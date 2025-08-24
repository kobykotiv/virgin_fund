// app/api/bots/route.ts
import { NextRequest } from "next/server";
import { Bot } from "types/bot";

// In-memory bot store for demo; replace with DB/Supabase in production
let bots: Bot[] = [];

export async function GET() {
  return Response.json({ data: bots }, { status: 200 });
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const newBot: Bot = {
      ...body,
      id: body.id || Math.random().toString(36).slice(2),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      assets: body.assets || [],
      status: body.status || "paused",
    };
    bots.push(newBot);
    return Response.json({ data: newBot }, { status: 201 });
  } catch (e) {
    return Response.json({ error: "Invalid request" }, { status: 400 });
  }
}

// Summary of Changes:
// - Added /api/bots GET (list all bots) and POST (create bot) handlers using in-memory store.
// - Ready for integration with useBots React Query hook.
// - For production, replace in-memory array with Supabase or DB logic.
