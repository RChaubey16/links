'use client';

import { useEffect, useState } from 'react';
import { api, ApiError } from '@/lib/api';
import type { AnalyticsResponse } from '@/lib/types';

interface Props {
  slug: string;
  onClose: () => void;
}

export default function AnalyticsModal({ slug, onClose }: Props) {
  const [data, setData] = useState<AnalyticsResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    api.links
      .analytics(slug)
      .then(setData)
      .catch(err =>
        setError(err instanceof ApiError ? err.message : 'Failed to load analytics'),
      )
      .finally(() => setLoading(false));
  }, [slug]);

  const maxCount = data ? Math.max(...data.clicksByDay.map(d => d.count), 1) : 1;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm"
      onClick={e => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xl w-full max-w-md p-6">
        <div className="flex items-center justify-between mb-1">
          <h2 className="text-sm font-semibold text-slate-900">Analytics</h2>
          <button
            onClick={onClose}
            className="p-1 rounded-md text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
          >
            <XIcon />
          </button>
        </div>
        <p className="font-mono text-xs text-slate-400 mb-5">/s/{slug}</p>

        {loading ? (
          <div className="space-y-3 animate-pulse">
            <div className="flex gap-4">
              <div className="flex-1 h-20 bg-slate-100 rounded-xl" />
              <div className="flex-1 h-20 bg-slate-100 rounded-xl" />
            </div>
            <div className="h-48 bg-slate-100 rounded-xl" />
          </div>
        ) : error ? (
          <p className="text-sm text-red-500">{error}</p>
        ) : data ? (
          <div className="space-y-5">
            <div className="flex gap-3">
              <StatBox label="Total clicks" value={data.totalClicks.toLocaleString()} />
              <StatBox
                label="Last click"
                value={
                  data.lastClickedAt
                    ? new Date(data.lastClickedAt).toLocaleDateString(undefined, {
                        month: 'short',
                        day: 'numeric',
                      })
                    : 'Never'
                }
              />
            </div>

            <div>
              <p className="text-xs font-medium text-slate-500 mb-3">Clicks — last 30 days</p>
              {data.clicksByDay.length === 0 ? (
                <p className="text-xs text-slate-400 italic">No clicks recorded in the last 30 days.</p>
              ) : (
                <div className="space-y-2 max-h-52 overflow-y-auto pr-1">
                  {data.clicksByDay.map(({ date, count }) => (
                    <div key={date} className="flex items-center gap-3">
                      <span className="text-xs text-slate-400 w-16 shrink-0">
                        {new Date(`${date}T00:00:00`).toLocaleDateString(undefined, {
                          month: 'short',
                          day: 'numeric',
                        })}
                      </span>
                      <div className="flex-1 bg-slate-100 rounded-full h-2 overflow-hidden">
                        <div
                          className="h-full bg-sky-500 rounded-full"
                          style={{ width: `${(count / maxCount) * 100}%` }}
                        />
                      </div>
                      <span className="text-xs text-slate-500 w-6 text-right shrink-0">{count}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        ) : null}

        <button
          onClick={onClose}
          className="mt-6 w-full px-4 py-2.5 text-sm font-medium text-slate-600 bg-slate-100 rounded-lg hover:bg-slate-200 transition-colors"
        >
          Close
        </button>
      </div>
    </div>
  );
}

function StatBox({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex-1 bg-slate-50 rounded-xl p-4">
      <p className="text-xs text-slate-500 mb-1">{label}</p>
      <p className="text-2xl font-semibold text-slate-900 tabular-nums">{value}</p>
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
