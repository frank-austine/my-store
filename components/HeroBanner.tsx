'use client';

import { useEffect, useRef } from 'react';
import Image from 'next/image';
import gsap from 'gsap';

export default function HeroBanner() {
  const logoRef = useRef<HTMLDivElement>(null);
  const taglineRef = useRef<HTMLParagraphElement>(null);
  const btnRef = useRef<HTMLDivElement>(null);
  const badgeRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });
    tl.fromTo(badgeRef.current, { y: -20, opacity: 0 }, { y: 0, opacity: 1, duration: 0.6 })
      .fromTo(logoRef.current, { scale: 0.85, opacity: 0 }, { scale: 1, opacity: 1, duration: 0.8 }, '-=0.2')
      .fromTo(taglineRef.current, { y: 20, opacity: 0 }, { y: 0, opacity: 1, duration: 0.5 }, '-=0.3')
      .fromTo(btnRef.current, { y: 20, opacity: 0 }, { y: 0, opacity: 1, duration: 0.5 }, '-=0.2');
  }, []);

  return (
    <section className="relative w-full min-h-screen flex flex-col items-center justify-center overflow-hidden bg-[#0d0d0d]">

      {/* Background radial glow */}
      <div className="absolute inset-0 pointer-events-none"
        style={{
          background: `radial-gradient(ellipse 80% 60% at 50% 50%, #2a2000 0%, transparent 70%)`,
        }}
      />

      {/* Gold corner accents */}
      <div className="absolute top-0 left-0 w-32 h-32 border-t-2 border-l-2 border-[#8B7B2A]/40 rounded-tl-3xl" />
      <div className="absolute top-0 right-0 w-32 h-32 border-t-2 border-r-2 border-[#8B7B2A]/40 rounded-tr-3xl" />
      <div className="absolute bottom-0 left-0 w-32 h-32 border-b-2 border-l-2 border-[#8B7B2A]/40 rounded-bl-3xl" />
      <div className="absolute bottom-0 right-0 w-32 h-32 border-b-2 border-r-2 border-[#8B7B2A]/40 rounded-br-3xl" />

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center text-center px-6">

        {/* Badge */}
        <span
          ref={badgeRef}
          className="inline-block border border-[#8B7B2A]/60 text-[#8B7B2A] text-xs font-semibold tracking-[0.25em] uppercase px-5 py-2 rounded-full mb-10"
        >
          Los Angeles · Premium Cannabis
        </span>

        {/* Logo */}
        <div ref={logoRef} className="relative w-[320px] h-[240px] sm:w-[440px] sm:h-[330px] mb-8 drop-shadow-2xl">
          <Image
            src="/logo.jpg"
            alt="Kandy Carnival"
            fill
            className="object-contain"
            priority
          />
        </div>

        {/* Tagline */}
        <p
          ref={taglineRef}
          className="text-gray-400 text-base sm:text-lg max-w-sm mx-auto mb-10 leading-relaxed"
        >
          Top-shelf flowers, edibles, vapes &amp; more.
          <br />
          <span className="text-[#8B7B2A]">Ship or local pickup.</span>
        </p>

        {/* CTA buttons */}
        <div ref={btnRef} className="flex flex-col sm:flex-row gap-4 items-center">
          <a
            href="#products"
            className="bg-[#8B7B2A] hover:bg-[#a08f30] text-white font-bold px-10 py-4 rounded-2xl transition-all duration-200 active:scale-95 text-sm uppercase tracking-[0.2em]"
          >
            Shop Now
          </a>
          <a
            href="https://t.me/Los_angeles_weed_kandy_plug"
            target="_blank"
            rel="noopener noreferrer"
            className="border border-[#8B7B2A]/50 hover:border-[#8B7B2A] text-gray-300 hover:text-white font-medium px-10 py-4 rounded-2xl transition-all duration-200 text-sm"
          >
            Order via Telegram
          </a>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-gray-600">
        <span className="text-xs tracking-widest uppercase">Scroll</span>
        <div className="w-px h-8 bg-gradient-to-b from-[#8B7B2A] to-transparent" />
      </div>
    </section>
  );
}