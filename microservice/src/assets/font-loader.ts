import fs from 'fs/promises';
import path from 'path';

let fontData: ArrayBuffer | null = null;

export async function loadFont(): Promise<ArrayBuffer> {
  if (fontData) {
    return fontData;
  }

  // Look in multiple possible locations
  const possiblePaths = [
    path.join(process.cwd(), 'assets', 'fonts', 'IBM-Plex-Sans-Arabic-Bold.ttf'),
    path.join(process.cwd(), 'src', 'assets', 'fonts', 'IBM-Plex-Sans-Arabic-Bold.ttf'),
    path.join(__dirname, 'fonts', 'IBM-Plex-Sans-Arabic-Bold.ttf'),
    '/app/assets/fonts/IBM-Plex-Sans-Arabic-Bold.ttf'
  ];

  for (const fontPath of possiblePaths) {
    try {
      console.log(`[FontLoader] Checking: ${fontPath}`);
      await fs.access(fontPath);
      const data = await fs.readFile(fontPath);
      fontData = data.buffer.slice(data.byteOffset, data.byteOffset + data.byteLength);
      console.log(`[FontLoader] SUCCESS: ${fontPath} (${data.length} bytes)`);
      return fontData!;
    } catch (err) {
      // console.log(`[FontLoader] Not found at ${fontPath}`);
      continue;
    }
  }

  console.error('CRITICAL: No local font file found in any expected location.');
  throw new Error('Font file not found. Please ensure IBM-Plex-Sans-Arabic-Bold.ttf is in microservice/assets/fonts/');
}
