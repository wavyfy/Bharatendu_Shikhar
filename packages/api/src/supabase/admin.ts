import { createClient } from "@supabase/supabase-js";
import type { Database } from "../types/database.types";

/**
 * Supabase admin client with service_role key.
 * Bypasses RLS. Server-only - NEVER expose to client.
 * Use for: seeding, migrations, admin ops, webhooks.
 */
export const supabaseAdmin = createClient<Database>(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  }
);
