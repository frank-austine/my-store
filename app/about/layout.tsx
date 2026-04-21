'use client';

import { useCartStore } from '@/store/cartStore';
import Sidebar from '@/components/Sidebar';
import CartDrawer from '@/components/CartDrawer';
import AntiCopyWrapper from '@/components/AntiCopyWrapper';

export default function AboutLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const toggleCart = useCartStore((state) => state.toggleCart);
  const items = useCartStore((state) => state.items);
  const cartCount = items.reduce((sum, i) => sum + i.quantity, 0);

  return (
    <AntiCopyWrapper>
      <Sidebar />

      {/* Header — shows ABOUT */}
      <header className="sticky top-0 z-40 bg-[#111111]/95 backdrop-blur border-b border-[#2a2a2a] px-6 py-4 flex items-center justify-between">
        <div className="w-10" />

        <span className="text-sm font-black uppercase tracking-[0.3em] text-white">
          About
        </span>

        <button
          onClick={toggleCart}
          className="relative w-10 h-10 flex items-center justify-center rounded-xl bg-[#1a1a1a] border border-[#2a2a2a] hover:border-[#8B7B2A]/50 transition"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#8B7B2A" strokeWidth="2">
            <circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/>
            <path d="M1 1h4l2.68 13.39a2 2 0 002 1.61h9.72a2 2 0 002-1.61L23 6H6"/>
          </svg>
          {cartCount > 0 && (
            <span className="absolute -top-2 -right-2 bg-[#8B7B2A] text-white text-[10px] rounded-full w-5 h-5 flex items-center justify-center font-black">
              {cartCount}
            </span>
          )}
        </button>
      </header>

      <main>{children}</main>
      <CartDrawer />
    </AntiCopyWrapper>
  );
}