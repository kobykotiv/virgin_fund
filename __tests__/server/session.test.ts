import { describe, it, expect } from 'vitest'
import { createSessionToken, verifySessionToken } from '../../lib/session'

describe('session token create/verify', async () => {
  it('creates and verifies a token', async () => {
    const payload = { user_id: 'test-user', role: 'free', email: 'test@example.com' }
    const token = await createSessionToken(payload)
    expect(typeof token).toBe('string')

    const verified = await verifySessionToken(token)
    expect(verified).toBeTruthy()
    // jose returns claims as strings/numbers; ensure our claims are present
    expect((verified as any).user_id).toBe(payload.user_id)
    expect((verified as any).role).toBe(payload.role)
    expect((verified as any).email).toBe(payload.email)
  })
})
