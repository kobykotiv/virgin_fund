"use client"

import React, { useState } from "react"
import { motion } from "framer-motion"
import {
  ResponsiveContainer,
  LineChart,
  Line,
  Area,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ReferenceLine,
} from "recharts"
import type { BacktestResult } from "@/types/backtest"

type Props = {
  result: BacktestResult
  comparisonResults?: BacktestResult[]
  height?: number
}

export default function BacktestCharts({ result, comparisonResults = [], height = 360 }: Props) {
  const main = result?.equityCurve ?? []
  const [scrubIndex, setScrubIndex] = useState<number | null>(null)
  const displayedIndex = scrubIndex === null ? Math.max(0, main.length - 1) : scrubIndex
  const displayedPoint = main[Math.max(0, Math.min(main.length - 1, displayedIndex))]

  const equityData = main.slice(0, displayedIndex + 1).map((p) => ({ date: p.timestamp, equity: p.equity }))

  const overlaySeries = comparisonResults.map((cr, idx) => ({
    id: cr.id ?? `cmp-${idx}`,
    name: cr.botName ?? `Comparison ${idx + 1}`,
    color: `hsl(${(idx + 1) * 60}, 70%, 45%)`,
    data: cr.equityCurve.map((p) => ({ date: p.timestamp, equity: p.equity })),
  }))

  const formatCurrency = (v: number) => new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(v)

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.15 }}>
      <div style={{ height }}>
        <div className="px-3 mb-2 flex items-center gap-4">
          <div className="flex-1">
            <input
              aria-label="time-travel"
              type="range"
              min={0}
              max={Math.max(0, main.length - 1)}
              value={displayedIndex}
              onChange={(e) => setScrubIndex(Number(e.target.value))}
              className="w-full"
            />
          </div>
          <div className="w-48 text-right text-sm">
            {displayedPoint ? `${new Date(displayedPoint.timestamp).toLocaleString()} — ${formatCurrency(displayedPoint.equity)}` : "—"}
          </div>
        </div>

        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={equityData} margin={{ top: 8, right: 30, left: 8, bottom: 8 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" tickFormatter={(v) => new Date(String(v)).toLocaleDateString()} />
            <YAxis />
            <Tooltip formatter={(value: any) => [formatCurrency(Number(value)), "Equity"]} labelFormatter={(value) => new Date(String(value)).toLocaleString()} />
            <Legend />

            <Area type="monotone" dataKey="equity" stroke="hsl(var(--primary))" fill="hsl(var(--primary)/0.12)" name={result.botName ?? "Portfolio"} isAnimationActive={false} />

            <Line type="monotone" dataKey="equity" stroke="hsl(var(--primary))" name={result.botName ?? "Portfolio"} dot={false} activeDot={{ r: 6 }} isAnimationActive={false} />

            {overlaySeries.map((s) => (
              <Line key={s.id} data={s.data} dataKey="equity" stroke={s.color} name={s.name} dot={false} strokeDasharray="3 2" isAnimationActive={false} />
            ))}

            {displayedIndex !== null && displayedIndex >= 0 && equityData[displayedIndex] && (
              <ReferenceLine x={equityData[displayedIndex].date} stroke="rgba(0,0,0,0.2)" strokeDasharray="3 3" />
            )}
          </LineChart>
        </ResponsiveContainer>
      </div>
    </motion.div>
  )
}

// Simple comparison legend used by backtest results UI
export function ComparisonLegend({ comparisonResults = [] }: { comparisonResults?: BacktestResult[] }) {
  if (!comparisonResults || comparisonResults.length === 0) return null
  return (
    <div className="flex flex-wrap gap-2 items-center">
      {comparisonResults.map((cr, idx) => {
        const id = cr.id ?? `cmp-${idx}`
        const color = `hsl(${(idx + 1) * 60}, 70%, 45%)`
        const name = cr.botName ?? `Comparison ${idx + 1}`
        return (
          <div key={id} className="flex items-center gap-2 text-sm">
            <span style={{ width: 12, height: 12, background: color, display: "inline-block", borderRadius: 3 }} />
            <span>{name}</span>
          </div>
        )
      })}
    </div>
  )
}
          const formatCurrency = (v: number) => new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(v);
