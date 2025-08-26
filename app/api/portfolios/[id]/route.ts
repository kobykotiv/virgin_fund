import { NextRequest, NextResponse } from 'next/server'
import { getSupabaseAdmin } from '@/lib/supabaseAdmin'
import { verifySessionToken } from '@/lib/session'

function parseCookie(header: string | null) {
  if (!header) return {} as Record<string, string>
  return Object.fromEntries(
    header
      .split(';')
      .map((p) => p.trim())
      .map((p) => {
        const idx = p.indexOf('=')
        if (idx === -1) return [p, '']
        return [p.slice(0, idx), decodeURIComponent(p.slice(idx + 1))]
      })
  )
}

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const cookies = parseCookie(req.headers.get('cookie'))
    const session = await verifySessionToken(cookies['vf_session'] || '')
    if (!session || (session as any).expired) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    const userId = (session as any).user_id
    const supabase = getSupabaseAdmin()

    const { data, error } = await supabase.from('portfolios').select('*').eq('id', params.id).eq('owner_id', userId).limit(1).maybeSingle()
    if (error) return NextResponse.json({ error: error.message }, { status: 500 })
    if (!data) return NextResponse.json({ error: 'Not found' }, { status: 404 })
    return NextResponse.json({ portfolio: data })
  } catch (err) {
    console.error('portfolios/[id] GET error', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const cookies = parseCookie(req.headers.get('cookie'))
    const session = await verifySessionToken(cookies['vf_session'] || '')
    if (!session || (session as any).expired) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    const userId = (session as any).user_id
    const supabase = getSupabaseAdmin()

    const body = (await req.json().catch(() => ({} as any))) as any
    const update: any = {}
    if (body.name !== undefined) update.name = body.name
    if (body.balance !== undefined) update.balance = body.balance

    const { data, error } = await supabase.from('portfolios').update(update).eq('id', params.id).eq('owner_id', userId).select().limit(1).maybeSingle()
    if (error) return NextResponse.json({ error: error.message }, { status: 500 })
    return NextResponse.json({ portfolio: data })
  } catch (err) {
    console.error('portfolios/[id] PATCH error', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function DELETE(_req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const cookies = parseCookie(_req.headers.get('cookie'))
    const session = await verifySessionToken(cookies['vf_session'] || '')
    if (!session || (session as any).expired) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    const userId = (session as any).user_id
    const supabase = getSupabaseAdmin()

    const { error } = await supabase.from('portfolios').delete().eq('id', params.id).eq('owner_id', userId)
    if (error) return NextResponse.json({ error: error.message }, { status: 500 })
    return NextResponse.json({ ok: true })
  } catch (err) {
    console.error('portfolios/[id] DELETE error', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
