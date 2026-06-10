export interface BadgeRow {
  id: number;
  name: string;
  slug: string;
  color: string;
  created_at: string;
}

export type BadgeInsert = Omit<BadgeRow, "id" | "created_at">;
export type BadgeUpdate = Partial<BadgeInsert>;
