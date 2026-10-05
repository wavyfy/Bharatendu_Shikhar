import { cache } from "react";
import { unstable_cache } from "next/cache";
import { supabase } from "@repo/api";
import type { Database } from "@repo/api";
import { fetchSettings } from "@/utils/fetchData";

export type AdData = Database["public"]["Tables"]["advertisements"]["Row"];

const IS_DEV = process.env.NODE_ENV === "development";

async function _fetchAdsForSlot(slotIdentifier: string): Promise<AdData | null> {
  try {
    // 1. Check global settings to see if ads are disabled
    const settings = await fetchSettings();

    if (settings?.hide_all_ads) {
      return null;
    }

    // 2. Fetch ad for slot
    const { data, error } = await supabase.rpc("get_active_ad_for_slot", {
      p_slot: slotIdentifier,
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

export const fetchAdsForSlot = cache((slotIdentifier: string) => {
  if (IS_DEV) {
    return _fetchAdsForSlot(slotIdentifier);
  }
  return unstable_cache(
    () => _fetchAdsForSlot(slotIdentifier),
    [`fetchAdsForSlot-${slotIdentifier}`],
    { tags: ["advertisements"], revalidate: 60 }
  )();
});

