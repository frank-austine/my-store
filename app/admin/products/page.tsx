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
};

export default function AdminProductsPage() {
  const router = useRouter();
  const [products, setProducts] = useState<Product[]>([]);
  const [form, setForm] = useState(EMPTY_FORM);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [videoPreview, setVideoPreview] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState('');
  const [message, setMessage] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingImageUrl, setEditingImageUrl] = useState<string | null>(null);
  const [editingVideoUrl, setEditingVideoUrl] = useState<string | null>(null);
  const imageRef = useRef<HTMLInputElement>(null);
  const videoRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      if (!data.session) router.push('/admin');
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

  function handleImageChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0] ?? null;
    setImageFile(file);
    if (file) setImagePreview(URL.createObjectURL(file));
    else setImagePreview(null);
  }

  function handleVideoChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0] ?? null;
    setVideoFile(file);
    if (file) setVideoPreview(URL.createObjectURL(file));
    else setVideoPreview(null);
  }

  async function uploadFile(file: File, bucket: string, baseName: string, ext: string): Promise<string | null> {
    const fileName = `${baseName}.${ext}`;
    const { error } = await supabase.storage.from(bucket).upload(fileName, file, { upsert: true });
    if (error) { setMessage(`Upload failed: ${error.message}`); return null; }
    const { data } = supabase.storage.from(bucket).getPublicUrl(fileName);
    return data.publicUrl;
  }

  async function handleSubmit() {
    if (!form.name || !form.price_ship || !form.price_local) {
      setMessage('Name and both prices are required.');
      return;
    }
    setUploading(true);
    setMessage('');

    const baseName = `${Date.now()}-${form.name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '')}`;
    let image_url = editingImageUrl;
    let video_url = editingVideoUrl;

    if (imageFile) {
      setUploadProgress('Uploading image...');
      const ext = imageFile.name.split('.').pop() ?? 'jpg';
      image_url = await uploadFile(imageFile, 'product-images', baseName, ext);
      if (!image_url) { setUploading(false); setUploadProgress(''); return; }
    }

    if (videoFile) {
      setUploadProgress('Uploading video... (this may take a moment)');
      const ext = videoFile.name.split('.').pop() ?? 'mp4';
      video_url = await uploadFile(videoFile, 'product-videos', baseName, ext);
      if (!video_url) { setUploading(false); setUploadProgress(''); return; }
    }

    setUploadProgress('Saving product...');
    const slug = form.slug || form.name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');

    const payload = {
      name: form.name,
      slug,
      description: form.description || null,
      price_ship: parseFloat(form.price_ship),
      price_local: parseFloat(form.price_local),
      category: form.category || null,
      image_url: image_url ?? null,
      video_url: video_url ?? null,
      updated_at: new Date().toISOString(),
    };

    if (editingId) {
      const { error } = await supabase.from('products').update(payload).eq('id', editingId);
      setMessage(error ? 'Update failed: ' + error.message : '✓ Product updated.');
    } else {
      const { error } = await supabase.from('products').insert({ ...payload, is_active: true });
      setMessage(error ? 'Add failed: ' + error.message : '✓ Product added.');
    }

    setForm(EMPTY_FORM);
    setImageFile(null); setVideoFile(null);
    setImagePreview(null); setVideoPreview(null);
    setEditingId(null); setEditingImageUrl(null); setEditingVideoUrl(null);
    if (imageRef.current) imageRef.current.value = '';
    if (videoRef.current) videoRef.current.value = '';
    setUploading(false); setUploadProgress('');
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
    setEditingImageUrl(product.image_url);
    setEditingVideoUrl(product.video_url);
    setImagePreview(product.image_url);
    setVideoPreview(product.video_url);
    setForm({
      name: product.name, slug: product.slug,
      description: product.description ?? '',
      price_ship: product.price_ship.toString(),
      price_local: product.price_local.toString(),
      category: product.category ?? '',
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  function handleCancel() {
    setEditingId(null); setForm(EMPTY_FORM);
    setImageFile(null); setVideoFile(null);
    setImagePreview(null); setVideoPreview(null);
    setEditingImageUrl(null); setEditingVideoUrl(null);
    if (imageRef.current) imageRef.current.value = '';
    if (videoRef.current) videoRef.current.value = '';
    setMessage('');
  }

  async function handleLogout() {
    await supabase.auth.signOut();
    router.push('/admin');
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-black uppercase tracking-tight text-white">Products</h1>
          <p className="text-sm text-gray-500 mt-0.5">Manage your store products</p>
        </div>
        <div className="flex gap-3">
          <a href="/admin/videos" className="text-sm px-4 py-2 rounded-xl border border-[#2a2a2a] text-gray-400 hover:text-white transition">Videos</a>
          <button onClick={handleLogout} className="text-sm px-4 py-2 rounded-xl border border-[#2a2a2a] text-red-500 hover:bg-red-500/10 transition">Logout</button>
        </div>
      </div>

      {/* Form */}
      <div className="bg-[#1a1a1a] rounded-2xl border border-[#2a2a2a] p-6 mb-10">
        <h2 className="font-black text-lg mb-6 text-white uppercase tracking-wide">
          {editingId ? 'Edit Product' : 'Add New Product'}
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="sm:col-span-2">
            <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Product Name *</label>
            <input type="text" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="e.g. Sugar Baby Smalls"
              className="w-full bg-[#111] border border-[#2a2a2a] focus:border-[#8B7B2A]/60 rounded-xl px-4 py-3 text-sm text-white placeholder-gray-600 outline-none transition" />
          </div>
          <div>
            <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Category</label>
            <input type="text" value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} placeholder="e.g. Indoor Smalls"
              className="w-full bg-[#111] border border-[#2a2a2a] focus:border-[#8B7B2A]/60 rounded-xl px-4 py-3 text-sm text-white placeholder-gray-600 outline-none transition" />
          </div>
          <div>
            <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Slug (auto if empty)</label>
            <input type="text" value={form.slug} onChange={(e) => setForm({ ...form, slug: e.target.value })} placeholder="sugar-baby-smalls"
              className="w-full bg-[#111] border border-[#2a2a2a] focus:border-[#8B7B2A]/60 rounded-xl px-4 py-3 text-sm text-white placeholder-gray-600 outline-none transition" />
          </div>
          <div>
            <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Ship Price * ($)</label>
            <input type="number" value={form.price_ship} onChange={(e) => setForm({ ...form, price_ship: e.target.value })} placeholder="200"
              className="w-full bg-[#111] border border-[#2a2a2a] focus:border-[#8B7B2A]/60 rounded-xl px-4 py-3 text-sm text-white placeholder-gray-600 outline-none transition" />
          </div>
          <div>
            <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Local Price * ($)</label>
            <input type="number" value={form.price_local} onChange={(e) => setForm({ ...form, price_local: e.target.value })} placeholder="100"
              className="w-full bg-[#111] border border-[#2a2a2a] focus:border-[#8B7B2A]/60 rounded-xl px-4 py-3 text-sm text-white placeholder-gray-600 outline-none transition" />
          </div>
          <div className="sm:col-span-2">
            <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Description (optional)</label>
            <textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} placeholder="Short product description..." rows={3}
              className="w-full bg-[#111] border border-[#2a2a2a] focus:border-[#8B7B2A]/60 rounded-xl px-4 py-3 text-sm text-white placeholder-gray-600 outline-none transition resize-none" />
          </div>

          {/* Image upload */}
          <div className="sm:col-span-2">
            <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Product Image</label>
            <div className="border border-dashed border-[#3a3a3a] hover:border-[#8B7B2A]/60 rounded-xl p-5 bg-[#111] transition">
              <div className="flex items-center gap-4">
                <label className="cursor-pointer flex items-center gap-2 bg-[#8B7B2A] hover:bg-[#a08f30] text-white text-xs font-black uppercase tracking-widest px-5 py-3 rounded-xl transition">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/>
                  </svg>
                  Choose Image
                  <input ref={imageRef} type="file" accept="image/*" onChange={handleImageChange} className="hidden" />
                </label>
                <span className="text-xs text-gray-600">{imageFile ? imageFile.name : 'JPG, PNG, WEBP'}</span>
              </div>
              {imagePreview && (
                <div className="mt-4 relative w-32 h-32 rounded-xl overflow-hidden border border-[#2a2a2a]">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                  <button onClick={() => { setImageFile(null); setImagePreview(null); if (imageRef.current) imageRef.current.value = ''; }}
                    className="absolute top-1 right-1 w-6 h-6 bg-black/80 rounded-full flex items-center justify-center text-white text-xs hover:bg-red-600 transition">✕</button>
                </div>
              )}
            </div>
          </div>

          {/* Video upload */}
          <div className="sm:col-span-2">
            <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Product Video (MP4)</label>
            <div className="border border-dashed border-[#3a3a3a] hover:border-[#8B7B2A]/60 rounded-xl p-5 bg-[#111] transition">
              <div className="flex items-center gap-4">
                <label className="cursor-pointer flex items-center gap-2 bg-[#8B7B2A] hover:bg-[#a08f30] text-white text-xs font-black uppercase tracking-widest px-5 py-3 rounded-xl transition">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <polygon points="23 7 16 12 23 17 23 7"/><rect x="1" y="5" width="15" height="14" rx="2"/>
                  </svg>
                  Choose Video
                  <input ref={videoRef} type="file" accept="video/mp4,video/*" onChange={handleVideoChange} className="hidden" />
                </label>
                <span className="text-xs text-gray-600">{videoFile ? videoFile.name : 'MP4 recommended'}</span>
              </div>
              <p className="text-[11px] text-gray-600 mt-2">Large files may take a moment — do not close the page</p>
              {videoPreview && (
                <div className="mt-4 relative w-full max-w-xs rounded-xl overflow-hidden border border-[#2a2a2a]">
                  <video src={videoPreview} controls className="w-full aspect-video" />
                  <button onClick={() => { setVideoFile(null); setVideoPreview(null); if (videoRef.current) videoRef.current.value = ''; }}
                    className="absolute top-1 right-1 w-6 h-6 bg-black/80 rounded-full flex items-center justify-center text-white text-xs hover:bg-red-600 transition">✕</button>
                </div>
              )}
            </div>
          </div>
        </div>

        {uploadProgress && (
          <div className="mt-5 flex items-center gap-3 bg-[#111] border border-[#2a2a2a] rounded-xl px-4 py-3">
            <div className="w-4 h-4 border-2 border-[#8B7B2A] border-t-transparent rounded-full animate-spin shrink-0" />
            <p className="text-sm text-[#8B7B2A] font-bold">{uploadProgress}</p>
          </div>
        )}
        {message && !uploadProgress && (
          <p className={`mt-4 text-sm font-bold ${message.includes('failed') ? 'text-red-400' : 'text-green-400'}`}>{message}</p>
        )}

        <div className="flex gap-3 mt-6">
          <button onClick={handleSubmit} disabled={uploading}
            className="bg-[#8B7B2A] hover:bg-[#a08f30] text-white px-8 py-3 rounded-xl text-sm font-black uppercase tracking-widest transition disabled:opacity-40">
            {uploading ? 'Saving...' : editingId ? 'Update Product' : 'Add Product'}
          </button>
          {editingId && (
            <button onClick={handleCancel} className="px-6 py-3 rounded-xl text-sm border border-[#2a2a2a] text-gray-400 hover:text-white transition">Cancel</button>
          )}
        </div>
      </div>

      {/* Products list */}
      <div className="space-y-3">
        <p className="text-xs font-black uppercase tracking-widest text-gray-600 mb-4">{products.length} Product{products.length !== 1 ? 's' : ''}</p>
        {products.length === 0 && <p className="text-center text-gray-600 py-8 text-sm">No products yet.</p>}
        {products.map((product) => (
          <div key={product.id} className="bg-[#1a1a1a] rounded-2xl border border-[#2a2a2a] px-4 py-4 flex items-center gap-4">
            <div className="w-14 h-14 rounded-xl overflow-hidden bg-[#111] shrink-0 border border-[#2a2a2a]">
              {product.image_url
                // eslint-disable-next-line @next/next/no-img-element
                ? <img src={product.image_url} alt={product.name} className="w-full h-full object-cover" />
                : <div className="w-full h-full flex items-center justify-center text-gray-700 text-xl">📦</div>}
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-bold text-sm text-white truncate">{product.name}</p>
              <p className="text-xs text-gray-500 mt-0.5">{product.category ?? 'No category'} · 🚢 ${product.price_ship} · 📍 ${product.price_local}</p>
              <div className="flex gap-2 mt-1">
                {product.image_url && <span className="text-[10px] text-[#8B7B2A] font-bold">🖼 Image</span>}
                {product.video_url && <span className="text-[10px] text-[#8B7B2A] font-bold">🎥 Video</span>}
              </div>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <button onClick={() => toggleActive(product)}
                className={`text-[11px] px-3 py-1.5 rounded-lg font-bold uppercase tracking-wide transition ${product.is_active ? 'bg-green-500/10 text-green-400' : 'bg-[#2a2a2a] text-gray-500'}`}>
                {product.is_active ? 'Live' : 'Hidden'}
              </button>
              <button onClick={() => handleEdit(product)} className="text-[11px] px-3 py-1.5 rounded-lg border border-[#2a2a2a] text-gray-400 hover:text-white transition">Edit</button>
              <button onClick={() => handleDelete(product.id)} className="text-[11px] px-3 py-1.5 rounded-lg text-red-500/60 hover:text-red-400 hover:bg-red-500/10 transition">Delete</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}