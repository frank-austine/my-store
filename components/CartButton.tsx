'use client';

import { useCartStore } from '@/store/cartStore';

export default function CartButton() {
  const { items, toggleCart } = useCartStore();
  const totalItems = items.reduce((sum, i) => sum + i.quantity, 0);

  return (
    <button
      onClick={toggleCart}
      aria-label="Open cart"
      className="relative flex items-center gap-2 px-3 py-2 rounded-xl border border-[#2a2a2a] hover:border-[#8B7B2A]/50 bg-[#1a1a1a] transition"
    >
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#8B7B2A" strokeWidth="2">
        <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/>
        <line x1="3" y1="6" x2="21" y2="6"/>
        <path d="M16 10a4 4 0 01-8 0"/>
      </svg>
      <span className="text-xs font-bold text-gray-300 uppercase tracking-widest">Cart</span>
      {totalItems > 0 && (
        <span className="absolute -top-2 -right-2 bg-[#8B7B2A] text-white text-[10px] rounded-full w-5 h-5 flex items-center justify-center font-black">
          {totalItems}
        </span>
      )}
    </button>
  );
}