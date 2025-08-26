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

export async function GET(req: NextRequest) {
  try {
    const cookies = parseCookie(req.headers.get('cookie'))
    const session = await verifySessionToken(cookies['vf_session'] || '')
    if (!session || (session as any).expired) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    const userId = (session as any).user_id
    const supabase = getSupabaseAdmin()

    const { data, error } = await supabase.from('portfolios').select('*').eq('owner_id', userId).order('created_at', { ascending: false })
    if (error) return NextResponse.json({ error: error.message }, { status: 500 })
    return NextResponse.json({ portfolios: data ?? [] })
  } catch (err) {
    console.error('portfolios GET error', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    const cookies = parseCookie(req.headers.get('cookie'))
    const session = await verifySessionToken(cookies['vf_session'] || '')
    if (!session || (session as any).expired) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    const userId = (session as any).user_id
    const supabase = getSupabaseAdmin()

    const body = (await req.json().catch(() => ({} as any))) as any
    const payload = {
      owner_id: userId,
      name: body.name || 'New Portfolio',
      currency: body.currency || 'USD',
      balance: body.balance ?? 0,
    }

    const { data: inserted, error } = await supabase.from('portfolios').insert([payload]).select().limit(1).maybeSingle()
    if (error) return NextResponse.json({ error: error.message }, { status: 500 })
    return NextResponse.json({ portfolio: inserted })
  } catch (err) {
    console.error('portfolios POST error', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
