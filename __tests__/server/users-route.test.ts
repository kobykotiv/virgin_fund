import { describe, it, expect, vi, beforeEach } from 'vitest'

vi.mock('../../lib/session', () => ({
  verifySessionToken: vi.fn(async (token: string) => {
    if (token === 'valid') return { user_id: 'user-1', role: 'free' }
    return null
  })
}))

vi.mock('../../lib/supabaseAdmin', () => ({
  getSupabaseAdmin: vi.fn(() => ({
    from: vi.fn(() => ({
      select: vi.fn(() => ({
        eq: vi.fn(() => ({ data: [{ id: 'user-1', email: 'u@example.com', name: 'User' }], error: null, maybeSingle: async () => ({ data: { id: 'user-1', email: 'u@example.com', name: 'User' }, error: null }) })),
        update: vi.fn(() => ({ data: { id: 'user-1', email: 'u@example.com', name: 'User' }, error: null, maybeSingle: async () => ({ data: { id: 'user-1', email: 'u@example.com', name: 'User' }, error: null }) }))
      }))
    }))
  }))
}))

import { GET, PATCH } from '../../app/api/users/route'

// Create a mock Request object
function makeReq(cookieVal?: string, body?: any) {
  return {
    headers: new Map([['cookie', `vf_session=${cookieVal || ''}`]]),
    json: async () => body
  } as any
}

describe('users route', () => {
  it('GET returns user when session valid', async () => {
    const res = await GET(makeReq('valid'))
    const json = await res.json()
    expect(json.user).toBeTruthy()
    expect(json.user.email).toBe('u@example.com')
  })

  it('PATCH updates user when session valid', async () => {
    const req = makeReq('valid', { name: 'New Name' })
    const res = await PATCH(req)
    const json = await res.json()
    expect(json.user).toBeTruthy()
  })
})
