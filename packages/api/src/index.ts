// Supabase clients
export { supabase } from "./supabase/client";
export { createSupabaseServerClient } from "./supabase/server";
export { createSupabaseMiddlewareClient, updateSession } from "./supabase/middleware";
export { supabaseAdmin } from "./supabase/admin";

// Types
export type { Database, Tables, TablesInsert, TablesUpdate, Enums } from "./types/database.types";