import { z } from "zod";

export const createLiveUpdateSchema = z.object({
  headline: z.string().min(3, "Headline must be at least 3 characters"),
  content: z.string().min(5, "Content must be at least 5 characters"),
});

export const updateLiveUpdateSchema = createLiveUpdateSchema.partial();

export type CreateLiveUpdateInput = z.infer<typeof createLiveUpdateSchema>;
export type UpdateLiveUpdateInput = z.infer<typeof updateLiveUpdateSchema>;
