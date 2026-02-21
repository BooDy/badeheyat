import satori from 'satori';
import { Resvg } from '@resvg/resvg-js';
import fs from 'fs/promises';
import path from 'path';
import { getTheme, Theme } from './theme.config';
import { loadFont } from './assets/font-loader';

interface GenerateOptions {
  badArgument: string;
  rebuttalFacts: string[];
  themeKey: string;
  slug: string;
}

interface ImageSize {
  width: number;
  height: number;
  name: 'og' | 'square' | 'story';
}

const SIZES: ImageSize[] = [
  { width: 1200, height: 630, name: 'og' },
  { width: 1080, height: 1080, name: 'square' },
  { width: 1080, height: 1920, name: 'story' },
];

export async function generateImages(options: GenerateOptions) {
  const { badArgument, rebuttalFacts, themeKey, slug } = options;
  const theme = getTheme(themeKey);
  const fontData = await loadFont();

  const results: Record<string, string> = {};

  for (const size of SIZES) {
    const svg = await satori(
      createTemplate(badArgument, rebuttalFacts, theme, size),
      {
        width: size.width,
        height: size.height,
        fonts: [
          {
            name: 'IBM Plex Sans Arabic',
            data: fontData,
            weight: 700,
            style: 'normal',
          },
        ],
      }
    );

    const resvg = new Resvg(svg, {
      fitTo: {
        mode: 'width',
        value: size.width,
      },
    });

    const pngData = resvg.render();
    const pngBuffer = pngData.asPng();

    const fileName = `${slug}-${size.name}.png`;
    const dirPath = path.join('/shared-media', 'axioms');
    await fs.mkdir(dirPath, { recursive: true });
    const filePath = path.join(dirPath, fileName);
    
    await fs.writeFile(filePath, pngBuffer);
    
    // Path relative to public mount for Strapi/Frontend
    results[`image${size.name.charAt(0).toUpperCase() + size.name.slice(1)}`] = `/media/axioms/${fileName}`;
  }

  return results;
}

function createTemplate(
  badArgument: string,
  rebuttalFacts: string[],
  theme: Theme,
  size: ImageSize
): any {
  const isStory = size.name === 'story';
  const isOg = size.name === 'og';

  return {
    type: 'div',
    props: {
      style: {
        height: '100%',
        width: '100%',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: theme.background,
        color: theme.text,
        padding: isStory ? '80px 40px' : '40px',
        fontFamily: 'IBM Plex Sans Arabic',
        direction: 'rtl',
      },
      children: [
        // Header / Logo area
        {
          type: 'div',
          props: {
            style: {
              display: 'flex',
              fontSize: isStory ? '48px' : '32px',
              fontWeight: 'bold',
              marginBottom: isStory ? '60px' : '40px',
              color: theme.accent,
            },
            children: 'بَديهيّة',
          },
        },
        // Bad Argument Card
        {
          type: 'div',
          props: {
            style: {
              display: 'flex',
              flexDirection: 'column',
              backgroundColor: theme.cardBg,
              borderRadius: '24px',
              padding: '32px',
              width: '100%',
              boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
              border: `2px solid ${theme.accent}22`,
              marginBottom: '32px',
            },
            children: [
              {
                type: 'div',
                props: {
                  style: {
                    fontSize: isStory ? '24px' : '18px',
                    color: theme.accent,
                    marginBottom: '12px',
                    opacity: 0.8,
                  },
                  children: 'الادعاء الشائع:',
                },
              },
              {
                type: 'div',
                props: {
                  style: {
                    fontSize: isStory ? '42px' : isOg ? '32px' : '36px',
                    lineHeight: 1.4,
                  },
                  children: badArgument,
                },
              },
            ],
          },
        },
        // Rebuttal Facts
        {
          type: 'div',
          props: {
            style: {
              display: 'flex',
              flexDirection: 'column',
              width: '100%',
              gap: '16px',
            },
            children: rebuttalFacts.slice(0, isOg ? 2 : 4).map((fact, index) => ({
              type: 'div',
              props: {
                style: {
                  display: 'flex',
                  alignItems: 'flex-start',
                  fontSize: isStory ? '32px' : '24px',
                  lineHeight: 1.5,
                },
                children: [
                  {
                    type: 'div',
                    props: {
                      style: {
                        color: theme.accent,
                        marginLeft: '12px',
                        marginTop: '4px',
                      },
                      children: '•',
                    },
                  },
                  {
                    type: 'div',
                    props: {
                      children: fact,
                    },
                  },
                ],
              },
            })),
          },
        },
        // Footer
        {
          type: 'div',
          props: {
            style: {
              marginTop: 'auto',
              fontSize: '20px',
              opacity: 0.6,
            },
            children: 'badeheyaat.com',
          },
        },
      ],
    },
  };
}
