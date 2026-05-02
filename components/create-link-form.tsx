'use client';

import { useState, type FormEvent } from 'react';
import { api, ApiError } from '@/lib/api';
import type { ShortLink } from '@/lib/types';

interface Props {
  onCreated: (link: ShortLink) => void;
}

export default function CreateLinkForm({ onCreated }: Props) {
  const [targetUrl, setTargetUrl] = useState('');
  const [slug, setSlug] = useState('');
  const [noExpiry, setNoExpiry] = useState(false);
  const [expiresInDays, setExpiresInDays] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const link = await api.links.create({
        targetUrl,
        slug: slug.trim() || undefined,
        noExpiry: noExpiry || undefined,
        expiresInDays: !noExpiry && expiresInDays ? parseInt(expiresInDays) : undefined,
      });
      onCreated(link);
      setTargetUrl('');
      setSlug('');
      setExpiresInDays('');
      setNoExpiry(false);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-xl border border-slate-200 p-5">
      <h2 className="text-sm font-semibold text-slate-900 mb-4">New link</h2>
      <form onSubmit={handleSubmit} className="space-y-2.5">
        <input
          type="url"
          value={targetUrl}
          onChange={e => setTargetUrl(e.target.value)}
          placeholder="https://example.com/your/long/url"
          required
          className="w-full px-3 py-2.5 rounded-lg border border-slate-200 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition"
        />

        <div className="flex gap-2">
          <div className="flex items-center flex-1 rounded-lg border border-slate-200 overflow-hidden focus-within:ring-2 focus-within:ring-indigo-500 focus-within:border-transparent transition">
            <span className="pl-3 pr-1 text-sm text-slate-400 select-none">/s/</span>
            <input
              type="text"
              value={slug}
              onChange={e => setSlug(e.target.value)}
              placeholder="custom-slug"
              pattern="[a-zA-Z0-9-]+"
              minLength={3}
              maxLength={50}
              className="flex-1 pr-3 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none bg-transparent"
            />
          </div>

          <button
            type="submit"
            disabled={loading || !targetUrl}
            className="px-4 py-2.5 bg-indigo-600 text-white text-sm font-medium rounded-lg hover:bg-indigo-700 active:bg-indigo-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors whitespace-nowrap"
          >
            {loading ? 'Creating…' : 'Create'}
          </button>
        </div>

        <div className="flex items-center gap-4 pt-0.5">
          <label className="flex items-center gap-2 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={noExpiry}
              onChange={e => setNoExpiry(e.target.checked)}
              className="w-3.5 h-3.5 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
            />
            <span className="text-xs text-slate-500">Never expire</span>
          </label>

          {!noExpiry && (
            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-500">Expires in</span>
              <input
                type="number"
                value={expiresInDays}
                onChange={e => setExpiresInDays(e.target.value)}
                min={1}
                max={365}
                placeholder="30"
                className="w-16 px-2 py-1 rounded-md border border-slate-200 text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
              />
              <span className="text-xs text-slate-500">days</span>
            </div>
          )}
        </div>

        {error && <p className="text-xs text-red-500 pt-0.5">{error}</p>}
      </form>
    </div>
  );
}
