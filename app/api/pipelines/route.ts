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

    const { data, error } = await supabase.from('pipelines').select('*').eq('user_id', userId).order('created_at', { ascending: false })
    if (error) {
      console.error('pipelines GET db error', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }
    return NextResponse.json({ pipelines: data || [] })
  } catch (err) {
    console.error('pipelines GET error', err)
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

    const body = (await req.json().catch(() => ({} as any))) as { name?: string; signalIds?: string[] }
    const name = typeof body.name === 'string' && body.name.trim() ? body.name.trim() : 'Unnamed Pipeline'
    const signalIds = Array.isArray(body.signalIds) ? body.signalIds : []

    const payload = { user_id: userId, name, signal_ids: signalIds }
    const { data: inserted, error: insertErr } = await supabase.from('pipelines').insert([payload]).select().limit(1).maybeSingle()
    if (insertErr) {
      console.error('pipelines insert failed', insertErr)
      return NextResponse.json({ error: insertErr.message }, { status: 500 })
    }
    return NextResponse.json({ pipeline: inserted })
  } catch (err) {
    console.error('pipelines POST error', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
