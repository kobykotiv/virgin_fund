import { NextRequest, NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabaseAdmin";
import { verifySessionToken } from "@/lib/session";

/**
 * GET /api/bots
 * POST /api/bots
 *
 * - Uses server session cookie (vf_session) to identify user via lib/session.verifySessionToken
 * - Uses Supabase service-role client for DB operations
 * - All returned bot rows are scoped to the current user
 */

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
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = (session as any).user_id;
    const supabase = getSupabaseAdmin();

    const { data, error } = await supabase
      .from("bots")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: false });

    if (error) {
      console.error("bots GET db error", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ bots: data || [] });
  } catch (err) {
    console.error("bots GET error", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const cookieHeader = req.headers.get("cookie");
    const cookies = parseCookie(cookieHeader);
    const sessionToken = cookies["vf_session"] || cookies["SESSION"] || null;
    const session = await verifySessionToken(sessionToken as string);
    if (!session || (session as any).expired) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = (session as any).user_id;
    const supabase = getSupabaseAdmin();

    const body = (await req.json().catch(() => ({} as any))) as {
      name?: string;
      strategy?: string;
      capital?: number;
      metadata?: Record<string, unknown>;
    };

    const name = typeof body.name === "string" && body.name.trim() ? body.name.trim() : "New Bot";
    const strategy = typeof body.strategy === "string" && body.strategy.trim() ? body.strategy.trim() : "default";
    const capital = typeof body.capital === "number" ? body.capital : 10000;
    const metadata = body.metadata ?? {};

    const payload = {
      user_id: userId,
      name,
      strategy,
      status: "paused",
      capital,
      pnl: 0,
      last_trade_at: null,
      metadata,
    };

    const { data: inserted, error: insertErr } = await supabase.from("bots").insert([payload]).select().limit(1).maybeSingle();

    if (insertErr) {
      console.error("bots insert failed", insertErr);
      return NextResponse.json({ error: insertErr.message }, { status: 500 });
    }

    return NextResponse.json({ bot: inserted });
  } catch (err) {
    console.error("bots POST error", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
