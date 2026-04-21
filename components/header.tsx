'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { api } from '@/lib/api';

export default function Header() {
  const router = useRouter();
  const [busy, setBusy] = useState(false);

  const handleLogout = async () => {
    setBusy(true);
    try {
      await api.auth.logout();
    } finally {
      router.replace('/');
    }
  };

  return (
    <header className="sticky top-0 z-10 bg-void/95 backdrop-blur-sm border-b border-void-border">
      <div className="max-w-2xl mx-auto px-5 h-14 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-1.5 h-1.5 rounded-full bg-gold" />
          <span className="font-display text-lg font-bold text-ink tracking-tight">Links</span>
        </div>

        <button
          onClick={handleLogout}
          disabled={busy}
          className="text-[11px] font-sans tracking-[0.15em] uppercase text-ink-dim hover:text-ink transition-colors duration-200 disabled:opacity-40"
        >
          {busy ? 'Signing out…' : 'Sign out'}
        </button>
      </div>
    </header>
  );
}
