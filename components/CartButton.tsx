'use client';

import { useCartStore } from '@/store/cartStore';

export default function CartButton() {
  const { items, toggleCart } = useCartStore();
  const totalItems = items.reduce((sum, i) => sum + i.quantity, 0);

  return (
    <button
      onClick={toggleCart}
      aria-label="Open cart"
      className="relative flex items-center justify-center w-11 h-11 rounded-lg bg-[#1a1a1a] border border-[#2a2a2a] hover:border-[#8B7B2A]/50 transition"
    >
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#8B7B2A" strokeWidth="2">
        <circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/>
        <path d="M1 1h4l2.68 13.39a2 2 0 002 1.61h9.72a2 2 0 002-1.61L23 6H6"/>
      </svg>
      {totalItems > 0 && (
        <span className="absolute -top-2 -right-2 bg-[#8B7B2A] text-white text-[10px] rounded-sm w-5 h-5 flex items-center justify-center font-black">
          {totalItems}
        </span>
      )}
    </button>
  );
}