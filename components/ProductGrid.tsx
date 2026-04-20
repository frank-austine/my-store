'use client';

import { Product } from '@/types/product';
import ProductCard from '@/components/ProductCard';

type Props = {
  products: Product[];
};

export default function ProductGrid({ products }: Props) {
  if (products.length === 0) {
    return (
      <p className="text-center text-gray-400 py-12">
        No products found.
      </p>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
      {products.map((product) => (
        <ProductCard
          key={product.id}
          product={product}
          videoUrl={product.video_url ?? undefined}
        />
      ))}
    </div>
  );
}