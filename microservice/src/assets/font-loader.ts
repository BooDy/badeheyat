import axios from 'axios';

let fontData: ArrayBuffer | null = null;

export async function loadFont(): Promise<ArrayBuffer> {
  if (fontData) {
    return fontData;
  }

  // Using a direct link to the TTF file for IBM Plex Sans Arabic
  // This is a common CDN for Google Fonts
  const fontUrl = 'https://github.com/google/fonts/raw/main/ofl/ibmplexsansarabic/IBMPlexSansArabic-Bold.ttf';
  
  try {
    const response = await axios.get(fontUrl, {
      responseType: 'arraybuffer',
    });
    fontData = response.data;
    return fontData!;
  } catch (error) {
    console.error('Failed to load font:', error);
    throw new Error('Could not load font');
  }
}
