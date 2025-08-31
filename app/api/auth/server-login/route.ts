import { NextRequest, NextResponse } from 'next/server'
import { createSessionToken } from '@/lib/session'
import { getSupabaseAdmin } from '@/lib/supabaseAdmin'
import bcrypt from 'bcryptjs'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({} as any))
    const { email, password } = body
    if (!email || !password) return NextResponse.json({ error: 'Email and password required' }, { status: 400 })

    // Demo mode short-circuit
    if (process.env.NEXT_PUBLIC_DEMO_MODE === 'true') {
      const payload = {
        user_id: 'demo-user',
        email,
        name: 'Demo User',
        role: 'free',
      }
      const token = await createSessionToken(payload)
      const res = NextResponse.json({ user: payload })
      res.cookies.set('vf_session', token, { httpOnly: true, path: '/', sameSite: 'lax' })
      return res
    }

    // In production, lookup user from Supabase
    const supabase = getSupabaseAdmin()
    const { data: user, error } = await supabase.from('users').select('*').eq('email', email).maybeSingle()
    if (error || !user) return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 })

    // Validate password: support bcrypt hashes and plaintext (dev)
    try {
      const stored = (user as any).password
      if (stored && typeof stored === 'string' && stored.startsWith('$2')) {
        const match = await bcrypt.compare(password, stored)
        if (!match) return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 })
      } else {
        // fallback (development): plain comparison
        if (stored && stored !== password) return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 })
      }
    } catch (err) {
      console.error('password verification error', err)
      return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 })
    }

    const payload = {
      user_id: user.id,
      email: user.email,
      name: user.name,
      role: user.role || 'free',
    }

    const token = await createSessionToken(payload)
    const res = NextResponse.json({ user: payload })
    res.cookies.set('vf_session', token, { httpOnly: true, path: '/', sameSite: 'lax' })
    return res
  } catch (error) {
    console.error('server-login error', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
