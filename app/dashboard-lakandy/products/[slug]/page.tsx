import { supabase } from '@/app/lib/supabaseClient';
import { Product } from '@/types/product';
import { notFound } from 'next/navigation';
import ProductDetailClient from '@/components/ProductDetailClient';

interface Props {
  params: { slug: string };
}

export default async function ProductPage({ params }: Props) {
  const { slug } = params;

  const { data: product } = await supabase
    .from('products')
    .select('*')
    .eq('slug', slug)
    .single();

  if (!product) {
    notFound();
  }

  return (
    <div>
      <ProductDetailClient product={product} />
    </div>
  );
}

