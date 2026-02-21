import type { Metadata } from "next";
import { Cairo } from "next/font/google";
import "./globals.css";

const cairo = Cairo({
  subsets: ["arabic", "latin"],
  variable: "--font-cairo",
});

export const metadata: Metadata = {
  title: "بديهيات - Badeheyaat",
  description: "منصة لاستضافة محتوى تعليمي قابل للمشاركة، مصمم لإغلاق الجدالات السيئة النية بردود واقعية ومتميزة بصرياً.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ar" dir="rtl">
      <body className={`${cairo.variable} font-sans antialiased bg-slate-50 text-slate-900 min-h-screen flex flex-col`}>
        <header className="bg-white border-b border-slate-200 sticky top-0 z-50">
          <div className="container mx-auto px-4 h-16 flex items-center justify-between">
            <a href="/" className="text-2xl font-bold text-indigo-600">
              بديهيات
            </a>
            <nav>
              <ul className="flex space-x-reverse space-x-6">
                <li>
                  <a href="/" className="hover:text-indigo-600 transition-colors">
                    الرئيسية
                  </a>
                </li>
              </ul>
            </nav>
          </div>
        </header>
        <main className="flex-grow container mx-auto px-4 py-8">
          {children}
        </main>
        <footer className="bg-white border-t border-slate-200 py-8">
          <div className="container mx-auto px-4 text-center text-slate-500">
            <p>© {new Date().getFullYear()} بديهيات. جميع الحقوق محفوظة.</p>
          </div>
        </footer>
      </body>
    </html>
  );
}
