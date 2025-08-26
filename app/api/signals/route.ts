import { NextRequest, NextResponse } from 'next/server'
import { parse } from 'cookie'
import { getSupabaseAdmin } from '@/lib/supabaseAdmin'
import { verifySessionToken } from '@/lib/session'

export async function GET(req: NextRequest) {
  try {
    const cookies = parse(req.headers.get('cookie') || '')
    const session = await verifySessionToken(cookies['vf_session'] || '')
    if (!session || (session as any).expired) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    const userId = (session as any).user_id
    const supabase = getSupabaseAdmin()

    const { data, error } = await supabase.from('signals').select('*').eq('user_id', userId).order('created_at', { ascending: false })
    if (error) {
      console.error('signals GET db error', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }
    return NextResponse.json({ signals: data || [] })
  } catch (err) {
    console.error('signals GET error', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    const cookies = parse(req.headers.get('cookie') || '')
    const session = await verifySessionToken(cookies['vf_session'] || '')
    if (!session || (session as any).expired) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    const userId = (session as any).user_id
    const supabase = getSupabaseAdmin()

    const body = (await req.json().catch(() => ({} as any))) as { name?: string; ticker?: string; condition?: string; params?: any }
    const name = typeof body.name === 'string' && body.name.trim() ? body.name.trim() : 'Unnamed Signal'
    const ticker = typeof body.ticker === 'string' ? body.ticker.trim().toUpperCase() : ''
    const condition = typeof body.condition === 'string' ? body.condition : ''

    const payload = { user_id: userId, name, ticker, condition, params: body.params ?? {}, enabled: true }
    const { data: inserted, error: insertErr } = await supabase.from('signals').insert([payload]).select().limit(1).maybeSingle()
    if (insertErr) {
      console.error('signals insert failed', insertErr)
      return NextResponse.json({ error: insertErr.message }, { status: 500 })
    }
    return NextResponse.json({ signal: inserted })
  } catch (err) {
    console.error('signals POST error', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
