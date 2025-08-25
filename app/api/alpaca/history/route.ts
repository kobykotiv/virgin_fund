import { NextResponse, NextRequest } from "next/server";
import { getUserFromRequest } from "@/lib/alpacaServer";
import { getSupabaseAdmin } from "@/lib/supabaseAdmin";

/**
 * GET /api/alpaca/history
 *
 * Query params:
 *  - limit (number, default 50, max 200)
 *  - page (number, default 1)
 *  - status (string, optional)
 *  - bot_id (string or number, optional)
 *
 * Returns paginated order_records for the authenticated user (filtered by user_id).
 */
export async function GET(req: NextRequest) {
  const userId = await getUserFromRequest(req);
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const supabase = getSupabaseAdmin();

  try {
    const url = new URL(req.url);
    const params = url.searchParams;

    const limitRaw = Number(params.get("limit") ?? 50);
    const limit = Number.isFinite(limitRaw) && limitRaw > 0 ? Math.min(limitRaw, 200) : 50;
    const pageRaw = Number(params.get("page") ?? 1);
    const page = Number.isFinite(pageRaw) && pageRaw > 0 ? Math.max(pageRaw, 1) : 1;
    const offset = (page - 1) * limit;

    const status = params.get("status");
    const botId = params.get("bot_id");

    // Build query: filter by user_id to prevent data leaks
    let query = supabase
      .from("order_records")
      .select("*", { count: "exact" })
      .eq("user_id", userId)
      .order("created_at", { ascending: false })
      .range(offset, offset + limit - 1);

    if (status) query = (query as any).eq("status", status);
    if (botId) query = (query as any).eq("bot_id", botId);

    const { data, error, count } = await query;

    if (error) {
      return NextResponse.json({ error: "DB query failed", details: error.message || error }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      data: data ?? [],
      meta: {
        count: typeof count === "number" ? count : null,
        page,
        limit,
      },
    });
  } catch (err) {
    return NextResponse.json({ error: "Unexpected error", details: String(err) }, { status: 500 });
  }
}
