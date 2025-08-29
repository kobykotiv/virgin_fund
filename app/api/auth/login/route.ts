import { NextRequest, NextResponse } from 'next/server'
import { signIn } from 'next-auth/react'
import { authOptions } from '@/lib/auth'
import { getServerSession } from 'next-auth'

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json()

    if (!email || !password) {
      return NextResponse.json({ error: 'Email and password required' }, { status: 400 })
    }

    // In demo mode, accept any credentials
    if (process.env.NEXT_PUBLIC_DEMO_MODE === 'true') {
      return NextResponse.json({
        user: {
          id: 'demo-user',
          email: email,
          name: 'Demo User',
          alpacaApiKey: process.env.NEXT_PUBLIC_ALPACA_API_KEY || '',
          alpacaSecretKey: process.env.NEXT_PUBLIC_ALPACA_SECRET_KEY || '',
          isPaper: true
        }
      })
    }

    // For production, you would validate credentials against your database
    // This is a simplified example
    const user = {
      id: '1',
      email: email,
      name: 'User',
      alpacaApiKey: process.env.ALPACA_API_KEY || '',
      alpacaSecretKey: process.env.ALPACA_SECRET_KEY || '',
      isPaper: process.env.ALPACA_IS_PAPER === 'true'
    }

    return NextResponse.json({ user })
  } catch (error) {
    console.error('Login error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
