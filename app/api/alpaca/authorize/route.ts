import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  const url = new URL(request.url)
  const returnTo = url.searchParams.get('returnTo') || '/'

  const stateObj = {
    csrf: Math.random().toString(36).slice(2),
    returnTo
  }

  const state = encodeURIComponent(JSON.stringify(stateObj))
  const scope = encodeURIComponent('account:write trading')
  const clientId = process.env.ALPACA_CLIENT_ID
  const redirectUri = encodeURIComponent(process.env.ALPACA_REDIRECT_URI || `${process.env.NEXT_PUBLIC_SITE_URL || ''}/api/alpaca/callback`)
  const env = process.env.ALPACA_ENV || 'paper'

  if (!clientId) {
    return NextResponse.json({ error: 'ALPACA_CLIENT_ID not configured' }, { status: 500 })
  }

  const authUrl = `https://app.alpaca.markets/oauth/authorize?response_type=code&client_id=${clientId}&redirect_uri=${redirectUri}&state=${state}&scope=${scope}&env=${env}`

  return NextResponse.redirect(authUrl)
}
