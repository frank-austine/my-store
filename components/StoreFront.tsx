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
import FilterModal from '@/components/FilterModal';

type Props = {
  products: Product[];
  videos: Video[];
};

export default function StoreFront({ products, videos }: Props) {
  const searchParams = useSearchParams();
  const categoryParam = searchParams.get('category');
  const [query, setQuery] = useState('');
  const [filterOpen, setFilterOpen] = useState(false);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);

  let filtered = products;
  if (categoryParam) {
    filtered = filtered.filter(
      (p) => p.category?.toLowerCase() === categoryParam.toLowerCase()
    );
  } else if (selectedCategories.length > 0) {
    filtered = filtered.filter((p) =>
      selectedCategories.some(
        (cat) => p.category?.toLowerCase() === cat.toLowerCase()
      )
    );
  }
  filtered = searchProducts(filtered, query);

  const activeFilterCount = selectedCategories.length;

  return (
    <div className="bg-[#111111] min-h-screen">
      {!categoryParam && <HeroBanner />}

      <section id="products" className="px-4 sm:px-6 py-10 max-w-7xl mx-auto">
        <h2 className="text-3xl font-black uppercase text-white mb-6 tracking-tight">
          {categoryParam ? categoryParam : 'Products'}
        </h2>

        <div className="flex gap-3 mb-8">
          <div className="flex-1">
            <SearchBar value={query} onChange={setQuery} />
          </div>
          <button
            onClick={() => setFilterOpen(true)}
            className={`relative flex items-center justify-center w-12 h-12 rounded-lg border transition shrink-0 ${
              activeFilterCount > 0
                ? 'bg-[#8B7B2A] border-[#8B7B2A] text-white'
                : 'bg-[#1a1a1a] border-[#2a2a2a] text-gray-400 hover:border-[#8B7B2A]/50 hover:text-[#8B7B2A]'
            }`}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="4" y1="6" x2="20" y2="6"/>
              <line x1="8" y1="12" x2="16" y2="12"/>
              <line x1="11" y1="18" x2="13" y2="18"/>
            </svg>
            {activeFilterCount > 0 && (
              <span className="absolute -top-1.5 -right-1.5 bg-white text-[#8B7B2A] text-[9px] font-black rounded-sm w-4 h-4 flex items-center justify-center">
                {activeFilterCount}
              </span>
            )}
          </button>
        </div>

        {selectedCategories.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-6">
            {selectedCategories.map((cat) => (
              <span
                key={cat}
                onClick={() => setSelectedCategories((prev) => prev.filter((c) => c !== cat))}
                className="flex items-center gap-1.5 bg-[#8B7B2A]/20 border border-[#8B7B2A]/40 text-[#8B7B2A] text-xs font-bold px-3 py-1.5 rounded-sm cursor-pointer hover:bg-[#8B7B2A]/30 transition uppercase tracking-wide"
              >
                {cat}
                <span className="text-[10px]">✕</span>
              </span>
            ))}
            <button
              onClick={() => setSelectedCategories([])}
              className="text-xs text-gray-600 hover:text-gray-400 transition underline underline-offset-2 ml-1"
            >
              Clear all
            </button>
          </div>
        )}

        <ProductGrid products={filtered} />
      </section>

      <VideoSection videos={videos} />
      <AboutSection />

      <footer className="border-t border-[#2a2a2a] py-8 px-6 text-center">
        <p className="text-gray-700 text-xs uppercase tracking-widest">
          © {new Date().getFullYear()} Kandy Distro · Los Angeles
        </p>
      </footer>

      <FilterModal
        isOpen={filterOpen}
        onClose={() => setFilterOpen(false)}
        selected={selectedCategories}
        onApply={setSelectedCategories}
      />
    </div>
  );
}