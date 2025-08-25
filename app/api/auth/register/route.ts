import { NextRequest, NextResponse } from "next/server"
import { supabaseAdmin } from '@/lib/supabaseAdmin'
import { createSession } from '@/lib/session'
import { setResponseCookie } from '@/lib/serverCookies'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({} as any))
    const email = typeof body?.email === 'string' ? body.email.trim() : ''
    const password = typeof body?.password === 'string' ? body.password : ''
    const name = typeof body?.name === 'string' ? body.name.trim() : ''

    if (!email || !password) {
      return NextResponse.json({ error: 'Email and password are required' }, { status: 400 })
    }

    const { data, error } = await supabaseAdmin.auth.signUp({
      email,
      password,
      options: { data: { name } },
    })

    if (error || !data?.user) {
      console.error('register failed', error)
      return NextResponse.json({ error: error?.message || 'Registration failed' }, { status: 400 })
    }

    const userId = data.user.id

    // Create server session and set cookie
    const { cookie } = await createSession(userId)

    const res = NextResponse.json({ ok: true, userId }, { status: 201 })
    setResponseCookie(res, cookie)
    return res
  } catch (err: any) {
    console.error('auth/register error', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
