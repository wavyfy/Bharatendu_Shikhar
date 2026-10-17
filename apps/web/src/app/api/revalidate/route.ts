import { revalidateTag } from "next/cache";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const expectedSecret = process.env.REVALIDATION_SECRET;
    if (!expectedSecret) {
      console.error("[Revalidate API] REVALIDATION_SECRET is not configured");
      return NextResponse.json({ message: "Revalidation is not configured" }, { status: 500 });
    }

    const { tags, secret } = await request.json();

    // Verify secret to prevent unauthorized cache purges
    if (secret !== expectedSecret) {
      console.warn("[Revalidate API] Rejected request with invalid secret");
      return NextResponse.json({ message: "Invalid secret" }, { status: 401 });
    }

    if (!Array.isArray(tags) || tags.length === 0 || !tags.every((tag) => typeof tag === "string" && tag.length > 0)) {
      return NextResponse.json({ message: "Missing or invalid tags array" }, { status: 400 });
    }

    // Next.js 16: "max" marks tagged entries stale (stale-while-revalidate on next visit)
    for (const tag of tags as string[]) {
      revalidateTag(tag, "max");
      console.log(`[Revalidate API] Revalidated tag: ${tag}`);
    }

    return NextResponse.json({ revalidated: true, tags, now: Date.now() });
  } catch (err) {
    console.error("[Revalidate API] Error:", err);
    return NextResponse.json({ message: "Error revalidating" }, { status: 500 });
  }
}
