import { z } from "zod";

const urlOrEmpty = z.string().url("Must be a valid URL").or(z.literal("")).optional().nullable();

export const siteInfoSchema = z.object({
  site_name: z.string().min(1, "Site name is required").max(100),
  site_tagline: z.string().max(200).optional().nullable(),
  site_logo_url: urlOrEmpty,
  favicon_url: urlOrEmpty,
});

export const seoSchema = z.object({
  meta_title: z.string().max(70).optional().nullable(),
  meta_description: z.string().max(160).optional().nullable(),
  meta_keywords: z.string().max(500).optional().nullable(),
  og_image_url: urlOrEmpty,
});

export const socialSchema = z.object({
  facebook_url: urlOrEmpty,
  twitter_url: urlOrEmpty,
  instagram_url: urlOrEmpty,
  youtube_url: urlOrEmpty,
  linkedin_url: urlOrEmpty,
});

export const contactSchema = z.object({
  contact_email: z.string().email("Invalid email").or(z.literal("")).optional().nullable(),
  contact_phone: z.string().max(20).optional().nullable(),
  contact_address: z.string().max(500).optional().nullable(),
});

export const notificationsSchema = z.object({
  notify_on_new_article: z.boolean().default(false),
  notify_email: z.string().email("Invalid email").or(z.literal("")).optional().nullable(),
});

export const homepageSchema = z.object({
  hero_title: z.string().max(200).optional().nullable(),
  hero_subtitle: z.string().max(500).optional().nullable(),
  featured_articles_count: z.coerce.number().int().min(1).max(20).default(6),
});

export const maintenanceSchema = z.object({
  maintenance_mode: z.boolean().default(false),
  maintenance_message: z.string().max(500).optional().nullable(),
});

// Combined full settings schema
export const settingsSchema = siteInfoSchema
  .merge(seoSchema)
  .merge(socialSchema)
  .merge(contactSchema)
  .merge(notificationsSchema)
  .merge(homepageSchema)
  .merge(maintenanceSchema);

export type SettingsInput = z.infer<typeof settingsSchema>;
export type SiteInfoInput = z.infer<typeof siteInfoSchema>;
export type SeoInput = z.infer<typeof seoSchema>;
export type SocialInput = z.infer<typeof socialSchema>;
export type ContactInput = z.infer<typeof contactSchema>;
export type NotificationsInput = z.infer<typeof notificationsSchema>;
export type HomepageInput = z.infer<typeof homepageSchema>;
export type MaintenanceInput = z.infer<typeof maintenanceSchema>;
