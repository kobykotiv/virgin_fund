import { NextResponse } from 'next/server'
import { readEnvLocal, writeEnvLocal } from '@/lib/env-local'

export async function GET() {
  const env = await readEnvLocal()
  const config = {
    apiKey: env['ALPACA_API_KEY'] ?? null,
    secretKey: env['ALPACA_SECRET_KEY'] ?? null,
    isPaper: (env['ALPACA_IS_PAPER'] ?? 'true') === 'true',
  }
  return NextResponse.json({ ok: true, config })
}

export async function POST(request: Request) {
  if (process.env.NODE_ENV === 'production') {
    return NextResponse.json({ ok: false, error: 'Not allowed in production' }, { status: 403 })
  }

  const body = await request.json().catch(() => null)
  if (!body || !body.apiKey || !body.secretKey) {
    return NextResponse.json({ ok: false, error: 'apiKey and secretKey required' }, { status: 400 })
  }

  await writeEnvLocal({
    ALPACA_API_KEY: body.apiKey,
    ALPACA_SECRET_KEY: body.secretKey,
    ALPACA_IS_PAPER: body.isPaper ? 'true' : 'false',
  })

  return NextResponse.json({ ok: true })
}
