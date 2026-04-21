import { supabase } from '@/app/lib/supabaseClient';
import { Product } from '@/types/product';
import { notFound } from 'next/navigation';
import ProductDetailClient from '@/components/ProductDetailClient';

type Props = {
  params: { slug: string };
};

export default async function ProductDetailPage({ params }: Props) {
  const { data } = await supabase
    .from('products')
    .select('*')
    .eq('slug', params.slug)
    .eq('is_active', true)
    .single();

  if (!data) notFound();

  return <ProductDetailClient product={data as Product} />;
}