import { NextRequest, NextResponse } from 'next/server'
import { verifySessionToken } from '@/lib/session'

export async function GET(req: NextRequest) {
  try {
    const token = req.cookies.get('vf_session')?.value
    const payload = await verifySessionToken(token as string)
    if (!payload) return NextResponse.json({ error: 'Unauthenticated' }, { status: 401 })

    const user = {
      id: (payload as any).user_id,
      email: (payload as any).email,
      name: (payload as any).name,
      role: (payload as any).role || 'free',
    }

    return NextResponse.json({ user })
  } catch (error) {
    console.error('session route error', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
