import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';
import CartButton from '@/components/CartButton';
import CartDrawer from '@/components/CartDrawer';
import Sidebar from '@/components/Sidebar';
import AntiCopyWrapper from '@/components/AntiCopyWrapper';
import TelegramFloat from '@/components/TelegramFloat';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'Kandy Carnival | Premium Cannabis Los Angeles',
  description: 'Premium cannabis products in Los Angeles. Flowers, edibles, vapes, concentrates and pre-rolls. Order via Telegram for fast discreet delivery.',
  keywords: 'weed delivery LA, cannabis Los Angeles, edibles LA, THC vapes, kandy carnival',
  openGraph: {
    title: 'Kandy Carnival',
    description: 'Premium cannabis products in Los Angeles.',
    type: 'website',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} min-h-screen bg-[#111111] text-white`}
        suppressHydrationWarning
      >
        <AntiCopyWrapper>
          <Sidebar />

          {/* Header */}
          <header className="sticky top-0 z-40 bg-[#111111]/95 backdrop-blur border-b border-[#2a2a2a] px-6 py-4 flex items-center justify-between">
            {/* Left spacer for hamburger */}
            <div className="w-10" />

            {/* Center logo text */}
            <a href="/" className="flex flex-col items-center leading-none">
              <span className="text-xl font-black tracking-tight uppercase text-white">
                Kandy Carnival
              </span>
              <span className="text-[9px] tracking-[0.3em] text-[#8B7B2A] uppercase mt-0.5">
                Los Angeles
              </span>
            </a>

            {/* Right: Cart */}
            <CartButton />
          </header>

          <main className="flex-1">
            {children}
          </main>

          <CartDrawer />
          <TelegramFloat />
        </AntiCopyWrapper>
      </body>
    </html>
  );
}