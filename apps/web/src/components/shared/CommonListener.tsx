"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@repo/api";

export function CommonListener({ 
  currentMaintenanceMode,
  currentHideAllAds
}: { 
  currentMaintenanceMode: boolean;
  currentHideAllAds?: boolean;
}) {
  const router = useRouter();

  useEffect(() => {
    // We poll the settings table every 10 seconds to check if maintenance mode or ad settings have changed.
    const interval = setInterval(async () => {
      const { data, error } = await supabase
        .from("settings")
        .select("maintenance_mode, hide_all_ads")
        .eq("id", 1)
        .single();
        
      if (!error && data) {
        if (
          Boolean(data.maintenance_mode) !== Boolean(currentMaintenanceMode) ||
          Boolean(data.hide_all_ads) !== Boolean(currentHideAllAds)
        ) {
          // Status changed! Refresh the page to show/hide the maintenance screen or ads.
          router.refresh();
        }
      }
    }, 10000); // 10 seconds

    return () => clearInterval(interval);
  }, [currentMaintenanceMode, currentHideAllAds, router]);

  return null;
}
