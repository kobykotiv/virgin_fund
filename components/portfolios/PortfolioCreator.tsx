"use client"

import React, { useState } from 'react'

type Preset = 'top5_coins' | 'top10_stocks' | 'grid_1pct_coins' | 'custom'

export default function PortfolioCreator() {
  const [preset, setPreset] = useState<Preset>('top5_coins')
  const [frequency, setFrequency] = useState<'daily' | 'weekly' | 'monthly'>('monthly')
  const [allocationPercent, setAllocationPercent] = useState<number>(1)
  const [funds, setFunds] = useState<number>(10000)
  const [customTickers, setCustomTickers] = useState<string>('')
  const [deployToAlpaca, setDeployToAlpaca] = useState<boolean>(false)
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<any | null>(null)

  const handleCreate = async () => {
    setLoading(true)
    setResult(null)
    try {
      const payload = {
        preset,
        frequency,
        allocationPercent,
        funds,
        customTickers: customTickers.split(',').map(s => s.trim()).filter(Boolean),
        deployToAlpaca,
      }

      const res = await fetch('/api/portfolios/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })

      const json = await res.json()
      setResult(json)
    } catch (e) {
      setResult({ error: (e as Error).message })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="p-4 border rounded space-y-4">
      <h3 className="text-lg font-semibold">Create Portfolio</h3>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
        <label className="flex flex-col">
          <span className="text-sm">Preset</span>
          <select value={preset} onChange={(e) => setPreset(e.target.value as Preset)} className="input">
            <option value="top5_coins">Top 5 coins by market cap (equal weight)</option>
            <option value="top10_stocks">Top 10 stocks by market cap (equal weight)</option>
            <option value="grid_1pct_coins">1% grid portfolios (coins)</option>
            <option value="custom">Custom tickers / basket</option>
          </select>
        </label>

        <label className="flex flex-col">
          <span className="text-sm">Rebalance Frequency</span>
          <select value={frequency} onChange={(e) => setFrequency(e.target.value as any)} className="input">
            <option value="daily">Daily</option>
            <option value="weekly">Weekly</option>
            <option value="monthly">Monthly</option>
          </select>
        </label>

        <label className="flex flex-col">
          <span className="text-sm">Per-asset allocation (%)</span>
          <input type="number" value={allocationPercent} onChange={(e) => setAllocationPercent(Number(e.target.value))} className="input" />
          <small className="text-xs text-muted-foreground">Each asset will receive this percentage of the portfolio (proportional resizing applied).</small>
        </label>

        <label className="flex flex-col">
          <span className="text-sm">Virtual funds amount (USD)</span>
          <input type="number" value={funds} onChange={(e) => setFunds(Number(e.target.value))} className="input" />
        </label>
      </div>

      {preset === 'custom' && (
        <label className="flex flex-col">
          <span className="text-sm">Custom tickers (comma separated)</span>
          <input value={customTickers} onChange={(e) => setCustomTickers(e.target.value)} className="input" placeholder="AAPL, MSFT, BTCUSD" />
        </label>
      )}

      <div className="flex items-center gap-2">
        <label className="flex items-center gap-2">
          <input type="checkbox" checked={deployToAlpaca} onChange={(e) => setDeployToAlpaca(e.target.checked)} />
          <span className="text-sm">Deploy as virtual orders via Alpaca paper API</span>
        </label>
      </div>

      <div className="flex gap-2">
        <button className="btn" onClick={handleCreate} disabled={loading}>{loading ? 'Creating…' : 'Preview / Create'}</button>
      </div>

      {result && (
        <div className="mt-4 p-3 bg-muted rounded">
          <pre className="text-xs overflow-auto max-h-64">{JSON.stringify(result, null, 2)}</pre>
        </div>
      )}
    </div>
  )
}
