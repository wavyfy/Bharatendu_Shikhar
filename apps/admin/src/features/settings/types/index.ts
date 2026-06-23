export type SettingsRow = {
  id: number;
  // Site Info
  site_name: string;
  site_url: string;
  site_tagline: string | null;
  site_logo_url: string | null;
  site_logo_dark_url: string | null;
  favicon_url: string | null;
  // SEO
  meta_title: string | null;
  meta_description: string | null;
  meta_keywords: string | null;
  og_image_url: string;
  // Social
  facebook_url: string | null;
  twitter_url: string | null;
  instagram_url: string | null;
  youtube_url: string | null;
  linkedin_url: string | null;
  // Contact
  contact_email: string | null;
  contact_phone: string | null;
  contact_address: string | null;
  // Notifications
  notify_on_new_article: boolean;
  notify_email: string | null;
  // Homepage
  hero_title: string | null;
  hero_subtitle: string | null;
  featured_articles_count: number;
  // Maintenance
  maintenance_mode: boolean;
  maintenance_message: string | null;
  // Timestamps
  updated_at: string;
  // Advertisements
  hide_all_ads: boolean;
  // Legal & Policies
  copyright_text: string | null;
  about_us: string | null;
  privacy_policy: string | null;
  terms_conditions: string | null;
  editorial_policy: string | null;
  correction_policy: string | null;
};
