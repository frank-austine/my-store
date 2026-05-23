import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';
import CartButton from '@/components/CartButton';
import CartDrawer from '@/components/CartDrawer';
import Sidebar from '@/components/Sidebar';
import AntiCopyWrapper from '@/components/AntiCopyWrapper';
import TelegramFloat from '@/components/TelegramFloat';
import HeaderTitle from '@/components/HeaderTitle';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'Kandy Distro | Premium Cannabis Los Angeles',
  description: 'Premium cannabis products in Los Angeles. Flowers, edibles, vapes, concentrates and pre-rolls. Order via Telegram for fast discreet delivery.',
  keywords: 'weed delivery LA, cannabis Los Angeles, Kandy Distro, edibles LA, THC vapes, buy weed online LA',
  openGraph: {
    title: 'Kandy Distro',
    description: 'Premium cannabis products in Los Angeles.',
    type: 'website',
    url: 'https://kandydistro.store',
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

          <header className="sticky top-0 z-40 bg-[#111111]/95 backdrop-blur border-b border-[#2a2a2a] px-6 py-3 flex items-center justify-between">
            <div className="w-10" />
            <HeaderTitle />
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