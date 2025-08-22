"use client"

import { useEffect, useMemo, useState } from "react"
import { motion } from "framer-motion"
import type { BacktestResult } from "@/types/backtest"

/**
 * ComparisonPanel
 * - Renders toggles for comparison backtests with animated state.
 * - Parent can pass comparisonResults and receive selected ids via onChange.
 *
 * Props:
 * - comparisonResults?: BacktestResult[]
 * - initialVisible?: boolean (default: true)
 * - onChange?: (visibleIds: string[]) => void
 */

export default function ComparisonPanel({
  comparisonResults,
  initialVisible = true,
  onChange,
}: {
  comparisonResults?: BacktestResult[]
  initialVisible?: boolean
  onChange?: (visibleIds: string[]) => void
}) {
  const results = comparisonResults ?? []

  // stable ids for each series
  const ids = useMemo(() => results.map((r, idx) => (r.id ? String(r.id) : `cmp-${idx}`)), [results])

  const [visible, setVisible] = useState<Record<string, boolean>>(() =>
    ids.reduce((acc, id) => {
      acc[id] = initialVisible
      return acc
    }, {} as Record<string, boolean>)
  )

  // keep visible map in sync when results change
  useEffect(() => {
    setVisible((prev) => {
      const next: Record<string, boolean> = {}
      ids.forEach((id) => {
        next[id] = id in prev ? prev[id] : initialVisible
      })
      return next
    })
  }, [ids, initialVisible])

  useEffect(() => {
    if (!onChange) return
    onChange(Object.keys(visible).filter((id) => visible[id]))
  }, [visible, onChange])

  const toggle = (id: string) => {
    setVisible((s) => ({ ...s, [id]: !s[id] }))
  }

  if (results.length === 0) return null

  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center justify-between">
        <div className="text-sm font-medium">Comparison Series</div>
        <div className="text-xs text-muted-foreground">Toggle overlays</div>
      </div>

      <div className="flex flex-wrap gap-2">
        {results.map((r, idx) => {
          const id = r.id ? String(r.id) : `cmp-${idx}`
          const color = `hsl(${(idx + 1) * 60}, 70%, 45%)`
          const isVisible = Boolean(visible[id])

          return (
            <motion.button
              key={id}
              onClick={() => toggle(id)}
              initial={{ opacity: 0, y: -4 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.15, delay: idx * 0.02 }}
              className={`inline-flex items-center gap-2 px-3 py-1 rounded-md border text-sm focus:outline-none ${
                isVisible ? "bg-muted/60 border-transparent" : "bg-transparent border-border"
              }`}
              style={{ borderColor: isVisible ? color : undefined }}
              aria-pressed={isVisible}
              type="button"
            >
              <span
                className="inline-block w-3 h-3 rounded"
                style={{ background: color }}
                aria-hidden
              />
              <span className="truncate max-w-[10rem]">{r.botName ?? `Comparison ${idx + 1}`}</span>
              <span className="ml-2 text-xs text-muted-foreground">{isVisible ? "on" : "off"}</span>
            </motion.button>
          )
        })}
      </div>
    </div>
  )
}
