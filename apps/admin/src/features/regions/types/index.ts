import type { RegionRow } from "@/features/articles/types";

export type RegionInsert = Omit<RegionRow, "id" | "created_at">;
export type RegionUpdate = Partial<RegionInsert>;

export type { RegionRow };
