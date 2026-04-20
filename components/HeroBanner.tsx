'use client';

import { useEffect, useRef } from 'react';
import gsap from 'gsap';

export default function HeroBanner() {
  const headingRef = useRef<HTMLHeadingElement>(null);
  const subRef = useRef<HTMLParagraphElement>(null);
  const btnRef = useRef<HTMLAnchorElement>(null);

  useEffect(() => {
    const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });
    tl.fromTo(headingRef.current, { y: 40, opacity: 0 }, { y: 0, opacity: 1, duration: 0.7 })
      .fromTo(subRef.current, { y: 20, opacity: 0 }, { y: 0, opacity: 1, duration: 0.5 }, '-=0.3')
      .fromTo(btnRef.current, { y: 20, opacity: 0 }, { y: 0, opacity: 1, duration: 0.5 }, '-=0.2');
  }, []);

  return (
    <section className="relative w-full bg-black text-white overflow-hidden">
      {/* Background pattern */}
      <div className="absolute inset-0 opacity-10"
        style={{
          backgroundImage: `radial-gradient(circle at 20% 50%, #22c55e 0%, transparent 50%),
                            radial-gradient(circle at 80% 20%, #16a34a 0%, transparent 40%)`,
        }}
      />

      <div className="relative z-10 max-w-4xl mx-auto px-6 py-24 text-center">
        <span className="inline-block bg-green-500/20 text-green-400 text-xs font-semibold tracking-widest uppercase px-4 py-1.5 rounded-full mb-6 border border-green-500/30">
          Los Angeles · Fast Delivery
        </span>

        <h1 ref={headingRef} className="text-5xl sm:text-6xl font-black uppercase tracking-tight leading-none mb-6">
          Premium<br />
          <span className="text-green-400">Cannabis</span><br />
          Products
        </h1>

        <p ref={subRef} className="text-gray-400 text-lg max-w-md mx-auto mb-10">
          Top-shelf flowers, edibles, vapes, concentrates and pre-rolls.
          Ship or local pickup — your choice.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <a
            ref={btnRef}
            href="#products"
            className="bg-green-500 hover:bg-green-400 text-black font-bold px-8 py-4 rounded-2xl transition-all duration-200 active:scale-95 text-sm uppercase tracking-wide"
          >
            Shop Now
          </a>
          <a
            href="https://t.me/Los_angeles_weed_kandy_plug"
            target="_blank"
            rel="noopener noreferrer"
            className="border border-gray-700 hover:border-gray-500 text-white font-medium px-8 py-4 rounded-2xl transition-all duration-200 text-sm"
          >
            Message on Telegram
          </a>
        </div>
      </div>

      {/* Bottom fade */}
      <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-white to-transparent" />
    </section>
  );
}