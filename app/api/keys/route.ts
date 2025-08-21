import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { requireSession } from "../../../middleware/sessionMiddleware";
import { encryptObject } from "../../../lib/encryption";

/**
 * POST /api/keys
 *   Body: { name: string, provider: string, credentials: object, metadata?: object }
 *   Creates an encrypted_keys row for the authenticated user.
 *
 * GET /api/keys
 *   Lists active keys for the authenticated user (metadata only).
 */

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
  // Defer throwing until runtime when endpoint is invoked to keep build-time safe.
  // Handled per-request below.
}

function getSupabase() {
  if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
    throw new Error("Supabase environment variables are not configured (NEXT_PUBLIC_SUPABASE_URL / SUPABASE_SERVICE_ROLE_KEY)");
  }
  return createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, { auth: { persistSession: false } });
}

export async function GET(req: NextRequest) {
  try {
    const { userId } = await requireSession(req);

    const supabase = getSupabase();
    const { data, error } = await supabase
      .from("encrypted_keys")
      .select("id, name, provider, metadata, is_active, created_at, updated_at, last_used")
      .eq("user_id", userId)
      .order("created_at", { ascending: false });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ keys: data ?? [] }, { status: 200 });
  } catch (err: any) {
    return NextResponse.json({ error: (err && err.message) || "Unauthorized" }, { status: err?.status || 401 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const { userId } = await requireSession(req);

    const body = await req.json();
    const { name, provider, credentials, metadata } = body || {};

    if (!name || !provider || !credentials) {
      return NextResponse.json({ error: "Missing required fields: name, provider, credentials" }, { status: 400 });
    }

    const supabase = getSupabase();

    // Encrypt credentials server-side
    const { encryptedBase64, ivBase64, tagBase64 } = await encryptObject(credentials);

    const insert = {
      user_id: userId,
      name,
      provider,
      encrypted_value: Buffer.from(encryptedBase64, "base64"),
      iv: Buffer.from(ivBase64, "base64"),
      tag: Buffer.from(tagBase64, "base64"),
      metadata: metadata ?? {},
      is_active: true,
    };

    const { data, error } = await supabase.from("encrypted_keys").insert([insert]).select("id, name, provider, metadata, created_at");

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ key: data?.[0] ?? null }, { status: 201 });
  } catch (err: any) {
    return NextResponse.json({ error: (err && err.message) || "Unauthorized" }, { status: err?.status || 401 });
  }
}

/*
Summary of Changes:
- Added app/api/keys/route.ts implementing:
  - GET /api/keys to list user's active encrypted keys (returns metadata only).
  - POST /api/keys to create a new encrypted key: accepts credentials object, encrypts server-side using lib/encryption, stores bytea fields.
- Uses requireSession helper for authentication and Supabase service role key for DB writes.
- Does not return decrypted credentials in list responses.
*/
