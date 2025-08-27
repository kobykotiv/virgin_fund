import { NextRequest, NextResponse } from 'next/server';
import { getBot, updateBot, deleteBot, performAction } from '@/lib/mockBots';

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  const { id } = params;
  const bot = getBot(id);
  if (!bot) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  return NextResponse.json(bot);
}

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  const { id } = params;
  const patch = await req.json();
  const bot = updateBot(id, patch);
  if (!bot) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  return NextResponse.json(bot);
}

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  const { id } = params;
  const ok = deleteBot(id);
  return NextResponse.json({ ok });
}

export async function POST(req: NextRequest, { params }: { params: { id: string } }) {
  // used for actions like /api/bots/:id?action=start
  const { id } = params;
  const url = new URL(req.url);
  const action = url.searchParams.get('action') || undefined;
  if (!action) return NextResponse.json({ error: 'action required' }, { status: 400 });
  const res = performAction(id, action);
  if (!res) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  return NextResponse.json(res);
}
