import Link from 'next/link';
import { ChevronRight, ChevronLeft } from 'lucide-react';

interface PaginationProps {
  pageCount: number;
  currentPage: number;
  categorySlug?: string;
  theme: {
    text: string;
    accent: string;
  };
}

export default function Pagination({ pageCount, currentPage, categorySlug, theme }: PaginationProps) {
  if (pageCount <= 1) return null;

  const createPageUrl = (page: number) => {
    const params = new URLSearchParams();
    if (categorySlug) params.set('category', categorySlug);
    params.set('page', page.toString());
    return `/?${params.toString()}`;
  };

  const pages = Array.from({ length: pageCount }, (_, i) => i + 1);

  return (
    <div className="flex justify-center items-center gap-2 md:gap-4 mt-12 md:mt-16">
      {currentPage > 1 && (
        <Link
          href={createPageUrl(currentPage - 1)}
          className="p-2 md:p-3 border-4 transition-all shadow-[4px_4px_0px_0px_rgba(29,53,87,1)] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none bg-white"
          style={{ borderColor: theme.text, color: theme.text }}
        >
          <ChevronRight size={24} />
        </Link>
      )}

      <div className="flex gap-2">
        {pages.map((page) => {
          const isCurrent = page === currentPage;
          return (
            <Link
              key={page}
              href={createPageUrl(page)}
              className="w-10 h-10 md:w-12 md:h-12 flex items-center justify-center font-black text-lg md:text-xl border-4 transition-all shadow-[4px_4px_0px_0px_rgba(29,53,87,1)] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none"
              style={{
                backgroundColor: isCurrent ? theme.accent : '#ffffff',
                color: isCurrent ? '#ffffff' : theme.text,
                borderColor: theme.text,
                boxShadow: isCurrent ? 'none' : `4px 4px 0px 0px ${theme.text}`,
              }}
            >
              {page}
            </Link>
          );
        })}
      </div>

      {currentPage < pageCount && (
        <Link
          href={createPageUrl(currentPage + 1)}
          className="p-2 md:p-3 border-4 transition-all shadow-[4px_4px_0px_0px_rgba(29,53,87,1)] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none bg-white"
          style={{ borderColor: theme.text, color: theme.text }}
        >
          <ChevronLeft size={24} />
        </Link>
      )}
    </div>
  );
}
