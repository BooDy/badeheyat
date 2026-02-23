import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "دليل المستخدم | بديهيات - مركز قيادة مكافحة الهبل",
  description: "دليل استخدام منصة بديهيات لمحاربة المغالطات والنقاشات العقيمة.",
};

export default function GuidePage() {
  return (
    <div className="max-w-7xl mx-auto px-4 md:px-6 py-12 md:py-20">
      <section className="mb-20 text-center">
        <h1 className="font-display font-black text-4xl md:text-7xl text-brand-blue mb-8 leading-[1.3] md:leading-[1.4]">
          <span className="bg-brand-red text-white px-4 inline-block -rotate-1 shadow-hard-blue">دليل المستخدم</span><br/>
          <span className="text-brand-red italic">لقواعد الاشتباك الفكري</span>
        </h1>
        <p className="text-xl md:text-3xl font-bold text-brand-blue max-w-4xl mx-auto leading-relaxed">
          أهلا بك في بديهيات، العالم يعود للخلف.. مستوى النقاشات على الانترنت وفي كل مكان في انحدار متواصل وإذا لم يتوقف هذا الانحدار سوف نتحول في خلال سنوات إلى مجموعات من النيانديرتال تخاف النار ولا تعرف كيف تتعامل معها.
        </p>
      </section>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Section 1 */}
        <div className="p-8 border-[8px] border-brand-blue shadow-hard-red bg-white relative">
          <div className="absolute -top-6 -right-4 bg-brand-blue text-white p-2 font-black text-sm border-2 border-white shadow-md rotate-3">
            المهمة #٠٠١
          </div>
          <h2 className="font-display font-black text-3xl mb-6 text-brand-blue uppercase">١. لماذا نحن هنا؟</h2>
          <div className="space-y-4 text-lg md:text-xl font-bold leading-relaxed text-brand-blue">
            <p>
              العالم مليء بنقاشات عقيمة تستهلك طاقتك وتدمر خلايا مخك. 
              <span className="text-brand-red underline decoration-4 underline-offset-4">"بديهيات"</span> ليست هنا لمناقشة الأغبياء، بل لتوفير وقتك وطاقتك من الانخراط في تلك البلاعة".
            </p>
            <p>
              هدفنا هو توفير ردود بصرية مبنية على المنطق والعلم، جاهزة للقصف في أي وقت لعل وعسى نتمكن من الارتقاء بشكل النقاشات في مجتمعنا الجميل.
            </p>
          </div>
        </div>

        {/* Section 2 */}
        <div className="p-8 border-[8px] border-brand-blue shadow-hard-blue bg-white relative">
          <div className="absolute -top-6 -right-4 bg-brand-red text-white p-2 font-black text-sm border-2 border-white shadow-md -rotate-2">
            العمليات
          </div>
          <h2 className="font-display font-black text-3xl mb-6 text-brand-blue uppercase">٢. كيف تستخدم الردود؟</h2>
          <ul className="space-y-6">
            <li className="flex gap-4 items-start">
              <span className="bg-brand-blue text-white w-8 h-8 flex-shrink-0 flex items-center justify-center font-black rounded-full">١</span>
              <div>
                <h3 className="font-black text-xl mb-1">تصفح البديهيات</h3>
                <p className="font-bold text-slate-600">تصفح الأرشيف حسب التصنيف. ابحث عن المغالطة التي تواجهها الآن.</p>
              </div>
            </li>
            <li className="flex gap-4 items-start">
              <span className="bg-brand-blue text-white w-8 h-8 flex-shrink-0 flex items-center justify-center font-black rounded-full">٢</span>
              <div>
                <h3 className="font-black text-xl mb-1">حمل الصورة</h3>
                <p className="font-bold text-slate-600">قم بتحميل الصورة (المنشور أو القصة) المصممة خصيصاً للرد على رجل الكهف.</p>
              </div>
            </li>
            <li className="flex gap-4 items-start">
              <span className="bg-brand-blue text-white w-8 h-8 flex-shrink-0 flex items-center justify-center font-black rounded-full">٣</span>
              <div>
                <h3 className="font-black text-xl mb-1">ودي</h3>
                <p className="font-bold text-slate-600">أرسل الصورة في النقاش، ثم انسحب بوقار. البديهيات لا تُناقش.</p>
              </div>
            </li>
          </ul>
        </div>
      </div>

      {/* Section 3 */}
      <section className="mt-20 py-16 px-8 border-8 border-brand-blue bg-brand-yellow relative overflow-hidden">
        <div className="absolute -top-20 -left-20 w-48 h-48 bg-brand-red rotate-45 opacity-10"></div>
        <div className="max-w-4xl mx-auto relative z-10">
          <h2 className="font-display font-black text-4xl md:text-5xl mb-8 text-brand-blue text-center uppercase">
            <span className="bg-brand-blue text-white px-4 py-1">مدرسة</span> المنطق
          </h2>
          <div className="text-xl md:text-2xl font-bold leading-relaxed text-brand-blue text-center mb-12">
            تعلم المنطق حتى لا تقع في فخ الهبل وأنت تحاول محاربته. الجهل معدٍ، والمنطق هو اللقاح الوحيد.
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center p-6 border-4 border-brand-blue bg-white">
              <div className="text-4xl mb-4 text-brand-red font-black">٠١</div>
              <h3 className="font-black text-xl mb-2 uppercase">السببية</h3>
              <p className="font-bold text-sm text-slate-600">التزامن لا يعني السببية. كون "س" حدثت مع "ص" لا يعني أن "س" هي السبب.</p>
            </div>
            <div className="text-center p-6 border-4 border-brand-blue bg-white">
              <div className="text-4xl mb-4 text-brand-red font-black">٠٢</div>
              <h3 className="font-black text-xl mb-2 uppercase">المصادر</h3>
              <p className="font-bold text-sm text-slate-600">البينة على من ادعى. إذا قلت كلاماً غريباً، فأنت الملزم بإثباته وليس نحن بنفيه.</p>
            </div>
            <div className="text-center p-6 border-4 border-brand-blue bg-white">
              <div className="text-4xl mb-4 text-brand-red font-black">٠٣</div>
              <h3 className="font-black text-xl mb-2 uppercase">الاستثناء</h3>
              <p className="font-bold text-sm text-slate-600">التجربة الشخصية ليست دليلاً علمياً. "واحد صاحبي حصل له كذا" لا تبني قاعدة عامة.</p>
            </div>
          </div>
          <div className="mt-16 text-center">
            <Link 
              href="/logic" 
              className="inline-block bg-brand-red text-white px-12 py-4 border-4 border-brand-blue font-black text-2xl shadow-hard-blue hover:translate-x-2 hover:translate-y-2 hover:shadow-none transition-all"
            >
              اذهب للمدرسة كاملة
            </Link>
          </div>
        </div>
      </section>

    </div>
  );
}
