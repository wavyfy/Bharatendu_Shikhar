import { z } from "zod";

export const articleSchema = z.object({
  title: z.string().min(5, "Title must be at least 5 characters long"),
  excerpt: z.string().optional().nullable(),
  content: z.string().optional().nullable(),
  featured_image: z.string().url("Must be a valid URL").optional().nullable().or(z.literal("")),
  status: z.enum(["draft", "published"]),
  is_live: z.boolean().default(false),
  category_id: z.coerce.number().positive("Select a valid category").optional().nullable(),
  region_id: z.coerce.number().positive("Select a valid region").optional().nullable(),
});

export const createArticleSchema = articleSchema;
export const updateArticleSchema = articleSchema.partial();

export type CreateArticleInput = z.infer<typeof createArticleSchema>;
export type UpdateArticleInput = z.infer<typeof updateArticleSchema>;
