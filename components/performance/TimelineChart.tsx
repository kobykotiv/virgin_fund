import React, { useMemo } from "react"
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts"
import type { BacktestResult } from "@/types/backtest"
import { format } from "date-fns"

type TimelinePoint = {
  date: string
  value: number
  name?: string
  id?: string | number
}

type Props = {
  timeline: TimelinePoint[]
  comparisonResults?: BacktestResult[]
  height?: number
  colors?: string[]
}

function fmtDate(d?: string) {
  if (!d) return ""
  try {
    return format(new Date(d), "yyyy-MM-dd")
  } catch {
    return String(d)
  }
}

/**
 * TimelineChart
 * - Renders the equity timeline (final capital) and optional comparison overlays.
 * - Defensive: accepts possibly-empty arrays and guards rendering accordingly.
 */
export default function TimelineChart({ timeline, comparisonResults = [], height = 340, colors }: Props) {
  const COLORS = colors ?? ["#60A5FA", "#34D399", "#F97316", "#F87171", "#A78BFA", "#FBBF24"]

  const sanitizedTimeline = useMemo(() => {
    return Array.isArray(timeline) ? timeline : []
  }, [timeline])

  const sanitizedComparisons = useMemo(() => {
    return Array.isArray(comparisonResults) ? comparisonResults : []
  }, [comparisonResults])

  if (sanitizedTimeline.length === 0 && sanitizedComparisons.length === 0) {
    return <div className="h-[340px] flex items-center justify-center text-sm text-muted-foreground">No timeline data</div>
  }

  return (
    <div className={`h-[${height}px]`} style={{ height }}>
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={sanitizedTimeline}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="date" tickFormatter={(v) => fmtDate(String(v))} />
          <YAxis />
          <Tooltip labelFormatter={(v) => fmtDate(String(v))} />
          <Legend />
          <Line
            type="monotone"
            dataKey="value"
            stroke="hsl(var(--primary))"
            name="Final Capital"
            dot={false}
            isAnimationActive={false}
          />
          {sanitizedComparisons.map((cr, idx) => {
            const series =
              Array.isArray(cr.equityCurve) && cr.equityCurve.length
                ? cr.equityCurve.map((p) => ({ date: p.timestamp, value: p.equity }))
                : []
            if (!series.length) return null
            return (
              <Line
                key={String(cr.id ?? idx)}
                type="monotone"
                data={series}
                dataKey="value"
                stroke={COLORS[idx % COLORS.length]}
                strokeDasharray="4 2"
                name={`${cr.botName ?? cr.id} (comp)`}
                dot={false}
                isAnimationActive={false}
              />
            )
          })}
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}
