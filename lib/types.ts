export interface ShortLink {
  slug: string;
  targetUrl: string;
  expiresAt: string;
  createdAt: string;
  clickCount: number;
}

export interface CreateLinkInput {
  targetUrl: string;
  slug?: string;
}
