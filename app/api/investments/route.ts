export async function PATCH(req: NextRequest) {
  const supabase = getSupabaseAdmin();
  const body = await req.json();
  if (!body.id) return NextResponse.json({ error: 'Missing investment id' }, { status: 400 });
  if (!body.amount || isNaN(Number(body.amount)) || Number(body.amount) <= 0) {
    return NextResponse.json({ error: 'Amount is required and must be a positive number.' }, { status: 400 });
  }
  const { data, error } = await supabase.from('investments').update(body).eq('id', body.id).select().maybeSingle();
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ investment: data });
}

export async function DELETE(req: NextRequest) {
  const supabase = getSupabaseAdmin();
  const body = await req.json();
  if (!body.id) return NextResponse.json({ error: 'Missing investment id' }, { status: 400 });
  const { error } = await supabase.from('investments').delete().eq('id', body.id);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ success: true });
}
import { NextRequest, NextResponse } from 'next/server';
import { getSupabaseAdmin } from '@/lib/supabaseAdmin';

export async function GET(req: NextRequest) {
  const supabase = getSupabaseAdmin();
  const { data, error } = await supabase.from('investments').select('*');
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ investments: data });
}

export async function POST(req: NextRequest) {
  const supabase = getSupabaseAdmin();
  const body = await req.json();
  if (!body.amount || isNaN(Number(body.amount)) || Number(body.amount) <= 0) {
    return NextResponse.json({ error: 'Amount is required and must be a positive number.' }, { status: 400 });
  }
  const { data, error } = await supabase.from('investments').insert([body]).select().maybeSingle();
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ investment: data });
}
