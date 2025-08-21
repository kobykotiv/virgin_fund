import { NextRequest, NextResponse } from "next/server";
import { requireSession } from "../../../../middleware/sessionMiddleware";
import * as keysService from "../../../../services/keys-service";
import rateLimiter from "../../../../utils/rateLimiter";
import * as sessionLib from "../../../../lib/session";

/**
 * GET /api/keys/:id
 *   Returns metadata for the key. Pass ?reveal=true to return the decrypted secret
 *   (caller must be authorized; session freshness is enforced by requireSession).
 *
 * PATCH /api/keys/:id
 *   Update metadata or rotate secret. Body: { metadata?: object, secret?: string, isActive?: boolean }
 *
 * DELETE /api/keys/:id
 *   Soft-delete (set is_active = false).
 */

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { userId } = await requireSession(req);
    const id = params.id;

    // By default return metadata only
    const reveal = new URL(req.url).searchParams.get("reveal") === "true";

    if (reveal) {
      // Rate-limit reveal attempts per client/IP
      const rateKey = rateLimiter.keyFromRequest(req, `reveal:${id}`);
      const allowed = await rateLimiter.check(rateKey, 5, 60_000); // 5 attempts per minute
      if (!allowed) {
        return NextResponse.json({ error: "Too many reveal attempts" }, { status: 429 });
      }

      // Enforce recent session for sensitive operations (reveal)
      const cookieToken = typeof (req as any).cookies?.get === "function" ? (req as any).cookies.get("vf_session")?.value : null;
      let sessionRow: any = null;
      if (cookieToken) {
        const verified = await sessionLib.verifySessionToken(cookieToken);
        sessionRow = (verified && (verified as any).expired) ? (verified as any).session : verified;
      }

      try {
        sessionLib.requireRecentSession(sessionRow, 15 * 60 * 1000); // 15 minutes
      } catch (e: any) {
        return NextResponse.json({ error: "Session too old; re-auth required" }, { status: 401 });
      }

      // revealKey performs DB lookup + decryption server-side
      const key = await keysService.revealKey(userId, id);
      return NextResponse.json(
        { key: { id: key.id, name: key.name, provider: key.provider, secret: key.secret } },
        { status: 200 }
      );
    }

    // For metadata-only, reuse listKeys and filter single entry to avoid exposing secrets
    const keys = await keysService.listKeys(userId);
    const key = (keys || []).find((k) => k.id === id);
    if (!key) return NextResponse.json({ error: "Not found" }, { status: 404 });

    return NextResponse.json({ key }, { status: 200 });
  } catch (err: any) {
    return NextResponse.json({ error: (err && err.message) || "Unauthorized" }, { status: err?.status || 401 });
  }
}

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { userId } = await requireSession(req);
    const id = params.id;
    const body = await req.json().catch(() => ({}));
    const { metadata, secret, isActive } = body || {};

    if (!metadata && typeof secret === "undefined" && typeof isActive === "undefined") {
      return NextResponse.json({ error: "No updates provided" }, { status: 400 });
    }

    const updated = await keysService.updateKey(userId, id, { metadata, secret, isActive });

    return NextResponse.json({ key: updated }, { status: 200 });
  } catch (err: any) {
    return NextResponse.json({ error: (err && err.message) || "Unauthorized" }, { status: err?.status || 401 });
  }
}

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { userId } = await requireSession(req);
    const id = params.id;

    const deleted = await keysService.deleteKey(userId, id);
    return NextResponse.json({ success: true, id: deleted.id }, { status: 200 });
  } catch (err: any) {
    return NextResponse.json({ error: (err && err.message) || "Unauthorized" }, { status: err?.status || 401 });
  }
}

/*
Summary of Changes:
- Updated single-key API route to use services/keys-service.ts (revealKey, updateKey, deleteKey).
- GET supports ?reveal=true to return decrypted secret via the service.
- PATCH accepts metadata, secret rotation, or isActive toggles and delegates to updateKey.
- DELETE delegates soft-delete to deleteKey.
*/
