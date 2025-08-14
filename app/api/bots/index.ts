import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL as string;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY as string;
const supabase = createClient(supabaseUrl, supabaseAnonKey);

export async function GET() {
  // Fetch all bots for the authenticated user (assumes JWT in headers)
  // In production, use RLS and user_id
  const { data, error } = await supabase.from('bots').select('*');
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ bots: data });
}

export async function POST(request: Request) {
  // Create a new bot
  const body = await request.json();
  const { data, error } = await supabase.from('bots').insert([body]);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ bot: data ? data[0] : null });
}
