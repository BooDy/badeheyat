import { getAxioms, getCategories } from '@/lib/strapi';
import AxiomCard from '@/components/AxiomCard';
import Link from 'next/link';
import { Metadata } from 'next';

export const dynamic = 'force-dynamic';
export const revalidate = 60;

export async function generateMetadata(): Promise<Metadata> {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://badeheyat.com';
  const ogImageUrl = `${baseUrl}/og-main.png`;
  
  return {
    alternates: {
      canonical: baseUrl,
    },
    openGraph: {
      title: 'بديهيات - علشان إحنا بنهاتي في خراء',
      description: 'منصة لاستضافة محتوى تعليمي قابل للمشاركة، مصمم لعدم تضييع الوقت في نقاشات تافهة بدائية بردود واقعية ومتميزة بصرياً.',
      url: baseUrl,
      siteName: 'بديهيات',
      images: [
        {
          url: ogImageUrl,
          width: 1200,
          height: 630,
          alt: 'بديهيات - مركز مكافحة الهبل',
        },
      ],
      locale: 'ar_EG',
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: 'بديهيات - علشان إحنا بنهاتي في خراء',
      description: 'منصة لاستضافة محتوى تعليمي قابل للمشاركة، مصمم لعدم تضييع الوقت في نقاشات تافهة بدائية بردود واقعية ومتميزة بصرياً.',
      images: [ogImageUrl],
    },
  };
}

interface HomeProps {
  searchParams: {
    category?: string;
  };
}

