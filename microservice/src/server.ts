import express, { Request, Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { generateImages } from './generator';
import { updateAxiomImages } from './utils/strapi';

dotenv.config();

const app = express();
const port = process.env.PORT || 4000;

app.use(cors());
app.use(express.json());

app.post('/generate', async (req: Request, res: Response) => {
  try {
    const { 
      axiomId, 
      badArgument, 
      rebuttalFacts, 
      slug,
      backgroundColor,
      textColor,
      accentColor,
      cardBackgroundColor
    } = req.body;

    if (!axiomId || !badArgument || !rebuttalFacts || !slug) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    console.log(`Generating images for axiom: ${slug} (${axiomId})`);
    console.log(`[Server] Received badArgument:`, badArgument);
    console.log(`[Server] Received rebuttalFacts:`, JSON.stringify(rebuttalFacts, null, 2));

    // 1. Map rebuttalFacts (handle Strapi component structure)
    const facts = Array.isArray(rebuttalFacts) 
      ? rebuttalFacts.map((f: any) => typeof f === 'string' ? f : f.text)
      : [];

    // 2. Generate images
    const imagePaths = await generateImages({
      badArgument,
      rebuttalFacts: facts,
      theme: {
        background: backgroundColor || '#f8fafc',
        text: textColor || '#1e293b',
        accent: accentColor || '#3b82f6',
        cardBg: cardBackgroundColor || '#ffffff',
      },
      slug,
    });

    // 2. Update Strapi
    console.log(`[Server] Updating Strapi for Axiom ${axiomId}...`);
    try {
      await updateAxiomImages(axiomId, {
        imageOg: imagePaths.imageOg,
        imageSquare: imagePaths.imageSquare,
        imageStory: imagePaths.imageStory,
      });
      console.log(`[Server] Strapi update successful for: ${slug}`);
    } catch (updateError: any) {
      console.error(`[Server] Strapi update failed for: ${slug}`, updateError.message);
      throw updateError;
    }

    console.log(`Successfully generated and updated images for: ${slug}`);

    res.json({
      success: true,
      images: imagePaths,
    });
  } catch (error: any) {
    console.error('Generation failed:', error);
    res.status(500).json({
      error: 'Failed to generate images',
      details: error.message,
    });
  }
});

app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

app.listen(port, () => {
  console.log(`Image generation microservice listening at http://localhost:${port}`);
});
