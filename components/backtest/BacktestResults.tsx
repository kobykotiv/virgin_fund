import React from 'react'
import type { BacktestResult } from '@/types/api'
import TradeTable from './TradeTable'
import EquityChart from './EquityChart'

export default function BacktestResults({ result }: { result?: BacktestResult }) {
  if (!result) return <div className="p-4">No backtest result available.</div>

  return (
    <div className="p-4 space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-medium">Backtest Summary</h3>
        <div className="text-sm text-gray-600">Initial: {result.initialCapital ?? 'N/A'} — Trades: {(result.trades || []).length}</div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="col-span-1">
          <EquityChart equity={result.equityCurve || result.equity || []} />
        </div>
        <div className="col-span-1">
          <div className="bg-white p-2 rounded border">
            <h4 className="text-sm font-medium mb-2">Metrics</h4>
            <div className="text-sm text-gray-700">Sharpe: {result.metrics?.sharpe ?? '—'}</div>
            <div className="text-sm text-gray-700">Max Drawdown: {result.metrics?.maxDrawdown ?? '—'}</div>
            <div className="text-sm text-gray-700">Win Rate: {result.metrics?.winRate ?? '—'}</div>
          </div>
        </div>
      </div>

      <div>
        <TradeTable trades={result.trades || []} />
      </div>
    </div>
  )
}
