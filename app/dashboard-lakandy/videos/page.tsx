'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/app/lib/supabaseClient';
import { Video } from '@/types/product';

const EMPTY_FORM = {
  title: '',
  description: '',
  video_url: '',
  thumbnail_url: '',
};

export default function DashboardVideosPage() {
  const router = useRouter();
  const [videos, setVideos] = useState<Video[]>([]);
  const [form, setForm] = useState(EMPTY_FORM);
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      if (!data.session) router.push('/dashboard-lakandy');
    });
    fetchVideos();
  }, []);

  async function fetchVideos() {
    const { data } = await supabase
      .from('videos')
      .select('*')
      .order('created_at', { ascending: false });
    setVideos((data as Video[]) ?? []);
  }

  async function handleSubmit() {
    if (!form.title || !form.video_url) {
      setMessage('Title and video URL are required.');
      return;
    }
    setUploading(true);
    setMessage('');

    const payload = {
      title: form.title,
      description: form.description || null,
      video_url: form.video_url,
      thumbnail_url: form.thumbnail_url || null,
      updated_at: new Date().toISOString(),
    };

    if (editingId) {
      const { error } = await supabase.from('videos').update(payload).eq('id', editingId);
      setMessage(error ? 'Update failed: ' + error.message : 'Video updated. ✓');
    } else {
      const { error } = await supabase.from('videos').insert({ ...payload, is_active: true });
      setMessage(error ? 'Insert failed: ' + error.message : 'Video added. ✓');
    }

    setForm(EMPTY_FORM);
    setEditingId(null);
    setUploading(false);
    fetchVideos();
  }

  async function toggleActive(video: Video) {
    await supabase.from('videos').update({ is_active: !video.is_active }).eq('id', video.id);
    fetchVideos();
  }

  async function handleDelete(id: string) {
    if (!confirm('Delete this video?')) return;
    await supabase.from('videos').delete().eq('id', id);
    fetchVideos();
  }

  function handleEdit(video: Video) {
    setEditingId(video.id);
    setForm({
      title: video.title,
      description: video.description ?? '',
      video_url: video.video_url,
      thumbnail_url: video.thumbnail_url ?? '',
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
          <h1 className="text-2xl font-black uppercase tracking-tight">Videos</h1>
          <p className="text-sm text-gray-400 mt-0.5">Manage your store videos</p>
        </div>
        <div className="flex gap-3">
          <a href="/dashboard-lakandy/products" className="text-sm px-4 py-2 rounded-xl border border-gray-200 hover:bg-gray-50 transition">
            Products
          </a>
          <button onClick={handleLogout} className="text-sm px-4 py-2 rounded-xl border border-gray-200 text-red-500 hover:bg-gray-50 transition">
            Logout
          </button>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 mb-10">
        <h2 className="font-bold text-lg mb-5">{editingId ? 'Edit video' : 'Add new video'}</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {[
            { label: 'Title *', key: 'title', placeholder: 'e.g. Product showcase' },
            { label: 'Thumbnail URL (optional)', key: 'thumbnail_url', placeholder: 'https://...' },
          ].map(({ label, key, placeholder }) => (
            <div key={key}>
              <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
              <input
                type="text"
                value={form[key as keyof typeof form]}
                onChange={(e) => setForm({ ...form, [key]: e.target.value })}
                placeholder={placeholder}
                className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-black transition"
              />
            </div>
          ))}

          <div className="sm:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">Video URL *</label>
            <input
              type="text"
              value={form.video_url}
              onChange={(e) => setForm({ ...form, video_url: e.target.value })}
              placeholder="https://... direct link to video"
              className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-black transition"
            />
          </div>

          <div className="sm:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
            <textarea
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              placeholder="Short video description..."
              rows={3}
              className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-black transition resize-none"
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
            {uploading ? 'Saving...' : editingId ? 'Update video' : 'Add video'}
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

      <div className="space-y-3">
        {videos.length === 0 && (
          <p className="text-center text-gray-400 py-8">No videos yet.</p>
        )}
        {videos.map((video) => (
          <div key={video.id} className="bg-white rounded-2xl border border-gray-100 px-5 py-4 flex items-center justify-between gap-4">
            <div className="flex-1 min-w-0">
              <p className="font-semibold text-sm truncate">{video.title}</p>
              <p className="text-xs text-gray-400 mt-0.5 truncate">{video.video_url}</p>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <button
                onClick={() => toggleActive(video)}
                className={`text-xs px-3 py-1.5 rounded-lg font-medium transition ${
                  video.is_active ? 'bg-green-50 text-green-700 hover:bg-green-100' : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
                }`}
              >
                {video.is_active ? 'Active' : 'Hidden'}
              </button>
              <button onClick={() => handleEdit(video)} className="text-xs px-3 py-1.5 rounded-lg border border-gray-200 hover:bg-gray-50 transition">
                Edit
              </button>
              <button onClick={() => handleDelete(video.id)} className="text-xs px-3 py-1.5 rounded-lg text-red-400 hover:text-red-600 hover:bg-red-50 transition">
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}