import Expo, { type ExpoPushMessage, type ExpoPushTicket } from "expo-server-sdk";

const expo = new Expo();

export interface PushPayload {
  title: string;
  body: string;
  data?: Record<string, unknown>;
}

export interface PushResult {
  sent: number;
  failed: number;
  invalidTokens: string[];
}

/**
 * Send a push notification to a list of Expo push tokens.
 * Returns counts of sent/failed messages and any tokens marked invalid by Expo.
 */
export async function sendExpoPushNotifications(
  tokens: string[],
  payload: PushPayload
): Promise<PushResult> {
  const validTokens = tokens.filter((t) => Expo.isExpoPushToken(t));
  const skipped = tokens.length - validTokens.length;

  if (skipped > 0) {
    console.warn(`[expoPush] Skipped ${skipped} invalid-format tokens.`);
  }

  if (validTokens.length === 0) {
    return { sent: 0, failed: 0, invalidTokens: [] };
  }

  // Build messages
  const messages: ExpoPushMessage[] = validTokens.map((to) => ({
    to,
    title: payload.title,
    body: payload.body,
    data: payload.data ?? {},
    sound: "default",
  }));

  // Chunk & send
  const chunks = expo.chunkPushNotifications(messages);
  const ticketSets: ExpoPushTicket[][] = [];

  for (const chunk of chunks) {
    try {
      const tickets = await expo.sendPushNotificationsAsync(chunk);
      ticketSets.push(tickets);
    } catch (err) {
      console.error("[expoPush] Chunk send error:", err);
    }
  }

  // Inspect tickets for errors
  const allTickets = ticketSets.flat();
  let sent = 0;
  let failed = 0;
  const invalidTokens: string[] = [];

  allTickets.forEach((ticket, idx) => {
    if (ticket.status === "ok") {
      sent++;
    } else {
      failed++;
      const details = (ticket as { details?: { error?: string } }).details;
      if (details?.error === "DeviceNotRegistered") {
        // Map ticket index back to the token
        const token = validTokens[idx];
        if (token) invalidTokens.push(token);
      }
      console.error("[expoPush] Ticket error:", (ticket as { message?: string }).message);
    }
  });

  console.log(`[expoPush] Sent: ${sent}, Failed: ${failed}, Invalid: ${invalidTokens.length}`);
  return { sent, failed, invalidTokens };
}
