import { NextRequest, NextResponse } from 'next/server'
import { parse } from 'cookie'
import { getSupabaseAdmin } from '@/lib/supabaseAdmin'
import { verifySessionToken } from '@/lib/session'

export async function GET(_req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const cookies = parse(_req.headers.get('cookie') || '')
    const session = await verifySessionToken(cookies['vf_session'] || '')
    if (!session || (session as any).expired) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    const userId = (session as any).user_id
    const supabase = getSupabaseAdmin()

    const { id } = params
    const { data, error } = await supabase.from('signals').select('*').eq('id', id).eq('user_id', userId).maybeSingle()
    if (error) return NextResponse.json({ error: error.message }, { status: 500 })
    if (!data) return NextResponse.json({ error: 'Not found' }, { status: 404 })
    return NextResponse.json({ signal: data })
  } catch (err) {
    console.error('signals/[id] GET error', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const cookies = parse(req.headers.get('cookie') || '')
    const session = await verifySessionToken(cookies['vf_session'] || '')
    if (!session || (session as any).expired) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    const userId = (session as any).user_id
    const supabase = getSupabaseAdmin()

    const body = (await req.json().catch(() => ({} as any))) as { name?: string; ticker?: string; condition?: string; params?: any; enabled?: boolean }
    const update = {} as any
    if (typeof body.name === 'string') update.name = body.name.trim()
    if (typeof body.ticker === 'string') update.ticker = body.ticker.trim().toUpperCase()
    if (typeof body.condition === 'string') update.condition = body.condition
    if (body.params !== undefined) update.params = body.params
    if (typeof body.enabled === 'boolean') update.enabled = body.enabled

    const { data: updated, error: updateErr } = await supabase.from('signals').update(update).eq('id', params.id).eq('user_id', userId).select().limit(1).maybeSingle()
    if (updateErr) return NextResponse.json({ error: updateErr.message }, { status: 500 })
    return NextResponse.json({ signal: updated })
  } catch (err) {
    console.error('signals/[id] PATCH error', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function DELETE(_req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const cookies = parse(_req.headers.get('cookie') || '')
    const session = await verifySessionToken(cookies['vf_session'] || '')
    if (!session || (session as any).expired) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    const userId = (session as any).user_id
    const supabase = getSupabaseAdmin()

    const { error } = await supabase.from('signals').delete().eq('id', params.id).eq('user_id', userId)
    if (error) return NextResponse.json({ error: error.message }, { status: 500 })
    return NextResponse.json({ ok: true })
  } catch (err) {
    console.error('signals/[id] DELETE error', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
