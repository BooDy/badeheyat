import qs from 'qs';

const STRAPI_URL = process.env.STRAPI_API_URL || 'http://localhost:1337';

export interface Category {
  id: number;
  name: string;
  slug: string;
  themeKey: string;
}

export interface Axiom {
  id: number;
  slug: string;
  badArgument: string;
  rebuttalFacts: string[];
  detailedBody?: string;
  category?: Category;
  imageOg?: string;
  imageSquare?: string;
  imageStory?: string;
  createdAt: string;
  updatedAt: string;
}

async function fetchStrapi<T>(path: string, query?: any): Promise<T> {
  const queryString = query ? `?${qs.stringify(query)}` : '';
  const res = await fetch(`${STRAPI_URL}/api${path}${queryString}`, {
    next: { revalidate: 60 },
  });

  if (!res.ok) {
    throw new Error(`Failed to fetch from Strapi: ${res.statusText}`);
  }

  const { data } = await res.json();
  return data;
}

export async function getCategories(): Promise<Category[]> {
  return fetchStrapi<Category[]>('/categories');
}

export async function getAxioms(categorySlug?: string): Promise<Axiom[]> {
  const query: any = {
    populate: ['category'],
    sort: ['createdAt:desc'],
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

  return fetchStrapi<Axiom[]>('/axioms', query);
}

export async function getAxiomBySlug(slug: string): Promise<Axiom | null> {
  const query = {
    filters: {
      slug: {
        $eq: slug,
      },
    },
    populate: ['category'],
  };

  const axioms = await fetchStrapi<Axiom[]>('/axioms', query);
  return axioms.length > 0 ? axioms[0] : null;
}
