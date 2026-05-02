export interface ShortLink {
  slug: string;
  targetUrl: string;
  expiresAt: string | null;
  createdAt: string;
  clickCount: number;
}

export interface CreateLinkInput {
  targetUrl: string;
  slug?: string;
  expiresInDays?: number;
  noExpiry?: boolean;
}

export interface UpdateLinkInput {
  targetUrl?: string;
  expiresInDays?: number;
  noExpiry?: boolean;
}

export interface PaginatedLinksResponse {
  data: ShortLink[];
  total: number;
  page: number;
  pages: number;
}

export interface ClicksByDay {
  date: string;
  count: number;
}

export interface AnalyticsResponse {
  totalClicks: number;
  clicksByDay: ClicksByDay[];
  lastClickedAt: string | null;
}
