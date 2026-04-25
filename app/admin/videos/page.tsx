'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/app/lib/supabaseClient';
import { Video } from '@/types/product';

const EMPTY_FORM = { title: '', description: '' };

export default function AdminVideosPage() {
  const router = useRouter();
  const [videos, setVideos] = useState<Video[]>([]);
  const [form, setForm] = useState(EMPTY_FORM);
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [thumbnailFile, setThumbnailFile] = useState<File | null>(null);
  const [videoPreview, setVideoPreview] = useState<string | null>(null);
  const [thumbnailPreview, setThumbnailPreview] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState('');
  const [message, setMessage] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingVideoUrl, setEditingVideoUrl] = useState<string | null>(null);
  const [editingThumbnailUrl, setEditingThumbnailUrl] = useState<string | null>(null);
  const videoRef = useRef<HTMLInputElement>(null);
  const thumbnailRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      if (!data.session) router.push('/admin');
    });
    fetchVideos();
  }, []);

  async function fetchVideos() {
    const { data } = await supabase.from('videos').select('*').order('created_at', { ascending: false });
    setVideos((data as Video[]) ?? []);
  }

  async function uploadFile(file: File, bucket: string, baseName: string, ext: string): Promise<string | null> {
    const fileName = `${baseName}.${ext}`;
    const { error } = await supabase.storage.from(bucket).upload(fileName, file, { upsert: true });
    if (error) { setMessage(`Upload failed: ${error.message}`); return null; }
    const { data } = supabase.storage.from(bucket).getPublicUrl(fileName);
    return data.publicUrl;
  }

  async function handleSubmit() {
    if (!form.title) { setMessage('Title is required.'); return; }
    if (!editingId && !videoFile) { setMessage('Please select a video file.'); return; }
    setUploading(true); setMessage('');

    const baseName = `${Date.now()}-${form.title.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '')}`;
    let video_url = editingVideoUrl;
    let thumbnail_url = editingThumbnailUrl;

    if (videoFile) {
      setUploadProgress('Uploading video... (this may take a moment)');
      const ext = videoFile.name.split('.').pop() ?? 'mp4';
      video_url = await uploadFile(videoFile, 'videos', baseName, ext);
      if (!video_url) { setUploading(false); setUploadProgress(''); return; }
    }

    if (thumbnailFile) {
      setUploadProgress('Uploading thumbnail...');
      const ext = thumbnailFile.name.split('.').pop() ?? 'jpg';
      thumbnail_url = await uploadFile(thumbnailFile, 'product-images', baseName + '-thumb', ext);
      if (!thumbnail_url) { setUploading(false); setUploadProgress(''); return; }
    }

    setUploadProgress('Saving...');
    const payload = { title: form.title, description: form.description || null, video_url: video_url ?? '', thumbnail_url: thumbnail_url ?? null, updated_at: new Date().toISOString() };

    if (editingId) {
      const { error } = await supabase.from('videos').update(payload).eq('id', editingId);
      setMessage(error ? 'Update failed: ' + error.message : '✓ Video updated.');
    } else {
      const { error } = await supabase.from('videos').insert({ ...payload, is_active: true });
      setMessage(error ? 'Add failed: ' + error.message : '✓ Video added.');
    }

    setForm(EMPTY_FORM); setVideoFile(null); setThumbnailFile(null);
    setVideoPreview(null); setThumbnailPreview(null);
    setEditingId(null); setEditingVideoUrl(null); setEditingThumbnailUrl(null);
    if (videoRef.current) videoRef.current.value = '';
    if (thumbnailRef.current) thumbnailRef.current.value = '';
    setUploading(false); setUploadProgress('');
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
    setEditingId(video.id); setEditingVideoUrl(video.video_url); setEditingThumbnailUrl(video.thumbnail_url);
    setVideoPreview(video.video_url); setThumbnailPreview(video.thumbnail_url);
    setForm({ title: video.title, description: video.description ?? '' });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  async function handleLogout() {
    await supabase.auth.signOut();
    router.push('/admin');
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-black uppercase tracking-tight text-white">Videos</h1>
          <p className="text-sm text-gray-500 mt-0.5">Manage your store videos</p>
        </div>
        <div className="flex gap-3">
          <a href="/admin/products" className="text-sm px-4 py-2 rounded-xl border border-[#2a2a2a] text-gray-400 hover:text-white transition">Products</a>
          <button onClick={handleLogout} className="text-sm px-4 py-2 rounded-xl border border-[#2a2a2a] text-red-500 hover:bg-red-500/10 transition">Logout</button>
        </div>
      </div>

      <div className="bg-[#1a1a1a] rounded-2xl border border-[#2a2a2a] p-6 mb-10">
        <h2 className="font-black text-lg mb-6 text-white uppercase tracking-wide">{editingId ? 'Edit Video' : 'Add New Video'}</h2>
        <div className="grid grid-cols-1 gap-4">
          <div>
            <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Video Title *</label>
            <input type="text" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} placeholder="e.g. Product Showcase"
              className="w-full bg-[#111] border border-[#2a2a2a] focus:border-[#8B7B2A]/60 rounded-xl px-4 py-3 text-sm text-white placeholder-gray-600 outline-none transition" />
          </div>
          <div>
            <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Description (optional)</label>
            <textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} placeholder="Short description..." rows={3}
              className="w-full bg-[#111] border border-[#2a2a2a] focus:border-[#8B7B2A]/60 rounded-xl px-4 py-3 text-sm text-white placeholder-gray-600 outline-none transition resize-none" />
          </div>

          {/* Video upload */}
          <div>
            <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Video File (MP4) {!editingId && '*'}</label>
            <div className="border border-dashed border-[#3a3a3a] hover:border-[#8B7B2A]/60 rounded-xl p-5 bg-[#111] transition">
              <div className="flex items-center gap-4">
                <label className="cursor-pointer flex items-center gap-2 bg-[#8B7B2A] hover:bg-[#a08f30] text-white text-xs font-black uppercase tracking-widest px-5 py-3 rounded-xl transition">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <polygon points="23 7 16 12 23 17 23 7"/><rect x="1" y="5" width="15" height="14" rx="2"/>
                  </svg>
                  Choose Video
                  <input ref={videoRef} type="file" accept="video/mp4,video/*" onChange={(e) => { const f = e.target.files?.[0] ?? null; setVideoFile(f); setVideoPreview(f ? URL.createObjectURL(f) : null); }} className="hidden" />
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

          {/* Thumbnail upload */}
          <div>
            <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Thumbnail Image (optional)</label>
            <div className="border border-dashed border-[#3a3a3a] hover:border-[#8B7B2A]/60 rounded-xl p-5 bg-[#111] transition">
              <div className="flex items-center gap-4">
                <label className="cursor-pointer flex items-center gap-2 bg-[#8B7B2A] hover:bg-[#a08f30] text-white text-xs font-black uppercase tracking-widest px-5 py-3 rounded-xl transition">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/>
                  </svg>
                  Choose Thumbnail
                  <input ref={thumbnailRef} type="file" accept="image/*" onChange={(e) => { const f = e.target.files?.[0] ?? null; setThumbnailFile(f); setThumbnailPreview(f ? URL.createObjectURL(f) : null); }} className="hidden" />
                </label>
                <span className="text-xs text-gray-600">{thumbnailFile ? thumbnailFile.name : 'JPG, PNG, WEBP'}</span>
              </div>
              {thumbnailPreview && (
                <div className="mt-4 relative w-32 h-32 rounded-xl overflow-hidden border border-[#2a2a2a]">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={thumbnailPreview} alt="Thumbnail" className="w-full h-full object-cover" />
                  <button onClick={() => { setThumbnailFile(null); setThumbnailPreview(null); if (thumbnailRef.current) thumbnailRef.current.value = ''; }}
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
            {uploading ? 'Saving...' : editingId ? 'Update Video' : 'Add Video'}
          </button>
          {editingId && (
            <button onClick={() => { setEditingId(null); setForm(EMPTY_FORM); setVideoPreview(null); setThumbnailPreview(null); }}
              className="px-6 py-3 rounded-xl text-sm border border-[#2a2a2a] text-gray-400 hover:text-white transition">Cancel</button>
          )}
        </div>
      </div>

      <div className="space-y-3">
        <p className="text-xs font-black uppercase tracking-widest text-gray-600 mb-4">{videos.length} Video{videos.length !== 1 ? 's' : ''}</p>
        {videos.length === 0 && <p className="text-center text-gray-600 py-8 text-sm">No videos yet.</p>}
        {videos.map((video) => (
          <div key={video.id} className="bg-[#1a1a1a] rounded-2xl border border-[#2a2a2a] px-4 py-4 flex items-center gap-4">
            <div className="w-14 h-14 rounded-xl overflow-hidden bg-[#111] shrink-0 border border-[#2a2a2a] flex items-center justify-center">
              {video.thumbnail_url
                // eslint-disable-next-line @next/next/no-img-element
                ? <img src={video.thumbnail_url} alt={video.title} className="w-full h-full object-cover" />
                : <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#8B7B2A" strokeWidth="2"><polygon points="23 7 16 12 23 17 23 7"/><rect x="1" y="5" width="15" height="14" rx="2"/></svg>}
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-bold text-sm text-white truncate">{video.title}</p>
              {video.description && <p className="text-xs text-gray-500 mt-0.5 truncate">{video.description}</p>}
              <span className="text-[10px] text-[#8B7B2A] font-bold mt-1 block">🎥 Video uploaded</span>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <button onClick={() => toggleActive(video)}
                className={`text-[11px] px-3 py-1.5 rounded-lg font-bold uppercase tracking-wide transition ${video.is_active ? 'bg-green-500/10 text-green-400' : 'bg-[#2a2a2a] text-gray-500'}`}>
                {video.is_active ? 'Live' : 'Hidden'}
              </button>
              <button onClick={() => handleEdit(video)} className="text-[11px] px-3 py-1.5 rounded-lg border border-[#2a2a2a] text-gray-400 hover:text-white transition">Edit</button>
              <button onClick={() => handleDelete(video.id)} className="text-[11px] px-3 py-1.5 rounded-lg text-red-500/60 hover:text-red-400 hover:bg-red-500/10 transition">Delete</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}