'use client';

import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import { Product } from '@/types/product';
import { useCartStore } from '@/store/cartStore';
import { animateOnScroll } from '@/app/lib/gsapAnimations';

type Props = {
  product: Product;
  videoUrl?: string;
};

export default function ProductCard({ product, videoUrl }: Props) {
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
      className="rounded-2xl overflow-hidden flex flex-col bg-black text-white"
    >
      {/* Product name and category */}
      <div className="px-4 pt-5 pb-3">
        <h3 className="text-2xl font-bold leading-tight">{product.name}</h3>
        {product.category && (
          <p className="text-sm text-gray-400 font-medium mt-1">{product.category}</p>
        )}

        {/* Prices */}
        <div className="mt-4 space-y-1">
          <p className="text-base font-semibold">
            ${product.price_ship.toFixed(2)} - 🚢 Ship
          </p>
          <p className="text-base font-semibold">
            ${product.price_local.toFixed(2)} - 📍 In Town
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
            <span className="text-base">🖼</span> Image
          </button>
          <button
            onClick={() => setActiveTab('video')}
            className={`flex-1 flex items-center justify-center gap-2 py-2.5 text-sm font-medium transition ${
              activeTab === 'video'
                ? 'bg-gray-800 text-white'
                : 'bg-transparent text-gray-500 hover:text-gray-300'
            }`}
          >
            <span className="text-base">▷</span> Video
          </button>
        </div>
      )}

      {/* Media display */}
      <div className="relative w-full aspect-square bg-gray-900 mx-0">
        {activeTab === 'image' || !hasVideo ? (
          product.image_url ? (
            <Image
              src={product.image_url}
              alt={product.name}
              fill
              className="object-cover"
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
          className="w-full bg-white text-black py-3 rounded-xl text-sm font-bold hover:bg-gray-100 active:scale-95 transition-all duration-150"
        >
          Add to cart
        </button>
      </div>
    </div>
  );
}