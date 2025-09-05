import { NextResponse } from "next/server";

/**
 * Mock notifications catch-all endpoint
 *
 * Routes supported:
 * - GET  /api/notifications                     -> list notifications (mock)
 * - POST /api/notifications/mark-all-read       -> mark all read (mock)
 * - DELETE /api/notifications/clear             -> clear all notifications (mock)
 * - POST /api/notifications/:id/read            -> mark one as read (mock)
 * - DELETE /api/notifications/:id               -> delete one (mock)
 *
 * This is intentionally stateless and safe for local development.
 */

const MOCK = [
  { id: "n1", type: "account", message: "Deposit completed", createdAt: new Date().toISOString(), read: false },
  { id: "n2", type: "bot", message: "Bot 'Arb Bot' paused due to error", createdAt: new Date(Date.now() - 1000 * 60 * 30).toISOString(), read: false },
  { id: "n3", type: "team", message: "Alice invited Bob to the team", createdAt: new Date(Date.now() - 1000 * 60 * 60 * 5).toISOString(), read: true },
];

export async function handler(req: Request, { params }: { params: { slug?: string[] } }) {
  const slug = params?.slug || [];
  const method = req.method;

  // Simulate a light latency
  await new Promise((r) => setTimeout(r, 120));

  try {
    // GET /api/notifications
    if (method === "GET" && slug.length === 0) {
      return NextResponse.json(MOCK, { status: 200 });
    }

    // POST /api/notifications/mark-all-read
    if (method === "POST" && slug.length === 1 && slug[0] === "mark-all-read") {
      return NextResponse.json({ success: true }, { status: 200 });
    }

    // DELETE /api/notifications/clear
    if (method === "DELETE" && slug.length === 1 && slug[0] === "clear") {
      return NextResponse.json({ success: true }, { status: 200 });
    }

    // POST /api/notifications/:id/read
    if (method === "POST" && slug.length === 2 && slug[1] === "read") {
      const id = slug[0];
      return NextResponse.json({ success: true, id }, { status: 200 });
    }

    // DELETE /api/notifications/:id
    if (method === "DELETE" && slug.length === 1) {
      const id = slug[0];
      return NextResponse.json({ success: true, id }, { status: 200 });
    }

    return NextResponse.json({ error: "Not found" }, { status: 404 });
  } catch (err) {
    console.error("notifications handler error", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

export const GET = (req: Request, ctx: any) => handler(req, ctx);
export const POST = (req: Request, ctx: any) => handler(req, ctx);
export const DELETE = (req: Request, ctx: any) => handler(req, ctx);
