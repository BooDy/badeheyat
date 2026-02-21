import { getAxiomBySlug } from '@/lib/strapi';
import DownloadButton from '@/components/DownloadButton';
import { Metadata } from 'next';
import Image from 'next/image';
import { notFound } from 'next/navigation';

export const dynamic = 'force-dynamic';
export const revalidate = 60;

interface AxiomPageProps {
  params: {
    slug: string;
  };
}

export async function generateMetadata({ params }: AxiomPageProps): Promise<Metadata> {
  const axiom = await getAxiomBySlug(params.slug);
  if (!axiom) return { title: 'بديهية غير موجودة' };

  const imageUrl = axiom.imageOg || `/media/axioms/${axiom.slug}-og.png`;

  return {
    title: `${axiom.badArgument} - بديهيات`,
    description: axiom.rebuttalFacts.join(' • '),
    openGraph: {
      title: axiom.badArgument,
      description: axiom.rebuttalFacts.join(' • '),
      images: [
        {
          url: imageUrl,
          width: 1200,
          height: 630,
          alt: axiom.badArgument,
        },
      ],
      type: 'article',
    },
    twitter: {
      card: 'summary_large_image',
      title: axiom.badArgument,
      description: axiom.rebuttalFacts.join(' • '),
      images: [imageUrl],
    },
  };
}

export default async function AxiomPage({ params }: AxiomPageProps) {
  const axiom = await getAxiomBySlug(params.slug);

  if (!axiom) {
    notFound();
  }

  return (
    <div className="max-w-4xl mx-auto space-y-12">
      <section className="space-y-6">
        {axiom.category && (
          <span className="inline-block px-3 py-1 rounded-full bg-indigo-50 text-indigo-600 text-sm font-bold">
            {axiom.category.name}
          </span>
        )}
        <div className="bg-slate-100 border-r-4 border-slate-400 p-8 rounded-xl">
          <p className="text-2xl md:text-3xl font-bold text-slate-600 leading-relaxed italic">
            "{axiom.badArgument}"
          </p>
        </div>
      </section>

      <section className="space-y-8">
        <h2 className="text-2xl font-extrabold text-slate-900 border-b border-slate-200 pb-4">
          الردود الواقعية
        </h2>
        <ul className="space-y-6">
          {axiom.rebuttalFacts.map((fact, index) => (
            <li key={index} className="flex items-start gap-4 group">
              <span className="flex-shrink-0 w-8 h-8 rounded-full bg-indigo-600 text-white flex items-center justify-center font-bold text-sm group-hover:scale-110 transition-transform">
                {index + 1}
              </span>
              <p className="text-lg md:text-xl text-slate-800 leading-relaxed pt-0.5">
                {fact}
              </p>
            </li>
          ))}
        </ul>
      </section>

      {axiom.detailedBody && (
        <section className="space-y-6 bg-white p-8 rounded-2xl border border-slate-200 shadow-sm">
          <h2 className="text-2xl font-extrabold text-slate-900">شرح مفصل</h2>
          <div className="prose prose-indigo prose-lg max-w-none text-slate-700 leading-relaxed">
            {axiom.detailedBody}
          </div>
        </section>
      )}

      {(axiom.imageSquare || axiom.imageStory) && (
        <section className="space-y-8">
          <h2 className="text-2xl font-extrabold text-slate-900 border-b border-slate-200 pb-4">
            تحميل الصور للمشاركة
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {axiom.imageSquare && (
              <div className="space-y-4">
                <div className="aspect-square relative rounded-xl overflow-hidden border border-slate-200 shadow-sm bg-slate-50">
                  <Image
                    src={axiom.imageSquare}
                    alt="Square version"
                    fill
                    className="object-contain"
                    unoptimized
                  />
                </div>
                <DownloadButton
                  url={axiom.imageSquare}
                  filename={`${axiom.slug}-square.png`}
                  label="تحميل لمنشور إنستغرام"
                />
              </div>
            )}
            {axiom.imageStory && (
              <div className="space-y-4">
                <div className="aspect-[9/16] relative rounded-xl overflow-hidden border border-slate-200 shadow-sm bg-slate-50">
                  <Image
                    src={axiom.imageStory}
                    alt="Story version"
                    fill
                    className="object-contain"
                    unoptimized
                  />
                </div>
                <DownloadButton
                  url={axiom.imageStory}
                  filename={`${axiom.slug}-story.png`}
                  label="تحميل للقصة (Story)"
                />
              </div>
            )}
          </div>
        </section>
      )}
    </div>
  );
}
