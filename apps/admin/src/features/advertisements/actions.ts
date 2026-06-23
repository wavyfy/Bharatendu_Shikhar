"use server";

import { createSupabaseServerClient, supabaseAdmin } from "@repo/api";
import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";
import { randomUUID } from "crypto";
import { getSettings } from "@/features/settings/queries";

/**
 * Authenticates the current request and retrieves the authenticated user.
 *
 * @returns A Supabase client bound to the current request and the authenticated user.
 * @throws Throws an error if the request is not authenticated.
 */
async function getAuth() {
  const cookieStore = await cookies();
  const supabase = createSupabaseServerClient({
    get: (name) => cookieStore.get(name)?.value,
    set: (name, value, options) => cookieStore.set(name, value, options),
    remove: (name, options) => cookieStore.delete({ name, ...options }),
  });

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Unauthorized");

  return { supabase, user };
}

/**
 * Creates a new advertisement with optional slot placements.
 *
 * Inserts an advertisement record and creates placement records for each selected
 * slot. Returns a warning if the advertisement is activated while global ads are
 * disabled in settings.
 *
 * @returns An object with `success: true` containing the created advertisement data,
 * or `success: false` with an error message. A `warning` field is included if the
 * advertisement is activated while global ad display is disabled.
 */
export async function createAdvertisementAction(formData: FormData) {
  const { user } = await getAuth();

  const title = formData.get("title") as string;
  const advertiser_name = formData.get("advertiser_name") as string;
  const advertiser_phone = formData.get("advertiser_phone") as string;
  const image_url = formData.get("image_url") as string;
  const redirect_url = formData.get("redirect_url") as string;
  const start_date = formData.get("start_date") as string;
  const end_date = formData.get("end_date") as string;
  const is_active = formData.get("is_active") === "true" || formData.get("is_active") === "on";

  const slot_identifiers = formData.getAll("slot_identifiers") as string[];

  const { data, error } = await supabaseAdmin
    .from("advertisements")
    .insert({
      title,
      advertiser_name,
      advertiser_phone: advertiser_phone || null,
      image_url,
      redirect_url: redirect_url || null,
      start_date: new Date(start_date).toISOString(),
      end_date: new Date(`${end_date}T23:59:59.999Z`).toISOString(),
      is_active,
      created_by: user.id,
    })
    .select()
    .single();

  if (error) {
    return { success: false, error: error.message };
  }

  if (slot_identifiers.length > 0) {
    const placementsToInsert = slot_identifiers.map(slot => ({
      advertisement_id: data.id,
      slot_identifier: slot
    }));
    
    const { error: placementError } = await supabaseAdmin
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      .from("advertisement_placements" as any)
      .insert(placementsToInsert);
      
    if (placementError) {
      // Best effort deletion of ad if placement fails, though might not strictly be needed if they are isolated.
      console.error("Failed to insert placements", placementError);
    }
  }

  revalidatePath("/advertisements");
  
  let warning;
  if (is_active) {
    const settings = await getSettings();
    if (settings?.hide_all_ads) {
      warning = "Ad activated, but ads are currently disabled globally in Settings.";
    }
  }

  return { success: true, data, warning };
}

/**
 * Updates an existing advertisement and replaces its placements.
 *
 * If the advertisement is activated while advertisements are globally disabled in settings, the response includes
 * a warning message.
 *
 * @returns A result object with `success: true` containing the updated advertisement data and optional `warning`,
 * or `success: false` with an error message if the operation fails.
 */
export async function updateAdvertisementAction(id: string, formData: FormData) {
  await getAuth();
  
  const title = formData.get("title") as string;
  const advertiser_name = formData.get("advertiser_name") as string;
  const advertiser_phone = formData.get("advertiser_phone") as string;
  const image_url = formData.get("image_url") as string;
  const redirect_url = formData.get("redirect_url") as string;
  const start_date = formData.get("start_date") as string;
  const end_date = formData.get("end_date") as string;
  const is_active = formData.get("is_active") === "true" || formData.get("is_active") === "on";

  const slot_identifiers = formData.getAll("slot_identifiers") as string[];

  const { data, error } = await supabaseAdmin
    .from("advertisements")
    .update({
      title,
      advertiser_name,
      advertiser_phone: advertiser_phone || null,
      image_url,
      redirect_url: redirect_url || null,
      start_date: new Date(start_date).toISOString(),
      end_date: new Date(`${end_date}T23:59:59.999Z`).toISOString(),
      is_active,
    })
    .eq("id", id)
    .select()
    .single();

  if (error) {
    return { success: false, error: error.message };
  }

  // Delete existing placements
  await supabaseAdmin
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    .from("advertisement_placements" as any)
    .delete()
    .eq("advertisement_id", id);

  // Insert new placements
  if (slot_identifiers.length > 0) {
    const placementsToInsert = slot_identifiers.map(slot => ({
      advertisement_id: id,
      slot_identifier: slot
    }));
    
    await supabaseAdmin
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      .from("advertisement_placements" as any)
      .insert(placementsToInsert);
  }

  revalidatePath("/advertisements");

  let warning;
  if (is_active) {
    const settings = await getSettings();
    if (settings?.hide_all_ads) {
      warning = "Ad activated, but ads are currently disabled globally in Settings.";
    }
  }

  return { success: true, data, warning };
}

