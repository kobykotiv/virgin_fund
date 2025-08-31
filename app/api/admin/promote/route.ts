import { NextRequest, NextResponse } from 'next/server'
import { getSupabaseAdmin } from '@/lib/supabaseAdmin'
import { parse } from 'cookie'
import { verifySessionToken } from '@/lib/session'

export async function POST(req: NextRequest) {
  try {
    const cookies = parse(req.headers.get('cookie') || '')
    const session = await verifySessionToken(cookies['vf_session'] || '')
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const actorRole = (session as any).role || 'free'
    if (actorRole !== 'admin') return NextResponse.json({ error: 'Forbidden' }, { status: 403 })

    const body = await req.json().catch(() => ({} as any))
    const { userId, role } = body
    if (!userId || !role) return NextResponse.json({ error: 'userId and role required' }, { status: 400 })

    const supabase = getSupabaseAdmin()
    const { data, error } = await supabase.from('users').update({ role }).eq('id', userId).select().maybeSingle()
    if (error) return NextResponse.json({ error: error.message }, { status: 500 })

    return NextResponse.json({ user: data })
  } catch (error) {
    console.error('promote POST error', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
