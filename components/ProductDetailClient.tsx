'use client';

import { useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { Product } from '@/types/product';
import { useCartStore } from '@/store/cartStore';

type Props = {
  product: Product;
};

export default function ProductDetailClient({ product }: Props) {
  const router = useRouter();
  const addToCart = useCartStore((state) => state.addToCart);
  const toggleCart = useCartStore((state) => state.toggleCart);
  const [activeTab, setActiveTab] = useState<'image' | 'video'>('image');
  const [favorited, setFavorited] = useState(false);
  const [addedToCart, setAddedToCart] = useState(false);

  const hasVideo = !!product.video_url;

  function handleAddToCart() {
    addToCart(product);
    setAddedToCart(true);
    setTimeout(() => setAddedToCart(false), 2000);
  }

  function handleBuyOnTelegram() {
    const message = encodeURIComponent(
      `Hi! I want to order: ${product.name}\nShip price: $${product.price_ship}\nLocal price: $${product.price_local}`
    );
    window.open(`https://t.me/Los_angeles_weed_kandy_plug?text=${message}`, '_blank');
  }

  return (
    <div className="min-h-screen bg-[#1a1a1a] text-white pb-12">

      {/* Back button */}
      <div className="px-4 pt-4">
        <button
          onClick={() => router.back()}
          className="flex items-center gap-2 text-gray-400 hover:text-white transition text-sm"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M19 12H5M12 19l-7-7 7-7"/>
          </svg>
          Back
        </button>
      </div>

      {/* Product name + category */}
      <div className="px-4 pt-4 pb-3">
        <h1 className="text-2xl font-bold leading-tight">{product.name}</h1>
        {product.category && (
          <p className="text-sm text-gray-400 mt-1 font-medium">{product.category}</p>
        )}

        {/* Prices */}
        <div className="mt-3 space-y-1">
          <p className="text-base font-semibold">
            ${product.price_ship.toFixed(2)} — 🚢 Ship
          </p>
          <p className="text-base font-semibold">
            ${product.price_local.toFixed(2)} — 📍 In Town
          </p>
        </div>
      </div>

      {/* Image / Video tabs */}
      {hasVideo && (
        <div className="flex mx-4 mb-3 rounded-xl overflow-hidden border border-gray-700">
          <button
            onClick={() => setActiveTab('image')}
            className={`flex-1 flex items-center justify-center gap-2 py-2.5 text-sm font-medium transition ${
              activeTab === 'image'
                ? 'bg-gray-700 text-white'
                : 'bg-transparent text-gray-500 hover:text-gray-300'
            }`}
          >
            🖼 Image
          </button>
          <button
            onClick={() => setActiveTab('video')}
            className={`flex-1 flex items-center justify-center gap-2 py-2.5 text-sm font-medium transition ${
              activeTab === 'video'
                ? 'bg-gray-700 text-white'
                : 'bg-transparent text-gray-500 hover:text-gray-300'
            }`}
          >
            ▷ Video
          </button>
        </div>
      )}

      {/* Media */}
      <div className="relative w-full aspect-square bg-gray-900 mx-0">
        {activeTab === 'image' || !hasVideo ? (
          product.image_url ? (
            <Image
              src={product.image_url}
              alt={product.name}
              fill
              className="object-cover"
              sizes="100vw"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-gray-600 text-6xl">
              📦
            </div>
          )
        ) : (
          <video
            src={product.video_url!}
            controls
            autoPlay
            className="w-full h-full object-cover"
          />
        )}
      </div>

      {/* Description */}
      {product.description && (
        <div className="px-4 py-4 border-b border-gray-800">
          <p className="text-gray-400 text-sm leading-relaxed">{product.description}</p>
        </div>
      )}

      {/* Action buttons */}
      <div className="px-4 pt-6 space-y-3">

        {/* ADD TO CART */}
        <button
          onClick={handleAddToCart}
          className="w-full flex items-center justify-center gap-3 bg-[#8B7B2A] hover:bg-[#9d8c30] active:scale-95 text-white font-bold py-5 rounded-2xl transition-all duration-150 uppercase tracking-widest text-sm"
        >
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/>
            <line x1="3" y1="6" x2="21" y2="6"/>
            <path d="M16 10a4 4 0 01-8 0"/>
          </svg>
          {addedToCart ? 'Added ✓' : 'Add to Cart'}
        </button>

        {/* BUY ON TELEGRAM */}
        <button
          onClick={handleBuyOnTelegram}
          className="w-full flex items-center justify-center gap-3 bg-[#7A6B22] hover:bg-[#8B7B2A] active:scale-95 text-white font-bold py-5 rounded-2xl transition-all duration-150 uppercase tracking-widest text-sm"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <line x1="22" y1="2" x2="11" y2="13"/>
            <polygon points="22 2 15 22 11 13 2 9 22 2"/>
          </svg>
          Buy on Telegram
        </button>

        {/* ADD TO FAVORITES */}
        <button
          onClick={() => setFavorited(!favorited)}
          className={`w-full flex items-center justify-center gap-3 border font-bold py-5 rounded-2xl transition-all duration-150 uppercase tracking-widest text-sm active:scale-95 ${
            favorited
              ? 'border-red-500 text-red-400 bg-red-500/10'
              : 'border-gray-700 text-gray-400 hover:border-gray-500 bg-transparent'
          }`}
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill={favorited ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="2">
            <path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z"/>
          </svg>
          {favorited ? 'Saved to Favorites' : 'Add to Favorites'}
        </button>
      </div>

      {/* Bottom contact buttons */}
      <div className="px-4 pt-4 grid grid-cols-2 gap-3">
        {/* TELEGRAM */}
        <a
          href="https://t.me/Los_angeles_weed_kandy_plug"
          target="_blank"
          rel="noopener noreferrer"
          className="flex flex-col items-center justify-center gap-2 border border-gray-700 hover:border-gray-500 rounded-2xl py-5 transition text-gray-400 hover:text-white"
        >
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <line x1="22" y1="2" x2="11" y2="13"/>
            <polygon points="22 2 15 22 11 13 2 9 22 2"/>
          </svg>
          <span className="text-xs font-bold uppercase tracking-widest">Telegram</span>
        </a>

        {/* LOCAL */}
        <a
          href="https://t.me/Los_angeles_weed_kandy_plug"
          target="_blank"
          rel="noopener noreferrer"
          className="flex flex-col items-center justify-center gap-2 border border-gray-700 hover:border-gray-500 rounded-2xl py-5 transition text-gray-400 hover:text-white"
        >
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.07 9.81a19.79 19.79 0 01-3.07-8.67A2 2 0 012 .84h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L6.09 8.63a16 16 0 006.29 6.29l1.95-1.95a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92z"/>
          </svg>
          <span className="text-xs font-bold uppercase tracking-widest">Local</span>
        </a>
      </div>

    </div>
  );
}