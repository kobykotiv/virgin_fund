import { NextRequest, NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabaseAdmin";
import { getUserRoleFromRequest } from "@/lib/rbac";

/**
 * Funds API (GET, POST, PATCH, DELETE)
 * - Uses Supabase admin client when configured
 * - Falls back to mock responses when Supabase is not available (local dev)
 *
 * Expected DB table: "funds" with typical columns (id, name, description, ...)
 */

const MOCK_FUNDS = [
  { id: "f1", name: "Core Growth", description: "Long-term growth fund", created_at: new Date().toISOString() },
  { id: "f2", name: "Income Fund", description: "Yield-focused fund", created_at: new Date().toISOString() },
];

export async function GET(req: NextRequest) {
  const supabase = getSupabaseAdmin();
  if (!supabase) {
    return NextResponse.json({ funds: MOCK_FUNDS }, { status: 200 });
  }

  try {
    const { data, error } = await supabase.from("funds").select("*");
    if (error) {
      console.error("funds GET db error", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    return NextResponse.json({ funds: data ?? [] }, { status: 200 });
  } catch (err) {
    console.error("funds GET error", err);
    return NextResponse.json({ funds: MOCK_FUNDS }, { status: 200 });
  }
}

export async function POST(req: NextRequest) {
  const supabase = getSupabaseAdmin();
  const { userId, role } = await getUserRoleFromRequest(req, supabase);
  if (!role || !['admin', 'manager'].includes(role)) {
    return NextResponse.json({ error: "Insufficient permissions" }, { status: 403 });
  }
  const body = await req.json().catch(() => ({} as any));

  if (!body.name || typeof body.name !== "string" || body.name.trim().length < 3) {
    return NextResponse.json({ error: "Fund name is required and must be at least 3 characters." }, { status: 400 });
  }

  if (!supabase) {
    // Return a mock created fund
    const fund = { id: `f-${Date.now()}`, name: body.name, description: body.description ?? null, created_at: new Date().toISOString() };
    return NextResponse.json({ fund }, { status: 201 });
  }

  try {
    const { data, error } = await supabase.from("funds").insert([body]).select().maybeSingle();
    if (error) {
      console.error("funds POST db error", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    return NextResponse.json({ fund: data }, { status: 201 });
  } catch (err) {
    console.error("funds POST error", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest) {
  const supabase = getSupabaseAdmin();
  const { userId, role } = await getUserRoleFromRequest(req, supabase);
  if (!role || !['admin', 'manager'].includes(role)) {
    return NextResponse.json({ error: "Insufficient permissions" }, { status: 403 });
  }
  const body = await req.json().catch(() => ({} as any));

  if (!body.id) return NextResponse.json({ error: "Missing fund id" }, { status: 400 });
  if (!body.name || typeof body.name !== "string" || body.name.trim().length < 3) {
    return NextResponse.json({ error: "Fund name is required and must be at least 3 characters." }, { status: 400 });
  }

  if (!supabase) {
    // Return a mock updated fund
    const fund = { id: body.id, name: body.name, description: body.description ?? null, updated_at: new Date().toISOString() };
    return NextResponse.json({ fund }, { status: 200 });
  }

  try {
    const { data, error } = await supabase.from("funds").update(body).eq("id", body.id).select().maybeSingle();
    if (error) {
      console.error("funds PATCH db error", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    return NextResponse.json({ fund: data }, { status: 200 });
  } catch (err) {
    console.error("funds PATCH error", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  const supabase = getSupabaseAdmin();
  const { userId, role } = await getUserRoleFromRequest(req, supabase);
  if (!role || role !== 'admin') {
    return NextResponse.json({ error: "Insufficient permissions" }, { status: 403 });
  }
  const body = await req.json().catch(() => ({} as any));
  if (!body.id) return NextResponse.json({ error: "Missing fund id" }, { status: 400 });

  if (!supabase) {
    return NextResponse.json({ success: true }, { status: 200 });
  }

  try {
    const { error } = await supabase.from("funds").delete().eq("id", body.id);
    if (error) {
      console.error("funds DELETE db error", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    return NextResponse.json({ success: true }, { status: 200 });
  } catch (err) {
    console.error("funds DELETE error", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
