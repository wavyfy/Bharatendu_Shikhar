export function getSiteUrl(settingsSiteUrl?: string | null): URL {
  let url = settingsSiteUrl || process.env.NEXT_PUBLIC_SITE_URL || "https://www.bhartendushikhar.com";
  // Ensure it starts with http/https
  if (!url.startsWith("http")) {
    url = `https://${url}`;
  }
  // Ensure it has no trailing slash for consistency
  url = url.replace(/\/$/, "");
  
  // Enforce www for the main domain
  if (url === "https://bhartendushikhar.com" || url === "http://bhartendushikhar.com") {
    url = url.replace("bhartendushikhar.com", "www.bhartendushikhar.com");
  }

  return new URL(url);
}

export function getSiteUrlString(settingsSiteUrl?: string | null): string {
  return getSiteUrl(settingsSiteUrl).origin;
}

export function getAbsoluteImageUrl(imagePath?: string | null, fallbackUrl?: string | null): string | null {
  if (!imagePath || imagePath.trim() === "") {
    return fallbackUrl || null;
  }
  if (imagePath.startsWith("http://") || imagePath.startsWith("https://")) {
    return imagePath;
  }
  const supabaseUrl = (process.env.NEXT_PUBLIC_SUPABASE_URL || "").replace(/\/$/, "");
  if (imagePath.startsWith("/")) {
    return `${supabaseUrl}${imagePath}`;
  }
  return `${supabaseUrl}/storage/v1/object/public/${imagePath}`;
}
