import React, { useEffect, useMemo, useState } from "react"
import { useQueryClient } from "@tanstack/react-query"
import useBots, { useStartBot, usePauseBot, useStopBot, useUpdateBot, useCreateBot } from "@/hooks/useBots"
import { useToast } from "@/hooks/use-toast"
import { FixedSizeList as VirtualList } from "react-window"
import BotSettingsPane from "@/components/bot-settings-pane"
import useAlpacaRealtime from "@/hooks/useAlpacaRealtime"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"

import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "@/components/ui/pagination"
import { Skeleton } from "@/components/ui/skeleton"
import { Textarea } from "@/components/ui/textarea"

import {
  Play,
  Pause,
  Square,
  Pencil,
  Copy,
  ChevronDown,
  Settings2,
  ListFilter,
  BarChart3,
  Search,
  TrendingUp,
  TrendingDown,
} from "lucide-react"

/**
 * Types
 */
export type BotStatus = "running" | "paused" | "stopped"
export type BotStrategy =
  | "grid-1"
  | "grid-x"
  | "stat-arb"
  | "tri-arb"
  | "indicator"
  | "portfolio-top5"
  | "portfolio-top10"
  | "portfolio-top20"

export interface Bot {
  id: string
  name: string
  strategy: BotStrategy
  status: BotStatus
  pnl: number
  capital: number
  updatedAt?: string
}

const strategyLabel: Record<BotStrategy, string> = {
  "grid-1": "Grid 1%",
  "grid-x": "Grid X%",
  "stat-arb": "Stat Arb",
  "tri-arb": "Tri Arb",
  indicator: "Indicator",
  "portfolio-top5": "Top 5 by MC",
  "portfolio-top10": "Top 10 by MC",
  "portfolio-top20": "Top 20 by MC",
}

// Demo bots data
const demoBots: Bot[] = [
  {
    id: "demo-tech-growth-bot",
    name: "Tech Growth Bot",
    strategy: "portfolio-top5",
    status: "running",
    pnl: 1247.32,
    capital: 10000,
    updatedAt: new Date(Date.now() - 3600000).toISOString(),
  },
  {
    id: "demo-crypto-dca-master",
    name: "Crypto DCA Master",
    strategy: "portfolio-top10",
    status: "running",
    pnl: 2156.78,
    capital: 25000,
    updatedAt: new Date(Date.now() - 7200000).toISOString(),
  },
  {
    id: "demo-stat-arb-pro",
    name: "Stat Arb Pro",
    strategy: "stat-arb",
    status: "paused",
    pnl: -234.56,
    capital: 5000,
    updatedAt: new Date(Date.now() - 1800000).toISOString(),
  },
  {
    id: "demo-grid-trader-elite",
    name: "Grid Trader Elite",
    strategy: "grid-x",
    status: "running",
    pnl: 876.43,
    capital: 15000,
    updatedAt: new Date(Date.now() - 900000).toISOString(),
  },
  {
    id: "demo-value-investor",
    name: "Value Investor",
    strategy: "indicator",
    status: "stopped",
    pnl: 345.67,
    capital: 8000,
    updatedAt: new Date(Date.now() - 14400000).toISOString(),
  },
  {
    id: "demo-triangular-arb",
    name: "Triangular Arb",
    strategy: "tri-arb",
    status: "running",
    pnl: 567.89,
    capital: 20000,
    updatedAt: new Date(Date.now() - 3600000).toISOString(),
  },
]

function formatCurrency(v: number, currency = "USD") {
  try {
    return new Intl.NumberFormat(undefined, {
      style: "currency",
      currency,
      maximumFractionDigits: 2,
    }).format(v)
  } catch {
    return `${v.toFixed(2)} ${currency}`
  }
}

function PnLChip({ value }: { value: number }) {
  const positive = value >= 0
  return (
    <Badge className={positive ? "bg-emerald-600" : "bg-rose-600"}>
      {positive ? (
        <span className="inline-flex items-center gap-1">
          <TrendingUp className="h-4 w-4" /> {formatCurrency(value)}
        </span>
      ) : (
        <span className="inline-flex items-center gap-1">
          <TrendingDown className="h-4 w-4" /> {formatCurrency(value)}
        </span>
      )}
    </Badge>
  )
}

