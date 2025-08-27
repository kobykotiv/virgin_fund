"use client"
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { useEffect, useRef } from 'react'

export type MarketSource = 'coingecko' | 'alpaca'
export interface MarketTicker {
  symbol: string
  price: number
  source: MarketSource
  series?: number[]
}

interface UseMarketDataOptions {
  realtime?: boolean
  streamEndpoint?: string
}

async function fetchCoinGecko(symbols: string[]) {
  try {
    const res = await fetch(`/api/coingecko/prices?symbols=${encodeURIComponent(symbols.join(','))}`)
    if (!res.ok) return {}
    const json = await res.json()
    const prices = json?.prices || json || {}
    return Object.fromEntries(Object.entries(prices).map(([k, v]: any) => [k, { symbol: k, price: v?.price ?? v, source: 'coingecko' as MarketSource }]))
  } catch {
    return {}
  }
}

async function fetchAlpaca(symbols: string[]) {
  try {
    const res = await fetch(`/api/alpaca/prices?symbols=${encodeURIComponent(symbols.join(','))}`)
    if (!res.ok) return {}
    const json = await res.json()
    const prices = json?.prices || json || {}
    return Object.fromEntries(Object.entries(prices).map(([k, v]: any) => [k, { symbol: k, price: v?.price ?? v, source: 'alpaca' as MarketSource }]))
  } catch {
    return {}
  }
}

export default function useMarketData(
  coingeckoSymbols: string[] = [],
  alpacaSymbols: string[] = [],
  options: UseMarketDataOptions = {}
) {
  const qc = useQueryClient()
  const queryKey = ['market-data', coingeckoSymbols.slice().sort().join(','), alpacaSymbols.slice().sort().join(',')]

  const query = useQuery({
    queryKey,
    queryFn: async () => {
      const [cg, alp] = await Promise.all([fetchCoinGecko(coingeckoSymbols || []), fetchAlpaca(alpacaSymbols || [])])
      const merged: Record<string, MarketTicker> = { ...cg, ...alp }
      if (Object.keys(merged).length === 0) {
        // fallback demo data
        return {
          BTC: { symbol: 'BTC', price: 30000, source: 'coingecko' },
          ETH: { symbol: 'ETH', price: 1800, source: 'coingecko' },
          AAPL: { symbol: 'AAPL', price: 150, source: 'alpaca' },
        }
      }
      return merged
    },
    staleTime: 10_000,
    refetchInterval: options.realtime ? 5_000 : false,
  })

  const startedRef = useRef(false)
  useEffect(() => {
    if (!options.realtime || startedRef.current) return
    const all = [...(coingeckoSymbols || []), ...(alpacaSymbols || [])]
    if (!all.length) return
    startedRef.current = true
    const endpoint = options.streamEndpoint || '/api/market-data/stream'
    const es = new EventSource(`${endpoint}?symbols=${encodeURIComponent(all.join(','))}`)
    es.onmessage = (ev) => {
      try {
        const payload = JSON.parse(ev.data)
        if (payload?.type === 'quote' && payload.symbol && typeof payload.price === 'number') {
          qc.setQueryData<Record<string, MarketTicker>>(queryKey, (prev = {} as any) => ({
            ...prev,
            [payload.symbol]: { symbol: payload.symbol, price: payload.price, source: (payload.source || prev[payload.symbol]?.source || 'alpaca') as MarketSource },
          }))
        }
      } catch {}
    }
    es.onerror = () => { try { es.close() } catch {} }
    return () => { try { es.close() } catch {} }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [options.realtime, options.streamEndpoint, coingeckoSymbols.join(','), alpacaSymbols.join(',')])

  return {
    data: query.data,
    isLoading: query.isLoading,
    error: query.error,
    refetch: query.refetch,
  }
}

// allow both default and named imports
export { useMarketData }
