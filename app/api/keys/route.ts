import { NextRequest, NextResponse } from "next/server";
import { requireSession } from "../../../middleware/sessionMiddleware";
import * as keysService from "../../../services/keys-service";

/**
 * GET /api/keys
 *   Lists active keys for the authenticated user (metadata only).
 *
 * POST /api/keys
 *   Body: { name: string, provider?: string, apiKey?: string, secret?: string, credentials?: any, metadata?: object, isPaper?: boolean }
 *   Creates an api_keys row for the authenticated user. Secrets are encrypted server-side.
 *
 * Notes:
 *  - This route delegates encryption/storage to services/keys-service.ts and does NOT expose encrypted blobs.
 *  - Callers must be authenticated (requireSession) and the service uses the server Supabase key.
 */

export async function GET(req: NextRequest) {
  try {
    const { userId } = await requireSession(req);

    const keys = await keysService.listKeys(userId);
    return NextResponse.json({ keys: keys ?? [] }, { status: 200 });
  } catch (err: any) {
    return NextResponse.json({ error: (err && err.message) || "Unauthorized" }, { status: err?.status || 401 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const { userId } = await requireSession(req);

    const body = await req.json().catch(() => ({}));
    const { name, provider, apiKey, secret, credentials, metadata, isPaper } = body || {};

    // Support multiple payload shapes for backwards compatibility:
    // - secret present directly
    // - credentials as string (secret)
    // - credentials as object with { secret }
    let resolvedSecret: string | undefined = secret;
    if (!resolvedSecret && credentials) {
      if (typeof credentials === "string") resolvedSecret = credentials;
      else if (typeof credentials === "object" && credentials.secret) resolvedSecret = credentials.secret;
      else {
        // If credentials is an object without a `secret` field, serialize it.
        resolvedSecret = JSON.stringify(credentials);
      }
    }

    if (!name || !resolvedSecret) {
      return NextResponse.json({ error: "Missing required fields: name and secret (or credentials)" }, { status: 400 });
    }

    const created = await keysService.createKey(userId, {
      name,
      provider,
      apiKey,
      secret: resolvedSecret,
      isPaper: Boolean(isPaper),
      metadata: metadata ?? {},
    });

    return NextResponse.json({ key: created }, { status: 201 });
  } catch (err: any) {
    return NextResponse.json({ error: (err && err.message) || "Unauthorized" }, { status: err?.status || 401 });
  }
}

/*
Summary of Changes:
- Updated app/api/keys/route.ts to use the new services/keys-service.ts (createKey, listKeys).
- GET returns the user's keys (metadata only).
- POST accepts several payload shapes, resolves a secret string, encrypts via service, and returns safe metadata.
*/
