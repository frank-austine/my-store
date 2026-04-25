'use client';

import { useState } from 'react';
import { supabase } from '@/app/lib/supabaseClient';
import { useRouter } from 'next/navigation';

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleLogin() {
    setLoading(true);
    setError('');
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) {
      setError('Invalid email or password.');
      setLoading(false);
    } else {
      router.push('/admin/products');
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-6">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-black uppercase tracking-tight text-white">Kandy Carnival</h1>
          <p className="text-xs text-gray-500 tracking-widest uppercase mt-1">Admin Panel</p>
        </div>

        <div className="bg-[#1a1a1a] rounded-2xl border border-[#2a2a2a] p-8 space-y-4">
          <div>
            <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@example.com"
              className="w-full bg-[#111] border border-[#2a2a2a] focus:border-[#8B7B2A]/60 rounded-xl px-4 py-3 text-sm text-white placeholder-gray-600 outline-none transition"
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              onKeyDown={(e) => e.key === 'Enter' && handleLogin()}
              className="w-full bg-[#111] border border-[#2a2a2a] focus:border-[#8B7B2A]/60 rounded-xl px-4 py-3 text-sm text-white placeholder-gray-600 outline-none transition"
            />
          </div>

          {error && <p className="text-red-400 text-sm text-center">{error}</p>}

          <button
            onClick={handleLogin}
            disabled={loading}
            className="w-full bg-[#8B7B2A] hover:bg-[#a08f30] text-white py-3 rounded-xl font-black uppercase tracking-widest text-sm transition disabled:opacity-50"
          >
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </div>

        <p className="text-center text-xs text-gray-600 mt-6">
          Authorized personnel only.
        </p>
      </div>
    </div>
  );
}