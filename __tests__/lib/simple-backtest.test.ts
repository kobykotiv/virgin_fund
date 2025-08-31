import { describe, it, expect } from 'vitest'
import { runSimpleBacktest } from '@/lib/simple-backtest'

describe('simple-backtest', () => {
  it('runs and returns expected shape', () => {
    const config = { conditions: [{ type: 'price', operator: 'above', value: '0' }] }
    const res = runSimpleBacktest(config as any, { symbol: 'MOCK', lookback: 100 })
    expect(res).toHaveProperty('signals')
    expect(res).toHaveProperty('hitRate')
    expect(Array.isArray(res.returns)).toBe(true)
  })
})
