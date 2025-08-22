import { NextRequest, NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabaseAdmin";
import { verifySessionToken } from "@/lib/session";

/**
 * GET /api/strategies/:id
 * PUT /api/strategies/:id
 * DELETE /api/strategies/:id
 *
 * - Uses server session cookie (vf_session) to identify user via lib/session.verifySessionToken
 * - Uses Supabase service-role client for DB operations
 * - Enforces multi-tenant access by filtering on user_id for mutations; GET allows public strategies
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

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const cookieHeader = req.headers.get("cookie");
    const cookies = parseCookie(cookieHeader);
    const sessionToken = cookies["vf_session"] || cookies["SESSION"] || null;
    const session = await verifySessionToken(sessionToken as string);
    if (!session || (session as any).expired) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = (session as any).user_id;
    const strategyId = params.id;
    if (!strategyId) return NextResponse.json({ error: "Missing strategy id" }, { status: 400 });

    const supabase = getSupabaseAdmin();

    const { data: strategy, error: fetchErr } = await supabase
      .from("strategies")
      .select("*")
      .eq("id", strategyId)
      .limit(1)
      .maybeSingle();

    if (fetchErr) {
      console.error("strategies GET by id db error", fetchErr);
      return NextResponse.json({ error: fetchErr.message }, { status: 500 });
    }

    if (!strategy) {
      return NextResponse.json({ error: "Strategy not found" }, { status: 404 });
    }

    // allow owner or public strategies
    if (strategy.user_id !== userId && !strategy.is_public) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    return NextResponse.json({ strategy });
  } catch (err) {
    console.error("strategies GET error", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
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
    const strategyId = params.id;
    if (!strategyId) return NextResponse.json({ error: "Missing strategy id" }, { status: 400 });

    const supabase = getSupabaseAdmin();

    const { data: existing, error: fetchErr } = await supabase
      .from("strategies")
      .select("id,user_id")
      .eq("id", strategyId)
      .limit(1)
      .maybeSingle();

    if (fetchErr || !existing) {
      return NextResponse.json({ error: "Strategy not found" }, { status: 404 });
    }

    if (existing.user_id !== userId) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const body = (await req.json().catch(() => ({} as any))) as Record<string, any>;
    const allowed: Record<string, any> = {};
    const updatable = ["name", "description", "parameters", "is_public"];
    for (const k of updatable) {
      if (k in body) allowed[k] = body[k];
    }

    if (Object.keys(allowed).length === 0) {
      return NextResponse.json({ error: "No updatable fields provided" }, { status: 400 });
    }

    const { data: updated, error: updateErr } = await supabase
      .from("strategies")
      .update(allowed)
      .eq("id", strategyId)
      .select()
      .limit(1)
      .maybeSingle();

    if (updateErr) {
      console.error("strategies PUT update failed", updateErr);
      return NextResponse.json({ error: updateErr.message }, { status: 500 });
    }

    return NextResponse.json({ strategy: updated });
  } catch (err) {
    console.error("strategies PUT error", err);
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
    const strategyId = params.id;
    if (!strategyId) return NextResponse.json({ error: "Missing strategy id" }, { status: 400 });

    const supabase = getSupabaseAdmin();

    const { data: existing, error: fetchErr } = await supabase
      .from("strategies")
      .select("id,user_id")
      .eq("id", strategyId)
      .limit(1)
      .maybeSingle();

    if (fetchErr || !existing) {
      return NextResponse.json({ error: "Strategy not found" }, { status: 404 });
    }

    if (existing.user_id !== userId) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const { error: deleteErr } = await supabase.from("strategies").delete().eq("id", strategyId);

    if (deleteErr) {
      console.error("strategies DELETE failed", deleteErr);
      return NextResponse.json({ error: deleteErr.message }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("strategies DELETE error", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
