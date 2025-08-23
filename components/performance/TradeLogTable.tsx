"use client"

import React from "react"

type Trade = {
  timestamp?: string
  botName?: string
  symbol?: string
  type?: string
  quantity?: number
  price?: number
  value?: number
}

type Props = {
  trades: Trade[]
  onSort?: (key: string) => void
  onExport?: () => void
  sortKey?: string
  sortDir?: "asc" | "desc"
  className?: string
}

/**
 * TradeLogTable
 * Minimal, typed presentational table extracted from PerformanceDashboard.
 * - keeps rendering identical to previous inline table
 * - callers provide sortedTrades and handlers for sort/export
 */
export default function TradeLogTable({
  trades = [],
  onSort,
  onExport,
  sortKey = "date",
  sortDir = "desc",
  className = "",
}: Props) {
  const fmtDate = (d?: string) => {
    if (!d) return ""
    try {
      return new Date(d).toISOString().slice(0, 10)
    } catch {
      return d
    }
  }

  return (
    <div className={className}>
      <div className="flex items-center justify-between mb-3">
        <div className="flex gap-2">
          <button className={`btn ${sortKey === "date" ? "btn-primary" : "btn-ghost"}`} onClick={() => onSort?.("date")}>
            Date
          </button>
          <button className={`btn ${sortKey === "symbol" ? "btn-primary" : "btn-ghost"}`} onClick={() => onSort?.("symbol")}>
            Symbol
          </button>
          <button className={`btn ${sortKey === "type" ? "btn-primary" : "btn-ghost"}`} onClick={() => onSort?.("type")}>
            Action
          </button>
        </div>

        <div className="flex gap-2">
          <button className="btn" onClick={onExport}>Export Trades CSV</button>
          <button className="btn" onClick={() => onSort?.("value")}>Sort P&L</button>
        </div>
      </div>

      <div className="max-h-[420px] overflow-auto">
        <table className="min-w-full divide-y">
          <thead>
            <tr className="text-xs text-muted-foreground">
              <th className="p-2 text-left">Date</th>
              <th className="p-2 text-left">Bot</th>
              <th className="p-2 text-left">Symbol</th>
              <th className="p-2 text-left">Action</th>
              <th className="p-2 text-right">Qty</th>
              <th className="p-2 text-right">Price</th>
              <th className="p-2 text-right">Value</th>
            </tr>
          </thead>
          <tbody>
            {trades.length === 0 && (
              <tr>
                <td colSpan={7} className="p-6 text-center text-sm text-muted-foreground">No trades</td>
              </tr>
            )}
            {trades.map((t, i) => (
              <tr key={i} className="hover:bg-muted/30">
                <td className="p-2">{fmtDate(t.timestamp)}</td>
                <td className="p-2">{t.botName}</td>
                <td className="p-2">{t.symbol}</td>
                <td className="p-2">{t.type}</td>
                <td className="p-2 text-right">{typeof t.quantity === "number" ? t.quantity.toFixed(4) : ""}</td>
                <td className="p-2 text-right">${(t.price ?? 0).toFixed(2)}</td>
                <td className={`p-2 text-right ${(t.value ?? 0) >= 0 ? "text-green-500" : "text-red-500"}`}>{(t.value ?? 0).toFixed(2)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
