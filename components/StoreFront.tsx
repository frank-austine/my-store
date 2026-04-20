'use client';

import { useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { Product, Video } from '@/types/product';
import { searchProducts } from '@/app/lib/fuseSearch';
import ProductGrid from '@/components/ProductGrid';
import SearchBar from '@/components/SearchBar';
import VideoSection from '@/components/VideoSection';
import AboutSection from '@/components/AboutSection';
import HeroBanner from '@/components/HeroBanner';

type Props = {
  products: Product[];
  videos: Video[];
};

export default function StoreFront({ products, videos }: Props) {
  const searchParams = useSearchParams();
  const categoryParam = searchParams.get('category');
  const [query, setQuery] = useState('');

  const byCategory = categoryParam
    ? products.filter((p) => p.category?.toLowerCase() === categoryParam.toLowerCase())
    : products;

  const filtered = searchProducts(byCategory, query);

  return (
    <div className="bg-[#111111] min-h-screen">
      {/* Hero — only on main view */}
      {!categoryParam && <HeroBanner />}

      {/* Products section */}
      <section id="products" className="px-4 sm:px-6 py-12 max-w-screen-xl mx-auto">

        {/* Section header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
          <div>
            {categoryParam ? (
              <>
                <p className="text-[10px] text-[#8B7B2A] uppercase tracking-[0.3em] mb-1">Category</p>
                <h2 className="text-2xl font-black uppercase tracking-tight text-white">{categoryParam}</h2>
                <a href="/" className="text-xs text-gray-600 hover:text-[#8B7B2A] transition mt-1 inline-block uppercase tracking-wide">
                  ← All products
                </a>
              </>
            ) : (
              <>
                <p className="text-[10px] text-[#8B7B2A] uppercase tracking-[0.3em] mb-1">Browse</p>
                <h2 className="text-2xl font-black uppercase tracking-tight text-white">All Products</h2>
              </>
            )}
          </div>
          <div className="w-full sm:w-72">
            <SearchBar value={query} onChange={setQuery} />
          </div>
        </div>

        <ProductGrid products={filtered} />
      </section>

      {/* Videos */}
      <VideoSection videos={videos} />

      {/* About */}
      <AboutSection />

      {/* Footer */}
      <footer className="border-t border-[#2a2a2a] py-8 px-6 text-center">
        <p className="text-gray-700 text-xs uppercase tracking-widest">
          © {new Date().getFullYear()} Kandy Carnival · Los Angeles
        </p>
      </footer>
    </div>
  );
}