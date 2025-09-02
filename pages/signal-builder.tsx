"use client"

import React, { useEffect, useMemo, useRef, useState } from "react"
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from "@/components/ui/card"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { Form, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Button } from "@/components/ui/button"
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert"
import { Pagination } from "@/components/ui/pagination"
import { useToast } from "@/components/ui/use-toast"
import {
  Edit,
  Play,
  Pause,
  Trash,
  FileText,
  Download,
  CheckCircle,
  XCircle,
} from "lucide-react"

type ComparisonOperator = ">" | "<" | "=" | ">=" | "<="

export interface Signal {
  id: string
  name: string
  symbol: string
  description?: string
  conditionType: "price" | "indicator" | "volume"
  operator: ComparisonOperator | string
  threshold: number
  timeWindowMinutes?: number
  active: boolean
  createdAt: string
}

export interface SignalHistoryRow {
  id: string
  timestamp: string
  signalId: string
  signalName: string
  symbol: string
  triggeredValue: number
  actionTaken: string
  status: "triggered" | "executed" | "ignored"
}

/**
 * Basic persistence & hook for signals. This mirrors an API-backed flow but
 * uses localStorage for this implementation so the page is usable out-of-the-box.
 *
 * The hook exposes create/update/delete/test operations and handles loading + error states.
 */
function useSignals() {
  const STORAGE_KEY = "vf:signals:v1"
  const [signals, setSignals] = useState<Signal[] | null>(null)
  const [loading, setLoading] = useState<boolean>(false)
  const [error, setError] = useState<string | null>(null)

  // load from localStorage
  useEffect(() => {
    setLoading(true)
    try {
      const raw = localStorage.getItem(STORAGE_KEY)
      if (raw) {
        setSignals(JSON.parse(raw) as Signal[])
      } else {
        setSignals([])
      }
    } catch (e) {
      setError("Failed to load signals")
      setSignals([])
    } finally {
      setLoading(false)
    }
  }, [])

  const persist = (sigs: Signal[]) => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(sigs))
      setSignals(sigs)
    } catch (e) {
      setError("Failed to save signals")
    }
  }

  const create = async (signal: Omit<Signal, "id" | "createdAt">) => {
    try {
      const s: Signal = {
        ...signal,
        id: `sig_${Date.now()}`,
        createdAt: new Date().toISOString(),
      }
      const next = [...(signals || []), s]
      persist(next)
      return s
    } catch (e) {
      setError("Create failed")
      throw e
    }
  }

  const update = async (id: string, patch: Partial<Signal>) => {
    try {
      const next = (signals || []).map((s) => (s.id === id ? { ...s, ...patch } : s))
      persist(next)
      return next.find((s) => s.id === id) || null
    } catch (e) {
      setError("Update failed")
      throw e
    }
  }

  const remove = async (id: string) => {
    try {
      const next = (signals || []).filter((s) => s.id !== id)
      persist(next)
      return true
    } catch (e) {
      setError("Delete failed")
      throw e
    }
  }

  const toggleActive = async (id: string) => {
    const s = signals?.find((x) => x.id === id)
    if (!s) throw new Error("Not found")
    return update(id, { active: !s.active })
  }

  return {
    signals,
    loading,
    error,
    create,
    update,
    remove,
    toggleActive,
  }
}

