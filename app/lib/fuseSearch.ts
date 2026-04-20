import Fuse from 'fuse.js';
import { Product } from '@/types/product';

export function createFuseInstance(products: Product[]) {
  return new Fuse(products, {
    keys: ['name', 'description', 'category'],
    threshold: 0.3,
    includeScore: true,
  });
}

export function searchProducts(products: Product[], query: string): Product[] {
  if (!query.trim()) return products;
  const fuse = createFuseInstance(products);
  return fuse.search(query).map((result) => result.item);
}