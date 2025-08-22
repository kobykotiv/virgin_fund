import { NextRequest, NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabaseAdmin";
import { encryptSecret, hashApiKey } from "@/lib/crypto";
import { verifySessionToken } from "@/lib/session";

/**
 * GET /api/api-keys
 * POST /api/api-keys
 *
 * This route uses the server-side session cookie (`vf_session`) to identify the user.
 * - Reads vf_session from the Cookie header and verifies it via lib/session.verifySessionToken.
 * - Uses the Supabase service-role client (getSupabaseAdmin) for DB operations.
 * - Stores encrypted_secret and api_key_hash in `api_keys` table; never returns raw secrets.
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

    const supabase = getSupabaseAdmin();
    const userId = (session as any).user_id;

    const { data, error } = await supabase
      .from("api_keys")
      .select("id, name, provider, is_paper, is_active, metadata, created_at, updated_at, api_key_hash")
      .eq("user_id", userId);

    if (error) {
      console.error("api-keys GET db error", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ keys: data || [] });
  } catch (e) {
    console.error("api-keys GET error", e);
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
      api_key?: string;
      secret_key?: string;
      is_paper?: boolean;
      name?: string;
      provider?: string;
      metadata?: Record<string, unknown>;
    };

    const apiKey = typeof body.api_key === "string" ? body.api_key.trim() : "";
    const secretKey = typeof body.secret_key === "string" ? body.secret_key.trim() : "";
    const isPaper = typeof body.is_paper === "boolean" ? body.is_paper : true;
    const name = typeof body.name === "string" && body.name.trim() ? body.name.trim() : "Alpaca";
    const provider = typeof body.provider === "string" && body.provider.trim() ? body.provider.trim() : "alpaca";
    const metadata = body.metadata ?? {};

    if (!apiKey || !secretKey) {
      return NextResponse.json({ error: "Missing api_key or secret_key" }, { status: 400 });
    }

    const api_key_hash = hashApiKey(apiKey);
    const encrypted_secret = encryptSecret(secretKey);

    const { data: existing, error: fetchErr } = await supabase
      .from("api_keys")
      .select("*")
      .eq("user_id", userId)
      .eq("provider", provider)
      .limit(1)
      .maybeSingle();

    if (fetchErr) {
      console.warn("api-keys lookup failed", fetchErr);
      return NextResponse.json({ error: "Failed to check existing keys" }, { status: 500 });
    }

    if (existing) {
      const changes = {
        name,
        api_key_hash,
        encrypted_secret,
        is_paper: isPaper,
        is_active: true,
        metadata,
      };
      const { data: updated, error: updateErr } = await supabase
        .from("api_keys")
        .update(changes)
        .eq("id", existing.id)
        .select()
        .limit(1)
        .maybeSingle();

      if (updateErr) {
        console.error("api-keys update failed", updateErr);
        return NextResponse.json({ error: updateErr.message }, { status: 500 });
      }

      return NextResponse.json({
        success: true,
        key: {
          id: updated?.id,
          name: updated?.name,
          provider: updated?.provider,
          is_paper: updated?.is_paper,
          is_active: updated?.is_active,
          metadata: updated?.metadata,
          created_at: updated?.created_at,
          updated_at: updated?.updated_at,
          api_key_hash: updated?.api_key_hash,
        },
      });
    } else {
      const payload = {
        user_id: userId,
        name,
        provider,
        api_key_hash,
        encrypted_secret,
        is_paper: isPaper,
        is_active: true,
        metadata,
      };

      const { data: inserted, error: insertErr } = await supabase
        .from("api_keys")
        .insert([payload])
        .select()
        .limit(1)
        .maybeSingle();

      if (insertErr) {
        console.error("api-keys insert failed", insertErr);
        return NextResponse.json({ error: insertErr.message }, { status: 500 });
      }

      return NextResponse.json({
        success: true,
        key: {
          id: inserted?.id,
          name: inserted?.name,
          provider: inserted?.provider,
          is_paper: inserted?.is_paper,
          is_active: inserted?.is_active,
          metadata: inserted?.metadata,
          created_at: inserted?.created_at,
          updated_at: inserted?.updated_at,
          api_key_hash: inserted?.api_key_hash,
        },
      });
    }
  } catch (err) {
    console.error("api-keys POST error", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
