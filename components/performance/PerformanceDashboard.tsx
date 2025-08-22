"use client"

import { useEffect, useMemo, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
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
import { getSavedBacktests, BacktestResult } from "@/lib/backtest-service"
import { format } from "date-fns"

function formatDateLabel(s: string) {
  try {
    return format(new Date(s), "yyyy-MM-dd")
  } catch {
    return s
  }
}

export function PerformanceDashboard() {
  const [saved, setSaved] = useState<BacktestResult[]>([])
  const [filterBot, setFilterBot] = useState<string>("all")
  const [startDate, setStartDate] = useState<string>("")
  const [endDate, setEndDate] = useState<string>("")

  useEffect(() => {
    const load = async () => {
      const results = await getSavedBacktests()
      setSaved(results)
    }
    load()
  }, [])

  const bots = useMemo(() => {
    const names = Array.from(new Set(saved.map((s) => s.botName).filter(Boolean)))
    return names
  }, [saved])

  const filtered = useMemo(() => {
    return saved.filter((s) => {
      if (filterBot !== "all" && s.botName !== filterBot) return false
      if (startDate && s.endDate < startDate) return false
      if (endDate && s.startDate > endDate) return false
      return true
    })
  }, [saved, filterBot, startDate, endDate])

  // Simple aggregated metrics
  const totalPnL = useMemo(() => filtered.reduce((acc, r) => acc + (r.totalPnL ?? 0), 0), [filtered])
  const avgSharpe = useMemo(
    () => (filtered.length ? filtered.reduce((acc, r) => acc + (r.sharpeRatio ?? 0), 0) / filtered.length : 0),
    [filtered],
  )
  const winRate = useMemo(
    () =>
      filtered.length
        ? filtered.reduce((acc, r) => acc + ((r.statistics?.winRate ?? 0) * 100), 0) / filtered.length
        : 0,
    [filtered],
  )

  // Build simple timeline: one point per backtest endDate with finalCapital
  const timeline = useMemo(() => {
    return filtered
      .map((r) => ({ date: r.endDate ?? r.startDate, equity: r.finalCapital ?? 0, name: r.botName }))
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
  }, [filtered])

  const exportCSV = () => {
    let csv = "id,botName,startDate,endDate,initialCapital,finalCapital,totalPnL,sharpe,winRate\n"
    for (const r of filtered) {
      csv += `${r.id},${r.botName},${r.startDate},${r.endDate},${r.initialCapital},${r.finalCapital},${r.totalPnL},${r.sharpeRatio},${r.statistics?.winRate ?? 0}\n`
    }
    const blob = new Blob([csv], { type: "text/csv" })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.setAttribute("hidden", "")
    a.setAttribute("href", url)
    a.setAttribute("download", `performance-report-${Date.now()}.csv`)
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader>
            <CardTitle>Aggregated Performance</CardTitle>
            <CardDescription>Summary across filtered backtests</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="text-sm">Total Backtests</div>
              <div className="text-2xl font-bold">{filtered.length}</div>

              <div className="text-sm pt-2">Total P&L</div>
              <div className={`text-xl font-semibold ${totalPnL >= 0 ? "text-green-500" : "text-red-500"}`}>
                {totalPnL >= 0 ? "+" : ""}
                {totalPnL.toFixed(2)}
              </div>

              <div className="grid grid-cols-2 gap-2 pt-3">
                <div>
                  <div className="text-xs text-muted-foreground">Average Sharpe</div>
                  <div className="font-medium">{avgSharpe.toFixed(2)}</div>
                </div>
                <div>
                  <div className="text-xs text-muted-foreground">Average Win Rate</div>
                  <div className="font-medium">{winRate.toFixed(2)}%</div>
                </div>
              </div>

              <div className="pt-4 flex gap-2">
                <Button onClick={exportCSV}>Export CSV</Button>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Filters</CardTitle>
            <CardDescription>Filter by bot and date range</CardDescription>
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

              <div>
                <label className="text-sm block mb-1">Start Date</label>
                <input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="input w-full"
                />
              </div>

              <div>
                <label className="text-sm block mb-1">End Date</label>
                <input
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="input w-full"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Quick Insights</CardTitle>
            <CardDescription>Recent backtests</CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              {timeline.slice(-5).reverse().map((t, i) => (
                <li key={i} className="flex justify-between">
                  <span className="text-sm">{t.name}</span>
                  <span className="font-medium">{formatDateLabel(t.date)}</span>
                </li>
              ))}
              {timeline.length === 0 && <li className="text-sm text-muted-foreground">No backtests found</li>}
            </ul>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Equity Timeline</CardTitle>
          <CardDescription>Final capital by backtest end date</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-[360px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={timeline}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" tickFormatter={(v) => formatDateLabel(v)} />
                <YAxis />
                <Tooltip labelFormatter={(v) => formatDateLabel(v as string)} />
                <Legend />
                <Line type="monotone" dataKey="equity" stroke="hsl(var(--primary))" name="Final Capital" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default PerformanceDashboard
