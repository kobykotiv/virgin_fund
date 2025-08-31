import { vi } from 'vitest'

// Set up environment variables before any imports
process.env.NEXT_PUBLIC_SUPABASE_URL = 'https://mock.supabase.co'
process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY = 'mock.key.for.testing'
process.env.SUPABASE_URL = 'https://mock.supabase.co'
process.env.SUPABASE_SERVICE_KEY = 'mock.service.key'
process.env.SUPABASE_SERVICE_ROLE_KEY = 'mock.service.role.key'
process.env.JWT_SECRET = 'test-secret'

// Mock @supabase/supabase-js at the global level with common chainable DB methods
vi.mock('@supabase/supabase-js', () => {
  const mockFromObj: any = {}
  mockFromObj.select = vi.fn(() => mockFromObj)
  mockFromObj.update = vi.fn(async (payload: any) => ({ data: payload ? [payload] : [], error: null }))
  mockFromObj.insert = vi.fn(async (payload: any) => ({ data: payload ? [payload] : [], error: null }))
  mockFromObj.upsert = vi.fn(async (payload: any) => ({ data: payload ? [payload] : [], error: null }))
  mockFromObj.delete = vi.fn(async () => ({ data: [], error: null }))
  mockFromObj.eq = vi.fn(() => mockFromObj)
  mockFromObj.in = vi.fn(() => mockFromObj)
  mockFromObj.rpc = vi.fn(async () => ({ data: [], error: null }))

  const createClient = vi.fn(() => ({
    from: vi.fn(() => mockFromObj),
  }))

  return { createClient }
})

// Polyfill crypto for jose in test environment (Node < 20 compatibility)
if (typeof (globalThis as any).crypto === 'undefined') {
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const nodeCrypto = require('crypto')
  ;(globalThis as any).crypto = nodeCrypto.webcrypto
}

import { vi } from 'vitest';

// Set up environment variables before any imports
process.env.NEXT_PUBLIC_SUPABASE_URL = 'https://mock.supabase.co';
process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY = 'mock.key.for.testing';
process.env.SUPABASE_URL = 'https://mock.supabase.co';
process.env.SUPABASE_SERVICE_KEY = 'mock.service.key';
process.env.SUPABASE_SERVICE_ROLE_KEY = 'mock.service.role.key';
process.env.JWT_SECRET = 'test-secret';

// Mock @supabase/supabase-js at the global level
vi.mock('@supabase/supabase-js', () => ({
  createClient: vi.fn(() => ({
    from: vi.fn(() => ({
      select: vi.fn(() => ({
        in: vi.fn(() => ({
          eq: vi.fn(() => ({
            data: [],
            error: null
          }))
        }))
      }))
    }))
  }))
}));

// Polyfill crypto for jose in test environment (Node < 20 compatibility)
if (typeof (globalThis as any).crypto === 'undefined') {
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const nodeCrypto = require('crypto')
  ;(globalThis as any).crypto = nodeCrypto.webcrypto
}
