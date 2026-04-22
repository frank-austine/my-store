import Image from 'next/image';
import Link from 'next/link';
import CartButton from '@/components/CartButton';
import CartDrawer from '@/components/CartDrawer';
import Sidebar from '@/components/Sidebar';
import AntiCopyWrapper from '@/components/AntiCopyWrapper';
import TelegramFloat from '@/components/TelegramFloat';

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AntiCopyWrapper>
      <Sidebar />

      {/* Header — logo in white box */}
      <header className="sticky top-0 z-40 bg-[#111111]/95 backdrop-blur border-b border-[#2a2a2a] px-6 py-3 flex items-center justify-between">
        <div className="w-10" />

        <Link href="/" className="flex items-center justify-center">
          <div className="relative w-10 h-10 bg-white rounded-lg overflow-hidden">
            <Image
              src="/logo.png"
              alt="Kandy Carnival"
              fill
              className="object-contain p-0.5"
              priority
            />
          </div>
        </Link>

        <CartButton />
      </header>

      <main className="flex-1">
        {children}
      </main>

      <CartDrawer />
      <TelegramFloat />
    </AntiCopyWrapper>
  );
}