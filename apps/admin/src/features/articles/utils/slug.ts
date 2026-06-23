/**
 * Generates a URL-safe slug from any input text, with support for Unicode scripts.
 *
 * Falls back to a timestamp-based slug if the result is empty (e.g., input contains only punctuation or whitespace).
 *
 * @returns A lowercase slug containing Unicode letters, digits, and single hyphens, or `item-${timestamp}` if the slug is empty
 */
export function generateSlug(text: string): string {
  const slug = text
    .trim()
    .replace(/\s+/g, "-")
    .replace(/[^\p{L}\p{N}-]/gu, "")
    .replace(/-{2,}/g, "-")
    .replace(/^-+|-+$/g, "")
    .toLowerCase();

  return slug || `item-${Date.now()}`;
}

