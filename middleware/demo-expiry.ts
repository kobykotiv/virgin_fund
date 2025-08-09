import { NextResponse } from 'next/server';

/**
 * Middleware to check demo portfolio expiry and redirect to signup if expired.
 */
export async function middleware(request: any) {
  const userId = request.cookies.get('user_id');
  if (!userId) return NextResponse.next();

  // Fetch demo portfolio
  const res = await fetch(`${process.env.NEXT_PUBLIC_SUPABASE_URL}/rest/v1/demo_portfolios?user_id=eq.${userId}`, {
    headers: {
      apikey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '',
      Authorization: `Bearer ${process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY}`,
    },
  });
  const portfolios = await res.json();
  if (portfolios.length === 0) return NextResponse.next();
  const portfolio = portfolios[0];
  if (new Date(portfolio.expires_at) < new Date()) {
    return NextResponse.redirect('/signup?demo_expired=1');
  }
  return NextResponse.next();
}
