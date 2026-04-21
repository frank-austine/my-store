import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Dashboard | Kandy Carnival',
  robots: { index: false, follow: false },
};

export default function DashboardLayout({
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