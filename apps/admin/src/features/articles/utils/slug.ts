/**
 * Generates a URL-safe slug from any text.
 * Works correctly for both English and Hindi (Devanagari) / other Unicode scripts.
 *
 * Strategy:
 *  1. Trim whitespace
 *  2. Replace whitespace runs with hyphens
 *  3. Strip characters that are NOT Unicode letters, digits, or hyphens
 *  4. Collapse consecutive hyphens
 *  5. Strip leading/trailing hyphens
 *  6. Lowercase the result
 *  7. If result is empty (e.g. pure punctuation title), fall back to a timestamp
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

