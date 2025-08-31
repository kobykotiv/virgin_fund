import { describe, it, expect } from 'vitest'

// List of backend modules to import. Keep this list focused and safe (no network calls).
const modules = [
  '../../lib/alpaca-client',
  '../../lib/api',
  '../../lib/auth',
  '../../lib/backtest-service',
  '../../lib/bot-api',
  '../../lib/demo-data',
  '../../lib/mock-data',
  '../../lib/news-service',
  '../../server/alpaca',
  '../../server/bots',
  '../../server/index',
  '../../server/portfolio-aggregate',
  '../../server/supabaseClient',
]

describe('smoke import backend modules', () => {
  for (const p of modules) {
    it(`imports ${p}`, async () => {
      const mod = await import(p)
      expect(mod).toBeTruthy()
    })
  }
})
