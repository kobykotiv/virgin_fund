import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabaseAdmin'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({} as any))
    const email = typeof body?.email === 'string' ? body.email.trim() : ''
    if (!email) return NextResponse.json({ error: 'Email required' }, { status: 400 })

    const { error } = await supabaseAdmin.auth.resetPasswordForEmail(email)
    if (error) {
      console.error('reset password failed', error)
      return NextResponse.json({ error: 'Could not send reset email' }, { status: 500 })
    }

    return NextResponse.json({ ok: true }, { status: 200 })
  } catch (err) {
    console.error('auth/reset error', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
