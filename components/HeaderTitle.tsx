'use client';

import { usePathname } from 'next/navigation';
import Image from 'next/image';

export default function HeaderTitle() {
  const pathname = usePathname();

  // About page
  if (pathname === '/about') {
    return (
      <span className="text-sm font-black uppercase tracking-[0.3em] text-white">
        About
      </span>
    );
  }

  // Product detail page
  if (pathname.startsWith('/products/')) {
    return (
      <span className="text-sm font-black uppercase tracking-[0.3em] text-white">
        Product
      </span>
    );
  }

  // Homepage and everything else — show logo
  return (
    <a href="/" className="flex items-center justify-center">
      <div className="relative w-10 h-10 bg-white rounded-lg overflow-hidden">
        <Image
          src="/logo.png"
          alt="Kandy Carnival"
          fill
          className="object-contain p-0.5"
          priority
        />
      </div>
    </a>
  );
}