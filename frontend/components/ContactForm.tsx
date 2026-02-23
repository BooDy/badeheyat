'use client';

import { useState } from 'react';
import { Send, CheckCircle, AlertCircle } from 'lucide-react';

export default function ContactForm() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    content: '',
  });
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('loading');
    setErrorMessage('');

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (!res.ok) {
        throw new Error('فشل إرسال الرسالة. حاول مرة أخرى لاحقاً.');
      }

      setStatus('success');
      setFormData({ name: '', email: '', subject: '', content: '' });
    } catch (err: any) {
      setStatus('error');
      setErrorMessage(err.message);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  if (status === 'success') {
    return (
      <div className="p-1 border-4 border-brand-blue shadow-hard-blue bg-white text-center">
        <div className="p-12 flex flex-col items-center gap-6">
          <div className="bg-green-500 text-white p-6 border-4 border-brand-blue shadow-hard-blue">
            <CheckCircle size={48} />
          </div>
          <div>
            <h3 className="font-display font-black text-3xl text-brand-blue mb-4 uppercase">تم استلام الرسالة بنجاح</h3>
            <p className="text-xl font-bold text-brand-blue">شكراً لتواصلك معنا. سنقوم بمراجعة رسالتك في أقرب وقت.</p>
            <button 
              onClick={() => setStatus('idle')}
              className="mt-8 bg-brand-red text-white px-8 py-3 border-4 border-brand-blue font-black hover:bg-white hover:text-brand-blue transition-all shadow-hard-blue"
            >
              إرسال رسالة أخرى
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-1 border-4 border-brand-blue shadow-hard-red bg-white relative">
      <div className="p-8 md:p-10">
        <div className="mb-8 flex items-center gap-4">
          <div className="bg-brand-red text-white p-4 border-4 border-brand-blue shadow-hard-blue">
            <Send size={32} />
          </div>
          <h3 className="font-display font-black text-3xl text-brand-blue uppercase">أرسل لنا بلاغاً</h3>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label htmlFor="name" className="font-black text-brand-blue block text-lg">الاسم الكامل</label>
              <input
                required
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="مثال: الباحث عن الحقيقة"
                className="w-full p-4 border-4 border-brand-blue focus:shadow-hard-blue outline-none transition-all font-bold placeholder:opacity-30"
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="email" className="font-black text-brand-blue block text-lg">البريد الإلكتروني</label>
              <input
                required
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="example@badeheyat.com"
                className="w-full p-4 border-4 border-brand-blue focus:shadow-hard-blue outline-none transition-all font-bold placeholder:opacity-30"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label htmlFor="subject" className="font-black text-brand-blue block text-lg">الموضوع</label>
            <input
              required
              type="text"
              id="subject"
              name="subject"
              value={formData.subject}
              onChange={handleChange}
              placeholder="مثال: بلاغ عن هبدة عابرة للقارات"
              className="w-full p-4 border-4 border-brand-blue focus:shadow-hard-blue outline-none transition-all font-bold placeholder:opacity-30"
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="content" className="font-black text-brand-blue block text-lg">محتوى الرسالة</label>
            <textarea
              required
              id="content"
              name="content"
              rows={5}
              value={formData.content}
              onChange={handleChange}
              placeholder="اكتب تفاصيل بلاغك هنا... يرجى الالتزام بالمنطق."
              className="w-full p-4 border-4 border-brand-blue focus:shadow-hard-blue outline-none transition-all font-bold placeholder:opacity-30 resize-none"
            />
          </div>

          {status === 'error' && (
            <div className="bg-red-100 border-4 border-red-500 p-4 text-red-700 font-bold flex items-center gap-3">
              <AlertCircle size={24} />
              {errorMessage}
            </div>
          )}

          <button
            type="submit"
            disabled={status === 'loading'}
            className="w-full bg-brand-red text-white py-4 px-8 border-4 border-brand-blue font-black text-2xl flex items-center justify-center gap-4 hover:bg-white hover:text-brand-blue transition-all shadow-hard-blue disabled:opacity-50"
          >
            {status === 'loading' ? 'جاري الإرسال...' : (
              <>
                إرسال البلاغ <Send size={24} />
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
