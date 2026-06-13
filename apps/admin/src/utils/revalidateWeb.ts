/**
 * Sends a request to the web application's revalidate API to bust the Next.js Data Cache.
 * @param tags The cache tags to invalidate (e.g., 'articles', 'categories', 'settings')
 */
export async function revalidateWeb(tags: string[]) {
  // During local development, the web app usually runs on port 3000
  const webUrl = process.env.NEXT_PUBLIC_WEB_URL || "http://localhost:3000";
  const secret = process.env.REVALIDATION_SECRET || "default_development_secret";

  try {
    const res = await fetch(`${webUrl}/api/revalidate`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ tags, secret }),
    });

    if (!res.ok) {
      console.error(`[RevalidateWeb] Failed to revalidate tags: ${tags.join(", ")} - Status: ${res.status}`);
    } else {
      console.log(`[RevalidateWeb] Successfully pinged web app to revalidate tags: ${tags.join(", ")}`);
    }
  } catch (error) {
    console.error("[RevalidateWeb] Network error while revalidating web app:", error);
  }
}
