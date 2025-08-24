import { NextRequest, NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabaseAdmin";
import { verifySessionToken } from "@/lib/session";

/**
 * POST /api/market/portfolio/demo
 *
 * Best-effort endpoint to persist a chosen demo portfolio to the user's
 * server-side portfolio record. Requires a valid server session cookie (`vf_session`).
 *
 * Notes:
 * - This handler is intentionally small and defensive. If the session is missing
 *   it responds 401. DB errors return 500.
 * - The shape of stored data is simple: { user_id, name, description, data }
 *   where `data` contains the full demo payload as JSON. Adjust to match your
 *   DB schema if you want different columns.
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

    const body = (await req.json().catch(() => ({} as any))) as any;

    const payload = {
      user_id: userId,
      name: typeof body.name === "string" ? body.name : "Demo Portfolio",
      description: typeof body.description === "string" ? body.description : "",
      data: body,
    };

    // Upsert by user_id so repeated demo applies overwrite the user's demo portfolio row.
    const { data: inserted, error } = await supabase
      .from("portfolios")
      .upsert([payload], { onConflict: "user_id" })
      .select()
      .limit(1)
      .maybeSingle();

    if (error) {
      console.error("portfolio demo persist failed", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true, portfolio: inserted }, { status: 201 });
  } catch (err) {
    console.error("portfolio/demo POST error", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
