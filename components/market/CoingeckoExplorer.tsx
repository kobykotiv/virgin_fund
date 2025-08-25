"use client"

import React, { useState } from 'react'
import { useCoingeckoTop, useCoingeckoCoin } from '@/hooks/useCoingecko'

export default function CoingeckoExplorer() {
  const [page, setPage] = useState(1)
  const { data: coins, isLoading } = useCoingeckoTop(page, 100)
  const [selected, setSelected] = useState<string | null>(null)
  const { data: coinDetail } = useCoingeckoCoin(selected ?? undefined)

  return (
    <div className="p-4">
      <h2 className="text-xl font-semibold mb-4">CoinGecko Explorer — Top Coins</h2>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="col-span-1">
          <div className="space-y-2 max-h-[600px] overflow-auto">
            {isLoading && <div>Loading...</div>}
            {coins?.map((c: any) => (
              <button key={c.id} className="w-full text-left p-2 rounded hover:bg-gray-50" onClick={() => setSelected(c.id)}>
                <div className="flex items-center gap-3">
                  <img src={c.image} alt={c.symbol} className="h-6 w-6" />
                  <div>
                    <div className="font-medium">{c.name}</div>
                    <div className="text-xs text-muted-foreground">{c.symbol.toUpperCase()} • ${Number(c.current_price).toLocaleString()}</div>
                  </div>
                </div>
              </button>
            ))}
            <div className="flex gap-2 mt-2">
              <button className="btn btn-sm" onClick={() => setPage((p) => Math.max(1, p - 1))}>Prev</button>
              <button className="btn btn-sm" onClick={() => setPage((p) => p + 1)}>Next</button>
            </div>
          </div>
        </div>
        <div className="col-span-3">
          {selected ? (
            <div>
              <h3 className="text-2xl font-semibold">{coinDetail?.name} ({coinDetail?.symbol?.toUpperCase()})</h3>
              <div className="mt-2">
                <div dangerouslySetInnerHTML={{ __html: coinDetail?.description ?? '' }} className="prose max-w-none" />
                <div className="mt-4">
                  <h4 className="font-medium">Market Data</h4>
                  <pre className="text-xs bg-slate-50 p-2 rounded max-h-64 overflow-auto">{JSON.stringify(coinDetail?.market_data ?? {}, null, 2)}</pre>
                </div>
                <div className="mt-4">
                  <h4 className="font-medium">Community</h4>
                  <pre className="text-xs bg-slate-50 p-2 rounded max-h-36 overflow-auto">{JSON.stringify(coinDetail?.community_data ?? {}, null, 2)}</pre>
                </div>
              </div>
            </div>
          ) : (
            <div className="text-muted-foreground">Select a coin to view details</div>
          )}
        </div>
      </div>
    </div>
  )
}
