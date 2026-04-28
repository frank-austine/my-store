import { Suspense } from 'react';
import { supabase } from '@/app/lib/supabaseClient';
import { Product, Video } from '@/types/product';
import StoreFront from '@/components/StoreFront';

// Force dynamic rendering — never cache this page
export const dynamic = 'force-dynamic';
export const revalidate = 0;

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
    <Suspense fallback={<div className="p-12 text-center text-gray-600">Loading...</div>}>
      <StoreFront
        products={(products as Product[]) ?? []}
        videos={(videos as Video[]) ?? []}
      />
    </Suspense>
  );
}