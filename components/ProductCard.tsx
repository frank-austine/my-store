'use client';

import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { Product } from '@/types/product';

import { animateOnScroll } from '@/app/lib/gsapAnimations';

type Props = {
  product: Product;
  videoUrl?: string;
};

export default function ProductCard({ product, videoUrl }: Props) {
  const router = useRouter();

  const cardRef = useRef<HTMLDivElement>(null);
  const [favorited, setFavorited] = useState(false);

  useEffect(() => {
    if (cardRef.current) animateOnScroll(cardRef.current);
  }, []);

  const hasVideo = !!videoUrl;



  return (
    <div
      ref={cardRef}
      onClick={() => router.push(`/products/${product.slug}`)}
      className="rounded-2xl overflow-hidden flex flex-col bg-[#1a1a1a] cursor-pointer group"
    >
      {/* Image area */}
      <div className="relative w-full aspect-square bg-[#111]">
        {product.image_url ? (
          <Image
            src={product.image_url}
            alt={product.name}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-500"
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-700 text-4xl">
            📦
          </div>
        )}

        {/* Category badge — top left */}
        {product.category && (
          <span className="absolute top-2 left-2 bg-black/60 text-white text-[10px] font-semibold px-2 py-1 rounded-md">
            {product.category}
          </span>
        )}

        {/* Favorite — top right */}
        <button
          onClick={(e) => { e.stopPropagation(); setFavorited(!favorited); }}
          className="absolute top-2 right-2 w-8 h-8 rounded-full bg-black/40 flex items-center justify-center hover:bg-black/70 transition"
        >
          <svg width="14" height="14" viewBox="0 0 24 24"
            fill={favorited ? '#e74c3c' : 'none'}
            stroke={favorited ? '#e74c3c' : 'white'}
            strokeWidth="2"
          >
            <path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z"/>
          </svg>
        </button>

        {/* Play icon — bottom left (only if has video) */}
        {hasVideo && (
          <div className="absolute bottom-2 left-2 w-8 h-8 rounded-full bg-black/50 flex items-center justify-center">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="white">
              <polygon points="5 3 19 12 5 21 5 3"/>
            </svg>
          </div>
        )}
      </div>

      {/* Info bar below image */}
      <div className="px-3 py-3 flex flex-col gap-1">
        <h3 className="text-white font-bold text-sm leading-snug line-clamp-1">
          {product.name}
        </h3>
        <p className="text-white font-black text-base">
          ${product.price_ship.toFixed(0)}
        </p>
      </div>
    </div>
  );
}