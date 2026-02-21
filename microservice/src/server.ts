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
    const { axiomId, badArgument, rebuttalFacts, themeKey, slug } = req.body;

    if (!axiomId || !badArgument || !rebuttalFacts || !slug) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    console.log(`Generating images for axiom: ${slug} (${axiomId})`);

    // 1. Generate images
    const imagePaths = await generateImages({
      badArgument,
      rebuttalFacts,
      themeKey: themeKey || 'default',
      slug,
    });

    // 2. Update Strapi
    await updateAxiomImages(axiomId, {
      imageOg: imagePaths.imageOg,
      imageSquare: imagePaths.imageSquare,
      imageStory: imagePaths.imageStory,
    });

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
