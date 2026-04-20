# Links

Frontend for the Atlas URL Shortener service. Create short links, track clicks, and manage your links — all in one clean interface.

## Stack

- **Next.js** (App Router) — React framework
- **Tailwind CSS** — styling
- **TypeScript** — type safety

## Features

- Google OAuth login via the Atlas API Gateway
- Create short links from any URL
- View all your links with click counts
- Delete links
- Protected dashboard — unauthenticated users are redirected to the login page

## Getting Started

```bash
pnpm install
pnpm dev       # runs on http://localhost:3004
```

## Environment Variables

Copy `.env.local.example` to `.env.local` and fill in the values:

```env
NEXT_PUBLIC_GATEWAY_URL=http://localhost:3000
NEXT_PUBLIC_APP_URL=http://localhost:3004
```

| Variable | Description |
|---|---|
| `NEXT_PUBLIC_GATEWAY_URL` | Base URL of the Atlas API Gateway |
| `NEXT_PUBLIC_APP_URL` | Public URL of this app (used as the OAuth redirect target) |

## Project Structure

```
app/
 ├── page.tsx            # Login page — redirects to /dashboard if already authenticated
 └── dashboard/
     └── page.tsx        # Main dashboard — create, list, and delete links
components/              # Shared UI components
lib/
 ├── api.ts              # Typed API client for the Atlas Gateway
 └── types.ts            # Shared TypeScript types
middleware.ts            # Redirects unauthenticated users away from /dashboard
```

## Auth Flow

1. User clicks **Continue with Google** — redirected to Atlas Gateway `/auth/google`
2. After OAuth, the gateway sets an `access_token` cookie and redirects back to `/dashboard`
3. Middleware checks for the cookie on every `/dashboard` route — no token redirects to `/`
