'use client';

import { useState, type FormEvent } from 'react';
import { api, ApiError } from '@/lib/api';
import type { ShortLink } from '@/lib/types';

interface Props {
  link: ShortLink;
  onUpdated: (link: ShortLink) => void;
  onClose: () => void;
}

export default function EditLinkModal({ link, onUpdated, onClose }: Props) {
  const [targetUrl, setTargetUrl] = useState(link.targetUrl);
  const [noExpiry, setNoExpiry] = useState(link.expiresAt === null);
  const [expiresInDays, setExpiresInDays] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const updated = await api.links.update(link.slug, {
        targetUrl: targetUrl !== link.targetUrl ? targetUrl : undefined,
        noExpiry: noExpiry || undefined,
        expiresInDays: !noExpiry && expiresInDays ? parseInt(expiresInDays) : undefined,
      });
      onUpdated(updated);
      onClose();
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Update failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm"
      onClick={e => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xl w-full max-w-md p-6">
        <div className="flex items-center justify-between mb-1">
          <h2 className="text-sm font-semibold text-slate-900">Edit link</h2>
          <button
            onClick={onClose}
            className="p-1 rounded-md text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
          >
            <XIcon />
          </button>
        </div>

        <p className="font-mono text-xs text-slate-400 mb-5">/s/{link.slug}</p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-slate-600 mb-1.5">
              Destination URL
            </label>
            <input
              type="url"
              value={targetUrl}
              onChange={e => setTargetUrl(e.target.value)}
              required
              className="w-full px-3 py-2.5 rounded-lg border border-slate-200 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-600 mb-2">Expiry</label>
            <div className="flex items-center gap-4">
              <label className="flex items-center gap-2 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={noExpiry}
                  onChange={e => setNoExpiry(e.target.checked)}
                  className="w-3.5 h-3.5 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
                />
                <span className="text-sm text-slate-600">Never expire</span>
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
                    placeholder="days"
                    className="w-20 px-2.5 py-1.5 rounded-lg border border-slate-200 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
                  />
                  <span className="text-xs text-slate-500">days</span>
                </div>
              )}
            </div>
            {!noExpiry && link.expiresAt && (
              <p className="mt-1.5 text-xs text-slate-400">
                Currently expires{' '}
                {new Date(link.expiresAt).toLocaleDateString(undefined, {
                  month: 'short',
                  day: 'numeric',
                  year: 'numeric',
                })}
                . Leave blank to keep as-is.
              </p>
            )}
          </div>

          {error && <p className="text-xs text-red-500">{error}</p>}

          <div className="flex gap-2 pt-1">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2.5 text-sm font-medium text-slate-600 bg-slate-100 rounded-lg hover:bg-slate-200 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 px-4 py-2.5 bg-indigo-600 text-white text-sm font-medium rounded-lg hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {loading ? 'Saving…' : 'Save changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

function XIcon() {
  return (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
    </svg>
  );
}
