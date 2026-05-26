import { RegionRow } from "@/features/regions/types";

export interface EpaperRow {
  id: number;
  title: string;
  pdf_url: string;
  thumbnail_url: string | null;
  region_id: number | null;
  author_id: string; // uuid
  published_at: string | null;
  expiry_date: string | null;
  created_at: string;
  updated_at: string;
}

export interface EpaperWithRelations extends EpaperRow {
  region?: Pick<RegionRow, "id" | "name" | "slug"> | null;
  author?: {
    id: string;
    full_name: string | null;
  } | null;
}

export type EpaperInsert = Omit<EpaperRow, "id" | "created_at" | "updated_at">;

export type EpaperUpdate = Partial<EpaperInsert>;
