/**
 * Constructs a normalized site URL from multiple fallback sources.
 *
 * @param settingsSiteUrl - Optional site URL override. Falls back to `NEXT_PUBLIC_SITE_URL` environment variable, then to a default.
 * @returns A normalized `URL` instance representing the site's base URL.
 */
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
