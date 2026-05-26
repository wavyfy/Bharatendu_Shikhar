export function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .trim()
    // Replace spaces and special characters with hyphens
    .replace(/[\s\W-]+/g, "-")
    // Remove leading/trailing hyphens
    .replace(/^-+|-+$/g, "");
}
