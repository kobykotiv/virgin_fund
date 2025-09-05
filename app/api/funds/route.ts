export async function PATCH(req: NextRequest) {
  const supabase = getSupabaseAdmin();
  const body = await req.json();
  if (!body.id) return NextResponse.json({ error: 'Missing fund id' }, { status: 400 });
  const { data, error } = await supabase.from('funds').update(body).eq('id', body.id).select().maybeSingle();
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ fund: data });
}

export async function DELETE(req: NextRequest) {
  const supabase = getSupabaseAdmin();
  const body = await req.json();
  if (!body.id) return NextResponse.json({ error: 'Missing fund id' }, { status: 400 });
  const { error } = await supabase.from('funds').delete().eq('id', body.id);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ success: true });
}
import { NextRequest, NextResponse } from 'next/server';
import { getSupabaseAdmin } from '@/lib/supabaseAdmin';

export async function GET(req: NextRequest) {
  const supabase = getSupabaseAdmin();
  const { data, error } = await supabase.from('funds').select('*');
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ funds: data });
}

export async function POST(req: NextRequest) {
  const supabase = getSupabaseAdmin();
  const body = await req.json();
  const { data, error } = await supabase.from('funds').insert([body]).select().maybeSingle();
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ fund: data });
}