function BotCard({
  bot,
  checked,
  onCheck,
  onStart,
  onPause,
  onStop,
  onEdit,
  onClone,
  onOpenSettings,
}: {
  bot: Bot
  checked: boolean
  onCheck: (id: string, value: boolean) => void
  onStart: (id: string) => void
  onPause: (id: string) => void
  onStop: (id: string) => void
  onEdit: (id: string) => void
  onClone: (id: string) => void
  onOpenSettings?: () => void
}) {
  return (
    <Card className="group relative flex h-full flex-col justify-between overflow-hidden rounded-2xl border bg-background shadow-sm transition hover:shadow-md">
      <CardHeader className="flex flex-row items-start justify-between space-y-0">
        <div className="flex items-center gap-3">
          <Checkbox checked={checked} onCheckedChange={(v) => onCheck(bot.id, Boolean(v))} />
          <div>
            <CardTitle className="text-lg leading-tight">{bot.name}</CardTitle>
            <CardDescription>{strategyLabel[bot.strategy]}</CardDescription>
          </div>
        </div>
        <Badge
          variant="secondary"
          className={
            bot.status === "running"
              ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-300"
              : bot.status === "paused"
              ? "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300"
              : "bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-300"
          }
        >
          {bot.status}
        </Badge>
      </CardHeader>
      <CardContent className="grid grid-cols-2 gap-3 sm:grid-cols-3">
        <div>
          <div className="text-xs text-muted-foreground">Allocated</div>
          <div className="font-medium">{formatCurrency(bot.capital)}</div>
        </div>
        <div>
          <div className="text-xs text-muted-foreground">PnL</div>
          <div className="mt-1">
            <PnLChip value={bot.pnl} />
          </div>
        </div>
        <div className="hidden sm:block">
          <div className="text-xs text-muted-foreground">Updated</div>
          <div className="font-medium">{bot.updatedAt ? new Date(bot.updatedAt).toLocaleString() : "—"}</div>
        </div>
      </CardContent>
      <CardFooter className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Button size="sm" variant="secondary" onClick={() => onStart(bot.id)} disabled={bot.status === "running"}>
            <Play className="mr-1 h-4 w-4" /> Start
          </Button>
          <Button size="sm" variant="secondary" onClick={() => onPause(bot.id)} disabled={bot.status !== "running"}>
            <Pause className="mr-1 h-4 w-4" /> Pause
          </Button>
          <Button size="sm" variant="destructive" onClick={() => onStop(bot.id)}>
            <Square className="mr-1 h-4 w-4" /> Stop
          </Button>
        </div>
        <div className="flex items-center gap-2">
          <Button size="icon" variant="ghost" onClick={() => onEdit(bot.id)}>
            <Pencil className="h-4 w-4" />
          </Button>
          <Button size="icon" variant="ghost" onClick={() => onClone(bot.id)}>
            <Copy className="h-4 w-4" />
          </Button>
        </div>
      </CardFooter>
    </Card>
  )
}

