
import { NextRequest, NextResponse } from 'next/server'
import { parse } from 'cookie'
import { getSupabaseAdmin } from '@/lib/supabaseAdmin'
import { verifySessionToken } from '@/lib/session'

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const cookies = parse(req.headers.get('cookie') || '')
    const session = await verifySessionToken(cookies['vf_session'] || '')
    if (!session || (session as any).expired) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    const userId = (session as any).user_id
    const supabase = getSupabaseAdmin()

    const body = (await req.json().catch(() => ({} as any))) as any
    const update = {} as any
    if (body.name !== undefined) update.name = body.name
    if (body.strategy !== undefined) update.strategy = body.strategy
    if (body.assets !== undefined) update.assets = body.assets
    if (body.allocation !== undefined) update.allocation = body.allocation
    if (body.currency !== undefined) update.currency = body.currency
    if (body.status !== undefined) update.status = body.status
    if (body.scheduleCron !== undefined) update.schedule_cron = body.scheduleCron

    const { data: updated, error } = await supabase.from('bots').update(update).eq('id', params.id).eq('owner_id', userId).select().limit(1).maybeSingle()
    if (error) return NextResponse.json({ error: error.message }, { status: 500 })
    if (!updated) return NextResponse.json({ error: 'Not found' }, { status: 404 })
    return NextResponse.json({ data: updated })
  } catch (err) {
    console.error('bots/[id] PATCH error', err)
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

    const { error } = await supabase.from('bots').delete().eq('id', params.id).eq('owner_id', userId)
    if (error) return NextResponse.json({ error: error.message }, { status: 500 })
    return NextResponse.json({ ok: true })
  } catch (err) {
    console.error('bots/[id] DELETE error', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function POST(_req: NextRequest, { params }: { params: { id: string }; }) {
  // support POST sub-actions like /api/bots/:id/start, /pause, /stop
  try {
    const cookies = parse(_req.headers.get('cookie') || '')
    const session = await verifySessionToken(cookies['vf_session'] || '')
    if (!session || (session as any).expired) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    const userId = (session as any).user_id
    const supabase = getSupabaseAdmin()

    const id = params.id
    const path = _req.nextUrl?.pathname || ''
    if (path.endsWith('/start')) {
      const { data, error } = await supabase.from('bots').update({ status: 'running' }).eq('id', id).eq('owner_id', userId).select().limit(1).maybeSingle()
      if (error) return NextResponse.json({ error: error.message }, { status: 500 })
      return NextResponse.json({ data })
    }
    if (path.endsWith('/pause')) {
      const { data, error } = await supabase.from('bots').update({ status: 'paused' }).eq('id', id).eq('owner_id', userId).select().limit(1).maybeSingle()
      if (error) return NextResponse.json({ error: error.message }, { status: 500 })
      return NextResponse.json({ data })
    }
    if (path.endsWith('/stop')) {
      const { data, error } = await supabase.from('bots').update({ status: 'stopped' }).eq('id', id).eq('owner_id', userId).select().limit(1).maybeSingle()
      if (error) return NextResponse.json({ error: error.message }, { status: 500 })
      return NextResponse.json({ data })
    }

    return NextResponse.json({ error: 'Unsupported action' }, { status: 400 })
  } catch (err) {
    console.error('bots/[id] POST action error', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
