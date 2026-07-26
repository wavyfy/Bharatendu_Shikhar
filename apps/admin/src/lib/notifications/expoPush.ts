import Expo, { type ExpoPushMessage } from "expo-server-sdk";

const expo = new Expo({ accessToken: process.env.EXPO_ACCESS_TOKEN });

export interface PushPayload {
  title: string;
  body: string;
  data?: Record<string, unknown>;
}

export interface PushResult {
  sent: number;
  failed: number;
  invalidTokens: string[];
  errors?: string[];
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
  let sent = 0;
  let failed = 0;
  const invalidTokens: string[] = [];
  const errorMessages: string[] = [];

  for (const chunk of chunks) {
    try {
      const tickets = await expo.sendPushNotificationsAsync(chunk);
      tickets.forEach((ticket, i) => {
        const token = chunk[i].to as string;
        if (ticket.status === "ok") {
          sent++;
        } else {
          failed++;
          const details = (ticket as { details?: { error?: string } }).details;
          const msg = (ticket as { message?: string }).message;
          if (details?.error === "DeviceNotRegistered") {
            invalidTokens.push(token);
          }
          if (msg) errorMessages.push(msg);
          console.error("[expoPush] Ticket error:", msg);
        }
      });
    } catch (err: unknown) {
      console.error("[expoPush] Chunk send error:", err);
      const errorMessage = err instanceof Error ? err.message : String(err);
      errorMessages.push(errorMessage);
      failed += chunk.length; // Count the whole chunk as failed
    }
  }

  console.log(`[expoPush] Sent: ${sent}, Failed: ${failed}, Invalid: ${invalidTokens.length}`);
  return { sent, failed, invalidTokens, errors: errorMessages };
}
