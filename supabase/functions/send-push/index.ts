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

Deno.cron("Process Scheduled Push Notifications", "* * * * *", async () => {
  console.log("Running scheduled push notification check...");
  const supabaseUrl = Deno.env.get("SUPABASE_URL") ?? "";
  const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "";
  
  if (!supabaseUrl || !supabaseServiceKey) {
    console.error("Missing Supabase environment variables for cron");
    return;
  }

  const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey);

  // Fetch articles due for push
  const { data: articles, error: articlesError } = await supabaseAdmin
    .from("articles")
    .select("id, title, excerpt, slug")
    .lte("push_due_at", new Date().toISOString())
    .is("push_sent_at", null);

  if (articlesError) {
    console.error("Failed to fetch due articles:", articlesError);
    return;
  }

  if (!articles || articles.length === 0) {
    console.log("No scheduled push notifications found.");
    return;
  }

  // Fetch device tokens
  const { data: rows, error: tokenError } = await supabaseAdmin.from("device_tokens").select("token");
  if (tokenError) {
    console.error("Failed to fetch device tokens:", tokenError);
    return;
  }

  const tokens = (rows ?? []).map((r: any) => r.token).filter(Boolean);
  if (tokens.length === 0) {
    console.log("No device tokens registered, skipping pushes.");
    return;
  }

  const expo = new Expo();
  const validTokens = tokens.filter((t: string) => Expo.isExpoPushToken(t));
  
  if (validTokens.length === 0) {
    console.log("No valid expo tokens found, skipping pushes.");
    return;
  }

  for (const article of articles) {
    console.log(`Sending push for article ${article.id}`);
    
    const messages = validTokens.map((to: string) => ({
      to,
      sound: "default",
      title: article.title,
      body: article.excerpt || "Tap to read the full article.",
      data: { article_id: article.id, article_slug: article.slug },
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

    const invalidTokens: string[] = [];
    tickets.forEach((ticket: any, idx) => {
      if (ticket.status !== "ok" && ticket.details && ticket.details.error === "DeviceNotRegistered") {
        invalidTokens.push(validTokens[idx]);
      }
    });

    if (invalidTokens.length > 0) {
      await supabaseAdmin.from("device_tokens").delete().in("token", invalidTokens);
    }

    // Mark as sent
    await supabaseAdmin
      .from("articles")
      .update({ push_sent_at: new Date().toISOString() })
      .eq("id", article.id);
  }
});
