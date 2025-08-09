import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase-client';
import { generateDemoPortfolio } from '@/lib/demo-portfolio';

/**
 * API route for demo login and demo data seeding.
 * Creates an anonymous user, tags with is_demo_user, and seeds demo tables.
 */
export async function POST() {
  // Create anonymous user (custom implementation, as Supabase JS does not have signInAnonymously)
  // You may need to use a service role key or custom RPC for true anonymous login
  const { data: user, error } = await supabase.auth.signUp({
    email: `demo_${Date.now()}@virginfund.local`,
    password: crypto.randomUUID(),
    options: {
      data: { is_demo_user: true }
    }
  });
  if (error || !user?.user) {
    return NextResponse.json({ error: error?.message || 'Demo user creation failed.' }, { status: 500 });
  }

  // Generate and seed demo portfolio and related data
  try {
    await generateDemoPortfolio(user.user.id);
    return NextResponse.json({ success: true, userId: user.user.id });
  } catch (err) {
    return NextResponse.json({ error: 'Demo portfolio generation failed.' }, { status: 500 });
  }
}
