import type {
  ShortLink,
  CreateLinkInput,
  UpdateLinkInput,
  PaginatedLinksResponse,
  AnalyticsResponse,
} from './types';

const BASE = process.env.NEXT_PUBLIC_GATEWAY_URL ?? 'http://localhost:3000';

export class ApiError extends Error {
  constructor(public readonly status: number, message: string) {
    super(message);
    this.name = 'ApiError';
  }
}

async function apiFetch<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`${BASE}${path}`, {
    ...init,
    credentials: 'include',
    headers: { 'Content-Type': 'application/json', ...init?.headers },
  });

  if (!res.ok) {
    const body = (await res.json().catch(() => ({}))) as { message?: string };
    throw new ApiError(res.status, body.message ?? res.statusText);
  }

  const text = await res.text();
  return (text ? JSON.parse(text) : undefined) as T;
}

export const api = {
  links: {
    list: (page = 1, limit = 20) =>
      apiFetch<PaginatedLinksResponse>(`/links?page=${page}&limit=${limit}`),
    create: (data: CreateLinkInput) =>
      apiFetch<ShortLink>('/links', { method: 'POST', body: JSON.stringify(data) }),
    update: (slug: string, data: UpdateLinkInput) =>
      apiFetch<ShortLink>(`/links/${slug}`, { method: 'PATCH', body: JSON.stringify(data) }),
    delete: (slug: string) => apiFetch<void>(`/links/${slug}`, { method: 'DELETE' }),
    analytics: (slug: string) => apiFetch<AnalyticsResponse>(`/links/${slug}/analytics`),
  },
  auth: {
    logout: () => apiFetch<void>('/auth/logout', { method: 'POST' }),
  },
};
