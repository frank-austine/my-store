'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/app/lib/supabaseClient';
import { Product } from '@/types/product';

const EMPTY_FORM = {
  name: '',
  slug: '',
  description: '',
  price_ship: '',
  price_local: '',
  category: '',
  video_url: '',
};

export default function DashboardProductsPage() {
  const router = useRouter();
  const [products, setProducts] = useState<Product[]>([]);
  const [form, setForm] = useState(EMPTY_FORM);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      if (!data.session) router.push('/dashboard-lakandy');
    });
    fetchProducts();
  }, []);

  async function fetchProducts() {
    const { data } = await supabase
      .from('products')
      .select('*')
      .order('created_at', { ascending: false });
    setProducts((data as Product[]) ?? []);
  }

  async function handleSubmit() {
    if (!form.name || !form.price_ship || !form.price_local) {
      setMessage('Name and both prices are required.');
      return;
    }
    setUploading(true);
    setMessage('');

    let image_url = null;

    if (imageFile) {
      const ext = imageFile.name.split('.').pop();
      const fileName = `${Date.now()}.${ext}`;
      const { error: uploadError } = await supabase.storage
        .from('product-images')
        .upload(fileName, imageFile);
      if (uploadError) {
        setMessage('Image upload failed: ' + uploadError.message);
        setUploading(false);
        return;
      }
      const { data: urlData } = supabase.storage
        .from('product-images')
        .getPublicUrl(fileName);
      image_url = urlData.publicUrl;
    }

    const slug = form.slug || form.name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');

    const payload = {
      name: form.name,
      slug,
      description: form.description || null,
      price_ship: parseFloat(form.price_ship),
      price_local: parseFloat(form.price_local),
      category: form.category || null,
      video_url: form.video_url || null,
      ...(image_url ? { image_url } : {}),
      updated_at: new Date().toISOString(),
    };

    if (editingId) {
      const { error } = await supabase.from('products').update(payload).eq('id', editingId);
      setMessage(error ? 'Update failed: ' + error.message : 'Product updated. ✓');
    } else {
      const { error } = await supabase.from('products').insert({ ...payload, is_active: true });
      setMessage(error ? 'Insert failed: ' + error.message : 'Product added. ✓');
    }

    setForm(EMPTY_FORM);
    setImageFile(null);
    setEditingId(null);
    if (fileRef.current) fileRef.current.value = '';
    setUploading(false);
    fetchProducts();
  }

  async function toggleActive(product: Product) {
    await supabase.from('products').update({ is_active: !product.is_active }).eq('id', product.id);
    fetchProducts();
  }

  async function handleDelete(id: string) {
    if (!confirm('Delete this product?')) return;
    await supabase.from('products').delete().eq('id', id);
    fetchProducts();
  }

  function handleEdit(product: Product) {
    setEditingId(product.id);
    setForm({
      name: product.name,
      slug: product.slug,
      description: product.description ?? '',
      price_ship: product.price_ship.toString(),
      price_local: product.price_local.toString(),
      category: product.category ?? '',
      video_url: product.video_url ?? '',
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  async function handleLogout() {
    await supabase.auth.signOut();
    router.push('/dashboard-lakandy');
  }

  return (
    <div className="max-w-4xl mx-auto px-6 py-10">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-black uppercase tracking-tight">Products</h1>
          <p className="text-sm text-gray-400 mt-0.5">Manage your store products</p>
        </div>
        <div className="flex gap-3">
          <a href="/dashboard-lakandy/videos" className="text-sm px-4 py-2 rounded-xl border border-gray-200 hover:bg-gray-50 transition">
            Videos
          </a>
          <button onClick={handleLogout} className="text-sm px-4 py-2 rounded-xl border border-gray-200 text-red-500 hover:bg-gray-50 transition">
            Logout
          </button>
        </div>
      </div>

      {/* Form */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 mb-10">
        <h2 className="font-bold text-lg mb-5">{editingId ? 'Edit product' : 'Add new product'}</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {[
            { label: 'Name *', key: 'name', placeholder: 'e.g. OG Kush' },
            { label: 'Category', key: 'category', placeholder: 'e.g. Flowers' },
            { label: 'Ship price *', key: 'price_ship', placeholder: '29.99' },
            { label: 'Local price *', key: 'price_local', placeholder: '24.99' },
            { label: 'Slug (auto-generated if empty)', key: 'slug', placeholder: 'og-kush' },
          ].map(({ label, key, placeholder }) => (
            <div key={key}>
              <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
              <input
                type={key.includes('price') ? 'number' : 'text'}
                value={form[key as keyof typeof form]}
                onChange={(e) => setForm({ ...form, [key]: e.target.value })}
                placeholder={placeholder}
                className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-black transition"
              />
            </div>
          ))}

          <div className="sm:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">Product video URL (optional)</label>
            <input
              type="text"
              value={form.video_url}
              onChange={(e) => setForm({ ...form, video_url: e.target.value })}
              placeholder="https://... direct link to .mp4"
              className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-black transition"
            />
          </div>

          <div className="sm:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
            <textarea
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              placeholder="Short product description..."
              rows={3}
              className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-black transition resize-none"
            />
          </div>

          <div className="sm:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">Product image</label>
            <input
              ref={fileRef}
              type="file"
              accept="image/*"
              onChange={(e) => setImageFile(e.target.files?.[0] ?? null)}
              className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:bg-gray-100 file:text-sm file:font-medium hover:file:bg-gray-200 transition"
            />
          </div>
        </div>

        {message && (
          <p className={`mt-4 text-sm ${message.includes('failed') ? 'text-red-500' : 'text-green-600'}`}>
            {message}
          </p>
        )}

        <div className="flex gap-3 mt-5">
          <button
            onClick={handleSubmit}
            disabled={uploading}
            className="bg-black text-white px-6 py-2.5 rounded-xl text-sm font-medium hover:bg-gray-800 transition disabled:opacity-50"
          >
            {uploading ? 'Saving...' : editingId ? 'Update product' : 'Add product'}
          </button>
          {editingId && (
            <button
              onClick={() => { setEditingId(null); setForm(EMPTY_FORM); }}
              className="px-6 py-2.5 rounded-xl text-sm border border-gray-200 hover:bg-gray-50 transition"
            >
              Cancel
            </button>
          )}
        </div>
      </div>

      {/* Products list */}
      <div className="space-y-3">
        {products.length === 0 && (
          <p className="text-center text-gray-400 py-8">No products yet.</p>
        )}
        {products.map((product) => (
          <div key={product.id} className="bg-white rounded-2xl border border-gray-100 px-5 py-4 flex items-center justify-between gap-4">
            <div className="flex-1 min-w-0">
              <p className="font-semibold text-sm truncate">{product.name}</p>
              <p className="text-xs text-gray-400 mt-0.5">
                {product.category ?? 'No category'} · Ship ${product.price_ship} · Local ${product.price_local}
                {product.video_url ? ' · 🎥 Has video' : ''}
              </p>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <button
                onClick={() => toggleActive(product)}
                className={`text-xs px-3 py-1.5 rounded-lg font-medium transition ${
                  product.is_active ? 'bg-green-50 text-green-700 hover:bg-green-100' : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
                }`}
              >
                {product.is_active ? 'Active' : 'Hidden'}
              </button>
              <button onClick={() => handleEdit(product)} className="text-xs px-3 py-1.5 rounded-lg border border-gray-200 hover:bg-gray-50 transition">
                Edit
              </button>
              <button onClick={() => handleDelete(product.id)} className="text-xs px-3 py-1.5 rounded-lg text-red-400 hover:text-red-600 hover:bg-red-50 transition">
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}