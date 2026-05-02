'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { api, ApiError } from '@/lib/api';
import type { ShortLink } from '@/lib/types';
import Header from '@/components/header';
import CreateLinkForm from '@/components/create-link-form';
import LinkCard from '@/components/link-card';
import EmptyState from '@/components/empty-state';

const LIMIT = 20;

export default function DashboardPage() {
  const router = useRouter();
  const [links, setLinks] = useState<ShortLink[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [pages, setPages] = useState(1);

  const load = useCallback(
    async (p: number) => {
      setLoading(true);
      try {
        const res = await api.links.list(p, LIMIT);
        setLinks(res.data);
        setTotal(res.total);
        setPages(res.pages);
      } catch (err) {
        if (err instanceof ApiError && err.status === 401) {
          router.replace('/');
        }
      } finally {
        setLoading(false);
      }
    },
    [router],
  );

  useEffect(() => {
    void load(page);
  }, [load, page]);

  const handleCreated = (_link: ShortLink) => {
    if (page === 1) {
      void load(1);
    } else {
      setPage(1);
    }
  };

  const handleUpdated = (updated: ShortLink) =>
    setLinks(prev => prev.map(l => (l.slug === updated.slug ? updated : l)));

  const handleDeleted = (slug: string) => {
    const remaining = links.filter(l => l.slug !== slug);
    const newTotal = total - 1;
    setTotal(newTotal);
    setPages(Math.max(1, Math.ceil(newTotal / LIMIT)));
    if (remaining.length === 0 && page > 1) {
      setPage(p => p - 1);
    } else {
      setLinks(remaining);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <Header />
      <main className="max-w-2xl mx-auto px-4 py-8">
        <CreateLinkForm onCreated={handleCreated} />

        <div className="mt-8">
          {loading ? (
            <Skeleton />
          ) : links.length === 0 ? (
            <EmptyState />
          ) : (
            <>
              <div className="flex items-center justify-between mb-3">
                <p className="text-xs font-medium text-slate-400 uppercase tracking-wider">
                  {total} {total === 1 ? 'link' : 'links'}
                </p>
                {pages > 1 && (
                  <p className="text-xs text-slate-400">
                    Page {page} of {pages}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                {links.map(link => (
                  <LinkCard
                    key={link.slug}
                    link={link}
                    onUpdated={handleUpdated}
                    onDeleted={handleDeleted}
                  />
                ))}
              </div>

              {pages > 1 && (
                <div className="flex justify-center items-center gap-3 mt-6">
                  <button
                    onClick={() => setPage(p => p - 1)}
                    disabled={page === 1}
                    className="px-3 py-1.5 text-xs font-medium text-slate-600 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                  >
                    ← Previous
                  </button>
                  <span className="text-xs text-slate-400 tabular-nums">
                    {page} / {pages}
                  </span>
                  <button
                    onClick={() => setPage(p => p + 1)}
                    disabled={page === pages}
                    className="px-3 py-1.5 text-xs font-medium text-slate-600 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                  >
                    Next →
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </main>
    </div>
  );
}

function Skeleton() {
  return (
    <div className="space-y-2 animate-pulse">
      {[0, 1, 2].map(i => (
        <div key={i} className="h-[84px] bg-slate-200 rounded-xl" />
      ))}
    </div>
  );
}
