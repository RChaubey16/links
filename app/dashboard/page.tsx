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
    <div className="min-h-screen bg-void">
      <Header />
      <main className="max-w-2xl mx-auto px-5 py-10">
        <div className="opacity-0 animate-fade-up delay-75">
          <CreateLinkForm onCreated={handleCreated} />
        </div>

        <div className="mt-10">
          {loading ? (
            <Skeleton />
          ) : links.length === 0 ? (
            <EmptyState />
          ) : (
            <div className="opacity-0 animate-fade-in delay-150">
              <div className="flex items-center justify-between mb-4">
                <p className="text-[10px] font-sans font-semibold tracking-[0.2em] uppercase text-gold">
                  Your Links
                </p>
                <span className="text-[10px] text-ink-faint font-sans">
                  {links.length} {links.length === 1 ? 'link' : 'links'}
                </span>
              </div>
              <div className="space-y-2">
                {links.map((link, i) => (
                  <div
                    key={link.slug}
                    className="opacity-0 animate-fade-up"
                    style={{ animationDelay: `${175 + i * 45}ms`, animationFillMode: 'forwards' }}
                  >
                    <LinkCard link={link} onDeleted={handleDeleted} />
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

function Skeleton() {
  return (
    <div className="space-y-2">
      {[0, 1, 2].map(i => (
        <div
          key={i}
          className="h-[88px] bg-void-card border border-void-border border-l-2 border-l-gold/20 animate-pulse"
          style={{ animationDelay: `${i * 80}ms` }}
        />
      ))}
    </div>
  );
}
