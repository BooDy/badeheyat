import satori from 'satori';
import { Resvg } from '@resvg/resvg-js';
import fs from 'fs/promises';
import path from 'path';
import QRCode from 'qrcode';
// @ts-ignore
import bidiFactory from 'bidi-js';
import { Theme } from './theme.config';
import { loadFont } from './assets/font-loader';

// Use require for arabic-reshaper to bypass ESM/CJS issues
const arabicReshaper = require('arabic-reshaper');
const bidi = bidiFactory();

interface GenerateOptions {
  badArgument: string;
  rebuttalFacts: string[];
  theme: Theme;
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

/**
 * Fixes Arabic text rendering issues (shaping AND RTL order)
 * Satori does not handle Arabic shaping or RTL correctly on its own.
 * We must:
 * 1. Reshape the characters (connect them)
 * 2. Reorder them for visual display (Bidi)
 * 3. Render with direction: ltr to preserve our calculated order.
 */
function fixArabic(text: string): string {
  if (!text) return '';
  
  try {
    const reshapeFn = arabicReshaper.convertArabic || arabicReshaper.reshape || 
                     (arabicReshaper.default && (arabicReshaper.default.convertArabic || arabicReshaper.default.reshape));

    if (typeof reshapeFn !== 'function') {
      console.error('CRITICAL: Arabic reshaper function not found.');
      return text;
    }

    const reshaped = reshapeFn.call(arabicReshaper, text);
    const embeddingLevels = bidi.getEmbeddingLevels(reshaped, 'rtl');
    return bidi.getReorderedString(reshaped, embeddingLevels);
  } catch (error) {
    console.error('Error reshaping Arabic text:', error);
    return text;
  }
}

/**
 * Helper to render RTL text that supports proper line wrapping in Satori.
 * Since Satori's native RTL line-breaking can be problematic with manual Bidi,
 * we split the text into words and use flex-wrap with row-reverse.
 */
function renderRtlText(text: string, style: any) {
  if (!text) return null;
  
  // Split by space to get words
  const words = text.split(' ');
  
  return {
    type: 'div',
    props: {
      style: {
        display: 'flex',
        flexDirection: 'row-reverse',
        flexWrap: 'wrap',
        justifyContent: 'flex-start',
        width: '100%',
        ...style,
      },
      children: words.map((word, i) => ({
        type: 'span',
        props: {
          style: {
            marginLeft: '0.25em', // Space between words
          },
          children: fixArabic(word),
        },
      })),
    },
  };
}

export async function generateImages(options: GenerateOptions) {
  const { badArgument, rebuttalFacts, theme, slug } = options;
  
  console.log(`[Generator] Starting generation for: ${slug}`);
  const displayFactRaw = rebuttalFacts.length > 0 ? rebuttalFacts[0] : badArgument;
  console.log(`[Generator] Display fact: "${displayFactRaw.substring(0, 50)}..."`);
  
  console.log(`[Generator] Loading font...`);
  const fontData = await loadFont();
  console.log(`[Generator] Font loaded (${fontData.byteLength} bytes)`);

  // Process branding only (one-liners)
  console.log(`[Generator] Processing branding text...`);
  const processedBrand = fixArabic('بديهيات');
  const processedSubTitle = fixArabic('مركز مكافحة الهبل');
  const processedTagLine = fixArabic('علشان بقى لنا سنين بنهاتي في خراء');
  
  // Note: We pass raw badArgument and rebuttalFacts to the template
  // because the template will use renderRtlText which handles processing per-word.
  console.log(`[Generator] Branding processed`);

  console.log(`[Generator] Creating QR code...`);
  const qrCodeUrl = `https://badeheyat.com/a/${slug}`;
  const qrCodeBuffer = await QRCode.toBuffer(qrCodeUrl, {
    margin: 1,
    color: {
      dark: theme.text,
      light: '#ffffff00',
    },
  });
  const qrCodeBase64 = `data:image/png;base64,${qrCodeBuffer.toString('base64')}`;
  console.log(`[Generator] QR code created`);

  const results: Record<string, string> = {};

  for (const size of SIZES) {
    console.log(`[Generator] Rendering ${size.name} (${size.width}x${size.height})...`);
    
    try {
      const svg = await satori(
        createSimplifiedTemplate(
          badArgument, // RAW
          rebuttalFacts, // RAW
          theme, 
          size, 
          qrCodeBase64, 
          processedBrand,
          processedSubTitle,
          processedTagLine
        ),
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
      console.log(`[Generator] ${size.name} SVG created`);

      const resvg = new Resvg(svg, {
        fitTo: {
          mode: 'width',
          value: size.width,
        },
      });

      const pngData = resvg.render();
      const pngBuffer = pngData.asPng();
      console.log(`[Generator] ${size.name} PNG rendered`);

      const fileName = `${slug}-${size.name}.png`;
      const dirPath = path.join('/shared-media', 'axioms');
      await fs.mkdir(dirPath, { recursive: true });
      const filePath = path.join(dirPath, fileName);
      
      await fs.writeFile(filePath, pngBuffer);
      console.log(`[Generator] ${size.name} saved to disk`);
      
      results[`image${size.name.charAt(0).toUpperCase() + size.name.slice(1)}`] = `/media/axioms/${fileName}`;
    } catch (err) {
      console.error(`[Generator] Failed to render ${size.name}:`, err);
      throw err;
    }
  }

  console.log(`[Generator] All images generated for: ${slug}`);
  return results;
}

/**
 * New Minimized and Simplified Template
 */
function createSimplifiedTemplate(
  badArgument: string,
  rebuttalFacts: string[],
  theme: Theme,
  size: ImageSize,
  qrCode: string,
  brandText: string,
  subTitleText: string,
  tagLineText: string
): any {
  const isStory = size.name === 'story';
  const isOg = size.name === 'og';
  const isSquare = size.name === 'square';
  
  // Dynamic sizing based on content length
  const factCount = rebuttalFacts.length;
  const baseFontSize = isStory ? 48 : isOg ? 32 : 40;
  const factFontSize = factCount > 3 ? baseFontSize * 0.7 : baseFontSize;

  return {
    type: 'div',
    props: {
      style: {
        height: size.height,
        width: size.width,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'flex-start',
        backgroundColor: theme.background,
        color: theme.text,
        padding: isStory ? '80px 60px' : '40px 60px',
        fontFamily: 'IBM Plex Sans Arabic',
        direction: 'ltr', // Visual order is already handled
        border: `16px solid ${theme.text}`,
        boxSizing: 'border-box',
        overflow: 'hidden',
      },
      children: [
        // Branding Top (Website Style)
        {
          type: 'div',
          props: {
            style: {
              display: 'flex',
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'center',
              width: '100%',
              marginBottom: '60px',
              gap: '20px',
            },
            children: [
              // Subtitles
              {
                type: 'div',
                props: {
                  style: {
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'flex-end',
                    marginRight: '20px',
                  },
                  children: [
                    {
                      type: 'div',
                      props: {
                        style: {
                          fontSize: isStory ? '32px' : '20px',
                          fontWeight: '900',
                          color: theme.text,
                        },
                        children: subTitleText,
                      },
                    },
                    {
                      type: 'div',
                      props: {
                        style: {
                          fontSize: isStory ? '20px' : '12px',
                          fontWeight: '700',
                          backgroundColor: theme.text,
                          color: '#ffffff',
                          padding: '2px 8px',
                          marginTop: '4px',
                        },
                        children: tagLineText,
                      },
                    },
                  ],
                },
              },
              // Logo Box
              {
                type: 'div',
                props: {
                  style: {
                    backgroundColor: theme.accent,
                    padding: isStory ? '12px 24px' : '8px 16px',
                    border: `4px solid ${theme.text}`,
                    transform: 'rotate(-2deg)',
                    boxShadow: `6px 6px 0px 0px ${theme.text}`,
                    display: 'flex',
                  },
                  children: {
                    type: 'div',
                    props: {
                      style: {
                        fontSize: isStory ? '64px' : '40px',
                        fontWeight: '900',
                        color: '#ffffff',
                        display: 'flex',
                      },
                      children: brandText,
                    },
                  },
                },
              },
            ],
          },
        },
        
        // Bad Argument (The Claim)
        {
          type: 'div',
          props: {
            style: {
              display: 'flex',
              flexDirection: 'column',
              width: '100%',
              padding: '30px',
              backgroundColor: theme.cardBg,
              borderRadius: '24px',
              borderRight: `8px solid ${theme.accent}`, // Move border to the right
              marginBottom: '40px',
              alignItems: 'flex-end',
            },
            children: [
              {
                type: 'div',
                props: {
                  style: {
                    fontSize: isStory ? '32px' : '22px',
                    color: theme.accent,
                    marginBottom: '10px',
                    fontWeight: 'bold',
                  },
                  children: fixArabic('الإدعاء الشائع:'),
                },
              },
              renderRtlText(badArgument, {
                fontSize: isStory ? '42px' : '28px',
                lineHeight: 1.4,
                opacity: 0.9,
              }),
            ],
          },
        },

        // Rebuttal Facts (The Truth)
        {
          type: 'div',
          props: {
            style: {
              display: 'flex',
              flexDirection: 'column',
              width: '100%',
              flexGrow: 1,
              alignItems: 'flex-end',
            },
            children: [
              {
                type: 'div',
                props: {
                  style: {
                    fontSize: isStory ? '36px' : '24px',
                    color: theme.accent,
                    marginBottom: '20px',
                    fontWeight: 'bold',
                  },
                  children: fixArabic('الحقيقة البديهية:'),
                },
              },
              ...rebuttalFacts.flatMap((fact, index) => {
                const elements: any[] = [
                  renderRtlText(fact, {
                    fontSize: `${factFontSize}px`,
                    lineHeight: 1.5,
                    marginBottom: index === rebuttalFacts.length - 1 ? '0px' : '20px',
                  })
                ];
                
                if (index < rebuttalFacts.length - 1) {
                  elements.push({
                    type: 'div',
                    props: {
                      style: {
                        width: '100%',
                        height: '1px',
                        borderBottom: `2px dashed ${theme.accent}`,
                        opacity: 0.3,
                        marginBottom: '20px',
                        display: 'flex',
                      },
                      children: []
                    }
                  });
                }
                
                return elements;
              }),
            ],
          },
        },

        // Footer Area
        {
          type: 'div',
          props: {
            style: {
              marginTop: 'auto',
              display: 'flex',
              flexDirection: (isOg || isSquare) ? 'row' : 'column',
              alignItems: 'center',
              width: '100%',
              justifyContent: 'space-between',
              gap: '20px',
              paddingTop: '20px',
            },
            children: [
              {
                type: 'div',
                props: {
                  style: {
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: (isOg || isSquare) ? 'flex-start' : 'center',
                    gap: '8px',
                  },
                  children: [
                    {
                      type: 'div',
                      props: {
                        style: {
                          fontSize: isStory ? '36px' : '24px',
                          fontWeight: 900,
                          color: theme.text,
                        },
                        children: 'badeheyat.com',
                      },
                    },
                    {
                      type: 'div',
                      props: {
                        style: {
                          display: 'flex',
                          alignItems: 'center',
                          gap: '8px',
                          fontSize: isStory ? '28px' : '18px',
                          fontWeight: 700,
                          backgroundColor: theme.text,
                          color: '#ffffff',
                          padding: '4px 12px',
                          borderRadius: '8px',
                        },
                        children: [
                          {
                            type: 'svg',
                            props: {
                              width: isStory ? '24' : '16',
                              height: isStory ? '24' : '16',
                              viewBox: '0 0 24 24',
                              fill: 'none',
                              stroke: 'currentColor',
                              strokeWidth: '2',
                              strokeLinecap: 'round',
                              strokeLinejoin: 'round',
                              children: [
                                { type: 'rect', props: { x: '2', y: '2', width: '20', height: '20', rx: '5', ry: '5' } },
                                { type: 'path', props: { d: 'M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z' } },
                                { type: 'line', props: { x1: '17.5', y1: '6.5', x2: '17.51', y2: '6.5' } }
                              ]
                            }
                          },
                          {
                            type: 'span',
                            props: {
                              children: 'badeheyat',
                            }
                          }
                        ],
                      },
                    },
                  ],
                },
              },
              {
                type: 'img',
                props: {
                  src: qrCode,
                  style: {
                    width: isStory ? '140px' : '100px',
                    height: isStory ? '140px' : '100px',
                    borderRadius: '16px',
                    padding: '8px',
                    backgroundColor: '#fff',
                  },
                },
              },
            ],
          },
        },
      ],
    },
  };
}
