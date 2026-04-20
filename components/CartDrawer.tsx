'use client';

import { useEffect, useRef } from 'react';
import { useCartStore } from '@/store/cartStore';
import { animateCartOpen } from '@/app/lib/gsapAnimations';

const TELEGRAM_CHAT_URL = 'https://t.me/Los_angeles_weed_kandy_plug';

export default function CartDrawer() {
  const { items, isOpen, removeFromCart, updateQuantity, clearCart, toggleCart } = useCartStore();
  const drawerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen && drawerRef.current) animateCartOpen(drawerRef.current);
  }, [isOpen]);

  const total = items.reduce((sum, i) => sum + i.product.price_ship * i.quantity, 0);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={toggleCart} />
      <div
        ref={drawerRef}
        className="relative bg-[#111111] border-l border-[#2a2a2a] w-full max-w-sm h-full flex flex-col"
      >
        {/* Header */}
        <div className="flex justify-between items-center px-6 py-5 border-b border-[#2a2a2a]">
          <div>
            <h2 className="text-base font-black uppercase tracking-widest text-white">Your Cart</h2>
            <p className="text-[10px] text-[#8B7B2A] tracking-widest uppercase mt-0.5">
              {items.length} {items.length === 1 ? 'item' : 'items'}
            </p>
          </div>
          <button onClick={toggleCart} className="text-gray-600 hover:text-white transition text-lg">✕</button>
        </div>

        {/* Items */}
        <div className="flex-1 overflow-y-auto px-5 py-4 space-y-4">
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-40 gap-3">
              <p className="text-gray-600 text-sm uppercase tracking-widest">Cart is empty</p>
              <button onClick={toggleCart} className="text-[#8B7B2A] text-xs underline underline-offset-4">
                Continue shopping
              </button>
            </div>
          ) : (
            items.map(({ product, quantity }) => (
              <div key={product.id} className="flex gap-3 border-b border-[#1f1f1f] pb-4">
                <div className="flex-1 min-w-0">
                  <p className="font-bold text-sm text-white leading-snug truncate">{product.name}</p>
                  <p className="text-[10px] text-gray-600 mt-0.5 uppercase tracking-wide">{product.category}</p>
                  <p className="text-[#8B7B2A] font-bold text-sm mt-1">
                    ${(product.price_ship * quantity).toFixed(2)}
                  </p>
                  <div className="flex items-center gap-2 mt-2">
                    <button
                      onClick={() => updateQuantity(product.id, quantity - 1)}
                      className="w-6 h-6 rounded-lg border border-[#2a2a2a] text-gray-400 hover:border-[#8B7B2A] hover:text-[#8B7B2A] transition flex items-center justify-center text-sm"
                    >−</button>
                    <span className="text-sm text-white w-4 text-center font-bold">{quantity}</span>
                    <button
                      onClick={() => updateQuantity(product.id, quantity + 1)}
                      className="w-6 h-6 rounded-lg border border-[#2a2a2a] text-gray-400 hover:border-[#8B7B2A] hover:text-[#8B7B2A] transition flex items-center justify-center text-sm"
                    >+</button>
                  </div>
                </div>
                <button
                  onClick={() => removeFromCart(product.id)}
                  className="text-gray-700 hover:text-red-500 transition text-sm self-start mt-1"
                >✕</button>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        {items.length > 0 && (
          <div className="px-5 py-5 border-t border-[#2a2a2a]">
            <div className="flex justify-between items-center mb-4">
              <span className="text-gray-500 text-xs uppercase tracking-widest">Total</span>
              <span className="font-black text-xl text-[#8B7B2A]">${total.toFixed(2)}</span>
            </div>
            <button
              onClick={() => window.open(TELEGRAM_CHAT_URL, '_blank')}
              className="w-full bg-[#8B7B2A] hover:bg-[#a08f30] text-white py-4 rounded-xl font-black uppercase tracking-widest text-sm active:scale-95 transition-all duration-150"
            >
              Checkout via Telegram
            </button>
            <button
              onClick={clearCart}
              className="w-full mt-3 text-xs text-gray-600 hover:text-red-500 transition uppercase tracking-widest"
            >
              Clear cart
            </button>
          </div>
        )}
      </div>
    </div>
  );
}