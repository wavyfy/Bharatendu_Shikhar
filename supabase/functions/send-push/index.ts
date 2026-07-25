// @ts-nocheck
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { Expo } from "npm:expo-server-sdk";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const { title, body, data } = await req.json();

    const supabaseUrl = Deno.env.get("SUPABASE_URL") ?? "";
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "";
    
    if (!supabaseUrl || !supabaseServiceKey) {
      throw new Error("Missing Supabase environment variables");
    }

    const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey);

    const { data: rows, error } = await supabaseAdmin.from("device_tokens").select("token");
    if (error) {
      throw error;
    }

    const tokens = (rows ?? []).map((r: any) => r.token).filter(Boolean);
    if (tokens.length === 0) {
      return new Response(JSON.stringify({ success: true, sent: 0, failed: 0, message: "No tokens found" }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const expo = new Expo();
    const validTokens = tokens.filter((t: string) => Expo.isExpoPushToken(t));
    
    if (validTokens.length === 0) {
      return new Response(JSON.stringify({ success: true, sent: 0, failed: 0, message: "No valid expo tokens found" }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const messages = validTokens.map((to: string) => ({
      to,
      sound: "default",
      title,
      body,
      data: data || {},
    }));

    const chunks = expo.chunkPushNotifications(messages);
    const tickets = [];

    for (const chunk of chunks) {
      try {
        const ticketChunk = await expo.sendPushNotificationsAsync(chunk);
        tickets.push(...ticketChunk);
      } catch (err) {
        console.error("Chunk send error:", err);
      }
    }

    let sent = 0;
    let failed = 0;
    const invalidTokens: string[] = [];

    tickets.forEach((ticket: any, idx) => {
      if (ticket.status === "ok") {
        sent++;
      } else {
        failed++;
        if (ticket.details && ticket.details.error === "DeviceNotRegistered") {
          invalidTokens.push(validTokens[idx]);
        }
      }
    });

    if (invalidTokens.length > 0) {
      await supabaseAdmin.from("device_tokens").delete().in("token", invalidTokens);
    }

    return new Response(JSON.stringify({ success: true, sent, failed, invalidTokens: invalidTokens.length }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error: any) {
    console.error("Error sending push notification:", error);
    return new Response(JSON.stringify({ success: false, error: error.message }), {
      status: 400,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
