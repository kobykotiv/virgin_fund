import { NextRequest, NextResponse } from 'next/server';
import supabase from '@/lib/supabaseClient';
import { authMiddleware } from '@/middleware/authMiddleware';

export async function GET(req: NextRequest) {
  const authResp = await authMiddleware(req);
  if (authResp) return authResp;

  try {
    const { data, error } = await supabase.from('notifications').select('id, alert_id, payload, read, created_at').order('created_at', { ascending: false });
    if (error) throw error;
    return NextResponse.json({ success: true, data });
  } catch (e) {
    console.error('failed to fetch notifications', e);
    return NextResponse.json({ success: false, error: (e as Error).message }, { status: 500 });
  }
}
