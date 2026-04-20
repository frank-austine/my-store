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
  title: 'LA Weed Kandy Plug | Premium Cannabis Los Angeles',
  description: 'Premium cannabis products in Los Angeles. Flowers, edibles, vapes, concentrates and pre-rolls. Order via Telegram for fast discreet delivery.',
  keywords: 'weed delivery LA, cannabis Los Angeles, edibles LA, THC vapes, buy weed online LA',
  openGraph: {
    title: 'LA Weed Kandy Plug',
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
        className={`${geistSans.variable} ${geistMono.variable} min-h-screen bg-white text-gray-900`}
        suppressHydrationWarning
      >
        <AntiCopyWrapper>
          <Sidebar />

          <header className="sticky top-0 z-40 bg-white border-b border-gray-100 px-6 py-4 flex items-center justify-between">
            <div className="w-10" />
            <a href="/" className="flex flex-col items-center leading-none">
              <span className="text-2xl font-black tracking-tight uppercase text-black">
                LA Kandy
              </span>
              <span className="text-[10px] tracking-[0.2em] text-gray-400 uppercase">
                Weed Plug
              </span>
            </a>
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