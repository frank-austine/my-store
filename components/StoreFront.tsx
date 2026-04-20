'use client';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { Product, Video } from '@/types/product';
import { searchProducts } from '@/app/lib/fuseSearch';
import ProductGrid from '@/components/ProductGrid';
import SearchBar from '@/components/SearchBar';
import VideoSection from '@/components/VideoSection';
import AboutSection from '@/components/AboutSection';

type Props = {
  products: Product[];
  videos: Video[];
};

export default function StoreFront({ products, videos }: Props) {
  const searchParams = useSearchParams();
  const categoryParam = searchParams.get('category');

  const [query, setQuery] = useState('');

  // Filter by category from sidebar link, then by search query
  const byCategory = categoryParam
    ? products.filter(
        (p) => p.category?.toLowerCase() === categoryParam.toLowerCase()
      )
    : products;

  const filtered = searchProducts(byCategory, query);

  return (
    <>
      {/* Hero */}
      <section className="px-6 py-16 text-center border-b border-gray-100">
        <h1 className="text-4xl font-bold tracking-tight mb-3">
          {categoryParam ? categoryParam : 'All Products'}
        </h1>
        <p className="text-gray-500 text-lg max-w-xl mx-auto">
          Browse our products and checkout via Telegram.
        </p>
      </section>

      {/* Search + Products */}
      <section id="products" className="px-6 py-12 max-w-7xl mx-auto">
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