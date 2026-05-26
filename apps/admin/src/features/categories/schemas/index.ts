import { z } from "zod";

export const categorySchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters long"),
});

export const createCategorySchema = categorySchema;
export const updateCategorySchema = categorySchema.partial();

export type CreateCategoryInput = z.infer<typeof createCategorySchema>;
export type UpdateCategoryInput = z.infer<typeof updateCategorySchema>;
