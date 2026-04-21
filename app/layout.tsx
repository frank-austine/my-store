import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';
import Image from 'next/image';
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
  description: 'Premium cannabis products in Los Angeles. Flowers, edibles, vapes, concentrates and pre-rolls.',
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
          <header className="sticky top-0 z-40 bg-[#111111]/95 backdrop-blur border-b border-[#2a2a2a] px-6 py-3 flex items-center justify-between">
            <div className="w-10" />

            {/* Center — logo in white box */}
            <a href="/" className="flex items-center justify-center">
              <div className="relative w-10 h-10 bg-white rounded-lg overflow-hidden">
                <Image
                  src="/logo.jpg"
                  alt="Kandy Carnival"
                  fill
                  className="object-contain p-0.5"
                  priority
                />
              </div>
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