import React, { useEffect, useState } from "react"
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/hooks/use-toast"
import { useBacktest } from "@/hooks/useBots"

function getSupabase() {
  return (typeof window !== "undefined" ? (window as any).supabase : null) as any
}

export default function BotSettingsPane({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [apiKey, setApiKey] = useState("")
  const [secret, setSecret] = useState("")
  const [strategy, setStrategy] = useState("grid-1")
  const [initialCapital, setInitialCapital] = useState(1000)
  const [strategies, setStrategies] = useState<Array<{ id: string; name: string; params: Record<string, any> }>>([])
  const [newStrategyName, setNewStrategyName] = useState("")
  const [newStrategyParams, setNewStrategyParams] = useState("")
  const { toast } = useToast()
  const backtestMut = useBacktest()
  const [running, setRunning] = useState(false)
  const [lastResult, setLastResult] = useState<any>(null)

  const supabase = getSupabase()

  useEffect(() => {
    // load settings from Supabase or localStorage
    let mounted = true
    ;(async () => {
      try {
        if (supabase) {
          const { data, error } = await supabase.from("bot_settings").select("api_key, api_secret, default_strategy, initial_capital").limit(1).order("created_at", { ascending: false }).single()
          if (!mounted) return
          if (!error && data) {
            if (data.api_key) setApiKey(data.api_key)
            if (data.api_secret) setSecret(data.api_secret)
            if (data.default_strategy) setStrategy(data.default_strategy)
            if (data.initial_capital) setInitialCapital(Number(data.initial_capital))
          }
          // load strategies table if exists
          try {
            const sres = await supabase.from("strategies").select("id, name, params")
            if (!sres.error && Array.isArray(sres.data)) setStrategies(sres.data.map((r: any) => ({ id: r.id, name: r.name, params: r.params ?? {} })))
          } catch {}
          return
        }
      } catch (e) {}

      // fallback localStorage
      try {
        const raw = localStorage.getItem("bot_settings")
        if (raw) {
          const obj = JSON.parse(raw)
          if (obj.apiKey) setApiKey(obj.apiKey)
          if (obj.secret) setSecret(obj.secret)
          if (obj.strategy) setStrategy(obj.strategy)
          if (obj.initialCapital) setInitialCapital(Number(obj.initialCapital))
        }
        const sraw = localStorage.getItem("bot_strategies")
        if (sraw) setStrategies(JSON.parse(sraw))
      } catch (e) {}
    })()
    return () => {
      mounted = false
    }
  }, [open])

  if (!open) return null

  return (
    <div className="fixed right-4 top-4 z-50 w-[420px]">
      <Card className="rounded-2xl">
        <CardHeader>
          <CardTitle>Bot settings</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <div className="text-sm font-medium">API Key</div>
            <Input value={apiKey} onChange={(e) => setApiKey((e.target as HTMLInputElement).value)} />
          </div>
          <div>
            <div className="text-sm font-medium">Secret</div>
            <Input value={secret} onChange={(e) => setSecret((e.target as HTMLInputElement).value)} />
          </div>

          <div>
            <div className="text-sm font-medium">Default strategy</div>
            <Select value={strategy} onValueChange={(v) => setStrategy(v)}>
              <SelectTrigger><SelectValue placeholder="Strategy" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="grid-1">Grid 1%</SelectItem>
                <SelectItem value="grid-x">Grid X%</SelectItem>
                <SelectItem value="stat-arb">Stat Arb</SelectItem>
                <SelectItem value="indicator">Indicator</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <div className="text-sm font-medium">Initial capital</div>
            <Input type="number" value={String(initialCapital)} onChange={(e) => setInitialCapital(Number((e.target as HTMLInputElement).value))} />
          </div>

          <div>
            <div className="text-sm font-medium">Backtest notes</div>
            <Textarea placeholder="Describe test scenario..." />
          </div>
          
          <Card className="rounded-lg border">
            <CardHeader>
              <CardTitle className="text-sm">Backtest</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-2">
                <Input placeholder="Symbol e.g. BTC/USD or AAPL" id="bt-symbol" />
                <div className="flex gap-2">
                  <Input placeholder="From (YYYY-MM-DD)" id="bt-from" />
                  <Input placeholder="To (YYYY-MM-DD)" id="bt-to" />
                </div>
                <div className="flex items-center gap-2">
                  <Button disabled={running} onClick={async () => {
                    const sym = (document.getElementById("bt-symbol") as HTMLInputElement)?.value || "BTC/USD"
                    const from = (document.getElementById("bt-from") as HTMLInputElement)?.value || undefined
                    const to = (document.getElementById("bt-to") as HTMLInputElement)?.value || undefined
                    try {
                      setRunning(true)
                      const payload = { symbol: sym, start: from, end: to, initialCapital, dcaAmount: 0, frequency: 'daily' }
                      const res = await backtestMut.mutateAsync(payload)
                      setLastResult(res?.result ?? res)
                      toast({ title: 'Backtest complete', description: `Trades: ${res?.result?.trades?.length ?? 0}` })
                    } catch (e) {
                      toast({ title: 'Backtest failed', description: String(e) })
                    } finally {
                      setRunning(false)
                    }
                  }}>
                    {running ? 'Running…' : 'Run backtest'}
                  </Button>
                  <Button variant="ghost" onClick={() => setLastResult(null)}>Clear</Button>
                </div>
                {lastResult && (
                  <div className="mt-2 rounded-md border p-2 text-sm">
                    <div className="font-medium">Last run summary</div>
                    <div>Final balance: {String(lastResult?.summary?.finalBalance ?? lastResult?.summary?.final?.balance ?? 'N/A')}</div>
                    <div>Trades: {String(lastResult?.trades?.length ?? 0)}</div>
                    <div>Return: {String(lastResult?.summary?.totalReturnPct ?? 'N/A')}%</div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          <Card className="rounded-lg border">
            <CardHeader>
              <CardTitle className="text-sm">Strategy builder</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <Input placeholder="Strategy name" value={newStrategyName} onChange={(e) => setNewStrategyName((e.target as HTMLInputElement).value)} />
                <Textarea placeholder='Params as JSON e.g. {"gridSize":1,"steps":10}' value={newStrategyParams} onChange={(e) => setNewStrategyParams((e.target as HTMLTextAreaElement).value)} />
                <div className="flex gap-2">
                  <Button onClick={async () => {
                    try {
                      const params = newStrategyParams ? JSON.parse(newStrategyParams) : {}
                      const entry = { id: crypto.randomUUID(), name: newStrategyName || `Strategy ${strategies.length+1}`, params }
                      if (supabase) {
                        await supabase.from("strategies").insert({ name: entry.name, params: entry.params })
                      } else {
                        const next = [entry, ...strategies]
                        setStrategies(next)
                        localStorage.setItem("bot_strategies", JSON.stringify(next))
                      }
                      setNewStrategyName("")
                      setNewStrategyParams("")
                      toast({ title: "Strategy saved" })
                    } catch (e) {
                      toast({ title: "Save failed", description: String(e) })
                    }
                  }}>Save strategy</Button>
                </div>
                <div>
                  {strategies.map((s) => (
                    <div key={s.id} className="flex items-center justify-between border-b py-2">
                      <div>
                        <div className="font-medium">{s.name}</div>
                        <div className="text-xs text-muted-foreground">{JSON.stringify(s.params)}</div>
                      </div>
                      <div className="flex gap-2">
                        <Button size="icon" variant="ghost" onClick={() => { setStrategy(s.name); toast({ title: "Selected strategy", description: s.name }) }}>Use</Button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </CardContent>
        <CardFooter className="flex justify-between">
          <div className="text-sm text-muted-foreground">Settings are stored locally for now.</div>
          <div className="flex gap-2">
            <Button variant="ghost" onClick={onClose}>Close</Button>
            <Button onClick={() => { alert('Saved (locally)'); onClose() }}>Save</Button>
          </div>
        </CardFooter>
      </Card>
    </div>
  )
}
