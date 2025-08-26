"use client"

import React, { useEffect, useState, useRef } from 'react'

type PriceEntry = {
  price: number
  source?: string
  symbol?: string
}

type PricesMap = Record<string, PriceEntry>

const DEFAULT_SYMBOLS = [
  'AAPL', 'MSFT', 'NVDA', 'TSLA', 'AMZN', 'GOOGL', 'SPY', 'QQQ', 'BTCUSD', 'ETHUSD'
]

export default function AlpacaOverview({ symbols = DEFAULT_SYMBOLS }: { symbols?: string[] }) {
  const [prices, setPrices] = useState<PricesMap>({})
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const esRef = useRef<EventSource | null>(null)

  useEffect(() => {
    let mounted = true
    async function load() {
      try {
        setLoading(true)
        const res = await fetch(`/api/market-data/alpaca?symbols=${encodeURIComponent(symbols.join(','))}`)
        if (!res.ok) throw new Error(await res.text())
        const json = await res.json()
        if (!mounted) return
        // expected shape: { SYMBOL: { price, source } }
        setPrices(json)
      } catch (err: any) {
        console.error('AlpacaOverview fetch error', err)
        setError(err?.message || String(err))
      } finally {
        setLoading(false)
      }
    }

    load()

    // connect SSE stream to receive live updates
    try {
      const qs = `symbols=${encodeURIComponent(symbols.join(','))}`
      const url = `/api/market-data/alpaca/stream?${qs}`
      const es = new EventSource(url)
      esRef.current = es
      es.onmessage = (evt) => {
        try {
          const payload = JSON.parse(evt.data)
          // payload expected like { symbol: 'AAPL', price: 123.45 }
          if (!payload) return
          setPrices((prev) => {
            const copy = { ...prev }
            const sym = (payload.symbol || payload.s || '').toUpperCase()
            if (!sym) return prev
            copy[sym] = { price: payload.price ?? payload.p ?? payload.last_price ?? copy[sym]?.price ?? 0, source: 'alpaca', symbol: sym }
            return copy
          })
        } catch (e) {
          // ignore parse errors
        }
      }
      es.onerror = (e) => {
        // EventSource will retry automatically; surface a non-fatal notice
        console.warn('Alpaca SSE error', e)
      }
    } catch (e) {
      console.warn('Failed to start SSE', e)
    }

    return () => {
      mounted = false
      try {
        esRef.current?.close()
      } catch (e) {
        /* ignore */
      }
    }
  }, [symbols.join(',')])

  function formatPrice(n?: number) {
    if (n == null || Number.isNaN(n)) return '—'
    return n >= 1000 ? n.toLocaleString(undefined, { maximumFractionDigits: 2 }) : n.toFixed(2)
  }

  return (
    <div className="p-6">
      <div className="max-w-6xl mx-auto">
        <header className="mb-6">
          <h1 className="text-3xl font-semibold">Alpaca Markets — Live Overview</h1>
          <p className="text-sm text-muted-foreground mt-1">Real-time Alpaca price feed, quotes and market snapshot.</p>
        </header>

        {error && (
          <div className="mb-4 text-red-600">Failed to load Alpaca data: {error}</div>
        )}

        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {symbols.map((sym) => {
            const entry = prices[sym] || { price: undefined }
            const price = entry.price
            return (
              <article key={sym} className="bg-white/5 border border-white/6 rounded-lg p-4 shadow-sm hover:shadow-md transition">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-sm text-muted-foreground">{sym}</div>
                    <div className="text-xl md:text-2xl font-medium mt-1">{formatPrice(price)}</div>
                  </div>
                  <div className="text-right">
                    <div className="text-xs text-muted-foreground">{entry.source ?? 'alpaca'}</div>
                    <div className="text-xs text-muted-foreground">Live</div>
                  </div>
                </div>

                <div className="mt-3 flex gap-2 text-sm text-muted-foreground">
                  <div className="px-2 py-1 rounded bg-green-900/40">Market</div>
                  <div className="px-2 py-1 rounded bg-blue-900/40">Alpaca</div>
                  <div className="px-2 py-1 rounded bg-slate-900/40">Updated</div>
                </div>
              </article>
            )
          })}
        </section>

        <footer className="mt-6 text-xs text-muted-foreground">Data provided by Alpaca Markets via server proxies; secrets remain server-side.</footer>
      </div>
    </div>
  )
}
