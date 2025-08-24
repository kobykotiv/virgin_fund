import supabase from '@/lib/supabaseClient';
import { NextResponse } from 'next/server';

export async function POST(req: Request, { params }: { params: { id: string } }) {
  const id = params.id;
  const body = await req.json();
  const { symbol } = body;
  if (!symbol) return NextResponse.json({ error: 'symbol required' }, { status: 400 });

  const { data, error } = await supabase.from('watchlists').select('items').eq('id', id).maybeSingle();
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  const items = (data?.items ?? []) as string[];
  if (!items.includes(symbol)) items.push(symbol);
  const { error: upErr } = await supabase.from('watchlists').update({ items }).eq('id', id);
  if (upErr) return NextResponse.json({ error: upErr.message }, { status: 500 });
  return NextResponse.json({ ok: true });
}
