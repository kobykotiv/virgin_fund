"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Chart } from "@/components/ui/chart"
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from "recharts"
import { DollarSign } from "lucide-react"

export function OptionPremiumCalculator() {
  const [underlyingPrice, setUnderlyingPrice] = useState<string>("100")
  const [strikePrice, setStrikePrice] = useState<string>("100")
  const [optionType, setOptionType] = useState<string>("call")
  const [volatility, setVolatility] = useState<string>("20")
  const [daysToExpiration, setDaysToExpiration] = useState<string>("30")
  const [riskFreeRate, setRiskFreeRate] = useState<string>("2")
  const [premium, setPremium] = useState<number | null>(null)
  const [chartData, setChartData] = useState<any[]>([])

  // Black-Scholes formula for European options
  function calculatePremium() {
    const S = Number.parseFloat(underlyingPrice) || 0
    const K = Number.parseFloat(strikePrice) || 0
    const T = (Number.parseInt(daysToExpiration) || 0) / 365
    const r = (Number.parseFloat(riskFreeRate) || 0) / 100
    const sigma = (Number.parseFloat(volatility) || 0) / 100

    if (S <= 0 || K <= 0 || T <= 0 || sigma <= 0) {
      setPremium(null)
      setChartData([])
      return
    }

    const d1 = (Math.log(S / K) + (r + sigma * sigma / 2) * T) / (sigma * Math.sqrt(T))
    const d2 = d1 - sigma * Math.sqrt(T)

    function normCDF(x: number) {
      return (1 + erf(x / Math.sqrt(2))) / 2
    }
    function erf(x: number) {
      // Approximation of error function
      const sign = x >= 0 ? 1 : -1
      x = Math.abs(x)
      const a1 = 0.254829592
      const a2 = -0.284496736
      const a3 = 1.421413741
      const a4 = -1.453152027
      const a5 = 1.061405429
      const p = 0.3275911
      const t = 1 / (1 + p * x)
      return (
        sign *
        (1 -
          (((((a5 * t + a4) * t) + a3) * t + a2) * t + a1) * t * Math.exp(-x * x)))
      )
    }

    let optionPremium = 0
    if (optionType === "call") {
      optionPremium = S * normCDF(d1) - K * Math.exp(-r * T) * normCDF(d2)
    } else {
      optionPremium = K * Math.exp(-r * T) * normCDF(-d2) - S * normCDF(-d1)
    }
    setPremium(optionPremium)

    // Chart: show premium for a range of underlying prices
    const prices = Array.from({ length: 21 }, (_, i) => S - 10 + i)
    const chart = prices.map((price) => {
      const d1p = (Math.log(price / K) + (r + sigma * sigma / 2) * T) / (sigma * Math.sqrt(T))
      const d2p = d1p - sigma * Math.sqrt(T)
      let prem = 0
      if (optionType === "call") {
        prem = price * normCDF(d1p) - K * Math.exp(-r * T) * normCDF(d2p)
      } else {
        prem = K * Math.exp(-r * T) * normCDF(-d2p) - price * normCDF(-d1p)
      }
      return {
        price: Number(price.toFixed(2)),
        premium: Number(prem.toFixed(2)),
      }
    })
    setChartData(chart)
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <Card className="lg:col-span-1">
        <CardHeader>
          <CardTitle className="flex items-center">
            <DollarSign className="mr-2 h-5 w-5" />
            Option Premium Calculator
          </CardTitle>
          <CardDescription>Calculate the theoretical price of an option using Black-Scholes</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="underlyingPrice">Underlying Price</Label>
            <Input
              id="underlyingPrice"
              type="number"
              value={underlyingPrice}
              onChange={(e) => setUnderlyingPrice(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="strikePrice">Strike Price</Label>
            <Input
              id="strikePrice"
              type="number"
              value={strikePrice}
              onChange={(e) => setStrikePrice(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="optionType">Option Type</Label>
            <Select value={optionType} onValueChange={setOptionType}>
              <SelectTrigger>
                <SelectValue placeholder="Select option type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="call">Call</SelectItem>
                <SelectItem value="put">Put</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="volatility">Volatility (%)</Label>
            <Input
              id="volatility"
              type="number"
              step="0.1"
              value={volatility}
              onChange={(e) => setVolatility(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="daysToExpiration">Days to Expiration</Label>
            <Input
              id="daysToExpiration"
              type="number"
              value={daysToExpiration}
              onChange={(e) => setDaysToExpiration(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="riskFreeRate">Risk-Free Rate (%)</Label>
            <Input
              id="riskFreeRate"
              type="number"
              step="0.1"
              value={riskFreeRate}
              onChange={(e) => setRiskFreeRate(e.target.value)}
            />
          </div>
          <Button className="w-full" onClick={calculatePremium}>
            Calculate Premium
          </Button>
        </CardContent>
      </Card>
      <Card className="lg:col-span-2">
        <CardHeader>
          <CardTitle>Results</CardTitle>
          <CardDescription>Theoretical option premium and sensitivity to underlying price</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="bg-muted p-4 rounded-lg">
              <p className="text-sm text-muted-foreground">Option Premium</p>
              <p className="text-2xl font-bold">
                {premium !== null ? `$${premium.toFixed(2)}` : "-"}
              </p>
              <p className="text-xs text-muted-foreground">Based on Black-Scholes model</p>
            </div>
          </div>
          <div className="h-[300px]">
            <Chart children={undefined}>
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="price" label={{ value: "Underlying Price", position: "insideBottomRight", offset: -5 }} />
                  <YAxis label={{ value: "Premium ($)", angle: -90, position: "insideLeft" }} />
                  <Tooltip formatter={(value) => [`$${value}`, "Premium"]} />
                  <Legend />
                  <Line type="monotone" dataKey="premium" stroke="#8884d8" activeDot={{ r: 8 }} />
                </LineChart>
              </ResponsiveContainer>
            </Chart>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
