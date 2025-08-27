import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '../../../lib/supabaseClient';

export async function GET(req: NextRequest) {
  try {
    const url = new URL(req.url);
    const search = url.searchParams.get('q') || undefined;
    const status = url.searchParams.get('status') || undefined;
    const strategy = url.searchParams.get('strategy') || undefined;
    const page = Math.max(parseInt(url.searchParams.get('page') || '1', 10), 1);
    const pageSize = Math.min(Math.max(parseInt(url.searchParams.get('pageSize') || '20', 10), 1), 200);

    let query = supabase.from('bots').select('*', { count: 'exact' });

    if (search) {
      // simple ilike on name
      query = query.ilike('name', `%${search}%`);
    }
    if (status) {
      query = query.eq('status', status);
    }
    if (strategy) {
      query = query.eq('strategy_type', strategy);
    }

    const from = (page - 1) * pageSize;
    const to = from + pageSize - 1;
    const { data, count, error } = await query.range(from, to);
    if (error) throw error;
    return NextResponse.json({ data, count, page, pageSize });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Failed to fetch bots' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    if (!body || typeof body !== 'object') {
      return NextResponse.json({ error: 'Invalid JSON payload' }, { status: 400 });
    }
    const { name, strategy_type, allocated_capital } = body as any;
    if (!name || !strategy_type) {
      return NextResponse.json({ error: 'Missing required fields: name, strategy_type' }, { status: 400 });
    }

    const insert = {
      name,
      strategy_type,
      allocated_capital: allocated_capital || null,
      status: 'stopped'
    } as any;

    const { data, error } = await supabase.from('bots').insert(insert).select().single();
    if (error) throw error;
    return NextResponse.json(data, { status: 201 });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Failed to create bot' }, { status: 500 });
  }
}


