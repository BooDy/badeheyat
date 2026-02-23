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
      className="flex items-center justify-center gap-2 px-6 py-3 bg-brand-blue text-white font-black text-lg border-4 border-brand-blue hover:bg-white hover:text-brand-blue transition-all shadow-hard-red w-full"
    >
      <Download size={20} />
      <span>{label}</span>
    </button>
  );
}
