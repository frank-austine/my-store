'use client';

import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { Product } from '@/types/product';
import { useCartStore } from '@/store/cartStore';
import { animateOnScroll } from '@/app/lib/gsapAnimations';

type Props = {
  product: Product;
  videoUrl?: string;
};

export default function ProductCard({ product, videoUrl }: Props) {
  const router = useRouter();
  const addToCart = useCartStore((state) => state.addToCart);
  const cardRef = useRef<HTMLDivElement>(null);
  const [activeTab, setActiveTab] = useState<'image' | 'video'>('image');
  const [added, setAdded] = useState(false);

  useEffect(() => {
    if (cardRef.current) animateOnScroll(cardRef.current);
  }, []);

  const hasVideo = !!videoUrl;

  function handleAddToCart(e: React.MouseEvent) {
    e.stopPropagation();
    addToCart(product);
    setAdded(true);
    setTimeout(() => setAdded(false), 1800);
  }

  return (
    <div
      ref={cardRef}
      className="rounded-xl overflow-hidden flex flex-col bg-[#1a1a1a] border border-[#2a2a2a] hover:border-[#8B7B2A]/50 transition-colors duration-300"
    >
      {/* Media area — clicking goes to detail */}
      <div
        className="relative w-full aspect-square bg-[#111] cursor-pointer group"
        onClick={() => router.push(`/products/${product.slug}`)}
      >
        {activeTab === 'image' || !hasVideo ? (
          product.image_url ? (
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
          )
        ) : (
          <video
            src={videoUrl}
            controls
            onClick={(e) => e.stopPropagation()}
            className="w-full h-full object-cover"
          />
        )}

        {/* Category badge */}
        {product.category && (
          <span className="absolute top-2 left-2 bg-black/70 text-[#8B7B2A] text-[10px] font-bold tracking-widest uppercase px-2 py-1 rounded-md border border-[#8B7B2A]/30">
            {product.category}
          </span>
        )}
      </div>

      {/* Image/Video tab toggle */}
      {hasVideo && (
        <div className="flex border-b border-[#2a2a2a]">
          <button
            onClick={() => setActiveTab('image')}
            className={`flex-1 py-2 text-[11px] font-bold tracking-widest uppercase transition ${
              activeTab === 'image'
                ? 'text-[#8B7B2A] border-b-2 border-[#8B7B2A]'
                : 'text-gray-600 hover:text-gray-400'
            }`}
          >
            Image
          </button>
          <button
            onClick={() => setActiveTab('video')}
            className={`flex-1 py-2 text-[11px] font-bold tracking-widest uppercase transition ${
              activeTab === 'video'
                ? 'text-[#8B7B2A] border-b-2 border-[#8B7B2A]'
                : 'text-gray-600 hover:text-gray-400'
            }`}
          >
            Video
          </button>
        </div>
      )}

      {/* Info */}
      <div
        className="p-3 flex flex-col flex-1 cursor-pointer"
        onClick={() => router.push(`/products/${product.slug}`)}
      >
        <h3 className="text-white font-bold text-sm leading-snug line-clamp-2 mb-2">
          {product.name}
        </h3>
        <div className="space-y-0.5 mb-3 mt-auto">
          <p className="text-[11px] text-gray-500">
            🚢 <span className="text-[#8B7B2A] font-semibold">${product.price_ship.toFixed(2)}</span> Ship
          </p>
          <p className="text-[11px] text-gray-500">
            📍 <span className="text-[#8B7B2A] font-semibold">${product.price_local.toFixed(2)}</span> Local
          </p>
        </div>
      </div>

      {/* Add to cart button */}
      <div className="px-3 pb-3">
        <button
          onClick={handleAddToCart}
          className={`w-full py-2.5 rounded-lg text-[11px] font-bold uppercase tracking-widest transition-all duration-150 active:scale-95 border ${
            added
              ? 'bg-[#8B7B2A]/20 border-[#8B7B2A] text-[#8B7B2A]'
              : 'bg-transparent border-[#8B7B2A]/40 text-[#8B7B2A] hover:bg-[#8B7B2A] hover:text-white hover:border-[#8B7B2A]'
          }`}
        >
          {added ? '✓ Added' : 'Add to Cart'}
        </button>
      </div>
    </div>
  );
}