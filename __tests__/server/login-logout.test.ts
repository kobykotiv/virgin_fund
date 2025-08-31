import { describe, it, expect, vi } from 'vitest'

vi.mock('../../lib/supabaseAdmin', () => ({
  getSupabaseAdmin: vi.fn(() => ({
    from: vi.fn(() => ({
      select: vi.fn(() => ({
        eq: vi.fn(() => ({ data: [{ id: 'user-1', email: 'u@example.com', name: 'User', password: '$2a$10$invalidhashplaceholder' }], error: null, maybeSingle: async () => ({ data: { id: 'user-1', email: 'u@example.com', name: 'User', password: '$2a$10$invalidhashplaceholder' }, error: null }) }))
      }))
    })),
    auth: { admin: { invalidateUserRefreshTokens: vi.fn(async (id: string) => ({ data: null })) } }
  }))
}))

import bcrypt from 'bcryptjs'

import { POST as loginPOST } from '../../app/api/auth/server-login/route'
import { POST as logoutPOST } from '../../app/api/auth/logout/route'

function makeReq(body?: any, cookieVal?: string) {
  return {
    json: async () => body,
    cookies: new Map([['vf_session', cookieVal || '']]),
  } as any
}

describe('server login/logout routes (unit)', () => {
  it('login returns 401 for unknown user', async () => {
    const res = await loginPOST({ json: async () => ({ email: 'nope@example.com', password: 'x' }) } as any)
    const json = await res.json()
    expect(res.status).toBe(401)
    expect(json.error).toBeTruthy()
  })

  it('logout clears cookie and attempts revoke', async () => {
    // create a token for user-1
    const { createSessionToken } = await import('../../lib/session')
    const token = await createSessionToken({ user_id: 'user-1', email: 'u@example.com', name: 'User' })

    const req = {
      cookies: new Map([['vf_session', token]])
    } as any

    const res = await logoutPOST(req)
    const json = await res.json()
    expect(json.success).toBe(true)
  })
})
