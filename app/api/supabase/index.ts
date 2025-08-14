// Supabase backend API route scaffold
import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL as string;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY as string;
const supabase = createClient(supabaseUrl, supabaseAnonKey);

export async function GET(request: Request) {
  // Example: fetch all users
  const { data, error } = await supabase.from('users').select('*');
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ users: data });
}

export async function POST(request: Request) {
  // Example: create a new user
  const body = await request.json();
  const { data, error } = await supabase.from('users').insert([body]);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ user: data ? data[0] : null });
}
