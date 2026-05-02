'use client';

import { useState } from 'react';
import { api, ApiError } from '@/lib/api';
import type { ShortLink } from '@/lib/types';
import EditLinkModal from './edit-link-modal';
import AnalyticsModal from './analytics-modal';

const GATEWAY = process.env.NEXT_PUBLIC_GATEWAY_URL ?? 'http://localhost:3000';

interface Props {
  link: ShortLink;
  onUpdated: (link: ShortLink) => void;
  onDeleted: (slug: string) => void;
}

export default function LinkCard({ link, onUpdated, onDeleted }: Props) {
  const [copied, setCopied] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showEdit, setShowEdit] = useState(false);
  const [showAnalytics, setShowAnalytics] = useState(false);

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

  const expiryBadge = (() => {
    if (link.expiresAt === null) {
      return { dot: 'bg-sky-400', label: 'Never expires' };
    }
    const daysLeft = Math.ceil(
      (new Date(link.expiresAt).getTime() - Date.now()) / (1000 * 60 * 60 * 24),
    );
    if (daysLeft <= 0) return { dot: 'bg-red-400', label: 'Expired' };
    if (daysLeft <= 2) return { dot: 'bg-red-400', label: `Expires in ${daysLeft}d` };
    if (daysLeft <= 7) return { dot: 'bg-amber-400', label: `Expires in ${daysLeft}d` };
    return { dot: 'bg-emerald-400', label: `Expires in ${daysLeft}d` };
  })();

  return (
    <>
      <div
        className={`bg-white rounded-xl border border-slate-200 p-4 transition-opacity duration-150 ${
          deleting ? 'opacity-40 pointer-events-none' : ''
        }`}
      >
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="font-mono text-sm font-medium text-sky-600">/s/{link.slug}</span>
              <span className="text-slate-300 text-xs">·</span>
              <span className="text-xs text-slate-400">
                {link.clickCount} {link.clickCount === 1 ? 'click' : 'clicks'}
              </span>
            </div>
            <p className="mt-0.5 text-sm text-slate-500 truncate">{link.targetUrl}</p>
            {error && <p className="mt-1 text-xs text-red-500">{error}</p>}
          </div>

          <div className="flex items-center gap-0.5 shrink-0">
            <button
              onClick={handleCopy}
              title="Copy short link"
              className="p-1.5 rounded-md text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
            >
              {copied ? <CheckIcon /> : <CopyIcon />}
            </button>
            <button
              onClick={() => setShowAnalytics(true)}
              title="View analytics"
              className="p-1.5 rounded-md text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
            >
              <ChartIcon />
            </button>
            <button
              onClick={() => setShowEdit(true)}
              title="Edit link"
              className="p-1.5 rounded-md text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
            >
              <PencilIcon />
            </button>
            <button
              onClick={handleDelete}
              title="Delete link"
              className="p-1.5 rounded-md text-slate-400 hover:text-red-500 hover:bg-red-50 transition-colors"
            >
              <TrashIcon />
            </button>
          </div>
        </div>

        <div className="mt-2.5 flex items-center gap-1.5">
          <div className={`w-1.5 h-1.5 rounded-full shrink-0 ${expiryBadge.dot}`} />
          <span className="text-xs text-slate-400">{expiryBadge.label}</span>
        </div>
      </div>

      {showEdit && (
        <EditLinkModal
          link={link}
          onUpdated={onUpdated}
          onClose={() => setShowEdit(false)}
        />
      )}

      {showAnalytics && (
        <AnalyticsModal slug={link.slug} onClose={() => setShowAnalytics(false)} />
      )}
    </>
  );
}

function CopyIcon() {
  return (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={1.8}
        d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
      />
    </svg>
  );
}

function CheckIcon() {
  return (
    <svg className="w-4 h-4 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
    </svg>
  );
}

function ChartIcon() {
  return (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={1.8}
        d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
      />
    </svg>
  );
}

function PencilIcon() {
  return (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={1.8}
        d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
      />
    </svg>
  );
}

function TrashIcon() {
  return (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={1.8}
        d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
      />
    </svg>
  );
}