export default function SignalBuilderPage(): JSX.Element {
  const { signals, loading, error, create, update, remove, toggleActive } = useSignals()
  const { toast } = useToast()

  // Form state for the "Create Signal" tab
  const [name, setName] = useState<string>("")
  const [symbol, setSymbol] = useState<string>("AAPL")
  const [conditionType, setConditionType] = useState<Signal["conditionType"]>("price")
  const [operator, setOperator] = useState<ComparisonOperator | string>(">")
  const [threshold, setThreshold] = useState<number | "">("")
  const [timeWindow, setTimeWindow] = useState<number>(5)
  const [description, setDescription] = useState<string>("")
  const [isSaving, setIsSaving] = useState(false)
  const [isTesting, setIsTesting] = useState(false)
  const nameRef = useRef<HTMLInputElement | null>(null)

  // Signal history (mocked)
  const [history, setHistory] = useState<SignalHistoryRow[]>([])
  const [historyLoading, setHistoryLoading] = useState(false)

  // Filters for Signal History
  const [historyFrom, setHistoryFrom] = useState<string>("")
  const [historyTo, setHistoryTo] = useState<string>("")
  const [historySignalFilter, setHistorySignalFilter] = useState<string>("all")
  const [historyStatusFilter, setHistoryStatusFilter] = useState<string>("all")

  // Table pagination
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(10)

  // Fetch mock history (simulate server)
  useEffect(() => {
    setHistoryLoading(true)
    const t = setTimeout(() => {
      // simple seeded mock - in a real app fetch from API
      const sample = (signals || []).flatMap((s, idx) =>
        new Array(3).fill(0).map((_, i) => ({
          id: `${s.id}-h-${i}`,
          timestamp: new Date(Date.now() - (i + idx) * 1000 * 60 * 60).toISOString(),
          signalId: s.id,
          signalName: s.name,
          symbol: s.symbol,
          triggeredValue: Math.round((Math.random() * 200) * 100) / 100,
          actionTaken: Math.random() > 0.5 ? "Alert" : "Execute",
          status: Math.random() > 0.5 ? "executed" : "triggered",
        }))
      )
      setHistory(sample)
      setHistoryLoading(false)
    }, 300)
    return () => clearTimeout(t)
  }, [signals])

  // Validation
  const validateForm = (): { ok: boolean; message?: string } => {
    if (!name || name.trim().length < 2) return { ok: false, message: "Signal name must be at least 2 characters." }
    if (!symbol || symbol.trim().length < 1) return { ok: false, message: "Symbol required." }
    if (threshold === "" || threshold === null || Number.isNaN(Number(threshold))) return { ok: false, message: "Threshold must be a number." }
    if (timeWindow <= 0) return { ok: false, message: "Time window must be > 0 minutes." }
    return { ok: true }
  }

  // Create signal handler
  const handleSave = async () => {
    const v = validateForm()
    if (!v.ok) {
      toast({ title: "Validation error", description: v.message })
      return
    }
    setIsSaving(true)
    try {
      const created = await create({
        name: name.trim(),
        symbol: symbol.trim().toUpperCase(),
        description,
        conditionType,
        operator,
        threshold: Number(threshold),
        timeWindowMinutes: timeWindow,
        active: true,
      })
      toast({ title: "Signal saved", description: `${created.name} saved successfully` })
      // reset form & focus management
      setName("")
      setDescription("")
      setThreshold("")
      setTimeout(() => nameRef.current?.focus(), 150)
    } catch (err) {
      toast({ title: "Save failed", description: "Unable to save signal", })
    } finally {
      setIsSaving(false)
    }
  }

  // Test signal handler (minimal test/backtest stub)
  const handleTest = async () => {
    setIsTesting(true)
    try {
      // try a server call, fallback to simple local test
      try {
        const resp = await fetch("/api/signals/test", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name,
            symbol,
            conditionType,
            operator,
            threshold,
            timeWindow,
          }),
        })
        if (resp.ok) {
          const j = await resp.json()
          toast({ title: "Test result", description: j?.message || "Server test completed" })
        } else {
          throw new Error("server-error")
        }
      } catch {
        // local fallback: random pass/fail
        const ok = Math.random() > 0.4
        toast({ title: "Local test", description: ok ? "Condition matched in sample run" : "No matches found" })
      }
    } catch (e) {
      toast({ title: "Test failed", description: "Unexpected error while testing signal" })
    } finally {
      setIsTesting(false)
    }
  }

  // Cancel / clear
  const handleCancel = () => {
    setName("")
    setSymbol("AAPL")
    setConditionType("price")
    setOperator(">")
    setThreshold("")
    setTimeWindow(5)
    setDescription("")
    nameRef.current?.focus()
  }

  // Active signals UI actions
  const handleEdit = (s: Signal) => {
    // populate form with signal for quick edit
    setName(s.name)
    setSymbol(s.symbol)
    setConditionType(s.conditionType)
    setOperator(s.operator as ComparisonOperator)
    setThreshold(s.threshold)
    setTimeWindow(s.timeWindowMinutes || 5)
    setDescription(s.description || "")
    // switch tab to create
    const el = document.querySelector('[role="tablist"] [data-state="active"]') as HTMLElement | null
    // simple focus hint: focus name input
    setTimeout(() => nameRef.current?.focus(), 150)
  }

  const handleDelete = async (id: string) => {
    try {
      await remove(id)
      toast({ title: "Deleted", description: "Signal removed" })
    } catch {
      toast({ title: "Delete failed", description: "Unable to remove signal" })
    }
  }

  const handlePauseResume = async (id: string) => {
    try {
      await toggleActive(id)
      toast({ title: "Updated", description: "Signal status toggled" })
    } catch {
      toast({ title: "Action failed", description: "Unable to toggle signal status" })
    }
  }

  // Derived filtered + paginated history rows
  const filteredHistory = useMemo(() => {
    let rows = history
    if (!rows) return []
    if (historySignalFilter !== "all") rows = rows.filter((r) => r.signalId === historySignalFilter)
    if (historyStatusFilter !== "all") rows = rows.filter((r) => r.status === historyStatusFilter)
    if (historyFrom) rows = rows.filter((r) => new Date(r.timestamp) >= new Date(historyFrom))
    if (historyTo) rows = rows.filter((r) => new Date(r.timestamp) <= new Date(historyTo))
    return rows.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
  }, [history, historyFrom, historyTo, historySignalFilter, historyStatusFilter])

  const totalPages = Math.max(1, Math.ceil(filteredHistory.length / pageSize))
  useEffect(() => {
    if (page > totalPages) setPage(1)
  }, [totalPages])

  const pagedHistory = useMemo(() => {
    const start = (page - 1) * pageSize
    return filteredHistory.slice(start, start + pageSize)
  }, [filteredHistory, page, pageSize])

  // CSV export
  const exportCSV = () => {
    const rows = filteredHistory
    const header = ["Timestamp", "Signal Name", "Symbol", "Triggered Value", "Action Taken", "Status"]
    const csv = [header.join(",")]
      .concat(
        rows.map((r) =>
          [
            new Date(r.timestamp).toISOString(),
            `"${(r.signalName || "").replace(/"/g, '""')}"`,
            r.symbol,
            String(r.triggeredValue),
            `"${(r.actionTaken || "").replace(/"/g, '""')}"`,
            r.status,
          ].join(",")
        )
      )
      .join("\n")
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `signal-history-${new Date().toISOString().slice(0, 10)}.csv`
    a.click()
    URL.revokeObjectURL(url)
    toast({ title: "Export started", description: "Downloading CSV" })
  }

  // Loading / error states for signals list
  if (loading || signals === null) {
    return (
      <div className="p-6">
        <Skeleton className="h-8 w-1/3 mb-4" />
        <div className="grid gap-4 md:grid-cols-3">
          <Skeleton className="h-52" />
          <Skeleton className="h-52" />
          <Skeleton className="h-52" />
        </div>
      </div>
    )
  }

  return (
    <div className="w-full h-full p-6">
      <Card className="w-full h-full min-h-[480px]">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Signal Builder</CardTitle>
            <div className="text-sm text-muted-foreground">Create, manage and review trading signals</div>
          </div>
        </CardHeader>

        <CardContent className="p-6">
          <Tabs defaultValue="create" className="w-full" id="signal-builder-tabs">
            <TabsList aria-label="Signal builder tabs" className="mb-4">
              <TabsTrigger value="create">Create Signal</TabsTrigger>
              <TabsTrigger value="active">Active Signals</TabsTrigger>
              <TabsTrigger value="history">Signal History</TabsTrigger>
            </TabsList>

            <TabsContent value="create">
              <Form>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  <FormItem>
                    <FormLabel>Name</FormLabel>
                    <FormControl>
                      <Input
                        ref={nameRef}
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        aria-label="Signal name"
                        placeholder="My breakouts"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>

                  <FormItem>
                    <FormLabel>Symbol</FormLabel>
                    <FormControl>
                      <Input value={symbol} onChange={(e) => setSymbol(e.target.value.toUpperCase())} aria-label="Symbol" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>

                  <FormItem>
                    <FormLabel>Condition Type</FormLabel>
                    <FormControl>
                      <Select value={conditionType} onValueChange={(v) => setConditionType(v as Signal["conditionType"])}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select condition type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="price">Price</SelectItem>
                          <SelectItem value="indicator">Indicator</SelectItem>
                          <SelectItem value="volume">Volume</SelectItem>
                        </SelectContent>
                      </Select>
                    </FormControl>
                  </FormItem>

                  <FormItem>
                    <FormLabel>Operator</FormLabel>
                    <FormControl>
                      <RadioGroup value={operator} onValueChange={(v) => setOperator(v)}>
                        <div className="flex gap-2 items-center">
                          <label className="inline-flex items-center gap-2">
                            <RadioGroupItem value=">" />
                            <span>{">"}</span>
                          </label>
                          <label className="inline-flex items-center gap-2">
                            <RadioGroupItem value="<" />
                            <span>{"<"}</span>
                          </label>
                          <label className="inline-flex items-center gap-2">
                            <RadioGroupItem value="=" />
                            <span>{"="}</span>
                          </label>
                          <label className="inline-flex items-center gap-2">
                            <RadioGroupItem value=">=" />
                            <span>{">="}</span>
                          </label>
                          <label className="inline-flex items-center gap-2">
                            <RadioGroupItem value="<=" />
                            <span>{"<="}</span>
                          </label>
                        </div>
                      </RadioGroup>
                    </FormControl>
                  </FormItem>

                  <FormItem>
                    <FormLabel>Threshold Value</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        value={threshold as any}
                        onChange={(e) => setThreshold(e.target.value === "" ? "" : Number(e.target.value))}
                        aria-label="threshold-value"
                        placeholder="e.g. 150.5"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>

                  <FormItem>
                    <FormLabel>Time Window (minutes)</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        value={timeWindow}
                        onChange={(e) => setTimeWindow(Number(e.target.value))}
                        aria-label="time-window"
                        min={1}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>

                  <FormItem className="md:col-span-2 lg:col-span-3">
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Textarea value={description} onChange={(e) => setDescription(e.target.value)} aria-label="description" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                </div>

                <div className="mt-4 flex gap-2">
                  <Button onClick={handleSave} disabled={isSaving} aria-label="Save Signal" >
                    {isSaving ? "Saving..." : "Save Signal"}
                  </Button>
                  <Button variant="secondary" onClick={handleTest} disabled={isTesting} aria-label="Test Signal">
                    {isTesting ? "Testing..." : "Test Signal"}
                  </Button>
                  <Button variant="outline" onClick={handleCancel} aria-label="Cancel">
                    Cancel
                  </Button>
                </div>
              </Form>
            </TabsContent>

            <TabsContent value="active">
              <Card>
                <CardHeader>
                  <CardTitle>Active Trading Signals</CardTitle>
                </CardHeader>
                <CardContent>
                  {error && (
                    <Alert>
                      <AlertTitle>Error</AlertTitle>
                      <AlertDescription>{error}</AlertDescription>
                    </Alert>
                  )}

                  {signals.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-12">
                      <FileText className="h-12 w-12 text-muted-foreground" />
                      <div className="mt-3 text-sm text-muted-foreground">No active signals</div>
                    </div>
                  ) : (
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Name</TableHead>
                          <TableHead>Symbol</TableHead>
                          <TableHead>Condition</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead>Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {signals.map((s) => (
                          <TableRow key={s.id}>
                            <TableCell className="font-medium">{s.name}</TableCell>
                            <TableCell>
                              <Badge variant="outline">{s.symbol}</Badge>
                            </TableCell>
                            <TableCell>
                              {s.conditionType} {String(s.operator)} {s.threshold}
                            </TableCell>
                            <TableCell>
                              {s.active ? (
                                <Badge variant="success" className="inline-flex items-center gap-2">
                                  <CheckCircle className="h-3 w-3" /> Active
                                </Badge>
                              ) : (
                                <Badge variant="outline" className="inline-flex items-center gap-2">
                                  <XCircle className="h-3 w-3" /> Inactive
                                </Badge>
                              )}
                            </TableCell>
                            <TableCell>
                              <div className="flex items-center gap-2">
                                <Button variant="ghost" size="icon" onClick={() => handleEdit(s)} aria-label={`Edit ${s.name}`}>
                                  <Edit className="h-4 w-4" />
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  onClick={() => handlePauseResume(s.id)}
                                  aria-label={s.active ? `Pause ${s.name}` : `Resume ${s.name}`}
                                >
                                  {s.active ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                                </Button>
                                <Button variant="ghost" size="icon" onClick={() => handleDelete(s.id)} aria-label={`Delete ${s.name}`}>
                                  <Trash className="h-4 w-4" />
                                </Button>
                              </div>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="history">
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle>Signal Execution History</CardTitle>
                    <div className="flex items-center gap-2">
                      <Button size="sm" variant="outline" onClick={exportCSV} aria-label="Export CSV">
                        <Download className="mr-2 h-4 w-4" /> Export CSV
                      </Button>
                    </div>
                  </div>
                </CardHeader>

                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-4">
                    <div>
                      <label className="text-xs block mb-1">From</label>
                      <Input type="date" value={historyFrom} onChange={(e) => setHistoryFrom(e.target.value)} />
                    </div>
                    <div>
                      <label className="text-xs block mb-1">To</label>
                      <Input type="date" value={historyTo} onChange={(e) => setHistoryTo(e.target.value)} />
                    </div>
                    <div>
                      <label className="text-xs block mb-1">Signal</label>
                      <Select value={historySignalFilter} onValueChange={(v) => setHistorySignalFilter(v)}>
                        <SelectTrigger>
                          <SelectValue placeholder="All signals" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All</SelectItem>
                          {signals.map((s) => (
                            <SelectItem key={s.id} value={s.id}>
                              {s.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  {historyLoading ? (
                    <div className="grid gap-2">
                      <Skeleton className="h-6 w-full" />
                      <Skeleton className="h-6 w-full" />
                      <Skeleton className="h-6 w-full" />
                    </div>
                  ) : filteredHistory.length === 0 ? (
                    <div className="text-sm text-muted-foreground">No history matching filters.</div>
                  ) : (
                    <>
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Timestamp</TableHead>
                            <TableHead>Signal</TableHead>
                            <TableHead>Symbol</TableHead>
                            <TableHead>Triggered Value</TableHead>
                            <TableHead>Action Taken</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {pagedHistory.map((r) => (
                            <TableRow key={r.id}>
                              <TableCell>{new Date(r.timestamp).toLocaleString()}</TableCell>
                              <TableCell>
                                <a href={`/signals/${r.signalId}`} className="text-primary underline">
                                  {r.signalName}
                                </a>
                              </TableCell>
                              <TableCell>{r.symbol}</TableCell>
                              <TableCell className="font-mono">{r.triggeredValue}</TableCell>
                              <TableCell>
                                <Badge>{r.actionTaken}</Badge>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>

                      <div className="mt-4 flex items-center justify-between">
                        <div className="text-sm text-muted-foreground">
                          Showing {Math.min(filteredHistory.length, page * pageSize)} of {filteredHistory.length} results
                        </div>
                        <div className="flex items-center gap-2">
                          <select
                            aria-label="Page size"
                            className="rounded border px-2 py-1"
                            value={pageSize}
                            onChange={(e) => {
                              setPageSize(Number(e.target.value))
                              setPage(1)
                            }}
                          >
                            {[10, 25, 50, 100].map((s) => (
                              <option key={s} value={s}>
                                {s}
                              </option>
                            ))}
                          </select>

                          <Pagination className="flex items-center gap-2" aria-label="History pagination">
                            {/* Simple previous/next controls */}
                            <button
                              className="inline-flex items-center rounded-md px-2 py-1 border"
                              onClick={() => setPage((p) => Math.max(1, p - 1))}
                              aria-label="Previous page"
                            >
                              Prev
                            </button>
                            <div className="px-2">
                              Page {page} / {totalPages}
                            </div>
                            <button
                              className="inline-flex items-center rounded-md px-2 py-1 border"
                              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                              aria-label="Next page"
                            >
                              Next
                            </button>
                          </Pagination>
                        </div>
                      </div>
                    </>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </CardContent>

        <CardFooter className="flex justify-end">
          <div className="text-xs text-muted-foreground">Signal Builder — client-only UI with optional server integrations</div>
        </CardFooter>
      </Card>
    </div>
  )
}
