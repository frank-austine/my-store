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
  const items = useCartStore((state) => state.items);
  const [activeTab, setActiveTab] = useState<'image' | 'video'>('image');
  const [favorited, setFavorited] = useState(false);
  const [addedToCart, setAddedToCart] = useState(false);

  const hasVideo = !!product.video_url;
  const cartCount = items.reduce((sum, i) => sum + i.quantity, 0);

  function handleAddToCart() {
    addToCart(product);
    setAddedToCart(true);
    setTimeout(() => setAddedToCart(false), 2000);
  }

  function handleBuyOnTelegram() {
    const message = encodeURIComponent(
      `Hi! I want to order:\n\n*${product.name}*\nShip: $${product.price_ship}\nLocal: $${product.price_local}`
    );
    window.open(`https://t.me/Kandydistro?text=${message}`, '_blank');
  }

  return (
    <div className="min-h-screen bg-[#111111] text-white flex flex-col items-center">
      <div className="w-full max-w-lg mx-auto flex flex-col">

        {/* Top bar */}
        <div className="flex items-center justify-between px-4 pt-5 pb-3">
          <button
            onClick={() => router.back()}
            className="w-10 h-10 flex items-center justify-center rounded-lg bg-[#1a1a1a] border border-[#2a2a2a] hover:border-[#8B7B2A]/50 transition"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5">
              <path d="M19 12H5M12 19l-7-7 7-7"/>
            </svg>
          </button>

          <button
            onClick={toggleCart}
            className="relative w-10 h-10 flex items-center justify-center rounded-lg bg-[#1a1a1a] border border-[#2a2a2a] hover:border-[#8B7B2A]/50 transition"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
              <circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/>
              <path d="M1 1h4l2.68 13.39a2 2 0 002 1.61h9.72a2 2 0 002-1.61L23 6H6"/>
            </svg>
            {cartCount > 0 && (
              <span className="absolute -top-1.5 -right-1.5 bg-[#8B7B2A] text-white text-[9px] font-black rounded-sm w-4 h-4 flex items-center justify-center">
                {cartCount}
              </span>
            )}
          </button>
        </div>

        {/* Product name — centered */}
        <div className="px-4 pt-2 pb-4 text-center">
          <h1 className="text-3xl font-black leading-tight mb-1">
            {product.name}
          </h1>
          {product.category && (
            <p className="text-gray-400 font-semibold text-sm mb-4">{product.category}</p>
          )}

          {/* Prices — centered */}
          <div className="space-y-1 mb-5">
            <p className="text-xl font-bold">
              ${product.price_ship.toFixed(2)} — 🚢 Ship
            </p>
            <p className="text-xl font-bold">
              ${product.price_local.toFixed(2)} — 📍 In Town
            </p>
          </div>

          {/* Image / Video toggle — centered, full width, square buttons */}
          {hasVideo && (
            <div className="flex w-full border border-[#2a2a2a] rounded-lg overflow-hidden mb-4">
              <button
                onClick={() => setActiveTab('image')}
                className={`flex-1 flex items-center justify-center gap-2 py-3 text-sm font-bold uppercase tracking-widest transition ${
                  activeTab === 'image'
                    ? 'bg-[#2a2a2a] text-white'
                    : 'bg-transparent text-gray-500 hover:text-gray-300'
                }`}
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <rect x="3" y="3" width="18" height="18" rx="1"/><circle cx="8.5" cy="8.5" r="1.5"/>
                  <polyline points="21 15 16 10 5 21"/>
                </svg>
                Image
              </button>
              <div className="w-px bg-[#2a2a2a]" />
              <button
                onClick={() => setActiveTab('video')}
                className={`flex-1 flex items-center justify-center gap-2 py-3 text-sm font-bold uppercase tracking-widest transition ${
                  activeTab === 'video'
                    ? 'bg-[#2a2a2a] text-white'
                    : 'bg-transparent text-gray-500 hover:text-gray-300'
                }`}
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <polygon points="5 3 19 12 5 21 5 3"/>
                </svg>
                Video
              </button>
            </div>
          )}
        </div>

        {/* Media — full width, centered */}
        <div className="px-4 mb-6 w-full">
          <div className="relative w-full rounded-lg overflow-hidden bg-[#1a1a1a]" style={{ aspectRatio: '1/1' }}>
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
                <div className="w-full h-full flex items-center justify-center text-gray-700 text-6xl">
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
        </div>

        {/* Description */}
        {product.description && (
          <div className="px-4 mb-4 text-center">
            <p className="text-gray-400 text-sm leading-relaxed">{product.description}</p>
          </div>
        )}

        {/* Action buttons — square/rectangle style */}
        <div className="px-4 flex flex-col gap-3">

          {/* ADD TO CART */}
          <button
            onClick={handleAddToCart}
            className="w-full flex items-center justify-center gap-3 bg-[#8B7B2A] hover:bg-[#9d8c30] active:scale-95 text-white font-black py-5 rounded-lg transition-all duration-150 uppercase tracking-widest text-sm"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/>
              <path d="M1 1h4l2.68 13.39a2 2 0 002 1.61h9.72a2 2 0 002-1.61L23 6H6"/>
            </svg>
            {addedToCart ? 'Added ✓' : 'Add to Cart'}
          </button>

          {/* BUY ON TELEGRAM */}
          <button
            onClick={handleBuyOnTelegram}
            className="w-full flex items-center justify-center gap-3 bg-[#7A6B22] hover:bg-[#8B7B2A] active:scale-95 text-white font-black py-5 rounded-lg transition-all duration-150 uppercase tracking-widest text-sm"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="22" y1="2" x2="11" y2="13"/>
              <polygon points="22 2 15 22 11 13 2 9 22 2"/>
            </svg>
            Buy on Telegram
          </button>

          {/* ADD TO FAVORITES */}
          <button
            onClick={() => setFavorited(!favorited)}
            className={`w-full flex items-center justify-center gap-3 border font-black py-5 rounded-lg transition-all duration-150 uppercase tracking-widest text-sm active:scale-95 ${
              favorited
                ? 'border-red-500/50 text-red-400 bg-red-500/10'
                : 'border-[#2a2a2a] text-gray-400 hover:border-gray-600 bg-transparent'
            }`}
          >
            <svg width="18" height="18" viewBox="0 0 24 24"
              fill={favorited ? 'currentColor' : 'none'}
              stroke="currentColor" strokeWidth="2"
            >
              <path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z"/>
            </svg>
            {favorited ? 'Saved to Favorites' : 'Add to Favorites'}
          </button>
        </div>

        {/* Bottom contact buttons — square style */}
        <div className="px-4 pt-4 pb-10 grid grid-cols-2 gap-3">
          <a
            href="https://t.me/Kandydistro"
            target="_blank"
            rel="noopener noreferrer"
            className="flex flex-col items-center justify-center gap-2 bg-[#1a1a1a] border border-[#2a2a2a] hover:border-[#8B7B2A]/40 rounded-lg py-6 transition"
          >
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.8">
              <line x1="22" y1="2" x2="11" y2="13"/>
              <polygon points="22 2 15 22 11 13 2 9 22 2"/>
            </svg>
            <span className="text-xs font-black uppercase tracking-widest text-gray-300">Telegram</span>
          </a>

          <a
            href="https://t.me/Kandydistro"
            target="_blank"
            rel="noopener noreferrer"
            className="flex flex-col items-center justify-center gap-2 bg-[#1a1a1a] border border-[#2a2a2a] hover:border-[#8B7B2A]/40 rounded-lg py-6 transition"
          >
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.8">
              <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.07 9.81a19.79 19.79 0 01-3.07-8.67A2 2 0 012 .84h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L6.09 8.63a16 16 0 006.29 6.29l1.95-1.95a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92z"/>
            </svg>
            <span className="text-xs font-black uppercase tracking-widest text-gray-300">Local</span>
          </a>
        </div>

      </div>
    </div>
  );
}