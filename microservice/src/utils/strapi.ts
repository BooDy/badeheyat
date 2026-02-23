import axios from 'axios';

const STRAPI_API_URL = process.env.STRAPI_API_URL || 'http://strapi:1337';
const STRAPI_API_TOKEN = process.env.STRAPI_API_TOKEN;

export async function updateAxiomImages(
  axiomId: string | number,
  images: {
    imageOg: string;
    imageSquare: string;
    imageStory: string;
  }
) {
  try {
    const response = await axios.put(
      `${STRAPI_API_URL}/api/axioms/${axiomId}`,
      {
        data: images,
      },
      {
        headers: {
          Authorization: `Bearer ${STRAPI_API_TOKEN}`,
          'Content-Type': 'application/json',
        },
        timeout: 30000, // 30 second timeout
      }
    );
    return response.data;
  } catch (error) {
    console.error('Error updating Strapi:', error);
    throw error;
  }
}
