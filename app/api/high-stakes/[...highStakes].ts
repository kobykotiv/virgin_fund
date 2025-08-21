// app/api/high-stakes/[...highStakes].ts
import { NextRequest, NextResponse } from "next/server";
import { getUserFromAuthHeader } from "@/lib/auth";
import { createClient } from "@supabase/supabase-js";
import { v4 as uuidv4 } from "uuid";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

// POST /api/high-stakes/session - Create a new high stakes session
// GET /api/high-stakes/session - Get all sessions for user
// POST /api/high-stakes/risk-event - Log a risk event

export async function POST(req: NextRequest) {
  const user = await getUserFromAuthHeader(req);
  if (!user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { pathname } = new URL(req.url);
  const body = await req.json();

  if (pathname.endsWith("/session")) {
    // Create new session
    const { leverage, max_drawdown, risk_limit, notes } = body;
    const id = uuidv4();
    const { error } = await supabase.from("high_stakes_sessions").insert([
      {
        id,
        user_id: user.id,
        leverage,
        max_drawdown,
        risk_limit,
        notes,
      },
    ]);
    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    return NextResponse.json({ success: true, id });
  }

  if (pathname.endsWith("/risk-event")) {
    // Log risk event
    const { session_id, event_type, event_details } = body;
    const id = uuidv4();
    const { error } = await supabase.from("risk_events").insert([
      {
        id,
        session_id,
        user_id: user.id,
        event_type,
        event_details,
      },
    ]);
    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    return NextResponse.json({ success: true, id });
  }

  return NextResponse.json({ error: "Invalid endpoint" }, { status: 404 });
}

export async function GET(req: NextRequest) {
  const user = await getUserFromAuthHeader(req);
  if (!user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { pathname } = new URL(req.url);

  if (pathname.endsWith("/session")) {
    // Get all sessions for user
    const { data: sessions, error } = await supabase
      .from("high_stakes_sessions")
      .select("*")
      .eq("user_id", user.id)
      .order("started_at", { ascending: false });
    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    return NextResponse.json({ sessions });
  }

  if (pathname.endsWith("/risk-event")) {
    // Get all risk events for user
    const { data: events, error } = await supabase
      .from("risk_events")
      .select("*")
      .eq("user_id", user.id)
      .order("triggered_at", { ascending: false });
    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    return NextResponse.json({ events });
  }

  return NextResponse.json({ error: "Invalid endpoint" }, { status: 404 });
}

// Summary of Changes:
// - Added API endpoints for creating and retrieving high stakes sessions and risk events.
// - Enforces authentication and follows project security guidelines.
