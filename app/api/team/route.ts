import { NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabaseAdmin";

/**
 * GET /api/team
 *
 * Returns members and pending invites. If Supabase is configured (local env provided),
 * the endpoint will query `team_members` and `team_invites` tables. Otherwise it falls
 * back to in-file mock data for local development.
 *
 * Table assumptions (adjust to your schema):
 * - team_members: id, name, email, role, joined_at
 * - team_invites: id, email, role, invited_at, status
 *
 * This endpoint is read-only and safe for development.
 */

const MOCK_MEMBERS = [
  {
    id: "m1",
    name: "Alice Chen",
    email: "alice@example.com",
    role: "admin",
    joinedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 60).toISOString(),
  },
  {
    id: "m2",
    name: "Bob Smith",
    email: "bob@example.com",
    role: "editor",
    joinedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 30).toISOString(),
  },
];

const MOCK_INVITES = [
  {
    id: "i1",
    email: "pending1@example.com",
    role: "viewer",
    invitedAt: new Date().toISOString(),
    status: "pending",
  },
];

export async function GET() {
  // Simulate light latency for a more realistic dev experience
  await new Promise((r) => setTimeout(r, 150));

  const supabase = getSupabaseAdmin();
  if (!supabase) {
    return NextResponse.json(
      {
        members: MOCK_MEMBERS,
        invites: MOCK_INVITES,
      },
      { status: 200 }
    );
  }

  try {
    // Query members and invites from Supabase (adjust columns as needed)
    const [membersRes, invitesRes] = await Promise.all([
      supabase.from("team_members").select("id, name, email, role, joined_at"),
      supabase.from("team_invites").select("id, email, role, invited_at, status").order("invited_at", { ascending: false }),
    ]);

    // membersRes may be { data, error }
    const members = (membersRes as any).data ?? null;
    const invites = (invitesRes as any).data ?? null;

    // Map DB fields to API shape expected by the UI
    const mappedMembers = (members || []).map((m: any) => ({
      id: m.id,
      name: m.name,
      email: m.email,
      role: m.role,
      joinedAt: m.joined_at ?? null,
    }));

    const mappedInvites = (invites || []).map((i: any) => ({
      id: i.id,
      email: i.email,
      role: i.role,
      invitedAt: i.invited_at ?? null,
      status: i.status ?? "pending",
    }));

    return NextResponse.json(
      {
        members: mappedMembers,
        invites: mappedInvites,
      },
      { status: 200 }
    );
  } catch (err) {
    console.warn("team GET supabase error - falling back to mock", err);
    return NextResponse.json(
      {
        members: MOCK_MEMBERS,
        invites: MOCK_INVITES,
      },
      { status: 200 }
    );
  }
}
