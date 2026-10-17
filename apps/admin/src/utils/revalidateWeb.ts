import { after } from "next/server";

const IS_PRODUCTION = process.env.NODE_ENV === "production";
const REQUEST_TIMEOUT_MS = 10_000;

/**
 * Sends a request to the web application's revalidate API to bust the Next.js Data Cache.
 * Called from Server Actions: the request runs via `after()`, so it completes after the
 * action responds (kept alive with waitUntil on Vercel) instead of being a dropped promise.
 * @param tags The cache tags to invalidate (e.g., 'articles', 'categories', 'settings')
 */
export function revalidateWeb(tags: string[]) {
  // In production both values must come from the deployment environment; never fall back to dev defaults
  const webUrl = process.env.NEXT_PUBLIC_WEB_URL || (IS_PRODUCTION ? undefined : "http://localhost:3000");
  const secret = process.env.REVALIDATION_SECRET || (IS_PRODUCTION ? undefined : "default_development_secret");

  if (!webUrl || !secret) {
    console.error(
      `[RevalidateWeb] Skipped revalidating tags: ${tags.join(", ")} - missing ${!webUrl ? "NEXT_PUBLIC_WEB_URL" : "REVALIDATION_SECRET"}`
    );
    return;
  }

  after(async () => {
    try {
      const res = await fetch(`${webUrl.replace(/\/$/, "")}/api/revalidate`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ tags, secret }),
        signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS),
      });

      if (!res.ok) {
        const body = await res.text().catch(() => "");
        console.error(`[RevalidateWeb] Failed to revalidate tags: ${tags.join(", ")} - Status: ${res.status} ${body}`);
      } else {
        console.log(`[RevalidateWeb] Successfully pinged web app to revalidate tags: ${tags.join(", ")}`);
      }
    } catch (error) {
      console.error(`[RevalidateWeb] Network error while revalidating tags: ${tags.join(", ")} at ${webUrl}:`, error);
    }
  });
}
