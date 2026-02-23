'use client';

import { Twitter, Send, Link as LinkIcon, Share2 } from 'lucide-react';
import { useState } from 'react';

interface ShareButtonsProps {
  url: string;
  title: string;
}

export default function ShareButtons({ url, title }: ShareButtonsProps) {
  const [copied, setCopied] = useState(false);

  const encodedUrl = encodeURIComponent(url);
  const encodedTitle = encodeURIComponent(title);

  const shareLinks = [
    {
      name: 'X (Twitter)',
      icon: <Twitter size={20} />,
      url: `https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedTitle}`,
      color: 'bg-black text-white',
    },
    {
      name: 'WhatsApp',
      icon: <Send size={20} />,
      url: `https://wa.me/?text=${encodedTitle}%20${encodedUrl}`,
      color: 'bg-green-600 text-white',
    },
  ];

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  return (
    <div className="flex flex-wrap gap-4 items-center">
      <span className="font-black text-brand-blue uppercase bg-white border-2 border-brand-blue px-2 flex items-center gap-2">
        <Share2 size={16} />
        مشاركة:
      </span>
      {shareLinks.map((link) => (
        <a
          key={link.name}
          href={link.url}
          target="_blank"
          rel="noopener noreferrer"
          className={`flex items-center gap-2 px-4 py-2 font-bold border-2 border-brand-blue shadow-[4px_4px_0px_0px_rgba(29,53,87,1)] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none transition-all ${link.color}`}
        >
          {link.icon}
          <span>{link.name}</span>
        </a>
      ))}
      <button
        onClick={copyToClipboard}
        className="flex items-center gap-2 px-4 py-2 bg-brand-yellow text-brand-blue font-bold border-2 border-brand-blue shadow-[4px_4px_0px_0px_rgba(29,53,87,1)] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none transition-all"
      >
        <LinkIcon size={20} />
        <span>{copied ? 'تم النسخ!' : 'نسخ الرابط'}</span>
      </button>
    </div>
  );
}
