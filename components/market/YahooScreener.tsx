"use client"

import React, { useEffect, useState } from 'react'

interface YahooScreenerProps {
  onSelect?: (symbol: string) => void
}

export default function YahooScreener({ onSelect }: YahooScreenerProps) {
  const [trending, setTrending] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let mounted = true
    async function load() {
      setLoading(true)
      setError(null)
      try {
        const url = `https://query2.finance.yahoo.com/v1/finance/trending/us`
        let res
        try {
          res = await fetch(url)
        } catch (e) {
          // fallback to server proxy if CORS blocks
          res = await fetch('/api/proxy/yahoo-trending')
        }
        const json = res ? await res.json().catch(() => ({})) : {}
        // try common locations
        const list = (json.finance && json.finance.result && json.finance.result[0] && json.finance.result[0].quotes) || json.quotes || json || []
        if (!Array.isArray(list)) {
          setTrending([])
        } else if (mounted) {
          setTrending(list.slice(0, 50))
        }
      } catch (e: any) {
        setError(e?.message ?? 'Failed to load trending')
      } finally {
        if (mounted) setLoading(false)
      }
    }
    load()
    return () => { mounted = false }
  }, [])

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-medium">Trending (Yahoo Finance)</h3>
        {loading && <div className="text-xs text-muted-foreground">Loading…</div>}
      </div>
      {error && <div className="text-sm text-destructive">{error}</div>}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-64 overflow-auto">
        {trending.map((t: any) => (
          <button
            key={t.symbol ?? t.shortname}
            className="p-2 text-left rounded hover:bg-slate-50"
            onClick={() => onSelect?.(t.symbol ?? t.shortname)}
          >
            <div className="font-medium">{t.symbol}</div>
            <div className="text-xs text-muted-foreground">{t.shortname ?? t.longname ?? t.exchDisp}</div>
          </button>
        ))}
        {trending.length === 0 && !loading && <div className="text-sm text-muted-foreground">No trending symbols available.</div>}
      </div>
    </div>
  )
}
