import { createServerClient } from "@supabase/ssr";
import type { NextRequest, NextResponse } from "next/server";
import type { Database } from "../types/database.types";

/**
 * Supabase client for use in Next.js proxy.ts (middleware).
 * Refreshes auth session by reading + writing cookies on the response.
 * Call updateSession() in your proxy to keep sessions alive.
 */
export function createSupabaseMiddlewareClient(
  request: NextRequest,
  response: NextResponse
) {
  return createServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          for (const { name, value } of cookiesToSet) {
            request.cookies.set(name, value);
          }
          for (const { name, value, options } of cookiesToSet) {
            response.cookies.set(name, value, options);
          }
        },
      },
    }
  );
}

/**
 * Call in proxy.ts to refresh expiring sessions.
 * Returns updated response with refreshed cookies.
 */
export async function updateSession(
  request: NextRequest,
  response: NextResponse
): Promise<NextResponse> {
  const supabase = createSupabaseMiddlewareClient(request, response);
  // Refresh session - required for Server Components
  await supabase.auth.getUser();
  return response;
}
