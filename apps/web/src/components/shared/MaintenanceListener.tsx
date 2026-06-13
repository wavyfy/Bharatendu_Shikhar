"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@repo/api";

export function MaintenanceListener({ currentMaintenanceMode }: { currentMaintenanceMode: boolean }) {
  const router = useRouter();

  useEffect(() => {
    // We poll the settings table every 10 seconds to check if maintenance mode has changed.
    // This ensures that if an admin enables/disables maintenance mode, all active users
    // are automatically refreshed to see or remove the maintenance overlay.
    const interval = setInterval(async () => {
      const { data, error } = await supabase
        .from("settings")
        .select("maintenance_mode")
        .eq("id", 1)
        .single();
        
      if (!error && data) {
        if (Boolean(data.maintenance_mode) !== Boolean(currentMaintenanceMode)) {
          // Status changed! Refresh the page to show/hide the maintenance screen.
          router.refresh();
        }
      }
    }, 10000); // 10 seconds

    return () => clearInterval(interval);
  }, [currentMaintenanceMode, router]);

  return null;
}
