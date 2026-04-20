'use client';

import { useEffect, useRef } from 'react';
import { animateOnScroll } from '@/app/lib/gsapAnimations';

export default function AboutSection() {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    if (sectionRef.current) {
      animateOnScroll(sectionRef.current);
    }
  }, []);

  return (
    <section ref={sectionRef} className="py-16 px-6 bg-gray-50 text-center">
      <h2 className="text-2xl font-bold mb-4">About Us</h2>
      <p className="text-gray-600 max-w-xl mx-auto leading-relaxed">
        LA Weed Kandy Plug — your trusted source for premium cannabis in Los Angeles.
        Quality products, fast service, full discretion.
      </p>
      <a
        href="/about"
        className="inline-block mt-6 bg-black text-white px-6 py-2.5 rounded-xl text-sm font-medium hover:bg-gray-800 transition"
      >
        Our full story →
      </a>
    </section>
  );
}