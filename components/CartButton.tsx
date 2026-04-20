'use client';

import { useCartStore } from '@/store/cartStore';

export default function CartButton() {
  const { items, toggleCart } = useCartStore();
  const totalItems = items.reduce((sum, i) => sum + i.quantity, 0);

  return (
    <button
      onClick={toggleCart}
      aria-label="Open cart"
      className="relative flex items-center gap-2 px-4 py-2 rounded-xl border border-gray-100 hover:border-gray-200 hover:shadow-sm transition"
    >
      <span className="text-lg">🛒</span>
      <span className="text-sm font-medium text-gray-700">Cart</span>
      {totalItems > 0 && (
        <span className="absolute -top-2 -right-2 bg-black text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold">
          {totalItems}
        </span>
      )}
    </button>
  );
}