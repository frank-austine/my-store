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
        {children}
      </body>
    </html>
  );
}