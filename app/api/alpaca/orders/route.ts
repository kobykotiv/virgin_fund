import { NextResponse, NextRequest } from "next/server";
import { getAlpacaCredentialsForUser, getUserFromRequest } from "@/lib/alpacaServer";
import { getSupabaseAdmin } from "@/lib/supabaseAdmin";

const DEFAULT_BASE = process.env.ALPACA_BASE_URL || "https://paper-api.alpaca.markets";

export async function POST(req: NextRequest) {
  const userId = await getUserFromRequest(req);
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const creds = await getAlpacaCredentialsForUser(userId);
  if (!creds) return NextResponse.json({ error: "No Alpaca credentials" }, { status: 404 });

  let body: any;
  try {
    body = await req.json();
  } catch (e) {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  // minimal validation
  const { symbol, qty, side, type = "market", time_in_force = "gtc", limit_price, client_order_id } = body;
  if (!symbol || !qty || !side) return NextResponse.json({ error: "Missing required fields" }, { status: 400 });

  const base = (creds.meta?.base_url as string) ?? DEFAULT_BASE;
  try {
    const res = await fetch(`${base}/v2/orders`, {
      method: "POST",
      headers: {
        "APCA-API-KEY-ID": creds.key,
        "APCA-API-SECRET-KEY": creds.secret,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        symbol,
        qty,
        side,
        type,
        time_in_force,
        limit_price,
        client_order_id,
      }),
    });

    const json = await res.json();
    if (!res.ok) {
      return NextResponse.json({ error: "Alpaca order failed", details: json }, { status: res.status });
    }

    // Persist order logs to DB (best-effort; do not fail the request if persistence fails)
    try {
      const supabase = getSupabaseAdmin();
      // Insert a minimal order record. Adjust column names to match your schema if necessary.
      await supabase.from("order_records").insert([
        {
          alpaca_order_id: (json as any)?.id ?? (json as any)?.client_order_id ?? null,
          user_id: userId,
          type: (json as any)?.type ?? type,
          side: (json as any)?.side ?? side,
          qty: (json as any)?.qty ?? (json as any)?.filled_qty ?? qty,
          filled_qty: (json as any)?.filled_qty ?? 0,
          price: (json as any)?.filled_avg_price ?? (json as any)?.price ?? null,
          status: (json as any)?.status ?? "unknown",
          meta: json,
          created_at: new Date().toISOString(),
        },
      ]);
    } catch (e) {
      // non-fatal: log and continue
      // eslint-disable-next-line no-console
      console.warn("Failed to persist Alpaca order record", e);
    }

    return NextResponse.json(json);
  } catch (err) {
    return NextResponse.json({ error: "Proxy failed", details: String(err) }, { status: 502 });
  }
}
