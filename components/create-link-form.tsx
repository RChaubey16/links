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
      });
      onCreated(link);
      setTargetUrl('');
      setSlug('');
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-void-card border border-void-border p-6">
      <p className="text-[10px] font-sans font-semibold tracking-[0.2em] uppercase text-gold mb-5">
        New Link
      </p>
      <form onSubmit={handleSubmit} className="space-y-3">
        <input
          type="url"
          value={targetUrl}
          onChange={e => setTargetUrl(e.target.value)}
          placeholder="https://example.com/your/long/url"
          required
          className="w-full px-4 py-3 bg-void border border-void-border text-sm text-ink placeholder:text-ink-faint focus:outline-none focus:border-gold/40 focus:ring-1 focus:ring-gold/10 transition-all duration-200 font-sans"
        />

        <div className="flex gap-2">
          <div className="flex items-center flex-1 bg-void border border-void-border focus-within:border-gold/40 focus-within:ring-1 focus-within:ring-gold/10 transition-all duration-200 overflow-hidden">
            <span className="pl-4 pr-1.5 text-sm text-ink-faint select-none font-mono">/s/</span>
            <input
              type="text"
              value={slug}
              onChange={e => setSlug(e.target.value)}
              placeholder="custom-slug"
              pattern="[a-zA-Z0-9-]+"
              minLength={3}
              maxLength={50}
              className="flex-1 pr-4 py-3 text-sm text-ink placeholder:text-ink-faint focus:outline-none bg-transparent font-mono"
            />
          </div>

          <button
            type="submit"
            disabled={loading || !targetUrl}
            className="px-5 py-3 bg-gold text-void text-sm font-semibold hover:bg-gold-bright active:scale-[0.97] disabled:opacity-40 disabled:cursor-not-allowed transition-all duration-150 whitespace-nowrap font-sans"
          >
            {loading ? 'Creating…' : 'Shorten →'}
          </button>
        </div>

        {error && (
          <p className="text-xs text-ember pt-0.5 font-sans">{error}</p>
        )}
      </form>
    </div>
  );
}
