import { NextResponse, NextRequest } from "next/server";
import { getAlpacaCredentialsForUser, getUserFromRequest } from "@/lib/alpacaServer";

const DEFAULT_BASE = process.env.ALPACA_BASE_URL || "https://paper-api.alpaca.markets";

export async function GET(req: NextRequest) {
  const userId = await getUserFromRequest(req);
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const creds = await getAlpacaCredentialsForUser(userId);
  if (!creds) return NextResponse.json({ error: "No Alpaca credentials" }, { status: 404 });

  // Permission check: ensure the stored key is active
  if ((creds as any)?.is_active === false) {
    return NextResponse.json({ error: "Alpaca credentials disabled" }, { status: 403 });
  }

  const base = (creds.meta?.base_url as string) ?? DEFAULT_BASE;
  try {
    const res = await fetch(`${base}/v2/account`, {
      headers: {
        "APCA-API-KEY-ID": creds.key,
        "APCA-API-SECRET-KEY": creds.secret,
        "Content-Type": "application/json",
      },
    });

    const json = await res.json();
    if (!res.ok) {
      return NextResponse.json({ error: "Alpaca error", details: json }, { status: res.status });
    }
    return NextResponse.json(json);
  } catch (err) {
    return NextResponse.json({ error: "Proxy failed", details: String(err) }, { status: 502 });
  }
}
