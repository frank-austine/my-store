'use client';

import { useEffect, useRef } from 'react';
import Image from 'next/image';
import gsap from 'gsap';

export default function HeroBanner() {
  const cardRef = useRef<HTMLDivElement>(null);
  const btnRef = useRef<HTMLAnchorElement>(null);

  useEffect(() => {
    const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });
    tl.fromTo(cardRef.current, { scale: 0.9, opacity: 0 }, { scale: 1, opacity: 1, duration: 0.7 })
      .fromTo(btnRef.current, { y: 16, opacity: 0 }, { y: 0, opacity: 1, duration: 0.5 }, '-=0.2');
  }, []);

  return (
    <section className="min-h-screen bg-[#111111] flex flex-col items-center justify-center px-6 py-16">

      {/* Logo card */}
      <div
        ref={cardRef}
        className="bg-white rounded-lg p-6 w-full max-w-sm aspect-square flex items-center justify-center shadow-2xl"
      >
        <div className="relative w-full h-full">
          <Image
            src="/logo.png"
            alt="Kandy Distro"
            fill
            className="object-contain"
            priority
          />
        </div>
      </div>

      {/* Lets Go button */}
      <a
        ref={btnRef}
        href="#products"
        className="mt-5 w-full max-w-sm flex items-center justify-center bg-[#8B7B2A] hover:bg-[#a08f30] text-white font-black py-6 rounded-lg text-lg uppercase tracking-[0.2em] transition-all duration-200 active:scale-95 shadow-lg"
      >
        Lets Go!
      </a>

    </section>
  );
}