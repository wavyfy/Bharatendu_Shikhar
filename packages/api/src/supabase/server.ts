import { createServerClient } from "@supabase/ssr";
import type { CookieOptions } from "@supabase/ssr";
import type { Database } from "../types/database.types";

type CookieMethods = {
  get: (name: string) => string | undefined;
  set: (name: string, value: string, options: CookieOptions) => void;
  remove: (name: string, options: CookieOptions) => void;
};

/**
 * Server-side Supabase client for Next.js App Router.
 * Pass cookie methods from next/headers or middleware.
 * Uses anon key - respects RLS.
 */
export function createSupabaseServerClient(cookies: CookieMethods) {
  return createServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    { cookies }
  );
}
