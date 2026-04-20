import { Suspense } from 'react';
import { supabase } from '@/app/lib/supabaseClient';
import { Product, Video } from '@/types/product';
import StoreFront from '@/components/StoreFront';

export default async function Home() {
  const { data: products } = await supabase
    .from('products')
    .select('*')
    .eq('is_active', true)
    .order('created_at', { ascending: false });

  const { data: videos } = await supabase
    .from('videos')
    .select('*')
    .eq('is_active', true)
    .order('created_at', { ascending: false });

  return (
    <Suspense fallback={<div className="p-12 text-center text-gray-400">Loading...</div>}>
      <StoreFront
        products={(products as Product[]) ?? []}
        videos={(videos as Video[]) ?? []}
      />
    </Suspense>
  );
}