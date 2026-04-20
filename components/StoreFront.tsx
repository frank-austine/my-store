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
    ? products.filter(
        (p) => p.category?.toLowerCase() === categoryParam.toLowerCase()
      )
    : products;

  const filtered = searchProducts(byCategory, query);

  return (
    <>
      {/* Hero — only show on all products view */}
      {!categoryParam && <HeroBanner />}

      {/* Search + Products */}
      <section id="products" className="px-6 py-12 max-w-7xl mx-auto">
        {categoryParam && (
          <div className="mb-8">
            <h1 className="text-3xl font-black uppercase tracking-tight">{categoryParam}</h1>
            <a href="/" className="text-sm text-gray-400 hover:text-black transition mt-1 inline-block">
              ← All products
            </a>
          </div>
        )}
        <div className="mb-8 max-w-md mx-auto">
          <SearchBar value={query} onChange={setQuery} />
        </div>
        <ProductGrid products={filtered} />
      </section>

      {/* Videos */}
      <div className="border-t border-gray-100">
        <VideoSection videos={videos} />
      </div>

      {/* About */}
      <div className="border-t border-gray-100">
        <AboutSection />
      </div>
    </>
  );
}