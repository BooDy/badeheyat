'use client';

import { Download } from 'lucide-react';

interface DownloadButtonProps {
  url: string;
  filename: string;
  label: string;
}

export default function DownloadButton({ url, filename, label }: DownloadButtonProps) {
  const handleDownload = async () => {
    try {
      const response = await fetch(url);
      const blob = await response.blob();
      const downloadUrl = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = downloadUrl;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(downloadUrl);
    } catch (error) {
      console.error('Download failed:', error);
    }
  };

  return (
    <button
      onClick={handleDownload}
      className="flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-indigo-600 text-white font-bold hover:bg-indigo-700 transition-colors shadow-sm hover:shadow-md active:scale-95"
    >
      <Download size={20} />
      <span>{label}</span>
    </button>
  );
}
