import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Admin | kandy distro',
  robots: { index: false, follow: false },
};

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-[#111111] text-white">
      {children}
    </div>
  );
}