import qs from 'qs';

const STRAPI_URL = process.env.STRAPI_API_URL || 'http://localhost:1337';
const STRAPI_TOKEN = process.env.STRAPI_API_TOKEN;

export interface Category {
  id: number;
  name: string;
  slug: string;
  backgroundColor: string;
  textColor: string;
  accentColor: string;
  cardBackgroundColor: string;
}

export interface Axiom {
  id: number;
  slug: string;
  badArgument: string;
  rebuttalFacts: { id: number; text: string }[];
  references?: { id: number; title: string; url: string }[];
  detailedBody?: any;
  category?: Category;
  imageOg?: string;
  imageSquare?: string;
  imageStory?: string;
  createdAt: string;
  updatedAt: string;
}

async function fetchStrapi<T>(path: string, query?: any): Promise<{ data: T; meta?: any }> {
  const queryString = query ? `?${qs.stringify(query)}` : '';
  const url = `${STRAPI_URL}/api${path}${queryString}`;
  
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };

  if (STRAPI_TOKEN) {
    headers['Authorization'] = `Bearer ${STRAPI_TOKEN}`;
  }

  try {
    const res = await fetch(url, {
      headers,
      next: { revalidate: 60 },
    });

    if (!res.ok) {
      const errorData = await res.json().catch(() => ({}));
      console.error('Strapi Error:', {
        status: res.status,
        statusText: res.statusText,
        errorData,
        url,
      });
      throw new Error(`Failed to fetch from Strapi: ${res.status} ${res.statusText}`);
    }

    return await res.json();
  } catch (error) {
    console.error('Fetch error:', error);
    throw error;
  }
}

export async function getCategories(): Promise<Category[]> {
  const response = await fetchStrapi<Category[]>('/categories');
  return response.data || [];
}

export async function getAxioms(categorySlug?: string, page: number = 1, pageSize: number = 5): Promise<{ data: Axiom[]; meta: any }> {
  const query: any = {
    populate: ['category', 'rebuttalFacts', 'references'],
    sort: ['createdAt:desc'],
    pagination: {
      page,
      pageSize,
    },
  };

  if (categorySlug) {
    query.filters = {
      category: {
        slug: {
          $eq: categorySlug,
        },
      },
    };
  }

  return await fetchStrapi<Axiom[]>('/axioms', query);
}

export async function getAxiomBySlug(slug: string): Promise<Axiom | null> {
  const query = {
    filters: {
      slug: {
        $eq: slug,
      },
    },
    populate: ['category', 'rebuttalFacts', 'references'],
  };

  const response = await fetchStrapi<Axiom[]>('/axioms', query);
  return (response.data && response.data.length > 0) ? response.data[0] : null;
}
