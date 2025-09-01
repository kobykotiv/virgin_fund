/*
  Small Alpaca helper library.
  - exchangeCodeForToken(code): exchanges authorization code for tokens
  - persistToken(token): placeholder for storing token server-side (implement DB logic)
  - getTokenForUser(userId): placeholder for retrieving stored token
  - getAccountForUser(userId): convenience that fetches /v2/account from Alpaca

  NOTE: You must implement persistToken/getTokenForUser to integrate with your auth and DB.
*/

export type AlpacaToken = {
  access_token: string
  refresh_token?: string
  token_type?: string
  expires_in?: number
  scope?: string
  created_at?: string
}

const TOKEN_ENDPOINT = 'https://api.alpaca.markets/oauth/token'
const PAPER_API_BASE = 'https://paper-api.alpaca.markets'
const LIVE_API_BASE = 'https://api.alpaca.markets'

export async function exchangeCodeForToken(code: string): Promise<AlpacaToken> {
  const data = new URLSearchParams({
    grant_type: 'authorization_code',
    code,
    client_id: process.env.ALPACA_CLIENT_ID || '',
    client_secret: process.env.ALPACA_CLIENT_SECRET || '',
    redirect_uri: process.env.ALPACA_REDIRECT_URI || `${process.env.NEXT_PUBLIC_SITE_URL || ''}/api/alpaca/callback`
  })

  const res = await fetch(TOKEN_ENDPOINT, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: data.toString()
  })

  if (!res.ok) {
    const text = await res.text()
    throw new Error(`Token exchange failed: ${text}`)
  }

  const json = await res.json()
  return {
    access_token: json.access_token,
    refresh_token: json.refresh_token,
    token_type: json.token_type,
    expires_in: json.expires_in,
    scope: json.scope,
    created_at: new Date().toISOString()
  }
}

// TODO: implement persistent storage for tokens
export async function persistToken(token: AlpacaToken): Promise<void> {
  // Example placeholder: write to your DB keyed by authenticated user
  // throw new Error('persistToken not implemented - wire into your DB')
  console.warn('persistToken called - implement DB persistence', token)
}

export async function getTokenForUser(userId: string): Promise<AlpacaToken | null> {
  // TODO: read token from DB for given userId and return { access_token, ... }
  console.warn('getTokenForUser called - implement DB retrieval for userId', userId)
  return null
}

export async function getAccountForUser(userId: string): Promise<any | null> {
  const token = await getTokenForUser(userId)
  if (!token) return null

  const env = process.env.ALPACA_ENV || 'paper'
  const base = env === 'live' ? LIVE_API_BASE : PAPER_API_BASE

  const res = await fetch(`${base}/v2/account`, {
    headers: { Authorization: `Bearer ${token.access_token}` }
  })

  if (!res.ok) {
    const text = await res.text()
    throw new Error(`Failed fetching Alpaca account: ${text}`)
  }

  return res.json()
}