export default async function Home({ searchParams }: HomeProps) {
  const categorySlug = searchParams.category;
  const [axiomsData, categoriesData] = await Promise.all([
    getAxioms(categorySlug),
    getCategories(),
  ]);

  const axioms = axiomsData || [];
  const categories = categoriesData || [];

  const activeCategory = categories.find((c) => c.slug === categorySlug);

  // Default theme fallback
  const theme = {
    bg: activeCategory?.backgroundColor || '#ffffff',
    text: activeCategory?.textColor || '#1D3557',
    accent: activeCategory?.accentColor || '#ffc800',
    cardBg: activeCategory?.cardBackgroundColor || '#ffffff',
  };

  return (
    <div className="flex flex-col min-h-screen transition-colors duration-500" style={{ backgroundColor: theme.bg }}>
      {/* Hero / Search Section */}
      <section 
        className="py-12 md:py-20 px-4 md:px-6 border-b-8 border-brand-blue geometric-bg transition-all duration-500"
        style={{ 
          backgroundColor: activeCategory ? theme.bg : undefined,
          borderBottomColor: theme.text 
        }}
      >
        <div className="max-w-5xl mx-auto text-center">
          <h2 className="font-display font-black text-4xl md:text-7xl mb-12 leading-[1.3] md:leading-[1.4] transition-colors duration-500" style={{ color: theme.text }}>
            <span 
              className="text-white px-4 inline-block -rotate-1 shadow-[4px_4px_0px_0px_#1D3557] md:shadow-hard-blue transition-all"
              style={{ backgroundColor: theme.accent, boxShadow: `8px 8px 0px 0px ${theme.text}` }}
            >
              شغل مخك دقيقة
            </span><br />
            <span style={{ color: theme.accent }}>قبل ما تتكلم... أرجوك</span>
          </h2>
          <div className="relative max-w-4xl mx-auto">
            <div className="flex flex-wrap justify-center gap-4 md:gap-6 items-center">
              <span className="font-black uppercase bg-white border-4 border-brand-blue px-3 py-1 text-sm md:text-xl shadow-[4px_4px_0px_0px_#1D3557]" style={{ color: theme.text, borderColor: theme.text, boxShadow: `4px 4px 0px 0px ${theme.text}` }}>التصنيفات:</span>
              <Link 
                href="/" 
                className={`px-4 py-2 md:px-6 md:py-3 font-black text-sm md:text-xl border-4 transition-all shadow-[4px_4px_0px_0px_#1D3557] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none`}
                style={{ 
                  backgroundColor: !categorySlug ? theme.accent : '#ffffff',
                  color: !categorySlug ? '#ffffff' : theme.text,
                  borderColor: theme.text,
                  boxShadow: !categorySlug ? 'none' : `4px 4px 0px 0px ${theme.text}`
                }}
              >
                الكل
              </Link>
              {categories.map((category) => (
                <Link
                  key={category.id}
                  href={`/?category=${category.slug}`}
                  className={`px-4 py-2 md:px-6 md:py-3 font-black text-sm md:text-xl border-4 transition-all hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none`}
                  style={{ 
                    backgroundColor: categorySlug === category.slug ? theme.accent : '#ffffff',
                    color: categorySlug === category.slug ? '#ffffff' : theme.text,
                    borderColor: theme.text,
                    boxShadow: categorySlug === category.slug ? 'none' : `4px 4px 0px 0px ${theme.text}`
                  }}
                >
                  {category.name}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Marquee Section */}
      <div 
        className="border-y-4 md:border-y-8 border-brand-blue overflow-hidden h-10 md:h-14 flex items-center transition-colors duration-500"
        style={{ backgroundColor: theme.accent, borderColor: theme.text }}
      >
        <div className="marquee-container w-full">
          <div className="marquee-content flex gap-8 md:gap-16 items-center font-black text-white text-lg md:text-2xl">
            <span>/// عاجل: اكتشاف كائن بشري يفكر قبل أن يتحدث ///</span>
            <span>/// تنبيه: خطر انحطاط الحوار الجماعي في تزايد ///</span>
            <span>/// تعليمات: لا تجادل الجاهل حتى لا يخلط الناس بينكما ///</span>
            <span>/// عاجل: اكتشاف كائن بشري يفكر قبل أن يتحدث ///</span>
          </div>
        </div>
      </div>

      {/* Main Content Section */}
      <section className="max-w-7xl mx-auto px-4 md:px-6 py-12 md:py-16 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          <div className="lg:col-span-8">
            <div 
              className="mb-8 md:mb-12 border-b-4 md:border-b-8 border-brand-blue pb-4 flex flex-col md:flex-row md:items-end justify-between gap-4 transition-colors duration-500"
              style={{ borderBottomColor: theme.text }}
            >
              <h2 className="font-display font-black text-3xl md:text-5xl uppercase flex items-center gap-3 md:gap-4" style={{ color: theme.text }}>
                <span className="text-white px-3 md:px-4 py-1" style={{ backgroundColor: theme.text }}>تريندات</span>
                <span>بديهية</span>
              </h2>
            </div>
            
            {axioms.length > 0 ? (
              <div className="space-y-12 md:space-y-16">
                {axioms.map((axiom) => (
                  <article key={axiom.id} className="relative p-1 border-4 bg-white transition-all duration-500" style={{ borderColor: theme.text, boxShadow: `8px 8px 0px 0px ${theme.accent}` }}>
                    <div 
                      className="text-white p-1.5 md:p-2 font-black text-xs md:text-sm absolute -top-4 -right-2 md:-top-5 md:-right-4 rotate-3 border-2 border-white shadow-md z-20"
                      style={{ backgroundColor: theme.text }}
                    >
                      # {axiom.id}
                    </div>
                    <div className="p-6 md:p-8">
                      <div className="flex flex-wrap items-center gap-3 md:gap-4 mb-6">
                        <span className="text-white font-black px-3 md:px-4 py-1 text-xs md:text-sm uppercase" style={{ backgroundColor: theme.accent }}>تحذير أمني</span>
                        {axiom.category && (
                          <span className="font-black border-b-2 text-sm md:text-base" style={{ color: theme.text, borderBottomColor: theme.text }}>
                            تصنيف: {axiom.category.name}
                          </span>
                        )}
                      </div>
                      <h3 className="font-display text-2xl md:text-4xl font-black mb-6 md:mb-8 leading-tight" style={{ color: theme.text }}>
                        "{axiom.badArgument}"
                      </h3>
                      {axiom.rebuttalFacts && axiom.rebuttalFacts.length > 0 && (
                        <div className="p-6 md:p-8 border-r-4 md:border-r-8 mb-6 md:mb-8" style={{ backgroundColor: `${theme.text}08`, borderRightColor: theme.accent }}>
                          <p className="text-lg md:text-2xl font-bold leading-relaxed" style={{ color: theme.text }}>
                            <span className="text-white px-2 ml-2" style={{ backgroundColor: theme.accent }}>الرد القاطع:</span> 
                            {axiom.rebuttalFacts[0].text}
                          </p>
                        </div>
                      )}
                      <div className="flex justify-between items-center">
                        <Link 
                          href={`/a/${axiom.slug}`}
                          className="text-white font-black px-6 md:px-8 py-2.5 md:py-3 transition-all text-sm md:text-base"
                          style={{ backgroundColor: theme.text }}
                        >
                          اقرأ المزيد
                        </Link>
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            ) : (
              <div className="p-12 border-4 border-dashed text-center bg-brand-yellow" style={{ borderColor: theme.text }}>
                <p className="font-black text-2xl" style={{ color: theme.text }}>لا توجد بديهيات في هذا التصنيف حالياً.</p>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <aside className="lg:col-span-4 space-y-12">
            <div className="border-8 p-8 bg-brand-yellow relative overflow-hidden transition-colors duration-500" style={{ borderColor: theme.text }}>
              <div className="absolute -top-10 -left-10 w-24 h-24 rotate-45 transition-colors duration-500" style={{ backgroundColor: theme.accent }}></div>
              <h2 className="font-display font-black text-3xl mb-8 flex items-center gap-3 relative z-10" style={{ color: theme.text }}>
                <span className="text-white p-1" style={{ backgroundColor: theme.text }}>المنطق</span> للأغبياء
              </h2>
              <ul className="space-y-6 relative z-10">
                <li className="border-b-4 pb-4" style={{ borderBottomColor: `${theme.text}20` }}>
                  <div className="font-black text-lg mb-1" style={{ color: theme.accent }}>الدرس ١: السبب والنتيجة</div>
                  <p className="font-bold" style={{ color: theme.text }}>مش عشان الديك أذن يعني هو اللي جاب الشمس، فكر شوية.</p>
                </li>
                <li className="border-b-4 pb-4" style={{ borderBottomColor: `${theme.text}20` }}>
                  <div className="font-black text-lg mb-1" style={{ color: theme.accent }}>الدرس ٢: المصدر الموثوق</div>
                  <p className="font-bold" style={{ color: theme.text }}>جروب الواتساب بتاع خالتك "أسرار الكون" مش مصدر علمي.</p>
                </li>
                <li className="pb-4">
                  <div className="font-black text-lg mb-1" style={{ color: theme.accent }}>الدرس ٣: الشخصنة</div>
                  <p className="font-bold" style={{ color: theme.text }}>لو غلبت في الرد، مش لازم تغلط في شكل اللي قدامك.</p>
                </li>
              </ul>
              <Link 
                href="/logic" 
                className="w-full mt-6 text-white py-4 font-black text-xl border-4 transition-all shadow-hard-black flex items-center justify-center"
                style={{ backgroundColor: theme.text, borderColor: theme.text }}
              >
                تعلم المنطق غصب عنك
              </Link>
            </div>

            <div className="p-8 text-white border-8 shadow-hard-blue transition-all duration-500" style={{ backgroundColor: theme.accent, borderColor: theme.text, boxShadow: `8px 8px 0px 0px ${theme.text}` }}>
              <h3 className="font-display font-black text-3xl mb-4 italic">كلمة اليوم</h3>
              <p className="text-xl font-bold leading-relaxed mb-6" style={{ color: theme.text }}>
                "السكوت مش دايماً علامة الرضا، أحياناً بيبقى علامة إن اللي قدامك جاب آخره من غباءك."
              </p>
              <div className="text-left font-black text-2xl" style={{ color: theme.text }}>— إدارة البديهيات</div>
            </div>
          </aside>
        </div>
      </section>
    </div>
  );
}
