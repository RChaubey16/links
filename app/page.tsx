import { cookies, headers } from 'next/headers';
import { redirect } from 'next/navigation';

const GATEWAY = process.env.NEXT_PUBLIC_GATEWAY_URL ?? 'http://localhost:3000';

export default async function HomePage() {
  const store = await cookies();
  if (store.get('access_token')) redirect('/dashboard');

  const headersList = await headers();
  const host = headersList.get('host') ?? 'localhost:3004';
  const proto = headersList.get('x-forwarded-proto') ?? (host.startsWith('localhost') ? 'http' : 'https');
  const appOrigin = `${proto}://${host}`;

  const loginUrl =
    `${GATEWAY}/auth/google?redirect=${encodeURIComponent(`${appOrigin}/dashboard`)}`;

  return (
    <div className="min-h-screen bg-void flex flex-col items-center justify-center px-6 relative overflow-hidden">
      {/* Ambient glow */}
      <div aria-hidden className="pointer-events-none absolute inset-0 flex items-center justify-center">
        <div className="w-[560px] h-[560px] rounded-full bg-gold/5 blur-[110px]" />
      </div>

      {/* Top border line */}
      <div aria-hidden className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-void-border to-transparent" />

      <div className="w-full max-w-[360px] relative">
        {/* Platform label + title */}
        <div className="mb-12 opacity-0 animate-fade-up delay-75">
          <div className="inline-flex items-center gap-2.5 mb-7">
            <div className="w-1.5 h-1.5 rounded-full bg-gold" />
            <span className="text-[10px] font-sans tracking-[0.3em] uppercase text-ink-dim">
              Atlas
            </span>
          </div>

          <h1 className="font-display text-[76px] leading-none font-bold text-ink tracking-tight">
            Links
          </h1>
          <p className="mt-4 text-ink-dim text-sm leading-relaxed font-sans">
            Short links. Click tracking.
            <br />No noise.
          </p>
        </div>

        {/* Divider */}
        <div className="h-px bg-void-border mb-8 opacity-0 animate-fade-in delay-225" />

        {/* Auth section */}
        <div className="opacity-0 animate-fade-up delay-300">
          <a
            href={loginUrl}
            className="group relative flex items-center gap-3 w-full px-5 py-4 bg-void-card border border-void-border hover:border-gold/30 transition-all duration-300 overflow-hidden"
          >
            {/* Top shimmer on hover */}
            <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-gold/25 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

            <GoogleIcon />
            <span className="text-sm font-medium text-ink font-sans">Continue with Google</span>
            <svg
              className="w-3.5 h-3.5 text-ink-faint group-hover:text-gold transition-colors duration-300 ml-auto shrink-0"
              fill="none" stroke="currentColor" viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </a>

          <p className="mt-4 text-[11px] text-ink-faint text-center font-sans">
            Secured via Google OAuth 2.0
          </p>
        </div>
      </div>

      {/* Bottom corner version */}
      <div className="absolute bottom-6 right-6">
        <span className="text-[10px] tracking-[0.2em] uppercase text-ink-faint font-sans">v1</span>
      </div>

      {/* Bottom border line */}
      <div aria-hidden className="absolute bottom-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-void-border to-transparent" />
    </div>
  );
}

function GoogleIcon() {
  return (
    <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24">
      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
      <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
    </svg>
  );
}
