import { NextRequest, NextResponse } from 'next/server'
import { parse } from 'cookie'
import { verifySessionToken } from '@/lib/session'
import { getSupabaseAdmin } from '@/lib/supabaseAdmin'

function parseCookieHeader(header: string | null) {
  if (!header) return {}
  try {
    return parse(header)
  } catch {
    return {}
  }
}

export async function GET(req: NextRequest) {
  try {
    const cookieHeader = req.headers.get('cookie')
    const cookies = parseCookieHeader(cookieHeader)
    const token = cookies['vf_session'] || cookies['SESSION'] || null
    if (!token) return NextResponse.json({ user: null }, { status: 200 })

    const session = await verifySessionToken(token)
    if (!session || (session as any).expired) return NextResponse.json({ user: null }, { status: 200 })

    const userId = (session as any).user_id
    const supabase = getSupabaseAdmin()
    const { data: user, error } = await supabase.from('users').select('id, email, full_name, raw_metadata').eq('id', userId).limit(1).maybeSingle()

    if (error) {
      console.error('me: db error', error)
      return NextResponse.json({ user: null }, { status: 200 })
    }

    return NextResponse.json({ user: user ?? null })
  } catch (err) {
    console.error('auth/me error', err)
    return NextResponse.json({ user: null }, { status: 200 })
  }
}
