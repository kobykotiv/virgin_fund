
import { NextRequest, NextResponse } from 'next/server';
import { listBots, createBot } from '@/lib/mockBots';

export async function GET(req: NextRequest) {
  const url = new URL(req.url);
  const search = url.searchParams.get('q') || undefined;
  const status = url.searchParams.get('status') || undefined;
  const strategy = url.searchParams.get('strategy') || undefined;
  const page = parseInt(url.searchParams.get('page') || '1', 10) || 1;
  const pageSize = parseInt(url.searchParams.get('pageSize') || '20', 10) || 20;
  const data = listBots({ search, status, strategy, page, pageSize });
  return NextResponse.json(data);
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const bot = createBot(body);
  return NextResponse.json(bot, { status: 201 });
}


