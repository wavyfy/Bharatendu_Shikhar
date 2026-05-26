import type { CategoryRow } from "@/features/articles/types";

export type CategoryInsert = Omit<CategoryRow, "id" | "created_at">;
export type CategoryUpdate = Partial<CategoryInsert>;

export type { CategoryRow };
