import { NextResponse } from "next/server";

/**
 * Catch-all mock team actions endpoint
 *
 * Supports:
 * - DELETE /api/team/:memberId               -> remove member
 * - POST   /api/team/:memberId/role          -> change member role { role }
 * - DELETE /api/team/invite/:inviteId        -> cancel invite
 * - POST   /api/team/invite/:inviteId/resend -> resend invite
 *
 * This mock implementation is safe for local development and returns
 * realistic status codes and payloads so the frontend's optimistic
 * updates can be reconciled.
 */

export async function handler(req: Request, { params }: { params: { slug: string[] } }) {
  const slug = params?.slug || [];
  const method = req.method;

  // small simulated latency
  await new Promise((r) => setTimeout(r, 150));

  try {
    // Pattern: /api/team/invite/:inviteId(/resend)
    if (slug[0] === "invite" && slug[1]) {
      const inviteId = slug[1];

      if (method === "DELETE" && slug.length === 2) {
        // Cancel invite
        return NextResponse.json({ success: true, id: inviteId }, { status: 200 });
      }

      if (method === "POST" && slug.length === 3 && slug[2] === "resend") {
        // Resend invite
        return NextResponse.json({ success: true, id: inviteId, status: "resent" }, { status: 200 });
      }
    }

    // Pattern: /api/team/:memberId(/role)
    if (slug.length >= 1) {
      const memberId = slug[0];

      if (method === "DELETE" && slug.length === 1) {
        // Remove member
        return NextResponse.json({ success: true, id: memberId }, { status: 200 });
      }

      if (method === "POST" && slug.length === 2 && slug[1] === "role") {
        const body = await req.json().catch(() => ({}));
        const role = typeof body.role === "string" && body.role ? body.role : null;
        if (!role) {
          return NextResponse.json({ error: "Missing role" }, { status: 400 });
        }
        // Return updated member stub
        return NextResponse.json({ id: memberId, role }, { status: 200 });
      }
    }

    return NextResponse.json({ error: "Not found" }, { status: 404 });
  } catch (err) {
    console.error("team actions handler error", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

// Next.js expects named exports for HTTP methods; delegate to handler
export const GET = (req: Request, ctx: any) => handler(req, ctx);
export const POST = (req: Request, ctx: any) => handler(req, ctx);
export const DELETE = (req: Request, ctx: any) => handler(req, ctx);
