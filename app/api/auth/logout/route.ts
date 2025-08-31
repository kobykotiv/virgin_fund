import { NextRequest, NextResponse } from 'next/server'
import { verifySessionToken } from '@/lib/session'
import { getSupabaseAdmin } from '@/lib/supabaseAdmin'

export async function POST(req: NextRequest) {
  try {
    // Read token from cookie
    const token = req.cookies.get('vf_session')?.value
    const payload = await verifySessionToken(token as string)

    // Clear cookie
    const res = NextResponse.json({ success: true })
    res.cookies.set('vf_session', '', { httpOnly: true, path: '/', sameSite: 'lax', expires: new Date(0) })

    // Best-effort: if configured, attempt to revoke server-side session via Supabase admin
    if (process.env.SESSION_REVOKE_SUPABASE === 'true' && payload) {
      try {
        const userId = (payload as any).user_id
        const supabase = getSupabaseAdmin()
        // supabase admin API may expose invalidateUserRefreshTokens or similar; try best-effort
        // @ts-ignore
        if (supabase.auth && supabase.auth.admin && typeof (supabase.auth.admin as any).invalidateUserRefreshTokens === 'function') {
          // @ts-ignore
          await (supabase.auth.admin as any).invalidateUserRefreshTokens(userId)
        }
      } catch (err) {
        // swallow errors - this is best-effort
        console.warn('Supabase session revoke failed', err)
      }
    }

    return res
  } catch (error) {
    console.error('Logout error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
