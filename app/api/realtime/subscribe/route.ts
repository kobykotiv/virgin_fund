import { NextRequest, NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabaseAdmin";
import { verifySessionToken } from "@/lib/session";

/**
 * Server-Sent Events endpoint that forwards Supabase Postgres realtime events
 * for the authenticated user to the client.
 *
 * GET /api/realtime/subscribe
 *
 * - Reads vf_session cookie and verifies session via lib/session.verifySessionToken
 * - Subscribes server-side to `bots` and `portfolio` Postgres changes filtered by user_id
 * - Streams events to the client as SSE (event names: "bots", "portfolio")
 *
 * Notes:
 * - This implementation uses ReadableStream and NextResponse streaming.
 * - The Supabase channel is unsubscribed when the client disconnects (request abort).
 */

export const runtime = "nodejs";

function parseCookie(header: string | null) {
  if (!header) return {};
  return Object.fromEntries(
    header
      .split(";")
      .map((p) => p.trim())
      .map((p) => {
        const idx = p.indexOf("=");
        if (idx === -1) return [p, ""];
        return [p.slice(0, idx), decodeURIComponent(p.slice(idx + 1))];
      })
  );
}

export async function GET(req: NextRequest) {
  try {
    const cookieHeader = req.headers.get("cookie");
    const cookies = parseCookie(cookieHeader);
    const sessionToken = cookies["vf_session"] || cookies["SESSION"] || null;
    const session = await verifySessionToken(sessionToken as string);
    if (!session || (session as any).expired) {
      return new NextResponse(JSON.stringify({ error: "Unauthorized" }), { status: 401 });
    }

    const userId = (session as any).user_id;
    const supabase = getSupabaseAdmin();

    const headers = new Headers({
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache, no-transform",
      Connection: "keep-alive",
    });

    const stream = new ReadableStream({
      async start(controller) {
        const encoder = new TextEncoder();
        const send = (payload: string) => controller.enqueue(encoder.encode(payload));

        // Send a connected event immediately
        send(`event: connected\ndata: ${JSON.stringify({ ok: true })}\n\n`);

        // Create a unique channel name per user/session
        const channelName = `server-realtime-${userId}-${Date.now()}`;

        // Subscribe to bots changes for this user
        const botsListener = supabase
          .channel(channelName)
          .on(
            "postgres_changes",
            { event: "*", schema: "public", table: "bots", filter: `user_id=eq.${userId}` },
            (payload) => {
              try {
                send(`event: bots\ndata: ${JSON.stringify(payload)}\n\n`);
              } catch (e) {
                // ignore
              }
            }
          )
          .on(
            "postgres_changes",
            { event: "*", schema: "public", table: "portfolio", filter: `user_id=eq.${userId}` },
            (payload) => {
              try {
                send(`event: portfolio\ndata: ${JSON.stringify(payload)}\n\n`);
              } catch (e) {
                // ignore
              }
            }
          );

        // Subscribe
        try {
          await botsListener.subscribe();
        } catch (e) {
          console.warn("realtime subscribe error", e);
          send(`event: error\ndata: ${JSON.stringify({ error: "subscribe_failed" })}\n\n`);
        }

        const cleanup = async () => {
          try {
            await botsListener.unsubscribe();
          } catch (e) {
            // ignore
          }
          try {
            controller.close();
          } catch (e) {
            // ignore
          }
        };

        // When client disconnects (abort), cleanup subscription
        req.signal.addEventListener("abort", () => {
          cleanup();
        });
      },
      cancel() {
        // noop
      },
    });

    return new NextResponse(stream, { headers });
  } catch (err) {
    console.error("realtime subscribe error", err);
    return new NextResponse(JSON.stringify({ error: "Internal server error" }), { status: 500 });
  }
}
