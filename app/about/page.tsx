import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'About | Kandy Carnival',
  description: 'Learn about Kandy Carnival — premium cannabis products in Los Angeles.',
};

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-[#111111] text-white">

      {/* Page content */}
      <div className="px-6 pt-10 pb-32 max-w-lg mx-auto text-center">

        {/* Heading */}
        <h1 className="text-3xl font-black mb-8">About Us</h1>

        {/* Blocks */}
        <div className="space-y-6 text-sm font-bold uppercase tracking-wide leading-relaxed">

          <div>
            <p className="text-white">Official Menu Gallery</p>
          </div>

          <div>
            <p className="text-white">Never Lose Contact</p>
            <p className="text-white">Click Share Button</p>
            <p className="text-white">Add To Home Screen</p>
          </div>

          <div>
            <p className="text-white">Only Contact:</p>
            <p className="text-[#8B7B2A] mt-1">
              Telegram:{' '}
              <a
                href="https://t.me/Los_angeles_weed_kandy_plug"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-white transition"
              >
                @Los_angeles_weed_kandy_plug
              </a>
            </p>
          </div>

          <div>
            <p className="text-white">Shipping Available Nationwide</p>
            <p className="text-white">Insured Overnight Available</p>
            <p className="text-white">Local Pickup Available — Los Angeles</p>
          </div>

          <div>
            <p className="text-white">DM For Info</p>
            <p className="text-white">DM For Pricing & Deals</p>
          </div>

          <div>
            <p className="text-white">Products Available:</p>
            <p className="text-gray-400 normal-case font-medium tracking-normal mt-1 leading-relaxed">
              Flowers · Edibles · Vapes · Concentrates · Pre-Rolls
            </p>
          </div>

        </div>
      </div>

      {/* View Products button — fixed at bottom */}
      <div className="fixed bottom-0 left-0 right-0 px-6 pb-6 bg-gradient-to-t from-[#111111] via-[#111111]/90 to-transparent pt-8">
        <Link
          href="/#products"
          className="flex items-center justify-center w-full max-w-lg mx-auto bg-[#8B7B2A] hover:bg-[#a08f30] text-white font-black py-5 rounded-2xl text-base transition-all duration-200 active:scale-95"
        >
          View Products
        </Link>
      </div>

    </div>
  );
}
