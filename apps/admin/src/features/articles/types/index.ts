export type ArticleStatus = "draft" | "published";

export interface BadgeRow {
  id: number;
  name: string;
  slug: string;
  color: string;
  created_at: string;
}

export interface CategoryRow {
  id: number;
  name: string;
  slug: string;
  is_active: boolean;
  seo_description: string | null;
  created_at: string;
}

export interface RegionRow {
  id: number;
  name: string;
  slug: string;
  is_active: boolean;
  seo_description: string | null;
  created_at: string;
}

export interface ArticleRow {
  id: number;
  title: string;
  slug: string;
  excerpt: string | null;
  content: string | null;
  featured_image: string | null;
  status: ArticleStatus;
  is_live: boolean;
  category_id: number | null;
  region_id: number | null;
  author_id: string; // uuid
  published_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface ArticleWithRelations extends ArticleRow {
  category?: Pick<CategoryRow, "id" | "name" | "slug"> | null;
  region?: Pick<RegionRow, "id" | "name" | "slug"> | null;
  author?: {
    id: string;
    full_name: string | null;
  } | null;
  article_badges?: { badge_id: number; badge: BadgeRow }[];
  live_updates?: LiveUpdateRow[];
}

export type ArticleInsert = Omit<ArticleRow, "id" | "created_at" | "updated_at">;

export type ArticleUpdate = Partial<ArticleInsert>;

// ─── Live Updates ─────────────────────────────────────────────────────────────

export interface LiveUpdateRow {
  id: number;
  article_id: number;
  headline: string;
  content: string;
  created_at: string;
  updated_at: string;
  created_by: string; // uuid
}

export type LiveUpdateInsert = Omit<LiveUpdateRow, "id" | "created_at" | "updated_at">;
export type LiveUpdateUpdate = Partial<Pick<LiveUpdateRow, "headline" | "content">>;
