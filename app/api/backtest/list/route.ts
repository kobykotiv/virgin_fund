import { NextRequest, NextResponse } from 'next/server'
import { verifySessionToken } from '@/lib/session'
import { getSupabaseAdmin } from '@/lib/supabaseAdmin'

export async function GET(req: NextRequest) {
  try {
    const cookieHeader = (req.headers.get('cookie') || '')
    const match = /vf_session=([^;]+)/.exec(cookieHeader)
    const token = match?.[1]
    const session = await verifySessionToken(token ?? '')
    if (!session || (session as any).expired) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    const userId = (session as any).user_id

    const supabase = getSupabaseAdmin()
    const { data, error } = await supabase.from('backtests').select('*').eq('user_id', userId).order('created_at', { ascending: false }).limit(50)
    if (error) return NextResponse.json({ error: error.message }, { status: 500 })
    return NextResponse.json({ backtests: data ?? [] })
  } catch (e) {
    console.error('backtest list error', e)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
