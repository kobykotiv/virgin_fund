import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { POST as backtestPOST } from '@/app/api/backtest/route'

// Mock verifySessionToken and runBacktest and supabase admin
vi.mock('@/lib/session', () => ({ verifySessionToken: async () => ({ user_id: 'test-user' }) }))
vi.mock('@/lib/backtest/engine', () => ({ runBacktest: async (p: any) => ({ summary: { finalBalance: 1100, tradesCount: 2 }, timeseries: [], trades: [] }) }))
vi.mock('@/lib/supabaseAdmin', () => ({ getSupabaseAdmin: () => ({ from: () => ({ insert: async () => ({}) }) }) }))

// Minimal Request mock for NextRequest
function makeReq(body: any) {
  return {
  json: async () => body,
  headers: { get: (k: string) => (k === 'cookie' ? 'vf_session=token' : undefined) },
  } as any
}

describe('POST /api/backtest', () => {
  it('runs backtest and returns result (happy path)', async () => {
    const req = makeReq({ symbol: 'BTC/USD', start: '2020-01-01', end: '2020-12-31', initialCapital: 1000, dcaAmount: 100, frequency: 'daily' })
    const res = await backtestPOST(req as any)
    const json = await res.json()
    expect(json.result).toBeDefined()
    expect(json.result.summary.finalBalance).toBe(1100)
  })

  it('returns 400 for missing params', async () => {
    const req = makeReq({ symbol: '', start: '', end: '', initialCapital: 0 })
    const res = await backtestPOST(req as any)
    expect(res.status).toBe(400)
  })
})
