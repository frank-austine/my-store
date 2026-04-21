'use client';

import { useEffect, useRef } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import gsap from 'gsap';

export default function HeroBanner() {
  const cardRef = useRef<HTMLDivElement>(null);
  const btnRef = useRef<HTMLAnchorElement>(null);
  const router = useRouter();

  useEffect(() => {
    const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });
    tl.fromTo(cardRef.current, { scale: 0.9, opacity: 0 }, { scale: 1, opacity: 1, duration: 0.7 })
      .fromTo(btnRef.current, { y: 16, opacity: 0 }, { y: 0, opacity: 1, duration: 0.5 }, '-=0.2');
  }, []);

  return (
    <section className="min-h-screen bg-[#111111] flex flex-col items-center justify-center px-6 py-16">

      {/* Logo card — white rounded box just like screenshot */}
      <div
        ref={cardRef}
        className="bg-white rounded-2xl p-8 w-full max-w-lg aspect-square flex items-center justify-center shadow-2xl"
      >
        <div className="relative w-full h-full">
          <Image
            src="/logo.jpg"
            alt="Kandy Carnival"
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
        className="mt-6 w-full max-w-lg flex items-center justify-center bg-[#8B7B2A] hover:bg-[#a08f30] text-white font-bold py-5 rounded-2xl text-base uppercase tracking-widest transition-all duration-200 active:scale-95"
      >
        Lets Go!
      </a>

    </section>
  );
}