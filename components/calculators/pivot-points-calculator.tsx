"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export function PivotPointsCalculator() {
  const [high, setHigh] = useState<string>("")
  const [low, setLow] = useState<string>("")
  const [close, setClose] = useState<string>("")
  const [method, setMethod] = useState<"standard" | "fibonacci" | "woodie" | "camarilla">("standard")
  const [results, setResults] = useState<{
    pivotPoint: number
    resistance: number[]
    support: number[]
  } | null>(null)

  const calculatePivots = () => {
    const h = parseFloat(high)
    const l = parseFloat(low)
    const c = parseFloat(close)

    if (isNaN(h) || isNaN(l) || isNaN(c)) return

    let pp: number
    let r1: number, r2: number, r3: number
    let s1: number, s2: number, s3: number

    switch (method) {
      case "fibonacci":
        pp = (h + l + c) / 3
        r1 = pp + ((h - l) * 0.382)
        r2 = pp + ((h - l) * 0.618)
        r3 = pp + (h - l)
        s1 = pp - ((h - l) * 0.382)
        s2 = pp - ((h - l) * 0.618)
        s3 = pp - (h - l)
        break

      case "woodie":
        pp = (h + l + (2 * c)) / 4
        r1 = (2 * pp) - l
        r2 = pp + (h - l)
        r3 = h + 2 * (pp - l)
        s1 = (2 * pp) - h
        s2 = pp - (h - l)
        s3 = l - 2 * (h - pp)
        break

      case "camarilla":
        pp = (h + l + c) / 3
        r1 = c + ((h - l) * 1.1/12)
        r2 = c + ((h - l) * 1.1/6)
        r3 = c + ((h - l) * 1.1/4)
        s1 = c - ((h - l) * 1.1/12)
        s2 = c - ((h - l) * 1.1/6)
        s3 = c - ((h - l) * 1.1/4)
        break

      default: // Standard
        pp = (h + l + c) / 3
        r1 = (2 * pp) - l
        r2 = pp + (h - l)
        r3 = h + 2 * (pp - l)
        s1 = (2 * pp) - h
        s2 = pp - (h - l)
        s3 = l - 2 * (h - pp)
    }

    setResults({
      pivotPoint: pp,
      resistance: [r1, r2, r3],
      support: [s1, s2, s3]
    })
  }

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>High</Label>
          <Input
            type="number"
            value={high}
            onChange={(e) => setHigh(e.target.value)}
            placeholder="Enter high price"
          />
        </div>
        <div className="space-y-2">
          <Label>Low</Label>
          <Input
            type="number"
            value={low}
            onChange={(e) => setLow(e.target.value)}
            placeholder="Enter low price"
          />
        </div>
        <div className="space-y-2">
          <Label>Close</Label>
          <Input
            type="number"
            value={close}
            onChange={(e) => setClose(e.target.value)}
            placeholder="Enter closing price"
          />
        </div>
        <div className="space-y-2">
          <Label>Method</Label>
          <Select value={method} onValueChange={(value: any) => setMethod(value)}>
            <SelectTrigger>
              <SelectValue placeholder="Select method" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="standard">Standard</SelectItem>
              <SelectItem value="fibonacci">Fibonacci</SelectItem>
              <SelectItem value="woodie">Woodie's</SelectItem>
              <SelectItem value="camarilla">Camarilla</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <Button className="w-full" onClick={calculatePivots}>Calculate Pivot Points</Button>

      {results && (
        <div className="space-y-4">
          <div className="p-4 rounded-lg bg-muted">
            <p className="text-sm font-medium">Pivot Point (PP)</p>
            <p className="text-2xl font-bold">{results.pivotPoint.toFixed(2)}</p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <p className="font-medium">Resistance Levels</p>
              {results.resistance.map((r, i) => (
                <div key={i} className="p-2 border rounded">
                  <p className="text-sm text-muted-foreground">R{i + 1}</p>
                  <p className="text-lg font-bold">{r.toFixed(2)}</p>
                </div>
              ))}
            </div>
            <div className="space-y-2">
              <p className="font-medium">Support Levels</p>
              {results.support.map((s, i) => (
                <div key={i} className="p-2 border rounded">
                  <p className="text-sm text-muted-foreground">S{i + 1}</p>
                  <p className="text-lg font-bold">{s.toFixed(2)}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
