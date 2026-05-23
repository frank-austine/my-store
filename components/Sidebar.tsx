'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function Sidebar() {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    document.body.style.overflow = isOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [isOpen]);

  return (
    <>
      {/* Hamburger button */}
      <button
        onClick={() => setIsOpen(true)}
        aria-label="Open menu"
        className="fixed top-3 left-4 z-50 flex flex-col justify-center items-start gap-1.25 w-11 h-11 rounded-lg bg-[#1a1a1a] border border-[#8B7B2A]/40 hover:border-[#8B7B2A] hover:bg-[#222] transition px-3"
      >
        <span className="block w-5 h-0.5 bg-[#8B7B2A]" />
        <span className="block w-5 h-0.5 bg-[#8B7B2A]" />
        <span className="block w-3 h-0.5 bg-[#8B7B2A]" />
      </button>

      {/* Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/70 backdrop-blur-sm"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar panel */}
      <div
        className={`fixed top-0 left-0 z-50 h-full w-72 bg-[#111111] border-r border-[#2a2a2a] flex flex-col transition-transform duration-300 ease-in-out ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-[#2a2a2a]">
          <div className="flex flex-col leading-none">
            <span className="text-base font-black tracking-tight uppercase text-white">Kandy Distro</span>
            <span className="text-[9px] tracking-[0.3em] text-[#8B7B2A] uppercase mt-0.5">Los Angeles</span>
          </div>
          <button
            onClick={() => setIsOpen(false)}
            className="w-8 h-8 rounded-lg bg-[#2a2a2a] hover:bg-[#333] flex items-center justify-center text-gray-400 hover:text-white transition text-sm"
          >
            ✕
          </button>
        </div>

        {/* Nav */}
        <nav className="flex-1 overflow-y-auto px-4 py-6 space-y-2">
          <Link
            href="/#products"
            onClick={() => setIsOpen(false)}
            className="flex items-center gap-3 px-4 py-4 rounded-lg text-gray-300 hover:bg-[#1f1f1f] hover:text-white font-bold transition border border-transparent hover:border-[#2a2a2a] uppercase tracking-widest text-sm"
          >
            <span className="w-1.5 h-1.5 rounded-sm bg-[#8B7B2A] shrink-0" />
            All Products
          </Link>
          <Link
            href="/about"
            onClick={() => setIsOpen(false)}
            className="flex items-center gap-3 px-4 py-4 rounded-lg text-gray-300 hover:bg-[#1f1f1f] hover:text-white font-bold transition border border-transparent hover:border-[#2a2a2a] uppercase tracking-widest text-sm"
          >
            <span className="w-1.5 h-1.5 rounded-sm bg-[#8B7B2A] shrink-0" />
            About Us
          </Link>
        </nav>

        {/* Footer */}
        <div className="px-5 py-5 border-t border-[#2a2a2a]">
          <button
            onClick={() => {
              setIsOpen(false);
              window.open('https://t.me/Kandydistro', '_blank');
            }}
            className="w-full bg-[#8B7B2A] hover:bg-[#a08f30] text-white py-3 rounded-lg font-black transition text-sm uppercase tracking-widest"
          >
            Order via Telegram
          </button>
          <p className="text-[10px] text-gray-600 text-center mt-3 tracking-wide">
            @Kandydistro
          </p>
        </div>
      </div>
    </>
  );
}