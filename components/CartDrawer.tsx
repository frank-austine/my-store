'use client';

import { useEffect, useRef } from 'react';
import { useCartStore } from '@/store/cartStore';
import { animateCartOpen } from '@/app/lib/gsapAnimations';

const TELEGRAM_CHAT_URL = 'https://t.me/Los_angeles_weed_kandy_plug';

export default function CartDrawer() {
  const { items, isOpen, removeFromCart, updateQuantity, clearCart, toggleCart } =
    useCartStore();
  const drawerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen && drawerRef.current) {
      animateCartOpen(drawerRef.current);
    }
  }, [isOpen]);

  const total = items.reduce(
    (sum, i) => sum + i.product.price_ship * i.quantity,
    0
  );

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
        onClick={toggleCart}
      />

      {/* Drawer panel */}
      <div
        ref={drawerRef}
        className="relative bg-white w-full max-w-sm h-full flex flex-col shadow-2xl"
      >
        {/* Header */}
        <div className="flex justify-between items-center px-6 py-5 border-b border-gray-100">
          <h2 className="text-lg font-bold">Your Cart</h2>
          <button
            onClick={toggleCart}
            className="text-gray-400 hover:text-black transition text-xl leading-none"
          >
            ✕
          </button>
        </div>

        {/* Items */}
        <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4">
          {items.length === 0 ? (
            <p className="text-gray-400 text-sm text-center mt-12">
              Your cart is empty.
            </p>
          ) : (
            items.map(({ product, quantity }) => (
              <div
                key={product.id}
                className="flex justify-between items-start gap-4 border-b border-gray-100 pb-4"
              >
                <div className="flex-1">
                  <p className="font-medium text-sm leading-snug">{product.name}</p>
                  <p className="text-xs text-gray-400 mt-0.5">{product.category}</p>
                  <p className="text-sm font-semibold mt-1">
                    ${(product.price_ship * quantity).toFixed(2)}
                  </p>

                  {/* Quantity controls */}
                  <div className="flex items-center gap-2 mt-2">
                    <button
                      onClick={() => updateQuantity(product.id, quantity - 1)}
                      className="w-6 h-6 rounded-full border border-gray-200 text-sm flex items-center justify-center hover:bg-gray-100 transition"
                    >
                      −
                    </button>
                    <span className="text-sm w-4 text-center">{quantity}</span>
                    <button
                      onClick={() => updateQuantity(product.id, quantity + 1)}
                      className="w-6 h-6 rounded-full border border-gray-200 text-sm flex items-center justify-center hover:bg-gray-100 transition"
                    >
                      +
                    </button>
                  </div>
                </div>

                <button
                  onClick={() => removeFromCart(product.id)}
                  className="text-gray-300 hover:text-red-500 transition text-sm mt-1"
                >
                  ✕
                </button>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        {items.length > 0 && (
          <div className="px-6 py-5 border-t border-gray-100">
            <div className="flex justify-between items-center mb-4">
              <span className="text-gray-500 text-sm">Total (shipping prices)</span>
              <span className="font-bold text-lg">${total.toFixed(2)}</span>
            </div>
            <button
              onClick={() => window.open(TELEGRAM_CHAT_URL, '_blank')}
              className="w-full bg-black text-white py-3 rounded-xl font-medium hover:bg-gray-800 active:scale-95 transition-all duration-150"
            >
              Checkout via Telegram
            </button>
            <button
              onClick={clearCart}
              className="w-full mt-3 text-sm text-gray-400 hover:text-red-500 transition"
            >
              Clear cart
            </button>
          </div>
        )}
      </div>
    </div>
  );
}