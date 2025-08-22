"use client"

import { motion } from "framer-motion"
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  LineChart,
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
} from "recharts"
import type { BacktestResult } from "@/types/backtest"

/**
 * BacktestCharts
 * - Renders primary equity area + optional line overlay(s) for comparison results.
 * - Lightweight, focused component so the larger BacktestResults can be split into smaller pieces.
 *
 * Props:
 * - result: main BacktestResult
 * - comparisonResults?: array of BacktestResult to overlay on the equity chart
 * - height?: pixel height for the chart container (defaults to 360)
 *
 * Notes:
 * - Expects BacktestResult.equityCurve to be [{ timestamp: string, equity: number }, ...]
 * - Uses simple deterministic color palette for overlays
 */

export default function BacktestCharts({
  result,
  comparisonResults,
  height = 360,
}: {
  result: BacktestResult
  comparisonResults?: BacktestResult[]
  height?: number
}) {
  const main = result?.equityCurve ?? []
  const equityData = main.map((p) => ({ date: p.timestamp, equity: p.equity }))

  const overlaySeries = (comparisonResults ?? []).map((cr, idx) => {
    return {
      id: cr.id ?? `cmp-${idx}`,
      name: cr.botName ?? `Comparison ${idx + 1}`,
      color: `hsl(${(idx + 1) * 60}, 70%, 45%)`,
      data: cr.equityCurve.map((p) => ({ date: p.timestamp, equity: p.equity })),
    }
  })

  // Simple formatter helpers
  const formatCurrency = (v: number) =>
    new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(v)

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.35 }}>
      <div style={{ height }}>
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={equityData} margin={{ top: 8, right: 30, left: 8, bottom: 8 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" tickFormatter={(v) => new Date(v).toLocaleDateString()} />
            <YAxis />
            <Tooltip
              formatter={(value: any) => [formatCurrency(Number(value)), "Equity"]}
              labelFormatter={(value) => new Date(String(value)).toLocaleString()}
            />
            <Legend />
            <AreaChart data={equityData}>
              <Area
                type="monotone"
                dataKey="equity"
                stroke="hsl(var(--primary))"
                fill="hsl(var(--primary)/0.12)"
                name={result.botName ?? "Portfolio"}
                isAnimationActive={false}
              />
            </AreaChart>

            <Line
              type="monotone"
              dataKey="equity"
              stroke="hsl(var(--primary))"
              name={result.botName ?? "Portfolio"}
              dot={false}
              activeDot={{ r: 6 }}
              isAnimationActive={false}
            />

            {overlaySeries.map((s) => (
              <Line
                key={s.id}
                data={s.data}
                dataKey="equity"
                stroke={s.color}
                name={s.name}
                dot={false}
                strokeDasharray="3 2"
                isAnimationActive={false}
              />
            ))}
          </LineChart>
        </ResponsiveContainer>
      </div>
    </motion.div>
  )
}

/**
 * Simple helper component to render a compact legend for comparison series.
 * Exported for optional use by parent that wants a legend or series toggles.
 */
export function ComparisonLegend({ comparisonResults }: { comparisonResults?: BacktestResult[] }) {
  if (!comparisonResults || comparisonResults.length === 0) return null

  return (
    <div className="flex flex-wrap gap-3">
      {comparisonResults.map((cr, idx) => (
        <div key={cr.id ?? idx} className="flex items-center gap-2 text-sm">
          <span
            className="inline-block w-4 h-3 rounded"
            style={{ background: `hsl(${(idx + 1) * 60}, 70%, 45%)` }}
          />
          <span className="font-medium">{cr.botName ?? `Comparison ${idx + 1}`}</span>
        </div>
      ))}
    </div>
  )
}
