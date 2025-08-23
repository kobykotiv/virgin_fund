"use client"

import { useEffect, useMemo, useState } from "react"
import { motion } from "framer-motion"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Button, buttonVariants } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  ScatterChart,
  Scatter,
  ZAxis,
} from "recharts"
import { usePerformance } from "@/hooks/usePerformance"
import TimelineChart from "@/components/performance/TimelineChart"
import TradeLogTable from "@/components/performance/TradeLogTable"
import type { BacktestResult } from "@/types/backtest"
import { format } from "date-fns"

/**
 * PerformanceDashboard
 * - Aggregates saved backtests (local fallback) and provides:
 *   - Animated metric cards
 *   - Filters + quick filters
 *   - Equity timeline, monthly returns, drawdowns, P&L-by-bot pie
 *   - Trade log table (sortable)
 *   - Comparison overlay selector
 *   - CSV export and Print-as-PDF (window.print)
 *
 * Note: migrating data to Supabase + React Query is recommended next.
 */

function fmtDate(d?: string) {
  if (!d) return ""
  try {
    return format(new Date(d), "yyyy-MM-dd")
  } catch {
    return d
  }
}

export default function PerformanceDashboard() {
  const { data: saved = [], loading: performanceLoading, error: performanceError, refetch } = usePerformance()
  const [filterBot, setFilterBot] = useState<string>("all")
  const [startDate, setStartDate] = useState<string>("")
  const [endDate, setEndDate] = useState<string>("")
  const [quick, setQuick] = useState<"all" | "7d" | "month">("all")
  const [sortKey, setSortKey] = useState<string>("date")
  const [sortDir, setSortDir] = useState<"asc" | "desc">("desc")
  const [compareIds, setCompareIds] = useState<string[]>([])

  const bots = useMemo(() => {
    return Array.from(new Set(saved.map((s) => s.botName).filter(Boolean)))
  }, [saved])

  const filtered = useMemo(() => {
    let list = saved.slice()
    if (filterBot !== "all") list = list.filter((b) => b.botName === filterBot)
    if (startDate) list = list.filter((b) => b.endDate >= startDate)
    if (endDate) list = list.filter((b) => b.startDate <= endDate)

    if (quick === "7d") {
      const cutoff = Date.now() - 7 * 24 * 60 * 60 * 1000
      list = list.filter((b) => new Date(b.endDate).getTime() >= cutoff)
    } else if (quick === "month") {
      const now = new Date()
      const monthStart = new Date(now.getFullYear(), now.getMonth(), 1).getTime()
      list = list.filter((b) => new Date(b.endDate).getTime() >= monthStart)
    }

    return list
  }, [saved, filterBot, startDate, endDate, quick])

  // Aggregated metrics
  const totalPnL = useMemo(() => filtered.reduce((acc, r) => acc + (r.totalPnL ?? 0), 0), [filtered])
  const avgSharpe = useMemo(
    () => (filtered.length ? filtered.reduce((acc, r) => acc + (r.sharpeRatio ?? 0), 0) / filtered.length : 0),
    [filtered],
  )
  const totalTrades = useMemo(() => filtered.reduce((acc, r) => acc + (r.statistics?.totalTrades ?? 0), 0), [filtered])
  const winRate = useMemo(
    () =>
      filtered.length
        ? filtered.reduce((acc, r) => acc + ((r.statistics?.winRate ?? 0) * 100), 0) / filtered.length
        : 0,
    [filtered],
  )
  const maxDrawdown = useMemo(
    () =>
      filtered.length ? Math.max(...filtered.map((r) => (r.maxDrawdown ? Math.abs(r.maxDrawdown) : 0))) : 0,
    [filtered],
  )

  // Timeline: merge equity points by endDate (basic)
  const timeline = useMemo(() => {
    return filtered
      .map((r) => ({ date: r.endDate ?? r.startDate, value: r.finalCapital ?? 0, name: r.botName, id: r.id }))
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
  }, [filtered])

  // Monthly returns aggregated (simple)
  const monthly = useMemo(() => {
    const map = new Map<string, number>()
    for (const r of filtered) {
      const d = new Date(r.endDate ?? r.startDate)
      const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`
      map.set(key, (map.get(key) ?? 0) + (r.totalPnL ?? 0))
    }
    return Array.from(map.entries()).map(([month, value]) => ({ month, value }))
  }, [filtered])

  // Drawdowns list (flattened)
  const drawdowns = useMemo(() => {
    const all = filtered.flatMap((r) =>
      (r.drawdowns ?? []).map((d) => ({ ...d, botName: r.botName, id: `${r.id}-${d.start}` })),
    )
    return all
  }, [filtered])

  // P&L by bot for pie chart
  const pnlByBot = useMemo(() => {
    const map = new Map<string, number>()
    for (const r of filtered) {
      const name = r.botName ?? "unknown"
      map.set(name, (map.get(name) ?? 0) + (r.totalPnL ?? 0))
    }
    return Array.from(map.entries()).map(([name, value]) => ({ name, value }))
  }, [filtered])

  // Trade log combined from filtered backtests (flatten trades)
  const trades = useMemo(() => {
    return filtered.flatMap((r) =>
      (r.trades ?? []).map((t) => ({
        ...t,
        botName: r.botName,
        // BacktestResult does not include `strategyName`; use botName as the strategy label.
        strategy: r.botName,
      })),
    )
  }, [filtered])

  // Sortable trade log
  const sortedTrades = useMemo(() => {
    const copy = trades.slice()
    const dir = sortDir === "asc" ? 1 : -1
    if (sortKey === "date") copy.sort((a, b) => dir * (new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()))
    if (sortKey === "symbol") copy.sort((a, b) => dir * a.symbol.localeCompare(b.symbol))
    if (sortKey === "type") copy.sort((a, b) => dir * a.type.localeCompare(b.type))
    if (sortKey === "value") copy.sort((a, b) => dir * ((a.value ?? 0) - (b.value ?? 0)))
    return copy
  }, [trades, sortKey, sortDir])

  // Comparison overlay selection helpers
  const toggleCompare = (id?: string) => {
    if (!id) return
    setCompareIds((prev) => (prev.includes(id) ? prev.filter((p) => p !== id) : [...prev, id]))
  }
  const comparisonResults = useMemo(() => filtered.filter((r) => compareIds.includes(String(r.id))), [filtered, compareIds])

  // Export CSVs
  const exportFilteredCSV = () => {
    let csv = "id,botName,startDate,endDate,initialCapital,finalCapital,totalPnL,sharpe\n"
    for (const r of filtered) {
      csv += `${r.id},${r.botName},${r.startDate},${r.endDate},${r.initialCapital},${r.finalCapital},${r.totalPnL},${r.sharpeRatio}\n`
    }
    const blob = new Blob([csv], { type: "text/csv" })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `performance-${Date.now()}.csv`
    a.click()
    window.URL.revokeObjectURL(url)
  }

  const exportTradesCSV = () => {
    let csv = "timestamp,botName,symbol,type,price,quantity,value\n"
    for (const t of sortedTrades) {
      csv += `${t.timestamp},${t.botName},${t.symbol},${t.type},${t.price},${t.quantity},${t.value}\n`
    }
    const blob = new Blob([csv], { type: "text/csv" })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `trades-${Date.now()}.csv`
    a.click()
    window.URL.revokeObjectURL(url)
  }

  const clearFilters = () => {
    setFilterBot("all")
    setStartDate("")
    setEndDate("")
    setQuick("all")
  }

  const COLORS = ["#60A5FA", "#34D399", "#F97316", "#F87171", "#A78BFA", "#FBBF24"]

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <motion.div initial={{ y: 6, opacity: 0 }} animate={{ y: 0, opacity: 1 }}>
          <Card>
            <CardHeader>
              <CardTitle>Total P&L</CardTitle>
              <CardDescription>Sum of filtered backtests</CardDescription>
            </CardHeader>
            <CardContent>
              <div className={`text-2xl font-bold ${totalPnL >= 0 ? "text-green-500" : "text-red-500"}`}>
                {totalPnL >= 0 ? "+" : ""}
                {totalPnL.toFixed(2)}
              </div>
              <div className="text-sm text-muted-foreground">Based on {filtered.length} backtests</div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div initial={{ y: 6, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.05 }}>
          <Card>
            <CardHeader>
              <CardTitle>Win Rate</CardTitle>
              <CardDescription>Average win rate across backtests</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{winRate.toFixed(2)}%</div>
              <div className="text-sm text-muted-foreground">{totalTrades} trades</div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div initial={{ y: 6, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.1 }}>
          <Card>
            <CardHeader>
              <CardTitle>Sharpe Ratio</CardTitle>
              <CardDescription>Average Sharpe</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{avgSharpe.toFixed(2)}</div>
              <div className="text-sm text-muted-foreground">Mean of filtered backtests</div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div initial={{ y: 6, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.15 }}>
          <Card>
            <CardHeader>
              <CardTitle>Max Drawdown</CardTitle>
              <CardDescription>Largest drawdown observed</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-500">{(maxDrawdown * 100).toFixed(2)}%</div>
              <div className="text-sm text-muted-foreground">{drawdowns.length} drawdowns</div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <Card>
          <CardHeader>
            <CardTitle>Filters</CardTitle>
            <CardDescription>Bot / Date range / Quick filters</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div>
                <label className="text-sm block mb-1">Bot</label>
                <Select value={filterBot} onValueChange={(v) => setFilterBot(v)}>
                  <SelectTrigger>
                    <SelectValue placeholder="All bots" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All</SelectItem>
                    {bots.map((b) => (
                      <SelectItem key={b} value={b}>
                        {b}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-sm block mb-1">Start</label>
                  <input className="input w-full" type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} />
                </div>
                <div>
                  <label className="text-sm block mb-1">End</label>
                  <input className="input w-full" type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} />
                </div>
              </div>

              <div className="flex gap-2 items-center">
                <Button className={buttonVariants({ variant: quick === "all" ? "default" : "ghost" })} onClick={() => setQuick("all")}>
                  All time
                </Button>
                <Button className={buttonVariants({ variant: quick === "7d" ? "default" : "ghost" })} onClick={() => setQuick("7d")}>
                  Last 7 days
                </Button>
                <Button className={buttonVariants({ variant: quick === "month" ? "default" : "ghost" })} onClick={() => setQuick("month")}>
                  This month
                </Button>
                <Button className={buttonVariants({ variant: "ghost" })} onClick={clearFilters}>
                  Clear
                </Button>
              </div>

              <div className="pt-3 flex gap-2">
                <Button onClick={exportFilteredCSV}>Export Backtests CSV</Button>
                <Button onClick={() => window.print()}>Print / Save PDF</Button>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Equity Timeline</CardTitle>
            <CardDescription>Filtered backtests — final capital</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col gap-3">
              <div className="flex items-center gap-3">
                <div className="flex flex-wrap gap-2">
                  {filtered.map((r) => (
                    <button
                      key={r.id}
                      onClick={() => toggleCompare(String(r.id))}
                      className={`px-2 py-1 text-sm rounded border ${compareIds.includes(String(r.id)) ? "bg-muted/60" : ""}`}
                    >
                      {r.botName}
                    </button>
                  ))}
                </div>
              </div>

              <div className="h-[340px]">
                <TimelineChart timeline={timeline} comparisonResults={comparisonResults} height={340} colors={COLORS} />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <Card>
          <CardHeader>
            <CardTitle>Monthly Returns</CardTitle>
            <CardDescription>Sum of P&L by month</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[260px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={monthly}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="value" fill="hsl(var(--primary))" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Drawdowns</CardTitle>
            <CardDescription>Drawdown depth vs duration</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[260px]">
              <ResponsiveContainer width="100%" height="100%">
                <ScatterChart>
                  <CartesianGrid />
                  <XAxis dataKey="duration" name="duration" />
                  <YAxis dataKey="depth" name="depth" />
                  <ZAxis dataKey="depth" range={[100, 1000]} />
                  <Tooltip />
                  <Scatter name="Drawdowns" data={drawdowns} fill="hsl(var(--destructive))" />
                </ScatterChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>P&L by Bot</CardTitle>
            <CardDescription>Contribution by bot</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[260px] flex flex-col items-center">
              <ResponsiveContainer width="100%" height={220}>
                <PieChart>
                  <Pie data={pnlByBot} dataKey="value" nameKey="name" outerRadius={80} label>
                    {pnlByBot.map((_, i) => (
                      <Cell key={i} fill={COLORS[i % COLORS.length]} />
                    ))}
                  </Pie>
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Trade Log</CardTitle>
          <CardDescription>Recent trades across filtered backtests</CardDescription>
        </CardHeader>
        <CardContent>
          <TradeLogTable
            trades={sortedTrades}
            onSort={(k) => {
              setSortKey(k)
              setSortDir((prev) => (prev === "asc" ? "desc" : "asc"))
            }}
            onExport={exportTradesCSV}
            sortKey={sortKey}
            sortDir={sortDir}
          />
        </CardContent>
      </Card>
    </div>
  )
}
