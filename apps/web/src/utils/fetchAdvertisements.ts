import { supabase } from "@repo/api";
import type { Database } from "@repo/api";

export type AdData = Database["public"]["Tables"]["advertisements"]["Row"];

export async function fetchAdsForSlot(slotIdentifier: string): Promise<AdData | null> {
  try {
    // 1. Check global settings to see if ads are disabled
    const { data: settings } = await supabase
      .from("settings")
      .select("hide_all_ads")
      .eq("id", 1)
      .single();

    if (settings?.hide_all_ads) {
      return null;
    }

    // 2. Fetch ad for slot
    const { data, error } = await supabase.rpc("get_active_ad_for_slot", {
      p_slot: slotIdentifier
    });

    if (error) {
      return null;
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const rows = data as any[];
    if (rows && rows.length > 0) {
      return rows[0] as AdData;
    }

    return null;
  } catch {
    // Catch any unexpected exceptions from the Supabase client
    return null;
  }
}
