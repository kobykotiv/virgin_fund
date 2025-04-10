import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function POST() {
  const cookieStore = await cookies();
  
  // Clear all authentication related cookies
  cookieStore.delete('session');
  cookieStore.delete('token');
  cookieStore.delete('user');

  return NextResponse.json({ 
    success: true, 
    message: 'Successfully logged out' 
  });
}

export async function GET() {
  // Also handle GET requests the same way
  return POST();
}
