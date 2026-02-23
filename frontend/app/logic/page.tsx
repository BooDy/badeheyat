import type { Metadata } from "next";
import { Brain, Zap, ShieldAlert, Footprints, Scale, MessageCircleOff, Users } from 'lucide-react';

export const metadata: Metadata = {
  title: "مدرسة المنطق | بديهيات - مركز قيادة مكافحة الهبل",
  description: "مقدمة مبسطة لقواعد المنطق والتفكير النقدي وكيفية كشف الهبد والمغالطات.",
};

export default function LogicPage() {
  const lessons = [
    {
      id: "٠١",
      title: "السبب والنتيجة (Causation)",
      description: "مش عشان الحاجتين حصلوا مع بعض يبقى الأول هو سبب التاني. الصدفة موجودة، والارتباط مش دايماً سببية.",
      example: "الديك بيأذن والشمس بتطلع، بس الديك مش هو اللي بيطلع الشمس يا عبقري.",
      icon: <Zap className="text-brand-red" size={40} />,
    },
    {
      id: "٠٢",
      title: "المصدر الموثوق (Reliable Source)",
      description: "البينة على من ادعى. المصدر لازم يكون جهة مختصة، محايدة، وعندها دليل مادي. جروبات الواتساب مش مصادر.",
      example: "واحد صاحبي قالي إن اللقاح فيه شريحة تتبع.. صاحبك ده خريج إيه معلش؟",
      icon: <ShieldAlert className="text-brand-red" size={40} />,
    },
    {
      id: "٠٣",
      title: "مغالطة الشخصنة (Ad Hominem)",
      description: "لما تغلب في الحجة، فتقوم تغلط في الشخص اللي قدامك عشان تشتت الانتباه عن الموضوع الأساسي.",
      example: "أنت إزاي بتتكلم عن أضرار التدخين وأنت أصلاً بتلبس شرابات ملونة؟",
      icon: <Users className="text-brand-red" size={40} />,
    },
    {
      id: "٠٤",
      title: "رجل القش (Straw Man)",
      description: "لما تحرف كلام اللي قدامك وتخليه يبان تافه أو متطرف عشان تعرف تهاجمه بسهولة.",
      example: "أنا بقول لازم نهتم بحقوق العمال.. تقوم أنت رادد: يعني أنت عايزنا نبقى شيوعيين ونلغي الملكية الخاصة؟",
      icon: <MessageCircleOff className="text-brand-red" size={40} />,
    },
    {
      id: "٠٥",
      title: "المنحدر الزلق (Slippery Slope)",
      description: "الادعاء بأن خطوة واحدة بسيطة هتؤدي بالضرورة لسلسلة من الكوارث الكونية بدون أي دليل.",
      example: "لو سمحنا للطلبة يختاروا لون القلم، بكرة هيختاروا لون جدران المدرسة وبعده هيلغوا الامتحانات خالص!",
      icon: <Footprints className="text-brand-red" size={40} />,
    },
    {
      id: "٠٦",
      title: "الثنائية الزائفة (False Dilemma)",
      description: "حصر الاختيارات في اتنين بس (أبيض أو أسود) في حين إن فيه بدائل تانية كتير في النص.",
      example: "يا إما أنت معانا، يا إما أنت عدونا.. مفيش احتمال إني أكون واقف بتفرج وبضحك عليك؟",
      icon: <Scale className="text-brand-red" size={40} />,
    },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 md:px-6 py-12 md:py-20">
      {/* Hero Section */}
      <section className="mb-20 text-center">
        <div className="inline-block bg-brand-blue text-white p-4 mb-8 -rotate-2 border-4 border-white shadow-hard-red">
          <Brain size={64} className="mx-auto" />
        </div>
        <h1 className="font-display font-black text-4xl md:text-8xl text-brand-blue mb-8 leading-[1.2]">
          <span className="bg-brand-red text-white px-4 inline-block -rotate-1 shadow-hard-blue">مدرسة المنطق</span><br/>
          <span className="text-brand-red italic underline decoration-8 underline-offset-8">للأغـبـيـاء (والـهـبّـاديـن)</span>
        </h1>
        <p className="text-xl md:text-4xl font-bold text-brand-blue max-w-5xl mx-auto leading-relaxed mt-12">
          أهلاً بك في الدورة المكثفة لإعادة تأهيل العقل البشري. 
          هنا هنتعلم إزاي نفكر بدل ما بنهاتي، وإزاي نكشف الهبد قبل ما يلوث الجو العام.
        </p>
      </section>

      {/* Introduction Card */}
      <div className="mb-24 p-8 md:p-16 border-[8px] border-brand-blue shadow-hard-blue bg-brand-yellow relative overflow-hidden">
        <div className="absolute -top-20 -left-20 w-64 h-64 bg-brand-red rotate-45 opacity-20"></div>
        <div className="relative z-10">
          <h2 className="font-display font-black text-3xl md:text-5xl mb-10 text-brand-blue border-b-8 border-brand-red pb-4 inline-block">القاعدة الذهبية</h2>
          <p className="text-2xl md:text-5xl font-black text-brand-blue leading-tight mb-8">
            "مش عشان أنت فاهم حاجة غلط، يبقى الحقيقة هي اللي غلط."
          </p>
          <p className="text-xl md:text-2xl font-bold text-slate-700 leading-relaxed max-w-4xl">
            المنطق مش رفاهية، ده نظام تشغيل للمخ. لو نظام تشغيلك قديم أو مهكر، هتبقى فريسة سهلة لأي "هبدة" معدية على الفيسبوك. 
            المهمة هنا هي تحديث السوفت وير بتاعك.
          </p>
        </div>
      </div>

      {/* Lessons Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-24">
        {lessons.map((lesson) => (
          <article 
            key={lesson.id} 
            className="p-8 border-4 border-brand-blue shadow-hard-blue bg-white hover:-translate-x-2 hover:-translate-y-2 hover:shadow-[16px_16px_0px_0px_rgba(29,53,87,1)] transition-all group"
          >
            <div className="flex justify-between items-start mb-8 border-b-4 border-brand-blue/10 pb-6">
              <div className="bg-brand-blue text-white p-4 font-black text-3xl shadow-hard-red -rotate-3 group-hover:rotate-0 transition-transform">
                {lesson.id}
              </div>
              <div className="p-2 border-4 border-brand-blue group-hover:bg-brand-yellow transition-colors">
                {lesson.icon}
              </div>
            </div>
            <h3 className="font-display font-black text-2xl md:text-4xl text-brand-blue mb-6">{lesson.title}</h3>
            <p className="text-lg md:text-2xl font-bold text-slate-700 mb-8 leading-relaxed">
              {lesson.description}
            </p>
            <div className="p-6 bg-brand-yellow border-r-8 border-brand-red">
              <p className="font-black text-brand-blue text-lg mb-2">مثال للهبد:</p>
              <p className="font-bold text-xl md:text-2xl italic text-slate-600">
                "{lesson.example}"
              </p>
            </div>
          </article>
        ))}
      </div>

      {/* Call to Action */}
      <section className="text-center bg-brand-blue p-12 md:p-24 text-white border-8 border-brand-blue shadow-hard-red relative overflow-hidden">
        <div className="absolute top-0 right-0 w-full h-full opacity-10 pointer-events-none" style={{ backgroundImage: 'radial-gradient(#ffffff 2px, transparent 2px)', backgroundSize: '30px 30px' }}></div>
        <h2 className="font-display font-black text-4xl md:text-7xl mb-12 relative z-10">مبروك!</h2>
        <p className="text-2xl md:text-4xl font-bold mb-12 max-w-4xl mx-auto leading-relaxed relative z-10">
          دلوقتي أنت بقيت أقل عرضة للهبل بنسبة ٢٠٪. 
          استخدم السلاح ده بحكمة، وماتنساش تحمل "البديهيات" وتوزعها في كل حتة.
        </p>
        <a 
          href="/" 
          className="inline-block bg-brand-red text-white px-12 py-6 border-4 border-white font-black text-2xl md:text-4xl shadow-[8px_8px_0px_0px_#ffffff] hover:translate-x-2 hover:translate-y-2 hover:shadow-none transition-all relative z-10"
        >
          ارجع للأرشيف وكمل المهمة
        </a>
      </section>
    </div>
  );
}
