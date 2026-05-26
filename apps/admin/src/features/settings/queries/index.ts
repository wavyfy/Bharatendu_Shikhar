import { supabaseAdmin } from "@repo/api";
import type { SettingsRow } from "../types";

/**
 * Returns the single global settings row (id = 1).
 * Uses supabaseAdmin to bypass RLS — call only from server components/actions.
 */
export async function getSettings(): Promise<SettingsRow | null> {
  const { data, error } = await supabaseAdmin
    .from("settings" as never)
    .select("*")
    .eq("id", 1)
    .single();

  if (error) {
    console.error("Error fetching settings:", error.message);
    return null;
  }

  return data as SettingsRow;
}
