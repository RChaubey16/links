import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL ?? 'http://localhost:3004'),
  title: {
    template: '%s | Links',
    default: 'Links',
  },
  description:
    'Create short links, track clicks, and share anywhere. Powered by Atlas.',
  keywords: ['url shortener', 'short links', 'link tracking', 'click analytics'],
  authors: [{ name: 'Atlas' }],
  robots: {
    index: true,
    follow: true,
  },
  openGraph: {
    type: 'website',
    siteName: 'Links',
    title: 'Links — Short links. Click tracking. No noise.',
    description: 'Create short links, track clicks, and share anywhere.',
  },
  twitter: {
    card: 'summary',
    title: 'Links — Short links. Click tracking. No noise.',
    description: 'Create short links, track clicks, and share anywhere.',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="antialiased bg-white text-slate-900">{children}</body>
    </html>
  );
}
