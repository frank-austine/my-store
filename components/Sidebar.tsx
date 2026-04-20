'use client';

import { useState, useEffect } from 'react';
import { useCartStore } from '@/store/cartStore';

const menuLinks = [
  { label: 'All Products', href: '/#products' },
  { label: 'Edibles', href: '/?category=Edibles#products' },
  { label: 'Flowers', href: '/?category=Flowers#products' },
  { label: 'Concentrates', href: '/?category=Concentrates#products' },
  { label: 'Vapes', href: '/?category=Vapes#products' },
  { label: 'Pre-Rolls', href: '/?category=Pre-Rolls#products' },
];

export default function Sidebar() {
  const [isOpen, setIsOpen] = useState(false);
  const toggleCart = useCartStore((state) => state.toggleCart);

  // Close sidebar on route change
  useEffect(() => {
    setIsOpen(false);
  }, []);

  // Prevent body scroll when sidebar open
  useEffect(() => {
    document.body.style.overflow = isOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [isOpen]);

  return (
    <>
      {/* Hamburger button — always visible top left */}
      <button
        onClick={() => setIsOpen(true)}
        aria-label="Open menu"
        className="fixed top-4 left-4 z-50 flex flex-col justify-center items-center gap-1.5 w-10 h-10 rounded-xl bg-white border border-gray-100 shadow-sm hover:shadow-md transition"
      >
        <span className="block w-5 h-0.5 bg-gray-800 rounded" />
        <span className="block w-5 h-0.5 bg-gray-800 rounded" />
        <span className="block w-3.5 h-0.5 bg-gray-800 rounded self-start ml-1.25" />
      </button>

      {/* Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar panel */}
      <div
        className={`fixed top-0 left-0 z-50 h-full w-72 bg-white shadow-2xl flex flex-col transition-transform duration-300 ease-in-out ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Sidebar header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100">
          <div className="flex flex-col leading-none">
            <span className="text-lg font-black tracking-tight uppercase">LA Kandy</span>
            <span className="text-[10px] tracking-[0.2em] text-gray-400 uppercase">Weed Plug</span>
          </div>
          <button
            onClick={() => setIsOpen(false)}
            className="text-gray-400 hover:text-black transition text-xl leading-none"
          >
            ✕
          </button>
        </div>

        {/* Nav links */}
        <nav className="flex-1 overflow-y-auto px-4 py-6 space-y-1">
          <p className="text-xs text-gray-400 uppercase tracking-widest px-3 mb-3">
            Shop
          </p>
          {menuLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              onClick={() => setIsOpen(false)}
              className="flex items-center gap-3 px-3 py-3 rounded-xl text-gray-700 hover:bg-gray-50 hover:text-black font-medium transition"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-gray-300 shrink-0" />
              {link.label}
            </a>
          ))}

          <div className="pt-6">
            <p className="text-xs text-gray-400 uppercase tracking-widest px-3 mb-3">
              Info
            </p>
            <a
              href="/about"
              onClick={() => setIsOpen(false)}
              className="flex items-center gap-3 px-3 py-3 rounded-xl text-gray-700 hover:bg-gray-50 hover:text-black font-medium transition"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-gray-300 shrink-0" />
              About Us
            </a>
          </div>
        </nav>

        {/* Sidebar footer — Telegram CTA */}
        <div className="px-6 py-5 border-t border-gray-100">
          <button
            onClick={() => {
              setIsOpen(false);
              window.open('https://t.me/Los_angeles_weed_kandy_plug', '_blank');
            }}
            className="w-full bg-black text-white py-3 rounded-xl font-medium hover:bg-gray-800 transition text-sm"
          >
            Order via Telegram
          </button>
          <p className="text-xs text-gray-400 text-center mt-3">
            @Los_angeles_weed_kandy_plug
          </p>
        </div>
      </div>
    </>
  );
}