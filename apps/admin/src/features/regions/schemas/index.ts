import { z } from "zod";

export const regionSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters long"),
});

export const createRegionSchema = regionSchema;
export const updateRegionSchema = regionSchema.partial();

export type CreateRegionInput = z.infer<typeof createRegionSchema>;
export type UpdateRegionInput = z.infer<typeof updateRegionSchema>;
