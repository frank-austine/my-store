'use client';

import { useEffect, useRef } from 'react';
import { animateOnScroll } from '@/app/lib/gsapAnimations';

export default function AboutSection() {
  const sectionRef = useRef<HTMLElement>(null);
  useEffect(() => { if (sectionRef.current) animateOnScroll(sectionRef.current); }, []);

  return (
    <section ref={sectionRef} className="py-20 px-6 text-center border-t border-[#2a2a2a]">
      <p className="text-[10px] text-[#8B7B2A] uppercase tracking-[0.3em] mb-4">Who We Are</p>
      <h2 className="text-2xl font-black uppercase tracking-tight text-white mb-4">About Us</h2>
      <div className="w-8 h-px bg-[#8B7B2A] mx-auto mb-6" />
      <p className="text-gray-500 max-w-md mx-auto leading-relaxed text-sm">
        LA Weed Kandy Plug — your trusted source for premium cannabis in Los Angeles.
        Quality products, fast service, full discretion.
      </p>
      <a
        href="/about"
        className="inline-block mt-8 border border-[#8B7B2A]/50 hover:border-[#8B7B2A] text-[#8B7B2A] px-8 py-3 rounded-xl text-xs font-bold uppercase tracking-widest transition"
      >
        Our Full Story →
      </a>
    </section>
  );
}