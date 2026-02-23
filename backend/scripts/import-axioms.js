const fs = require('fs');
const path = require('path');
const readline = require('readline');

// CONFIGURATION
const STRAPI_URL = process.env.STRAPI_API_URL || 'http://localhost:1337';
const STRAPI_TOKEN = process.env.STRAPI_API_TOKEN;
const CSV_FILE = process.argv[2] || 'axioms.csv';
const DELAY_MS = 2000; // 2 seconds between imports to avoid crashing the microservice

if (!STRAPI_TOKEN) {
  console.error('ERROR: STRAPI_API_TOKEN is not set in environment.');
  process.exit(1);
}

// SLUGIFY HELPER (Supports Arabic)
function slugify(text) {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-') // Replace spaces with -
    .replace(/[^\w\u0621-\u064A-]+/g, '') // Remove all non-word chars (keep Arabic letters/numbers)
    .replace(/--+/g, '-') // Replace multiple - with single -
    .replace(/^-+/, '') // Trim - from start
    .replace(/-+$/, ''); // Trim - from end
}

async function run() {
  console.log('\n=============================================');
  console.log('   🚀 BADEHEYAT BULK IMPORT INITIATED');
  console.log('=============================================\n');
  console.log(`📍 URL: ${STRAPI_URL}`);
  console.log(`📄 File: ${CSV_FILE}`);
  console.log(`⏱️  Throttle: ${DELAY_MS}ms delay per row\n`);

  // 1. Fetch Categories
  process.stdout.write('🔍 Fetching categories... ');
  const categoryMap = {};
  try {
    const res = await fetch(`${STRAPI_URL}/api/categories`, {
      headers: { Authorization: `Bearer ${STRAPI_TOKEN}` }
    });
    const json = await res.json();
    if (json.data) {
      json.data.forEach(cat => {
        categoryMap[cat.name.trim().toLowerCase()] = cat.documentId;
      });
      process.stdout.write(`Done. (Found ${Object.keys(categoryMap).length})\n`);
    }
  } catch (err) {
    console.error('\n❌ Failed to fetch categories:', err.message);
    process.exit(1);
  }

  // 2. Count total lines for progress monitoring
  process.stdout.write('📊 Analyzing CSV size... ');
  let totalLines = 0;
  const countStream = fs.createReadStream(CSV_FILE);
  const countRl = readline.createInterface({ input: countStream });
  for await (const line of countRl) { totalLines++; }
  const totalItems = totalLines - 1; // Subtract header
  process.stdout.write(`${totalItems} items found.\n\n`);

  // 3. Read and Parse CSV
  const fileStream = fs.createReadStream(CSV_FILE);
  const rl = readline.createInterface({
    input: fileStream,
    crlfDelay: Infinity
  });

  let currentLine = 0;
  let successCount = 0;
  let failCount = 0;
  let skipCount = 0;

  for await (const line of rl) {
    currentLine++;
    if (currentLine === 1) continue; // Skip header

    const progress = Math.round(((currentLine - 1) / totalItems) * 100);
    const progressBar = '█'.repeat(Math.floor(progress / 5)) + '░'.repeat(20 - Math.floor(progress / 5));
    
    // Split by comma, handle quoted strings
    const row = line.split(/,(?=(?:(?:[^"]*"){2})*[^"]*$)/).map(v => v.replace(/^"|"$/g, '').trim());
    const [categoryName, claim, r1, r2, r3, r4] = row;

    if (!claim) {
      skipCount++;
      continue;
    }

    process.stdout.write(`\r[${progressBar}] ${progress}% | ✅ ${successCount} | ❌ ${failCount} | ⏭️  ${skipCount} | Processing...`);

    const rebuttalFacts = [r1, r2, r3, r4]
      .filter(f => f && f.length > 0)
      .map(text => ({ text }));

    const categoryDocId = categoryName ? categoryMap[categoryName.toLowerCase()] : null;
    
    if (categoryName && !categoryDocId) {
      failCount++;
      process.stdout.write(`\n   ⚠️  Error line ${currentLine}: Category "${categoryName}" not found.\n`);
      continue;
    }

    const payload = {
      data: {
        badArgument: claim,
        slug: slugify(claim),
        category: categoryDocId,
        rebuttalFacts: rebuttalFacts,
      }
    };

    try {
      const response = await fetch(`${STRAPI_URL}/api/axioms`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${STRAPI_TOKEN}`
        },
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        failCount++;
        const errData = await response.json();
        process.stdout.write(`\n   ❌ Failed line ${currentLine}: ${JSON.stringify(errData.error?.message || 'Unknown error')}\n`);
      } else {
        successCount++;
      }
    } catch (err) {
      failCount++;
      process.stdout.write(`\n   ❌ Error line ${currentLine}: ${err.message}\n`);
    }

    if (currentLine - 1 < totalItems) {
      await new Promise(resolve => setTimeout(resolve, DELAY_MS));
    }
  }

  console.log('\n\n=============================================');
  console.log('   ✅ IMPORT TASK COMPLETED');
  console.log('=============================================');
  console.log(`   Total Processed: ${totalItems}`);
  console.log(`   Successfully Added: ${successCount}`);
  console.log(`   Failed: ${failCount}`);
  console.log(`   Skipped (Empty): ${skipCount}`);
  console.log('=============================================\n');
}

run();
