import { NextRequest, NextResponse } from 'next/server';
import { listBots, createBot } from '../../../../lib/mockBots';

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
import { NextRequest, NextResponse } from 'next/server'
import { parse } from 'cookie'
import { getSupabaseAdmin } from '@/lib/supabaseAdmin'
import { verifySessionToken } from '@/lib/session'

export async function GET(req: NextRequest) {
  try {
    const cookies = parse(req.headers.get('cookie') || '')
    const session = await verifySessionToken(cookies['vf_session'] || '')
    if (!session || (session as any).expired) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    const userId = (session as any).user_id
    const supabase = getSupabaseAdmin()

    const { data, error } = await supabase.from('bots').select('*').eq('owner_id', userId).order('created_at', { ascending: false })
    if (error) {
      console.error('bots GET db error', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }
    return NextResponse.json({ data: data || [] })
  } catch (err) {
    console.error('bots GET error', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    const cookies = parse(req.headers.get('cookie') || '')
    const session = await verifySessionToken(cookies['vf_session'] || '')
    if (!session || (session as any).expired) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    const userId = (session as any).user_id
    const supabase = getSupabaseAdmin()

    const body = (await req.json().catch(() => ({} as any))) as any
    const payload = {
      owner_id: userId,
      name: body.name || null,
      strategy: body.strategy || 'dca',
      assets: body.assets || [],
      allocation: body.allocation ?? null,
      currency: body.currency || 'USD',
      status: body.status || 'paused',
      schedule_cron: body.scheduleCron || null,
      initial_balance: body.initialBalance ?? null,
    }

    const { data: inserted, error } = await supabase.from('bots').insert([payload]).select().limit(1).maybeSingle()
    if (error) {
      console.error('bots insert failed', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }
    return NextResponse.json({ data: inserted })
  } catch (err) {
    console.error('bots POST error', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
