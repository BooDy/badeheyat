import Link from 'next/link';
import Image from 'next/image';
import { Axiom } from '@/lib/strapi';

interface AxiomCardProps {
  axiom: Axiom;
}

export default function AxiomCard({ axiom }: AxiomCardProps) {
  // console.log('AxiomCard data:', JSON.stringify(axiom, null, 2));
  const imageUrl = axiom.imageSquare || `/media/axioms/${axiom.slug}-square.png`;

  return (
    <Link
      href={`/a/${axiom.slug}`}
      className="group block bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all border border-slate-200"
    >
      <div className="aspect-square relative bg-slate-100 overflow-hidden">
        <Image
          src={imageUrl}
          alt={axiom.badArgument}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-300"
          unoptimized
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-4">
          <span className="text-white font-medium text-sm">عرض التفاصيل</span>
        </div>
      </div>
      <div className="p-4">
        {axiom.category && (
          <span 
            className="inline-block px-2 py-1 rounded-full text-xs font-semibold mb-2"
            style={{ 
              backgroundColor: `${axiom.category.accentColor}11`,
              color: axiom.category.accentColor 
            }}
          >
            {axiom.category.name}
          </span>
        )}
        <h3 className="text-lg font-bold line-clamp-2 text-slate-800 transition-colors leading-relaxed">
          {axiom.badArgument}
        </h3>
      </div>
    </Link>
  );
}