/**
 * Deletes an advertisement by id.
 *
 * @param id - The advertisement id
 * @returns An object with `success: true` if deletion succeeded, or `success: false` with an error message if it failed
 */
export async function deleteAdvertisementAction(id: string) {
  await getAuth();
  const { error } = await supabaseAdmin.from("advertisements").delete().eq("id", id);
  if (error) {
    return { success: false, error: error.message };
  }
  revalidatePath("/advertisements");
  return { success: true };
}

/**
 * Updates the active status of an advertisement.
 *
 * @returns An object with `success` (true if the update succeeded). If successful and the ad is activated while ads are globally disabled, includes a `warning` message.
 */
export async function updateAdvertisementStatusAction(id: string, is_active: boolean) {
  await getAuth();
  const { error } = await supabaseAdmin.from("advertisements").update({ is_active }).eq("id", id);
  if (error) {
    return { success: false, error: error.message };
  }
  revalidatePath("/advertisements");

  let warning;
  if (is_active) {
    const settings = await getSettings();
    if (settings?.hide_all_ads) {
      warning = "Ad activated, but ads are currently disabled globally in Settings.";
    }
  }

  return { success: true, warning };
}

/**
 * Generates a signed upload URL for an advertisement image in Supabase Storage.
 *
 * @param fileExt - The file extension (e.g., "jpg", "png")
 * @returns A response object containing the signed URL, token, and storage path on success, or an error message on failure.
 */
export async function getAdvertisementUploadUrlAction(fileExt: string) {
  try {
    const { supabase, user } = await getAuth();
    const fileName = `${user.id}/${randomUUID()}.${fileExt}`;
    
    const { data, error } = await supabase.storage
      .from("advertisements")
      .createSignedUploadUrl(fileName);
      
    if (error) throw error;
    
    return { success: true, signedUrl: data.signedUrl, token: data.token, path: data.path };
  } catch (error: unknown) {
    console.error("Signed URL error:", error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : "Failed to generate upload URL" 
    };
  }
}

export async function deleteAdvertisementImageAction(url: string) {
  try {
    const { supabase } = await getAuth();
    if (!url) return { success: true }; 
    
    // URL format: https://[...]/storage/v1/object/public/advertisements/[user_id]/[file_name]
    const urlParts = new URL(url);
    const pathParts = urlParts.pathname.split("/");
    // Find 'advertisements' and get the rest
    const bucketIndex = pathParts.findIndex(p => p === "advertisements");
    if (bucketIndex === -1 || bucketIndex === pathParts.length - 1) throw new Error("Invalid URL format");
    
    const filePath = pathParts.slice(bucketIndex + 1).join("/");

    const { error } = await supabase.storage
      .from("advertisements")
      .remove([filePath]);

    if (error) throw error;

    return { success: true };
  } catch (error: unknown) {
    console.error("Delete error:", error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : "Failed to delete file" 
    };
  }
}

export type AdSlot = {
  id: string;
  name: string;
  type: 'fixed' | 'category' | 'region';
};

export async function getAdvertisementSlotsAction(startDate?: string, endDate?: string, excludeAdId?: string) {
  const { supabase } = await getAuth();
  
  // 1. Fetch Categories
  const { data: categories } = await supabase.from("categories").select("id, name");
  
  // 2. Fetch Regions
  const { data: regions } = await supabase.from("regions").select("id, name");
  
  const slots: AdSlot[] = [
    { id: "fixed:vertical_left", name: "Vertical Left Sidebar", type: "fixed" },
    { id: "fixed:vertical_right", name: "Vertical Right Sidebar", type: "fixed" },
    { id: "fixed:home_horizontal", name: "Home Middle (Below Featured)", type: "fixed" },
  ];
  
  if (categories) {
    categories.forEach(cat => {
      slots.push({ id: `category:${cat.id}`, name: `Topic: ${cat.name}`, type: "category" });
    });
  }
  
  if (regions) {
    regions.forEach(reg => {
      slots.push({ id: `region:${reg.id}`, name: `Region: ${reg.name}`, type: "region" });
    });
  }
  
  let occupiedIds: string[] = [];
  
  if (startDate && endDate) {
    try {
      console.log('Fetching occupied slots for:', startDate, endDate, excludeAdId);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const { data, error } = await supabaseAdmin.rpc("get_occupied_slots" as any, {
        p_start_date: new Date(startDate).toISOString(),
        p_end_date: new Date(endDate).toISOString(),
        p_exclude_ad_id: excludeAdId || null
      });
      
      console.log('RPC result:', data, error);
      if (!error && data) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        occupiedIds = data.map((r: any) => r.slot_identifier);
      }
    } catch (err) {
      console.error("Failed to fetch occupied slots", err);
    }
  }
  
  return { success: true, slots, occupiedIds };
}
