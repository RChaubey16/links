'use client';

import { useState } from 'react';
import { api, ApiError } from '@/lib/api';
import type { ShortLink } from '@/lib/types';

const GATEWAY = process.env.NEXT_PUBLIC_GATEWAY_URL ?? 'http://localhost:3000';

interface Props {
  link: ShortLink;
  onDeleted: (slug: string) => void;
}

export default function LinkCard({ link, onDeleted }: Props) {
  const [copied, setCopied] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const shortUrl = `${GATEWAY}/s/${link.slug}`;

  const handleCopy = async () => {
    await navigator.clipboard.writeText(shortUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  const handleDelete = async () => {
    setDeleting(true);
    setError(null);
    try {
      await api.links.delete(link.slug);
      onDeleted(link.slug);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Delete failed');
      setDeleting(false);
    }
  };

  const daysLeft = Math.ceil(
    (new Date(link.expiresAt).getTime() - Date.now()) / (1000 * 60 * 60 * 24),
  );

  const expiryColor = daysLeft > 7 ? 'text-jade' : daysLeft > 2 ? 'text-gold' : 'text-ember';
  const expiryDot = daysLeft > 7 ? 'bg-jade' : daysLeft > 2 ? 'bg-gold' : 'bg-ember';

  return (
    <div
      className={`group bg-void-card border border-void-border border-l-2 border-l-gold/40 hover:border-l-gold/80 hover:bg-void-hover transition-all duration-200 ${
        deleting ? 'opacity-40 pointer-events-none scale-[0.99]' : ''
      }`}
    >
      <div className="px-4 py-3.5 flex items-start justify-between gap-4">
        {/* Main content */}
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2.5 flex-wrap">
            <span className="font-mono text-sm font-semibold text-gold">/s/{link.slug}</span>
            <span className="text-void-border text-base leading-none">·</span>
            <span className="text-[11px] text-ink-dim font-sans">
              {link.clickCount} {link.clickCount === 1 ? 'click' : 'clicks'}
            </span>
          </div>
          <p className="mt-1 text-xs text-ink-faint truncate font-sans">{link.targetUrl}</p>
          {error && <p className="mt-1 text-xs text-ember font-sans">{error}</p>}
        </div>

        {/* Actions */}
        <div className="flex items-center gap-1 shrink-0">
          <button
            onClick={handleCopy}
            title="Copy short link"
            className="p-1.5 text-ink-faint hover:text-gold transition-colors duration-150"
          >
            {copied ? <CheckIcon /> : <CopyIcon />}
          </button>
          <button
            onClick={handleDelete}
            title="Delete link"
            className="p-1.5 text-ink-faint hover:text-ember transition-colors duration-150"
          >
            <TrashIcon />
          </button>
        </div>
      </div>

      {/* Expiry footer */}
      <div className="px-4 pb-3 flex items-center gap-1.5">
        <div className={`w-1 h-1 rounded-full shrink-0 ${expiryDot}`} />
        <span className={`text-[10px] font-sans ${expiryColor}`}>
          {daysLeft > 0 ? `Expires in ${daysLeft}d` : 'Expired'}
        </span>
      </div>
    </div>
  );
}

function CopyIcon() {
  return (
    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8}
        d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
    </svg>
  );
}

function CheckIcon() {
  return (
    <svg className="w-3.5 h-3.5 text-jade" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
    </svg>
  );
}

function TrashIcon() {
  return (
    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8}
        d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
    </svg>
  );
}
