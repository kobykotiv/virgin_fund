"use client"

import { useEffect, useMemo, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"

// Define types for our signal configuration
// Types for signal builder
type ConditionType = "price" | "volume" | "indicator"

interface SignalCondition {
  id?: string
  type: ConditionType
  operator: string
  // for price/volume: numeric value as string
  value?: string
  // for indicator: name and params
  indicator?: string
  params?: Record<string, string>
}

interface SignalConfig {
  name: string
  description: string
  timeframe: string
  conditions: SignalCondition[]
}

export function SignalBuilder() {
  // Provider selection: local evaluation or Alpaca server-backed evaluation
  const [provider, setProvider] = useState<"local" | "alpaca">("local")
  const [alpacaKeyStatus, setAlpacaKeyStatus] = useState<string | null>(null)
  const [equityCurve, setEquityCurve] = useState<number[] | null>(null)
  const [timeframeValidation, setTimeframeValidation] = useState<{ valid: boolean; message?: string; mapped?: string }>(() => ({ valid: true }))
  const [overrideEnabled, setOverrideEnabled] = useState<boolean>(false)
  const [overrideValue, setOverrideValue] = useState<string>("")
  // Built-in indicators supported by this minimal builder
  const INDICATORS: { id: string; label: string; params?: { key: string; label: string; default?: string }[] }[] = [
    { id: "sma", label: "Simple MA", params: [{ key: "period", label: "Period", default: "14" }] },
    { id: "ema", label: "Exponential MA", params: [{ key: "period", label: "Period", default: "14" }] },
    { id: "rsi", label: "RSI", params: [{ key: "period", label: "Period", default: "14" }] },
  ]

  // Initialize with safe default values
  const [signalConfig, setSignalConfig] = useState<SignalConfig>({
    name: "",
    description: "",
    timeframe: "1d",
    conditions: [{ type: "price", operator: "above", value: "" }],
  })

  const [evaluationResult, setEvaluationResult] = useState<string | null>(null)

  const handleAddCondition = () => {
    setSignalConfig({
      ...signalConfig,
  conditions: [...signalConfig.conditions, { type: "price", operator: "above", value: "" }],
    })
  }

  const handleRemoveCondition = (index: number) => {
    const newConditions = [...signalConfig.conditions]
    newConditions.splice(index, 1)
    setSignalConfig({
      ...signalConfig,
      conditions: newConditions,
    })
  }

  const updateCondition = (index: number, field: keyof SignalCondition, value: string) => {
    const newConditions = [...signalConfig.conditions]
    newConditions[index] = {
      ...newConditions[index],
      [field]: value,
    }
    setSignalConfig({
      ...signalConfig,
      conditions: newConditions,
    })
  }

  const updateConditionParam = (index: number, paramKey: string, value: string) => {
    const newConditions = [...signalConfig.conditions]
    const c = { ...newConditions[index] }
    c.params = { ...(c.params || {}), [paramKey]: value }
    newConditions[index] = c
    setSignalConfig({ ...signalConfig, conditions: newConditions })
  }

  const handleSave = () => {
    // Ensure we're not passing null or undefined to Object.entries
    if (!signalConfig) {
      console.error("Signal configuration is undefined or null")
      return
    }

    // Save to localStorage as a minimal persistence layer for now
    try {
      const key = `vf:signal:${signalConfig.name || Date.now()}`
      localStorage.setItem(key, JSON.stringify(signalConfig))
      console.log("Saved signal configuration to localStorage:", key)
    } catch (e) {
      console.error("Failed to save signal configuration", e)
    }
  }

  // --- Minimal in-browser evaluator / backtest stub ---
  // For demo purposes we generate mock price series and evaluate simple conditions.
  const generateMockPrices = (n = 200) => {
    const prices: number[] = []
    let p = 100
    for (let i = 0; i < n; i++) {
      p = p * (1 + (Math.random() - 0.48) * 0.02)
      prices.push(Number(p.toFixed(2)))
    }
    return prices
  }

  const sma = (prices: number[], period: number) => {
    const out: number[] = []
    for (let i = 0; i < prices.length; i++) {
      if (i + 1 < period) {
        out.push(NaN)
        continue
      }
      const slice = prices.slice(i + 1 - period, i + 1)
      const sum = slice.reduce((a, b) => a + b, 0)
      out.push(sum / period)
    }
    return out
  }

  const rsi = (prices: number[], period: number) => {
    const changes: number[] = []
    for (let i = 1; i < prices.length; i++) changes.push(prices[i] - prices[i - 1])
    const gains: number[] = []
    const losses: number[] = []
    for (const c of changes) {
      gains.push(Math.max(0, c))
      losses.push(Math.max(0, -c))
    }
    const out: number[] = [NaN]
    for (let i = 0; i < gains.length; i++) {
      if (i + 1 < period) {
        out.push(NaN)
        continue
      }
      const g = gains.slice(i + 1 - period, i + 1).reduce((a, b) => a + b, 0) / period
      const l = losses.slice(i + 1 - period, i + 1).reduce((a, b) => a + b, 0) / period
      const rs = g / (l || 1e-6)
      out.push(100 - 100 / (1 + rs))
    }
    return out
  }

  const evaluate = () => {
    setEvaluationResult(null)
  setEquityCurve(null)
    // Send config to server-side backtest endpoint (falls back to in-browser evaluator if request fails)
    ;(async () => {
      // If user selected Alpaca provider, ensure timeframe is valid and mapped
      if (provider === "alpaca") {
        if (!timeframeValidation.valid) {
          setEvaluationResult(`Invalid timeframe for Alpaca: ${timeframeValidation.message || signalConfig.timeframe}`)
          return
        }
      }
      try {
        const res = await fetch("/api/signals/backtest", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ config: signalConfig, options: { symbol: "MOCK", lookback: 500, provider, timeframe: timeframeValidation.mapped || signalConfig.timeframe } }),
        })
        const j = await res.json()
        if (j?.ok && j.result) {
      setEvaluationResult(`Server backtest: signals=${j.result.signals}, hitRate=${j.result.hitRate}, avgReturn=${j.result.avgReturn}`)
      // optionally render equity curve if provided
      if (Array.isArray(j.result.equityCurve)) setEquityCurve(j.result.equityCurve)
          return
        }
        setEvaluationResult(`Server error: ${j?.error || "unknown"}`)
      } catch (e) {
        // fallback to in-browser evaluator
        const prices = generateMockPrices(500)
        let matches = 0
        for (const cond of signalConfig.conditions) {
          if (cond.type === "price" && cond.value) {
            const v = Number(cond.value)
            const op = cond.operator
            const last = prices[prices.length - 1]
            let ok = false
            if (op === "above") ok = last > v
            if (op === "below") ok = last < v
            if (op === "equals") ok = last === v
            if (ok) matches++
          }
          if (cond.type === "indicator" && cond.indicator) {
            const ind = cond.indicator
            const period = Number(cond.params?.period || 14)
            if (ind === "sma") {
              const series = sma(prices, period)
              const last = prices[prices.length - 1]
              const lastSma = series[series.length - 1]
              if (!isNaN(lastSma)) {
                if (cond.operator === "above" && last > lastSma) matches++
                if (cond.operator === "below" && last < lastSma) matches++
              }
            }
            if (ind === "rsi") {
              const series = rsi(prices, period)
              const lastRsi = series[series.length - 1]
              if (!isNaN(lastRsi)) {
                if (cond.operator === "above" && lastRsi > Number(cond.value || 70)) matches++
                if (cond.operator === "below" && lastRsi < Number(cond.value || 30)) matches++
              }
            }
          }
        }
        setEvaluationResult(`Local fallback: Matched conditions: ${matches} / ${signalConfig.conditions.length}`)
      }
    })()
  }

  // Map user-entered timeframe (like '5m', '1h', '1d') to Alpaca-compatible timeframe strings.
  // Returns { valid, message, mapped }
  const mapTimeframeToAlpaca = (tf: string) => {
    if (!tf || typeof tf !== "string") return { valid: false, message: "Empty timeframe" }
    const s = tf.trim().toLowerCase()
    const m = s.match(/^(\d+)(s|sec|secs|m|min|mins|h|hr|hrs|d|day|w|wk|mo|month)?$/)
    if (!m) return { valid: false, message: "Unrecognized format (use 1m, 5m, 1h, 1d)" }
    const n = Number(m[1])
    const unit = m[2] || "m"
    // Normalize unit
    const u = unit.startsWith("s") ? "s" : unit.startsWith("m") && unit !== "mo" ? "m" : unit.startsWith("h") ? "h" : unit.startsWith("d") ? "d" : unit.startsWith("w") ? "w" : unit.startsWith("mo") ? "mo" : "m"

    // Alpaca supports these bar timeframes for stocks: 1Min, 5Min, 15Min, 30Min, 1Hour, 2Hour, 4Hour, 1Day
    if (u === "s") return { valid: false, message: "Seconds not supported by Alpaca bars" }
    if (u === "m") {
      if (n === 1) return { valid: true, mapped: "1Min" }
      if (n === 5) return { valid: true, mapped: "5Min" }
      if (n === 15) return { valid: true, mapped: "15Min" }
      if (n === 30) return { valid: true, mapped: "30Min" }
      if (n === 60) return { valid: true, mapped: "1Hour" }
      return { valid: false, message: "Unsupported minute interval for Alpaca (try 1,5,15,30,60)" }
    }
    if (u === "h") {
      if (n === 1) return { valid: true, mapped: "1Hour" }
      if (n === 2) return { valid: true, mapped: "2Hour" }
      if (n === 4) return { valid: true, mapped: "4Hour" }
      if (n === 24) return { valid: true, mapped: "1Day" }
      return { valid: false, message: "Unsupported hour interval for Alpaca (try 1,2,4)" }
    }
    if (u === "d") {
      if (n === 1) return { valid: true, mapped: "1Day" }
      return { valid: false, message: "Day intervals >1 are not supported by simple Alpaca bars mapping" }
    }
    if (u === "w" || u === "mo") return { valid: false, message: "Weekly/monthly not supported for Alpaca bars in this UI" }
    return { valid: false, message: "Unknown timeframe unit" }
  }

  // Validate timeframe whenever provider or timeframe changes
  useEffect(() => {
    if (provider === "alpaca") {
      // If user enabled an advanced override, trust it (but require non-empty)
      if (overrideEnabled) {
        const v = overrideValue?.trim()
        if (!v) {
          setTimeframeValidation({ valid: false, message: "Custom override is empty" })
        } else {
          setTimeframeValidation({ valid: true, mapped: v, message: "Using custom override (advanced)" })
        }
      } else {
        const v = mapTimeframeToAlpaca(signalConfig.timeframe)
        setTimeframeValidation(v)
      }
    } else {
      setTimeframeValidation({ valid: true })
    }
  }, [provider, signalConfig.timeframe])

  // Check server-side Alpaca key presence (redacted). Updates alpacaKeyStatus string.
  const checkAlpacaKey = async () => {
    setAlpacaKeyStatus("checking")
    try {
      const res = await fetch("/api/keys/alpaca/get")
      const j = await res.json()
      if (j?.ok) {
        // server should never return the raw secret to the browser; it may return a redacted form or presence flag
        if (j.key) setAlpacaKeyStatus(`present: ${String(j.key).slice(0, 4).padEnd(4, "*")}`)
        else if (j.keyExists) setAlpacaKeyStatus("present (redacted)")
        else setAlpacaKeyStatus("not set")
      } else {
        setAlpacaKeyStatus("error")
      }
    } catch (err) {
      setAlpacaKeyStatus("error")
    }
  }

  // Simple sparkline renderer using inline SVG — dependency-free and tiny.
  const Sparkline = ({ data, width = 240, height = 40, stroke = "#06b6d4" }: { data: number[]; width?: number; height?: number; stroke?: string }) => {
    const path = useMemo(() => {
      if (!data || data.length === 0) return ""
      const min = Math.min(...data)
      const max = Math.max(...data)
      const range = max - min || 1
      const step = width / Math.max(1, data.length - 1)
      return data
        .map((v, i) => {
          const x = i * step
          const y = height - ((v - min) / range) * height
          return `${i === 0 ? "M" : "L"}${x.toFixed(2)},${y.toFixed(2)}`
        })
        .join(" ")
    }, [data, width, height])

    return (
      <svg className="w-full" width={width} height={height} viewBox={`0 0 ${width} ${height}`} preserveAspectRatio="none">
        <path d={path} fill="none" stroke={stroke} strokeWidth={1.5} strokeLinejoin="round" strokeLinecap="round" />
      </svg>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Create Custom Signal</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
          <div>
            <Label>Provider</Label>
            <Select value={provider} onValueChange={(v) => setProvider(v as any)}>
              <SelectTrigger>
                <SelectValue placeholder="Select provider" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="local">Local (browser)</SelectItem>
                <SelectItem value="alpaca">Alpaca (server)</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label>Alpaca Key</Label>
            <div className="flex gap-2">
              <Button size="sm" variant="outline" onClick={checkAlpacaKey}>
                Check Alpaca Key
              </Button>
              <div className="flex items-center px-2">{alpacaKeyStatus ?? "unknown"}</div>
            </div>
          </div>

          <div className="col-span-1 md:col-span-1">
            <Label>Timeframe</Label>
            <Input value={signalConfig.timeframe} onChange={(e) => setSignalConfig({ ...signalConfig, timeframe: e.target.value })} />
          </div>
        </div>
        <div className="flex items-center gap-3">
          <input id="tf-override" type="checkbox" checked={overrideEnabled} onChange={(e) => setOverrideEnabled(e.target.checked)} />
          <Label htmlFor="tf-override" className="!mb-0">Advanced: use custom Alpaca timeframe</Label>
          {overrideEnabled && (
            <div className="flex items-center gap-2">
              <Input placeholder="e.g. 1Min or 5Min" value={overrideValue} onChange={(e) => setOverrideValue(e.target.value)} />
              <div className="text-sm text-amber-600">Warning: advanced overrides can break server requests if invalid.</div>
            </div>
          )}
        </div>

        {provider === "alpaca" && (
          <div className="text-sm mt-2">
            {timeframeValidation.valid ? (
              <div className="text-green-600">Timeframe OK {timeframeValidation.mapped ? `→ ${timeframeValidation.mapped}` : ""} {timeframeValidation.message ? `(${timeframeValidation.message})` : ""}</div>
            ) : (
              <div className="text-red-600">Invalid timeframe: {timeframeValidation.message}</div>
            )}
          </div>
        )}
        <div className="space-y-2">
          <Label htmlFor="name">Signal Name</Label>
          <Input
            id="name"
            value={signalConfig.name}
            onChange={(e) => setSignalConfig({ ...signalConfig, name: e.target.value })}
            placeholder="Enter signal name"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="description">Description</Label>
          <Textarea
            id="description"
            value={signalConfig.description}
            onChange={(e) => setSignalConfig({ ...signalConfig, description: e.target.value })}
            placeholder="Describe what this signal detects"
          />
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <Label>Conditions</Label>
            <Button variant="outline" size="sm" onClick={handleAddCondition}>
              Add Condition
            </Button>
          </div>

          {signalConfig.conditions &&
            signalConfig.conditions.map((condition, index) => (
              <Card key={index}>
                <CardContent className="pt-6">
                  <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                    <div>
                      <Label htmlFor={`condition-type-${index}`}>Type</Label>
                      <Select value={condition.type} onValueChange={(value) => updateCondition(index, "type", value)}>
                        <SelectTrigger id={`condition-type-${index}`}>
                          <SelectValue placeholder="Select type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="price">Price</SelectItem>
                          <SelectItem value="volume">Volume</SelectItem>
                          <SelectItem value="market_cap">Market Cap</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label htmlFor={`condition-operator-${index}`}>Operator</Label>
                      <Select
                        value={condition.operator}
                        onValueChange={(value) => updateCondition(index, "operator", value)}
                      >
                        <SelectTrigger id={`condition-operator-${index}`}>
                          <SelectValue placeholder="Select operator" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="above">Above</SelectItem>
                          <SelectItem value="below">Below</SelectItem>
                          <SelectItem value="equals">Equals</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label htmlFor={`condition-value-${index}`}>Value</Label>
                      <Input
                        id={`condition-value-${index}`}
                        value={condition.value}
                        onChange={(e) => updateCondition(index, "value", e.target.value)}
                        placeholder="Enter value"
                      />
                    </div>
                  </div>

                  <Button
                    variant="ghost"
                    size="sm"
                    className="mt-2 text-destructive"
                    onClick={() => handleRemoveCondition(index)}
                    disabled={signalConfig.conditions.length <= 1}
                  >
                    Remove
                  </Button>
                </CardContent>
              </Card>
            ))}
        </div>
      </CardContent>
      <CardFooter>
        <div className="flex items-center gap-2">
          <Button onClick={handleSave}>Save Signal</Button>
          <Button variant="secondary" onClick={evaluate}>
            Evaluate / Backtest
          </Button>
          {evaluationResult && <div className="ml-4 text-sm">{evaluationResult}</div>}
        </div>
        {equityCurve && (
          <div className="mt-2 w-full">
            <Label>Equity Curve</Label>
            <div className="bg-muted p-2 rounded">
              <Sparkline data={equityCurve} />
            </div>
          </div>
        )}
      </CardFooter>
    </Card>
  )
}

