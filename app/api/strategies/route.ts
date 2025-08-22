import { NextRequest, NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabaseAdmin";
import { verifySessionToken } from "@/lib/session";

/**
 * GET /api/strategies
 * POST /api/strategies
 *
 * - Uses server session cookie (vf_session) to identify user via lib/session.verifySessionToken
 * - Uses Supabase service-role client for DB operations
 * - Returns strategies scoped to current user (or public strategies if desired)
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
      .from("strategies")
      .select("*")
      .or(`user_id.eq.${userId},is_public.eq.true`)
      .order("created_at", { ascending: false });

    if (error) {
      console.error("strategies GET db error", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ strategies: data || [] });
  } catch (err) {
    console.error("strategies GET error", err);
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
      description?: string;
      parameters?: Record<string, unknown>;
      is_public?: boolean;
    };

    const name = typeof body.name === "string" && body.name.trim() ? body.name.trim() : "Unnamed Strategy";
    const description = typeof body.description === "string" ? body.description.trim() : "";
    const parameters = body.parameters ?? {};
    const is_public = Boolean(body.is_public ?? false);

    const payload = {
      user_id: userId,
      name,
      description,
      parameters,
      is_public,
    };

    const { data: inserted, error: insertErr } = await supabase
      .from("strategies")
      .insert([payload])
      .select()
      .limit(1)
      .maybeSingle();

    if (insertErr) {
      console.error("strategies insert failed", insertErr);
      return NextResponse.json({ error: insertErr.message }, { status: 500 });
    }

    return NextResponse.json({ strategy: inserted });
  } catch (err) {
    console.error("strategies POST error", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
