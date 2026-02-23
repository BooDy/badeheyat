import { getAxiomBySlug } from '@/lib/strapi';
import DownloadButton from '@/components/DownloadButton';
import ShareButtons from '@/components/ShareButtons';
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

  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://badeheyat.com';
  
  // Use absolute URL for the image
  // The microservice saves images as /media/axioms/[slug]-og.png
  const imageRelativePath = `/media/axioms/${axiom.slug}-og.png`;
  const imageUrl = `${baseUrl}${imageRelativePath}`;
  const canonicalUrl = `${baseUrl}/a/${axiom.slug}`;
  
  const pageTitle = `رد قاطع على: ${axiom.badArgument}`;
  const description = axiom.badArgument;

  return {
    title: pageTitle,
    description: description,
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      title: pageTitle,
      description: description,
      url: canonicalUrl,
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
      title: pageTitle,
      description: description,
      images: [imageUrl],
    },
  };
}

export default async function AxiomPage({ params }: AxiomPageProps) {
  const axiom = await getAxiomBySlug(params.slug);

  if (!axiom) {
    notFound();
  }

  const shareUrl = `https://badeheyat.com/a/${axiom.slug}`;
  const shareTitle = `رد قاطع على: ${axiom.badArgument}`;

  return (
    <div className="max-w-4xl mx-auto space-y-10 md:space-y-16 py-8 md:py-12 px-4 md:px-6">
      {/* Axiom Header Section */}
      <section className="space-y-6 md:space-y-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 md:gap-6">
          <div className="space-y-3 md:space-y-4">
            {axiom.category && (
              <span 
                className="inline-block px-3 md:px-4 py-1 bg-brand-blue text-white font-black text-xs md:text-sm uppercase rotate-1 border-2 border-white shadow-md"
                style={axiom.category.accentColor ? { backgroundColor: axiom.category.accentColor } : undefined}
              >
                ملف: {axiom.category.name}
              </span>
            )}
          </div>
        </div>

        <div className="relative">
          <div 
            className="p-6 md:p-8 border-[6px] md:border-[8px] border-brand-blue shadow-[6px_6px_0px_0px_#ffc800] md:shadow-hard-red bg-white relative z-10"
          >
            <div className="absolute -top-5 -left-3 md:-top-6 md:-left-4 bg-brand-red text-white p-1.5 md:p-2 font-black text-xs md:text-sm border-2 border-brand-blue shadow-md -rotate-2">
              ادعاء شائع
            </div>
            <p className="text-xl md:text-5xl font-black text-brand-blue leading-relaxed italic">
              "{axiom.badArgument}"
            </p>
          </div>
          <div className="absolute inset-0 bg-brand-blue translate-x-2 translate-y-2 md:translate-x-3 md:translate-y-3 -z-10"></div>
        </div>

        <ShareButtons url={shareUrl} title={shareTitle} />
      </section>

      {/* Rebuttal Section */}
      <section className="space-y-8 md:space-y-12">
        <div className="mb-6 md:mb-8 border-b-4 md:border-b-8 border-brand-blue pb-4">
          <h2 className="font-display font-black text-3xl md:text-5xl text-brand-blue uppercase">
            الردود <span className="text-brand-red">الواقعية</span>
          </h2>
        </div>
        <ul className="space-y-8 md:space-y-12">
          {axiom.rebuttalFacts.map((fact, index) => (
            <li key={fact.id || index} className="flex items-start gap-4 md:gap-8 group">
              <span 
                className="flex-shrink-0 w-12 h-12 md:w-16 md:h-16 bg-brand-blue text-white flex items-center justify-center font-black text-xl md:text-3xl border-4 border-brand-blue shadow-[4px_4px_0px_0px_#ffc800] md:shadow-hard-red transition-transform group-hover:scale-110"
                style={axiom.category?.accentColor ? { backgroundColor: axiom.category.accentColor, borderColor: axiom.category.accentColor } : undefined}
              >
                {index + 1}
              </span>
              <p className="text-lg md:text-3xl font-bold text-brand-blue leading-relaxed pt-1 md:pt-2">
                {fact.text}
              </p>
            </li>
          ))}
        </ul>
      </section>

      {axiom.detailedBody && (
        <section className="space-y-6 md:space-y-8">
          <div className="mb-6 md:mb-8 border-b-4 md:border-b-8 border-brand-blue pb-4">
            <h2 className="font-display font-black text-2xl md:text-4xl text-brand-blue uppercase">شرح مفصل</h2>
          </div>
          <div className="p-6 md:p-8 border-[6px] md:border-8 border-brand-blue bg-brand-yellow shadow-[6px_6px_0px_0px_#000000] md:shadow-hard-black prose prose-lg md:prose-2xl max-w-none font-bold text-brand-blue leading-relaxed">
            {axiom.detailedBody}
          </div>
        </section>
      )}

      {axiom.references && axiom.references.length > 0 && (
        <section className="space-y-6 md:space-y-8">
          <div className="mb-6 md:mb-8 border-b-4 md:border-b-8 border-brand-blue pb-4">
            <h2 className="font-display font-black text-2xl md:text-4xl text-brand-blue uppercase">الروابط والمصادر</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-6">
            {axiom.references.map((ref) => (
              <a
                key={ref.id}
                href={ref.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-between p-4 md:p-6 bg-white border-4 border-brand-blue shadow-[4px_4px_0px_0px_#1D3557] md:shadow-hard-blue hover:translate-x-1 hover:translate-y-1 hover:shadow-none transition-all group"
              >
                <span className="text-lg md:text-xl font-black text-brand-blue group-hover:text-brand-red transition-colors">
                  {ref.title}
                </span>
                <span className="text-brand-red group-hover:scale-110 transition-transform">
                  ↗
                </span>
              </a>
            ))}
          </div>
        </section>
      )}

      {/* Image Preview Section */}

      <section className="space-y-10 md:space-y-12">
        <div className="mb-6 md:mb-8 border-b-4 md:border-b-8 border-brand-blue pb-4">
          <h2 className="font-display font-black text-2xl md:text-4xl text-brand-blue uppercase">
            تحميل الصور <span className="text-brand-red">للمشاركة</span>
          </h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12">
          <div className="space-y-4 md:space-y-6">
            <div className="aspect-square relative border-4 md:border-8 border-brand-blue shadow-[6px_6px_0px_0px_#ffc800] md:shadow-hard-red bg-white overflow-hidden">
              <Image
                src={axiom.imageSquare || `/media/axioms/${axiom.slug}-square.png`}
                alt="Square version"
                fill
                className="object-contain"
                unoptimized
              />
            </div>
            <DownloadButton
              url={axiom.imageSquare || `/media/axioms/${axiom.slug}-square.png`}
              filename={`${axiom.slug}-square.png`}
              label="تحميل للمنشور (Square)"
            />
          </div>
          <div className="space-y-4 md:space-y-6">
            <div className="aspect-[9/16] relative border-4 md:border-8 border-brand-blue shadow-[6px_6px_0px_0px_#ffc800] md:shadow-hard-red bg-white overflow-hidden">
              <Image
                src={axiom.imageStory || `/media/axioms/${axiom.slug}-story.png`}
                alt="Story version"
                fill
                className="object-contain"
                unoptimized
              />
            </div>
            <DownloadButton
              url={axiom.imageStory || `/media/axioms/${axiom.slug}-story.png`}
              filename={`${axiom.slug}-story.png`}
              label="تحميل للقصة (Story)"
            />
          </div>
        </div>
      </section>
    </div>
  );
}
