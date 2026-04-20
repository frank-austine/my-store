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

  useEffect(() => {
    if (cardRef.current) {
      animateOnScroll(cardRef.current);
    }
  }, []);

  const hasVideo = !!videoUrl;

  return (
    <div
      ref={cardRef}
      className="rounded-2xl overflow-hidden flex flex-col bg-[#1a1a1a] text-white"
    >
      {/* Product name and category — clicking goes to detail page */}
      <div
        className="px-4 pt-5 pb-3 cursor-pointer"
        onClick={() => router.push(`/products/${product.slug}`)}
      >
        <h3 className="text-xl font-bold leading-tight hover:text-gray-300 transition">
          {product.name}
        </h3>
        {product.category && (
          <p className="text-sm text-gray-400 font-medium mt-1">{product.category}</p>
        )}

        {/* Prices */}
        <div className="mt-3 space-y-1">
          <p className="text-sm font-semibold">
            ${product.price_ship.toFixed(2)} — 🚢 Ship
          </p>
          <p className="text-sm font-semibold">
            ${product.price_local.toFixed(2)} — 📍 In Town
          </p>
        </div>
      </div>

      {/* Image / Video toggle tabs */}
      {hasVideo && (
        <div className="flex mx-4 mb-3 rounded-xl overflow-hidden border border-gray-700">
          <button
            onClick={() => setActiveTab('image')}
            className={`flex-1 flex items-center justify-center gap-2 py-2.5 text-sm font-medium transition ${
              activeTab === 'image'
                ? 'bg-gray-800 text-white'
                : 'bg-transparent text-gray-500 hover:text-gray-300'
            }`}
          >
            🖼 Image
          </button>
          <button
            onClick={() => setActiveTab('video')}
            className={`flex-1 flex items-center justify-center gap-2 py-2.5 text-sm font-medium transition ${
              activeTab === 'video'
                ? 'bg-gray-800 text-white'
                : 'bg-transparent text-gray-500 hover:text-gray-300'
            }`}
          >
            ▷ Video
          </button>
        </div>
      )}

      {/* Media — clicking image goes to detail page */}
      <div
        className="relative w-full aspect-square bg-gray-900 cursor-pointer"
        onClick={() => router.push(`/products/${product.slug}`)}
      >
        {activeTab === 'image' || !hasVideo ? (
          product.image_url ? (
            <Image
              src={product.image_url}
              alt={product.name}
              fill
              className="object-cover hover:opacity-90 transition"
              sizes="(max-width: 768px) 100vw, 25vw"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-gray-600 text-5xl">
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
      </div>

      {/* Add to cart */}
      <div className="px-4 py-4">
        {product.description && (
          <p className="text-sm text-gray-400 mb-3 line-clamp-2">
            {product.description}
          </p>
        )}
        <button
          onClick={() => addToCart(product)}
          className="w-full bg-[#8B7B2A] hover:bg-[#9d8c30] text-white py-3 rounded-xl text-sm font-bold active:scale-95 transition-all duration-150 uppercase tracking-wide"
        >
          Add to Cart
        </button>
      </div>
    </div>
  );
}