import { NextRequest, NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabaseAdmin";
import { verifySessionToken } from "@/lib/session";

/**
 * PUT /api/bots/:id
 * DELETE /api/bots/:id
 *
 * - Uses server session cookie (vf_session) to identify user via lib/session.verifySessionToken
 * - Uses Supabase service-role client for DB operations
 * - Enforces multi-tenant access by filtering on user_id
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

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const cookieHeader = req.headers.get("cookie");
    const cookies = parseCookie(cookieHeader);
    const sessionToken = cookies["vf_session"] || cookies["SESSION"] || null;
    const session = await verifySessionToken(sessionToken as string);
    if (!session || (session as any).expired) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = (session as any).user_id;
    const botId = params.id;
    if (!botId) return NextResponse.json({ error: "Missing bot id" }, { status: 400 });

    const supabase = getSupabaseAdmin();

    const body = (await req.json().catch(() => ({} as any))) as Record<string, any>;
    const allowed: Record<string, any> = {};
    // Only allow a small whitelist of updatable fields
    const updatable = ["name", "strategy", "status", "capital", "pnl", "last_trade_at", "metadata"];
    for (const k of updatable) {
      if (k in body) allowed[k] = body[k];
    }

    if (Object.keys(allowed).length === 0) {
      return NextResponse.json({ error: "No updatable fields provided" }, { status: 400 });
    }

    const { data: existing, error: fetchErr } = await supabase
      .from("bots")
      .select("id,user_id")
      .eq("id", botId)
      .limit(1)
      .maybeSingle();

    if (fetchErr || !existing) {
      return NextResponse.json({ error: "Bot not found" }, { status: 404 });
    }

    if (existing.user_id !== userId) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const { data: updated, error: updateErr } = await supabase
      .from("bots")
      .update(allowed)
      .eq("id", botId)
      .select()
      .limit(1)
      .maybeSingle();

    if (updateErr) {
      console.error("bots PUT update failed", updateErr);
      return NextResponse.json({ error: updateErr.message }, { status: 500 });
    }

    return NextResponse.json({ bot: updated });
  } catch (err) {
    console.error("bots PUT error", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const cookieHeader = req.headers.get("cookie");
    const cookies = parseCookie(cookieHeader);
    const sessionToken = cookies["vf_session"] || cookies["SESSION"] || null;
    const session = await verifySessionToken(sessionToken as string);
    if (!session || (session as any).expired) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = (session as any).user_id;
    const botId = params.id;
    if (!botId) return NextResponse.json({ error: "Missing bot id" }, { status: 400 });

    const supabase = getSupabaseAdmin();

    const { data: existing, error: fetchErr } = await supabase
      .from("bots")
      .select("id,user_id")
      .eq("id", botId)
      .limit(1)
      .maybeSingle();

    if (fetchErr || !existing) {
      return NextResponse.json({ error: "Bot not found" }, { status: 404 });
    }

    if (existing.user_id !== userId) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const { error: deleteErr } = await supabase.from("bots").delete().eq("id", botId);

    if (deleteErr) {
      console.error("bots DELETE failed", deleteErr);
      return NextResponse.json({ error: deleteErr.message }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("bots DELETE error", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
