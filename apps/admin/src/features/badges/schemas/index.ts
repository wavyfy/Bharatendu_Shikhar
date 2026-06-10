import { z } from "zod";

export const badgeSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters long"),
  color: z
    .string()
    .min(4, "Color is required")
    .regex(/^#[0-9A-Fa-f]{3,8}$/, "Must be a valid hex color"),
});

export const createBadgeSchema = badgeSchema;
export const updateBadgeSchema = badgeSchema.partial();

export type CreateBadgeInput = z.infer<typeof createBadgeSchema>;
export type UpdateBadgeInput = z.infer<typeof updateBadgeSchema>;
