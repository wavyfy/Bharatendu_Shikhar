export type ArticleStatus = "draft" | "published";

export interface CategoryRow {
  id: number;
  name: string;
  slug: string;
  created_at: string;
}

export interface RegionRow {
  id: number;
  name: string;
  slug: string;
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
}

export type ArticleInsert = Omit<ArticleRow, "id" | "created_at" | "updated_at">;

export type ArticleUpdate = Partial<ArticleInsert>;
