import { describe, it, expect, vi, beforeEach } from 'vitest'
import { renderHook, waitFor } from '@testing-library/react'
import useMarketData from '@/hooks/useMarketData'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

// Mock fetch responses for snapshot
const fetchMock = vi.fn()
;(globalThis as any).fetch = fetchMock

// Simple EventSource mock
class MockEventSource {
  url: string
  onmessage: ((ev: MessageEvent) => any) | null = null
  onerror: ((ev: any) => any) | null = null
  constructor(url: string) { this.url = url }
  emit(data: any) { this.onmessage?.({ data: JSON.stringify(data) } as any) }
  close() {}
}
// Track last instance for tests
const instances: MockEventSource[] = []
;(globalThis as any).EventSource = function(url: string) { const es = new MockEventSource(url); instances.push(es); return es } as any

function wrapper({ children }: any) {
  const qc = new QueryClient({ defaultOptions: { queries: { retry: false } } })
  return <QueryClientProvider client={qc}>{children}</QueryClientProvider>
}

beforeEach(() => {
  fetchMock.mockReset()
})

describe('useMarketData', () => {
  it('returns merged snapshot data', async () => {
    fetchMock.mockImplementation((url: string) => {
      if (url.startsWith('/api/market-data/alpaca')) {
        return Promise.resolve({ ok: true, json: () => Promise.resolve({ BTCUSD: { price: 100 }, ETHUSD: { price: 200 } }) })
      }
      if (url.startsWith('https://api.coingecko.com')) {
        return Promise.resolve({ ok: true, json: () => Promise.resolve({ bitcoin: { usd: 30000 }, ethereum: { usd: 1800 } }) })
      }
      return Promise.resolve({ ok: true, json: () => Promise.resolve({}) })
    })

  const { result } = renderHook(() => useMarketData(['bitcoin'], ['BTCUSD'], { realtime: false }), { wrapper })

  await waitFor(() => Object.keys(result.current.data || {}).length > 0)
  const data: any = result.current.data
  expect(data?.bitcoin.price).toBe(30000)
  expect(data?.BTCUSD.price).toBe(100)
  })

  it('applies realtime updates via EventSource', async () => {
    fetchMock.mockImplementation((url: string) => {
      if (url.startsWith('/api/market-data/alpaca')) {
        return Promise.resolve({ ok: true, json: () => Promise.resolve({ BTCUSD: { price: 100 } }) })
      }
      if (url.startsWith('https://api.coingecko.com')) {
        return Promise.resolve({ ok: true, json: () => Promise.resolve({ bitcoin: { usd: 30000 } }) })
      }
      return Promise.resolve({ ok: true, json: () => Promise.resolve({}) })
    })

  const { result } = renderHook(() => useMarketData(['bitcoin'], ['BTCUSD'], { realtime: true }), { wrapper })
  await waitFor(() => Object.keys(result.current.data || {}).length > 0)

  // Emit realtime update
  const es = instances[0]
  es.emit({ type: 'quote', symbol: 'BTCUSD', price: 150 })

  await waitFor(() => (result.current.data as any)?.BTCUSD.price === 150)
  const data: any = result.current.data
  expect(data?.BTCUSD.price).toBe(150)
  })
})
