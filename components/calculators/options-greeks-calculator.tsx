"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export function OptionsGreeksCalculator() {
  const [spotPrice, setSpotPrice] = useState<string>("")
  const [strikePrice, setStrikePrice] = useState<string>("")
  const [timeToExpiry, setTimeToExpiry] = useState<string>("")
  const [volatility, setVolatility] = useState<string>("")
  const [riskFreeRate, setRiskFreeRate] = useState<string>("2.5")
  const [optionType, setOptionType] = useState<"call" | "put">("call")
  
  const [results, setResults] = useState<{
    delta: number
    gamma: number
    theta: number
    vega: number
    rho: number
    premium: number
  } | null>(null)

  const calculateGreeks = () => {
    const S = parseFloat(spotPrice) // Spot price
    const K = parseFloat(strikePrice) // Strike price
    const T = parseFloat(timeToExpiry) / 365 // Time to expiry in years
    const sigma = parseFloat(volatility) / 100 // Volatility
    const r = parseFloat(riskFreeRate) / 100 // Risk-free rate

    if (isNaN(S) || isNaN(K) || isNaN(T) || isNaN(sigma) || isNaN(r)) return

    // Black-Scholes calculation would go here
    // This is a simplified placeholder
    const d1 = (Math.log(S/K) + (r + sigma*sigma/2)*T)/(sigma*Math.sqrt(T))
    const d2 = d1 - sigma*Math.sqrt(T)

    const delta = optionType === "call" ? 0.5 : -0.5
    const gamma = 0.1
    const theta = -0.01
    const vega = 0.2
    const rho = 0.01
    const premium = 100

    setResults({ delta, gamma, theta, vega, rho, premium })
  }

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>Spot Price ($)</Label>
          <Input
            type="number"
            value={spotPrice}
            onChange={(e) => setSpotPrice(e.target.value)}
            placeholder="100"
          />
        </div>
        <div className="space-y-2">
          <Label>Strike Price ($)</Label>
          <Input
            type="number"
            value={strikePrice}
            onChange={(e) => setStrikePrice(e.target.value)}
            placeholder="100"
          />
        </div>
        <div className="space-y-2">
          <Label>Days to Expiry</Label>
          <Input
            type="number"
            value={timeToExpiry}
            onChange={(e) => setTimeToExpiry(e.target.value)}
            placeholder="30"
          />
        </div>
        <div className="space-y-2">
          <Label>Volatility (%)</Label>
          <Input
            type="number"
            value={volatility}
            onChange={(e) => setVolatility(e.target.value)}
            placeholder="20"
          />
        </div>
        <div className="space-y-2">
          <Label>Risk-Free Rate (%)</Label>
          <Input
            type="number"
            value={riskFreeRate}
            onChange={(e) => setRiskFreeRate(e.target.value)}
            placeholder="2.5"
          />
        </div>
        <div className="space-y-2">
          <Label>Option Type</Label>
          <Select value={optionType} onValueChange={(value: "call" | "put") => setOptionType(value)}>
            <SelectTrigger>
              <SelectValue placeholder="Select type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="call">Call</SelectItem>
              <SelectItem value="put">Put</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <Button className="w-full" onClick={calculateGreeks}>Calculate Greeks</Button>

      {results && (
        <div className="grid grid-cols-2 gap-4">
          <div className="p-4 rounded-lg bg-muted">
            <p className="text-sm font-medium">Option Premium</p>
            <p className="text-2xl font-bold">${results.premium.toFixed(2)}</p>
          </div>
          <div className="p-4 rounded-lg bg-muted">
            <p className="text-sm font-medium">Delta</p>
            <p className="text-2xl font-bold">{results.delta.toFixed(4)}</p>
          </div>
          <div className="p-4 rounded-lg bg-muted">
            <p className="text-sm font-medium">Gamma</p>
            <p className="text-2xl font-bold">{results.gamma.toFixed(4)}</p>
          </div>
          <div className="p-4 rounded-lg bg-muted">
            <p className="text-sm font-medium">Theta</p>
            <p className="text-2xl font-bold">{results.theta.toFixed(4)}</p>
          </div>
          <div className="p-4 rounded-lg bg-muted">
            <p className="text-sm font-medium">Vega</p>
            <p className="text-2xl font-bold">{results.vega.toFixed(4)}</p>
          </div>
          <div className="p-4 rounded-lg bg-muted">
            <p className="text-sm font-medium">Rho</p>
            <p className="text-2xl font-bold">{results.rho.toFixed(4)}</p>
          </div>
        </div>
      )}
    </div>
  )
}
