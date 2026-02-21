import { getAxioms, getCategories } from '@/lib/strapi';
import AxiomCard from '@/components/AxiomCard';
import Link from 'next/link';

export const dynamic = 'force-dynamic';
export const revalidate = 60;

interface HomeProps {
  searchParams: {
    category?: string;
  };
}

export default async function Home({ searchParams }: HomeProps) {
  const categorySlug = searchParams.category;
  const [axioms, categories] = await Promise.all([
    getAxioms(categorySlug),
    getCategories(),
  ]);

  return (
    <div className="space-y-12">
      <section className="text-center space-y-4 max-w-3xl mx-auto">
        <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 leading-tight">
          بديهيات: ردود جاهزة للجدالات الشائعة
        </h1>
        <p className="text-lg text-slate-600 leading-relaxed">
          منصة لاستضافة محتوى تعليمي قابل للمشاركة، مصمم لإغلاق الجدالات السيئة النية بردود واقعية ومتميزة بصرياً.
        </p>
      </section>

      <section className="space-y-8">
        <div className="flex flex-wrap items-center justify-center gap-3">
          <Link
            href="/"
            className={`px-6 py-2 rounded-full text-sm font-bold transition-all border ${
              !categorySlug
                ? 'bg-indigo-600 text-white border-indigo-600 shadow-sm'
                : 'bg-white text-slate-600 border-slate-200 hover:border-indigo-300 hover:text-indigo-600'
            }`}
          >
            الكل
          </Link>
          {categories.map((category) => (
            <Link
              key={category.id}
              href={`/?category=${category.slug}`}
              className={`px-6 py-2 rounded-full text-sm font-bold transition-all border ${
                categorySlug === category.slug
                  ? 'bg-indigo-600 text-white border-indigo-600 shadow-sm'
                  : 'bg-white text-slate-600 border-slate-200 hover:border-indigo-300 hover:text-indigo-600'
              }`}
            >
              {category.name}
            </Link>
          ))}
        </div>

        {axioms.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {axioms.map((axiom) => (
              <AxiomCard key={axiom.id} axiom={axiom} />
            ))}
          </div>
        ) : (
          <div className="text-center py-20 bg-white rounded-2xl border border-dashed border-slate-300">
            <p className="text-slate-500 text-lg">لا توجد بديهيات في هذا التصنيف حالياً.</p>
          </div>
        )}
      </section>
    </div>
  );
}
