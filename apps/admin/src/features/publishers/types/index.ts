import { z } from "zod";

export const publisherSchema = z.object({
  full_name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters").optional().or(z.literal("")),
  is_active: z.boolean().default(true),
});

export type PublisherInput = z.infer<typeof publisherSchema>;

export type PublisherRow = {
  id: string;
  full_name: string;
  role: string;
  created_at: string;
  is_active: boolean;
};

export type PublisherWithAuth = PublisherRow & {
  email: string;
  article_count?: number;
};
