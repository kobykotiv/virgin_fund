import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { requireSession } from "../../../../middleware/sessionMiddleware";
import { decryptObject, encryptObject } from "../../../../lib/encryption";

/**
 * GET /api/keys/:id
 *   Returns metadata and (optionally) decrypted credentials if query ?reveal=true and user is authorized.
 *
 * PATCH /api/keys/:id
 *   Update metadata or rotate credentials. Body may contain { metadata?, credentials? }.
 *
 * DELETE /api/keys/:id
 *   Soft-delete (set is_active = false).
 */

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

function getSupabase() {
  if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
    throw new Error("Supabase environment variables are not configured (NEXT_PUBLIC_SUPABASE_URL / SUPABASE_SERVICE_ROLE_KEY)");
  }
  return createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, { auth: { persistSession: false } });
}

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { userId } = await requireSession(req);
    const id = params.id;
    const supabase = getSupabase();

    const { data, error } = await supabase
      .from("encrypted_keys")
      .select("*")
      .eq("id", id)
      .eq("user_id", userId)
      .limit(1)
      .maybeSingle();

    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    if (!data) return NextResponse.json({ error: "Not found" }, { status: 404 });

    // By default, do not reveal credentials. Only reveal if explicitly requested.
    const url = new URL(req.url);
    const reveal = url.searchParams.get("reveal") === "true";

    if (reveal) {
      // Decrypt credentials server-side
      const payload = {
        encryptedBase64: Buffer.from(data.encrypted_value).toString("base64"),
        ivBase64: Buffer.from(data.iv).toString("base64"),
        tagBase64: Buffer.from(data.tag).toString("base64"),
      };
      const creds = await decryptObject(payload);
      return NextResponse.json({ key: { id: data.id, name: data.name, provider: data.provider, metadata: data.metadata, credentials: creds } }, { status: 200 });
    }

    return NextResponse.json({ key: { id: data.id, name: data.name, provider: data.provider, metadata: data.metadata, is_active: data.is_active, created_at: data.created_at } }, { status: 200 });
  } catch (err: any) {
    return NextResponse.json({ error: (err && err.message) || "Unauthorized" }, { status: err?.status || 401 });
  }
}

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { userId } = await requireSession(req);
    const id = params.id;
    const body = await req.json();
    const { metadata, credentials } = body || {};

    const supabase = getSupabase();

    const updates: any = {};
    if (metadata) updates.metadata = metadata;
    if (credentials) {
      // Rotate credentials: encrypt new blob
      const { encryptedBase64, ivBase64, tagBase64 } = await encryptObject(credentials);
      updates.encrypted_value = Buffer.from(encryptedBase64, "base64");
      updates.iv = Buffer.from(ivBase64, "base64");
      updates.tag = Buffer.from(tagBase64, "base64");
    }

    const { data, error } = await supabase.from("encrypted_keys").update(updates).match({ id, user_id: userId }).select("id, name, provider, metadata, is_active, updated_at").limit(1).maybeSingle();

    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    if (!data) return NextResponse.json({ error: "Not found or not authorized" }, { status: 404 });

    return NextResponse.json({ key: data }, { status: 200 });
  } catch (err: any) {
    return NextResponse.json({ error: (err && err.message) || "Unauthorized" }, { status: err?.status || 401 });
  }
}

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { userId } = await requireSession(req);
    const id = params.id;
    const supabase = getSupabase();

    const { data, error } = await supabase.from("encrypted_keys").update({ is_active: false }).match({ id, user_id: userId }).select("id").limit(1).maybeSingle();

    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    if (!data) return NextResponse.json({ error: "Not found or not authorized" }, { status: 404 });

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (err: any) {
    return NextResponse.json({ error: (err && err.message) || "Unauthorized" }, { status: err?.status || 401 });
  }
}

/*
Summary of Changes:
- Implemented single-key API route to get, rotate, and soft-delete encrypted keys.
- GET supports optional ?reveal=true to return decrypted credentials (server-side only).
- PATCH supports rotating credentials and updating metadata.
- DELETE performs a soft-delete by setting is_active=false.
*/
