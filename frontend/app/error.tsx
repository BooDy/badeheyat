'use client';

import { useEffect } from 'react';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('Frontend Error:', error);
  }, [error]);

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center space-y-6 px-4">
      <div className="space-y-2">
        <h1 className="text-4xl font-extrabold text-slate-900">عفواً، حدث خطأ ما!</h1>
        <p className="text-slate-600 text-lg">
          نواجه مشكلة في الاتصال بالخدمة حالياً. يرجى المحاولة مرة أخرى لاحقاً.
        </p>
      </div>
      
      <div className="p-4 bg-red-50 text-red-700 rounded-lg border border-red-100 text-sm font-mono max-w-lg overflow-auto">
        {error.message || 'خطأ غير معروف'}
      </div>

      <button
        onClick={() => reset()}
        className="px-8 py-3 bg-indigo-600 text-white rounded-full font-bold hover:bg-indigo-700 transition-colors shadow-lg shadow-indigo-200"
      >
        إعادة المحاولة
      </button>
    </div>
  );
}
