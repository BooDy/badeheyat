import type { Metadata } from "next";
import { Cairo, Kufam, Aref_Ruqaa } from "next/font/google";
import Link from "next/link";
import "./globals.css";

const cairo = Cairo({
  subsets: ["arabic", "latin"],
  variable: "--font-cairo",
});

const kufam = Kufam({
  subsets: ["arabic", "latin"],
  variable: "--font-kufam",
});

const arefRuqaa = Aref_Ruqaa({
  subsets: ["arabic"],
  weight: ["400", "700"],
  variable: "--font-aref-ruqaa",
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_BASE_URL || 'https://badeheyat.com'),
  title: {
    default: "بديهيات - علشان إحنا بنهاتي في خراء",
    template: "%s | بديهيات"
  },
  description: "منصة لاستضافة محتوى تعليمي قابل للمشاركة، مصمم لعدم تضييع الوقت في نقاشات تافهة بدائية بردود واقعية ومتميزة بصرياً.",
  openGraph: {
    title: "بديهيات - علشان إحنا بنهاتي في خراء",
    description: "منصة لاستضافة محتوى تعليمي قابل للمشاركة، مصمم لعدم تضييع الوقت في نقاشات تافهة بدائية بردود واقعية ومتميزة بصرياً.",
    url: "/",
    siteName: "بديهيات",
    images: [
      {
        url: "/og-main.png",
        width: 1200,
        height: 630,
      },
    ],
    locale: "ar_EG",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "بديهيات - علشان إحنا بنهاتي في خراء",
    description: "منصة لاستضافة محتوى تعليمي قابل للمشاركة، مصمم لعدم تضييع الوقت في نقاشات تافهة بدائية بردود واقعية ومتميزة بصرياً.",
    images: ["/og-main.png"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ar" dir="rtl">
      <body className={`${cairo.variable} ${kufam.variable} ${arefRuqaa.variable} font-body antialiased bg-white text-brand-blue min-h-screen flex flex-col selection:bg-brand-red selection:text-white overflow-x-hidden`}>
        <header className="bg-white border-b-[8px] md:border-b-[12px] border-brand-blue py-4 md:py-6 px-4 md:px-12 sticky top-0 z-50">
          <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-center justify-between gap-4 md:gap-6">
            <div className="flex items-center gap-4 md:gap-6 w-full lg:w-auto justify-between lg:justify-start">
              <Link href="/" className="bg-brand-red p-1.5 md:p-2 -rotate-2 border-[3px] md:border-4 border-brand-blue shadow-[4px_4px_0px_0px_#1D3557] md:shadow-hard-blue block flex-shrink-0">
                <h1 className="font-display font-black text-3xl md:text-5xl tracking-tighter text-white">بديهيات</h1>
              </Link>
              <div className="mr-2 md:mr-4 text-left lg:text-right flex-grow">
                <p className="text-sm md:text-xl font-black text-brand-blue leading-none">مركز مكافحة الهبل</p>
                <p className="text-[10px] md:text-xs font-bold bg-brand-blue text-white px-2 py-0.5 md:py-1 mt-1 inline-block uppercase tracking-widest">بقى لنا سنين بنهاتي في خراء</p>
              </div>
            </div>
            <nav className="flex flex-wrap items-center justify-center gap-4 md:gap-8 font-black text-sm md:text-lg w-full lg:w-auto border-t-2 border-brand-blue/10 pt-4 lg:pt-0 lg:border-t-0">
              <Link className="hover:text-brand-red transition-colors border-b-2 md:border-b-4 border-transparent hover:border-brand-red" href="/guide">المستندات</Link>
              <Link className="hover:text-brand-red transition-colors border-b-2 md:border-b-4 border-transparent hover:border-brand-red" href="/">أرشيف الغباء</Link>
              <Link href="/contact" className="bg-brand-blue text-white px-4 md:px-6 py-2 md:py-3 border-2 md:border-4 border-brand-blue hover:bg-white hover:text-brand-blue transition-all shadow-[4px_4px_0px_0px_#ffc800] md:shadow-hard-red font-black text-base md:text-xl">
                ساعدنا
              </Link>
            </nav>
          </div>
        </header>

        <main className="flex-grow">
          {children}
        </main>

        <footer className="bg-brand-blue text-white py-8 md:py-12 px-6 md:px-12 mt-12 border-t-[8px] md:border-t-[12px] border-brand-red">
          <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-8 md:gap-10">
            <div className="flex flex-col gap-2 text-center md:text-right w-full md:w-auto">
              <span className="text-3xl md:text-4xl font-display font-black">بديهيات</span>
              <span className="text-brand-red font-black text-sm md:text-base">بقى لنا سنين بنهاتي في خراء</span>
            </div>
            <div className="flex flex-wrap justify-center gap-6 md:gap-12 font-black text-sm md:text-lg">
              <Link className="hover:text-brand-red" href="/contact">اتصل بنا</Link>
              <Link className="hover:text-brand-red" href="/guide">من نحن؟</Link>
            </div>
            <div className="text-center md:text-left w-full md:w-auto">
              <p className="font-black text-brand-red text-sm md:text-base">حالة العقل الجمعي: كارثية</p>
              <p className="text-[10px] md:text-xs opacity-50 mt-2">© {new Date().getFullYear()} جميع الحقوق محفوظة لعقولنا فقط</p>
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}