function ControlsBar({
  total,
  selectedCount,
  status,
  setStatus,
  strategy,
  setStrategy,
  sort,
  setSort,
  query,
  setQuery,
  onBulkStart,
  onBulkStop,
  onBulkDelete,
  view,
  setView,
  onOpenSettings,
}: {
  total: number
  selectedCount: number
  status: "all" | BotStatus
  setStatus: (v: "all" | BotStatus) => void
  strategy: "all" | BotStrategy
  setStrategy: (v: "all" | BotStrategy) => void
  sort: "pnl-desc" | "pnl-asc" | "name" | "updated"
  setSort: (s: "pnl-desc" | "pnl-asc" | "name" | "updated") => void
  query: string
  setQuery: (q: string) => void
  onBulkStart: () => void
  onBulkStop: () => void
  onBulkDelete: () => void
  view: "grid" | "list"
  setView: (v: "grid" | "list") => void
  onOpenSettings?: () => void
}) {
  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex flex-1 flex-wrap items-center gap-2">
        <div className="relative w-full max-w-xs">
          <Search className="pointer-events-none absolute left-2 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input className="pl-8" placeholder="Search bots..." value={query} onChange={(e) => setQuery(e.target.value)} />
        </div>
        <div className="flex items-center gap-2">
          <ListFilter className="h-4 w-4 text-muted-foreground" />
          <Select value={status} onValueChange={(v) => setStatus(v as any)}>
            <SelectTrigger className="w-[140px]"><SelectValue placeholder="Status" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All status</SelectItem>
              <SelectItem value="running">Running</SelectItem>
              <SelectItem value="paused">Paused</SelectItem>
              <SelectItem value="stopped">Stopped</SelectItem>
            </SelectContent>
          </Select>
          <Select value={strategy} onValueChange={(v) => setStrategy(v as any)}>
            <SelectTrigger className="w-[190px]"><SelectValue placeholder="Strategy" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All strategies</SelectItem>
              {Object.entries(strategyLabel).map(([key, label]) => (
                <SelectItem key={key} value={key}>{label}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={sort} onValueChange={(v) => setSort(v as any)}>
            <SelectTrigger className="w-[160px]"><SelectValue placeholder="Sort by" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="pnl-desc">PnL ↓</SelectItem>
              <SelectItem value="pnl-asc">PnL ↑</SelectItem>
              <SelectItem value="name">Name A–Z</SelectItem>
              <SelectItem value="updated">Recently Updated</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline">
              Bulk actions ({selectedCount}) <ChevronDown className="ml-2 h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Apply to selected</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={onBulkStart}><Play className="mr-2 h-4 w-4" /> Start</DropdownMenuItem>
            <DropdownMenuItem onClick={onBulkStop}><Pause className="mr-2 h-4 w-4" /> Stop</DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="text-rose-600" onClick={onBulkDelete}>Delete</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        <Button variant="ghost" onClick={() => onOpenSettings?.()}>
          <Settings2 className="mr-2 h-4 w-4" /> Settings
        </Button>
        <Tabs value={view} onValueChange={(v) => setView(v as any)}>
          <TabsList>
            <TabsTrigger value="grid">Grid</TabsTrigger>
            <TabsTrigger value="list">List</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>
    </div>
  )
}

function BotRow({ index, style, data }: any) {
  const bot: Bot = data.items[index]
  const { selected, onCheck, onStart, onPause, onStop, onEdit, onClone } = data
  return (
    <div style={style} className="grid grid-cols-[32px_1fr_1fr_1fr_1fr_auto] items-center gap-3 border-b px-3 py-2 text-sm">
      <Checkbox checked={selected.has(bot.id)} onCheckedChange={(v) => onCheck(bot.id, Boolean(v))} />
      <div className="truncate font-medium">{bot.name}</div>
      <div className="truncate">{strategyLabel[bot.strategy]}</div>
      <div className="truncate"><Badge>{bot.status}</Badge></div>
      <div className="truncate"><PnLChip value={bot.pnl} /></div>
      <div className="flex items-center justify-end gap-1">
        <Button size="icon" variant="ghost" onClick={() => onStart(bot.id)} disabled={bot.status === "running"}><Play className="h-4 w-4" /></Button>
        <Button size="icon" variant="ghost" onClick={() => onPause(bot.id)} disabled={bot.status !== "running"}><Pause className="h-4 w-4" /></Button>
        <Button size="icon" variant="ghost" onClick={() => onStop(bot.id)}><Square className="h-4 w-4" /></Button>
        <Button size="icon" variant="ghost" onClick={() => onEdit(bot.id)}><Pencil className="h-4 w-4" /></Button>
        <Button size="icon" variant="ghost" onClick={() => onClone(bot.id)}><Copy className="h-4 w-4" /></Button>
      </div>
    </div>
  )
}

// Non-virtualized row renderer used for list view when react-window isn't available
function BotRowSimple({ bot, selected, onCheck, onStart, onPause, onStop, onEdit, onClone }: any) {
  return (
    <div className="grid grid-cols-[32px_1fr_1fr_1fr_1fr_auto] items-center gap-3 border-b px-3 py-2 text-sm">
      <Checkbox checked={selected.has(bot.id)} onCheckedChange={(v) => onCheck(bot.id, Boolean(v))} />
      <div className="truncate font-medium">{bot.name}</div>
      <div className="truncate">{strategyLabel[bot.strategy]}</div>
      <div className="truncate"><Badge>{bot.status}</Badge></div>
      <div className="truncate"><PnLChip value={bot.pnl} /></div>
      <div className="flex items-center justify-end gap-1">
        <Button size="icon" variant="ghost" onClick={() => onStart(bot.id)} disabled={bot.status === "running"}><Play className="h-4 w-4" /></Button>
        <Button size="icon" variant="ghost" onClick={() => onPause(bot.id)} disabled={bot.status !== "running"}><Pause className="h-4 w-4" /></Button>
        <Button size="icon" variant="ghost" onClick={() => onStop(bot.id)}><Square className="h-4 w-4" /></Button>
        <Button size="icon" variant="ghost" onClick={() => onEdit(bot.id)}><Pencil className="h-4 w-4" /></Button>
        <Button size="icon" variant="ghost" onClick={() => onClone(bot.id)}><Copy className="h-4 w-4" /></Button>
      </div>
    </div>
  );
}

export default function DashboardBotsPage() {
  const queryClient = useQueryClient()
  const { data, isLoading, isError, error, refetch } = useBots()
  const [settingsOpen, setSettingsOpen] = useState(false)

  const [status, setStatus] = useState<"all" | BotStatus>("all")
  const [strategy, setStrategy] = useState<"all" | BotStrategy>("all")
  const [sort, setSort] = useState<"pnl-desc" | "pnl-asc" | "name" | "updated">("pnl-desc")
  const [query, setQuery] = useState("")
  const [view, setView] = useState<"grid" | "list">("grid")
  const [page, setPage] = useState(1)
  const pageSize = 24
  const [selected, setSelected] = useState<Set<string>>(new Set())

  const filtered = useMemo(() => {
    // Combine user bots and demo bots
    let items = [...((data ?? []) as any as Bot[]), ...demoBots]
    
    // Remove duplicates based on ID to prevent React key errors
    items = items.filter((bot, index, self) => 
      index === self.findIndex(b => b.id === bot.id)
    )
    
    if (status !== "all") items = items.filter((b) => b.status === status)
    if (strategy !== "all") items = items.filter((b) => b.strategy === strategy)
    if (query.trim()) {
      const q = query.toLowerCase()
      items = items.filter((b) => b.name.toLowerCase().includes(q) || strategyLabel[b.strategy].toLowerCase().includes(q))
    }
    switch (sort) {
      case "pnl-desc":
        items = [...items].sort((a, b) => b.pnl - a.pnl)
        break
      case "pnl-asc":
        items = [...items].sort((a, b) => a.pnl - b.pnl)
        break
      case "name":
        items = [...items].sort((a, b) => a.name.localeCompare(b.name))
        break
      case "updated":
        items = [...items].sort((a, b) => new Date(b.updatedAt ?? 0).getTime() - new Date(a.updatedAt ?? 0).getTime())
        break
    }
    return items
  }, [data, status, strategy, sort, query])

  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize))
  const paged = useMemo(() => {
    const start = (page - 1) * pageSize
    return filtered.slice(start, start + pageSize)
  }, [filtered, page])

  const allSelectedOnPage = paged.length > 0 && paged.every((b) => selected.has(b.id))

  function setAllOnPage(v: boolean) {
    const next = new Set(selected)
    paged.forEach((b) => (v ? next.add(b.id) : next.delete(b.id)))
    setSelected(next)
  }

  function onCheck(id: string, v: boolean) {
    const next = new Set(selected)
    if (v) next.add(id)
    else next.delete(id)
    setSelected(next)
  }

  const startMut = useStartBot()
  const pauseMut = usePauseBot()
  const stopMut = useStopBot()
  const updateMut = useUpdateBot()
  const createMut = useCreateBot()
  const { toast } = useToast()

  const onStart = (id: string) => {
    if (id.startsWith('demo-')) {
      toast({ title: "Demo bot", description: "Demo bots cannot be started" })
      return
    }
    startMut.mutate(id, {
      onSuccess: () => toast({ title: "Bot started", description: `Started ${id}` }),
      onError: (e: any) => toast({ title: "Start failed", description: String(e) }),
    })
  }
  const onPause = (id: string) => {
    if (id.startsWith('demo-')) {
      toast({ title: "Demo bot", description: "Demo bots cannot be paused" })
      return
    }
    pauseMut.mutate(id, {
      onSuccess: () => toast({ title: "Bot paused", description: `Paused ${id}` }),
      onError: (e: any) => toast({ title: "Pause failed", description: String(e) }),
    })
  }
  const onStop = (id: string) => {
    if (id.startsWith('demo-')) {
      toast({ title: "Demo bot", description: "Demo bots cannot be stopped" })
      return
    }
    stopMut.mutate(id, {
      onSuccess: () => toast({ title: "Bot stopped", description: `Stopped ${id}` }),
      onError: (e: any) => toast({ title: "Stop failed", description: String(e) }),
    })
  }
  const onEdit = (id: string) => {
    const bot = (data ?? []).find((b: any) => b.id === id)
    const name = prompt("Rename bot", bot?.name ?? "")
    if (!name) return
    updateMut.mutate({ id, patch: { name } }, { onSuccess: () => toast({ title: "Bot updated", description: name }) })
  }
  const onClone = (id: string) => {
    const bot = (data ?? []).find((b: any) => b.id === id)
    if (!bot) return
    const payload: any = { name: `${bot.name} (copy)`, strategy: bot.strategy, status: "paused", pnl: 0, capital: bot.capital }
    createMut.mutate(payload, { onSuccess: () => toast({ title: "Bot cloned", description: payload.name }) })
  }
  const onBulkStart = () => {
    Array.from(selected).forEach((id) => startMut.mutate(id))
    setSelected(new Set())
  }
  const onBulkStop = () => {
    Array.from(selected).forEach((id) => stopMut.mutate(id))
    setSelected(new Set())
  }
  const onBulkDelete = () => {
    // delete not wired here; keep UI behavior minimal for now
    console.log("bulk delete", Array.from(selected))
    setSelected(new Set())
  }

  if (isLoading) return <BotsOverviewSkeleton />
  if (isError)
    return (
      <Card className="rounded-2xl">
        <CardHeader>
          <CardTitle>Failed to load bots</CardTitle>
          <CardDescription className="text-rose-500">{String((error as any)?.message ?? "Unknown error")}</CardDescription>
        </CardHeader>
        <CardFooter>
          <Button onClick={() => refetch()}>Retry</Button>
        </CardFooter>
      </Card>
    )

  if (!data || data.length === 0)
    return (
      <Card className="rounded-2xl">
        <CardHeader>
          <CardTitle>No bots yet</CardTitle>
          <CardDescription>Create your first bot to get started.</CardDescription>
        </CardHeader>
        <CardFooter>
          <Button>Create Bot</Button>
        </CardFooter>
      </Card>
    )

  return (
    <div className="space-y-4">
      <ControlsBar
        total={filtered.length}
        selectedCount={selected.size}
        status={status}
        setStatus={setStatus}
        strategy={strategy}
        setStrategy={setStrategy}
        sort={sort}
        setSort={setSort}
        query={query}
        setQuery={setQuery}
        onBulkStart={onBulkStart}
        onBulkStop={onBulkStop}
        onBulkDelete={onBulkDelete}
        view={view}
  setView={(v) => setView(v)}
  onOpenSettings={() => setSettingsOpen(true)}
      />

      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <Checkbox checked={allSelectedOnPage} onCheckedChange={(v) => setAllOnPage(Boolean(v))} />
        <span>Select page ({paged.length} items)</span>
      </div>

      {view === "grid" ? (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5">
          {paged.map((bot) => (
            <BotCard
              key={bot.id}
              bot={bot}
              checked={selected.has(bot.id)}
              onCheck={onCheck}
              onStart={onStart}
              onPause={onPause}
              onStop={onStop}
              onEdit={onEdit}
              onClone={onClone}
            />
          ))}
        </div>
      ) : (
        <Card className="overflow-hidden rounded-2xl">
          <div className="grid grid-cols-[32px_1fr_1fr_1fr_1fr_auto] gap-3 border-b bg-muted/40 px-3 py-2 text-xs font-medium uppercase tracking-wide text-muted-foreground">
            <div />
            <div>Name</div>
            <div>Strategy</div>
            <div>Status</div>
            <div>PnL</div>
            <div className="text-right">Actions</div>
          </div>
          <div className="max-h-[480px]">
            {
              // Virtualized list for large bot counts. itemSize tuned to match row height.
            }
            <VirtualList
              height={Math.min(paged.length * 56, 480)}
              itemCount={paged.length}
              itemSize={56}
              width="100%"
              itemData={{ items: paged, selected, onCheck, onStart, onPause, onStop, onEdit, onClone }}
            >
              {BotRow}
            </VirtualList>
          </div>
        </Card>
      )}

      <div className="mt-2 flex items-center justify-between text-sm text-muted-foreground">
        <div>
          Showing {(page - 1) * pageSize + 1}–{Math.min(page * pageSize, filtered.length)} of {filtered.length}
        </div>
        <Pagination>
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious
                href="#"
                onClick={(e) => {
                  e.preventDefault()
                  setPage((p) => Math.max(1, p - 1))
                }}
              />
            </PaginationItem>
            {Array.from({ length: totalPages }).slice(0, 5).map((_, i) => {
              const idx = i + 1
              return (
                <PaginationItem key={idx}>
                  <PaginationLink
                    href="#"
                    isActive={idx === page}
                    onClick={(e) => {
                      e.preventDefault()
                      setPage(idx)
                    }}
                  >
                    {idx}
                  </PaginationLink>
                </PaginationItem>
              )
            })}
            <PaginationItem>
              <PaginationNext
                href="#"
                onClick={(e) => {
                  e.preventDefault()
                  setPage((p) => Math.min(totalPages, p + 1))
                }}
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      </div>

      <AllMarketsTickerView symbols={["AAPL", "TSLA", "NVDA", "BTC/USD", "ETH/USD", "SPY", "QQQ"]} />

      {/* Growth Charts for Demo Bots */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {demoBots.slice(0, 4).map((bot) => (
          <BotGrowthChart key={bot.id} bot={bot} />
        ))}
      </div>

  <BotSettingsPane open={settingsOpen} onClose={() => setSettingsOpen(false)} />
    </div>
  )
}

function mockPrice() {
  return 50 + Math.random() * 300
}
function mockChange() {
  return (Math.random() - 0.5) * 6
}
function mockSeries() {
  const n = 24
  const series = Array.from({ length: n }, () => Math.random())
  for (let i = 1; i < n; i++) series[i] = series[i - 1] * 0.6 + series[i] * 0.4
  const min = Math.min(...series), max = Math.max(...series)
  return series.map((v) => (v - min) / (max - min + 1e-6))
}

// Generate mock growth data for charts
function generateGrowthData(botId: string, days: number = 30) {
  const data = []
  let value = 10000
  for (let i = days; i >= 0; i--) {
    const date = new Date()
    date.setDate(date.getDate() - i)
    const change = (Math.random() - 0.4) * 200 // Slight upward bias
    value += change
    data.push({
      date: date.toISOString().split('T')[0],
      value: Math.max(0, value),
      pnl: value - 10000,
    })
  }
  return data
}

function BotGrowthChart({ bot }: { bot: Bot }) {
  const growthData = generateGrowthData(bot.id, 30)
  
  return (
    <Card className="rounded-2xl">
      <CardHeader>
        <CardTitle className="text-lg">{bot.name} Growth</CardTitle>
        <CardDescription>30-day performance chart</CardDescription>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={200}>
          <LineChart data={growthData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis 
              dataKey="date" 
              tick={{ fontSize: 12 }}
              tickFormatter={(value) => new Date(value).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
            />
            <YAxis 
              tick={{ fontSize: 12 }}
              tickFormatter={(value) => `$${value.toLocaleString()}`}
            />
            <Tooltip 
              labelFormatter={(value) => new Date(value).toLocaleDateString()}
              formatter={(value: any) => [`$${value.toLocaleString()}`, 'Portfolio Value']}
            />
            <Line 
              type="monotone" 
              dataKey="value" 
              stroke="#10b981" 
              strokeWidth={2}
              dot={false}
            />
          </LineChart>
        </ResponsiveContainer>
        <div className="mt-4 flex items-center justify-between text-sm">
          <span className="text-muted-foreground">Current PnL:</span>
          <PnLChip value={bot.pnl} />
        </div>
      </CardContent>
    </Card>
  )
}

export function AllMarketsTickerView({ symbols }: { symbols: string[] }) {
  return (
    <Card className="rounded-2xl">
      <CardHeader className="flex flex-row items-center justify-between">
        <div className="flex items-center gap-2">
          <BarChart3 className="h-5 w-5" />
          <CardTitle>Live Markets</CardTitle>
        </div>
        <Badge variant="secondary">Real-time</Badge>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8">
          {/* Remove duplicates to prevent React key errors */}
          {[...new Set(symbols)].map((s) => (
            <RealtimeTickerChip key={s} symbol={s} />
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

function RealtimeTickerChip({ symbol }: { symbol: string }) {
  const { data, error } = useAlpacaRealtime(symbol)
  
  if (error) {
    return (
      <div className="rounded-xl border bg-card p-3 shadow-sm">
        <div className="font-semibold">{symbol}</div>
        <div className="mt-1 text-sm text-muted-foreground">Error</div>
      </div>
    )
  }
  
  if (!data) {
    return (
      <div className="rounded-xl border bg-card p-3 shadow-sm">
        <div className="font-semibold">{symbol}</div>
        <div className="mt-1 text-sm text-muted-foreground">Loading...</div>
      </div>
    )
  }
  
  const price = data.price || data.close || 0
  const change = data.change || 0
  const changePercent = data.changePercent || 0
  
  return (
    <div className="rounded-xl border bg-card p-3 shadow-sm">
      <div className="flex items-baseline justify-between">
        <div className="font-semibold">{symbol}</div>
        <span className={changePercent >= 0 ? "text-emerald-600" : "text-rose-600"}>
          {changePercent >= 0 ? "+" : ""}{changePercent.toFixed(2)}%
        </span>
      </div>
      <div className="mt-1 text-sm font-medium">{price.toFixed(2)}</div>
      <div className="mt-1 text-xs text-muted-foreground">
        {change >= 0 ? "+" : ""}{change.toFixed(2)}
      </div>
    </div>
  )
}

export function BotsOverviewSkeleton() {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
        {[0, 1, 2, 3].map((i) => (
          <Card key={i} className="rounded-2xl">
            <CardContent className="p-4">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="mt-3 h-7 w-32" />
            </CardContent>
          </Card>
        ))}
      </div>
      <Card className="rounded-2xl">
        <CardHeader>
          <Skeleton className="h-6 w-40" />
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5">
            {Array.from({ length: 8 }).map((_, i) => (
              <Card key={i} className="rounded-2xl">
                <CardContent className="space-y-3 p-4">
                  <div className="flex items-center gap-2">
                    <Skeleton className="h-4 w-4 rounded" />
                    <Skeleton className="h-4 w-40" />
                  </div>
                  <div className="grid grid-cols-3 gap-3">
                    <Skeleton className="h-4" />
                    <Skeleton className="h-4" />
                    <Skeleton className="h-4" />
                  </div>
                  <div className="flex items-center justify-between">
                    <Skeleton className="h-8 w-24" />
                    <div className="flex gap-2">
                      <Skeleton className="h-9 w-9 rounded-full" />
                      <Skeleton className="h-9 w-9 rounded-full" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}