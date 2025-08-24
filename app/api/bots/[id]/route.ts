// app/api/bots/[id]/route.ts
import { NextRequest } from "next/server";
import { Bot } from "types/bot";

// Use the same in-memory store as app/api/bots/route.ts
let bots: Bot[] = [];

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { id } = params;
    const patch = await req.json();
    const idx = bots.findIndex(b => b.id === id);
    if (idx === -1) return Response.json({ error: "Bot not found" }, { status: 404 });
    bots[idx] = { ...bots[idx], ...patch, updatedAt: new Date().toISOString() };
    return Response.json({ data: bots[idx] }, { status: 200 });
  } catch {
    return Response.json({ error: "Invalid request" }, { status: 400 });
  }
}

export async function DELETE(_req: NextRequest, { params }: { params: { id: string } }) {
  const { id } = params;
  const idx = bots.findIndex(b => b.id === id);
  if (idx === -1) return Response.json({ error: "Bot not found" }, { status: 404 });
  const [deleted] = bots.splice(idx, 1);
  return Response.json({ data: deleted }, { status: 200 });
}

// Summary of Changes:
// - Added PATCH (update bot) and DELETE (remove bot) handlers for /api/bots/:id.
// - Uses in-memory store for demo; replace with DB/Supabase for production.
