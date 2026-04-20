'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { api, ApiError } from '@/lib/api';
import type { ShortLink } from '@/lib/types';
import Header from '@/components/header';
import CreateLinkForm from '@/components/create-link-form';
import LinkCard from '@/components/link-card';
import EmptyState from '@/components/empty-state';

export default function DashboardPage() {
  const router = useRouter();
  const [links, setLinks] = useState<ShortLink[]>([]);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    try {
      const data = await api.links.list();
      setLinks(data);
    } catch (err) {
      if (err instanceof ApiError && err.status === 401) {
        router.replace('/');
      }
    } finally {
      setLoading(false);
    }
  }, [router]);

  useEffect(() => {
    load();
  }, [load]);

  const handleCreated = (link: ShortLink) =>
    setLinks(prev => [link, ...prev]);

  const handleDeleted = (slug: string) =>
    setLinks(prev => prev.filter(l => l.slug !== slug));

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
              <p className="text-xs font-medium text-slate-400 uppercase tracking-wider mb-3">
                {links.length} {links.length === 1 ? 'link' : 'links'}
              </p>
              <div className="space-y-2">
                {links.map(link => (
                  <LinkCard key={link.slug} link={link} onDeleted={handleDeleted} />
                ))}
              </div>
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
