import type { Metadata } from "next";
import { Twitter, Send, Instagram, Mail, MessageSquare } from 'lucide-react';
import ContactForm from "@/components/ContactForm";

export const metadata: Metadata = {
  title: "اتصل بنا | بديهيات - مركز قيادة مكافحة الهبل",
  description: "تواصل مع إدارة بديهيات لتقديم البلاغات أو الاستفسارات.",
};

export default function ContactPage() {
  const socialLinks = [
    {
      name: 'Instagram',
      icon: <Instagram size={32} />,
      handle: '@badeheyat',
      url: '#',
      color: 'bg-gradient-to-tr from-yellow-400 via-red-500 to-purple-600 text-white',
    },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 md:px-6 py-12 md:py-20">
      <section className="mb-20 text-center">
        <h1 className="font-display font-black text-4xl md:text-7xl text-brand-blue mb-8 leading-[1.3] md:leading-[1.4] uppercase">
          <span className="bg-brand-red text-white px-4 inline-block -rotate-1 shadow-hard-blue">قنوات الاتصال</span><br/>
          <span className="text-brand-red italic">المباشر مع القيادة</span>
        </h1>
        <p className="text-xl md:text-3xl font-bold text-brand-blue max-w-4xl mx-auto leading-relaxed">
          لديك بلاغ رسمي؟ استفسار منطقي؟ أو تريد فقط التعبير عن إعجابك بمدى ذكائنا؟ نحن هنا (أحياناً).
        </p>
      </section>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
        {/* Social Accounts Grid */}
        <div className="lg:col-span-8 space-y-12">
          <div className="mb-8 border-b-8 border-brand-blue pb-4">
            <h2 className="font-display font-black text-4xl text-brand-blue uppercase">الحسابات <span className="text-brand-red">الرسمية</span></h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
            {socialLinks.map((social) => (
              <a
                key={social.name}
                href={social.url}
                className="relative group p-1 border-4 border-brand-blue shadow-hard-blue bg-white transition-all hover:-translate-x-1 hover:-translate-y-1 hover:shadow-[12px_12px_0px_0px_rgba(29,53,87,1)]"
              >
                <div className="p-8 flex items-center gap-6">
                  <div className={`w-16 h-16 flex items-center justify-center border-4 border-brand-blue shadow-[4px_4px_0px_0px_rgba(29,53,87,1)] ${social.color}`}>
                    {social.icon}
                  </div>
                  <div>
                    <h3 className="font-black text-2xl text-brand-blue mb-1">{social.name}</h3>
                    <p className="font-bold text-brand-red text-lg">{social.handle}</p>
                  </div>
                </div>
              </a>
            ))}
          </div>

          {/* Contact Form */}
          <ContactForm />
        </div>

        {/* Sidebar Notice */}
        <aside className="lg:col-span-4">
          <div className="sticky top-32 space-y-12">
            <div className="border-8 border-brand-blue p-8 bg-brand-yellow relative overflow-hidden">
              <div className="absolute -top-10 -left-10 w-24 h-24 bg-brand-red rotate-45"></div>
              <h2 className="font-display font-black text-3xl mb-8 flex items-center gap-3 relative z-10">
                <span className="bg-brand-blue text-white p-1 text-2xl font-black">تحذير</span> أمني
              </h2>
              <ul className="space-y-6 relative z-10 font-bold text-lg leading-relaxed text-brand-blue">
                <li className="border-b-4 border-brand-blue/20 pb-4 italic">
                  "الرسائل التي تحتوي على مغالطات منطقية سيتم تجاهلها تلقائياً."
                </li>
                <li>
                  يرجى التأكد من إرفاق الأدلة عند تقديم البلاغات. نحن لا نرد على "بيقولوا إن...".
                </li>
              </ul>
            </div>

            <div className="bg-brand-blue p-8 text-white border-8 border-brand-blue shadow-hard-red">
              <h3 className="font-display font-black text-2xl mb-4 italic">ساعات العمل</h3>
              <p className="text-xl font-bold leading-relaxed">
                مركز القيادة يعمل ٢٤/٧ طالما هناك شخص ما يقول كلاماً غبياً على الإنترنت.
              </p>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
