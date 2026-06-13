import { revalidateTag } from "next/cache";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const { tags, secret } = await request.json();

    // Verify secret to prevent unauthorized cache purges
    if (secret !== process.env.REVALIDATION_SECRET) {
      return NextResponse.json({ message: "Invalid secret" }, { status: 401 });
    }

    if (!tags || !Array.isArray(tags)) {
      return NextResponse.json({ message: "Missing or invalid tags array" }, { status: 400 });
    }

    // Revalidate each requested tag
    tags.forEach(tag => {
      // @ts-expect-error Next.js 15 types incorrectly require a second argument
      revalidateTag(tag);
      console.log(`[Revalidate API] Revalidated tag: ${tag}`);
    });

    return NextResponse.json({ revalidated: true, now: Date.now() });
  } catch (err) {
    console.error("[Revalidate API] Error:", err);
    return NextResponse.json({ message: "Error revalidating" }, { status: 500 });
  }
}
