import { supabaseAdmin } from "@repo/api";
import type { AdvertisementRow } from "./types";

export async function getAdvertisements() {
  const { data, error } = await supabaseAdmin
    .from("advertisements")
    .select("*, advertisement_placements(slot_identifier)")
    .order("created_at", { ascending: false });

  if (error) throw error;
  return { advertisements: data as unknown as AdvertisementRow[] };
}

export async function getAdvertisementById(id: string) {
  const { data, error } = await supabaseAdmin
    .from("advertisements")
    .select("*, advertisement_placements(slot_identifier)")
    .eq("id", id)
    .single();

  if (error) {
    if (error.code === 'PGRST116') return { advertisement: null };
    throw error;
  }
  
  return { advertisement: data as unknown as AdvertisementRow };
}
