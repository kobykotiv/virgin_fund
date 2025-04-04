"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from "recharts"

interface MarketData {
  symbol: string
  price: number
  change: number
  changePercent: number
  volume: number
  marketCap: number
  peRatio: number
  week52High: number
  week52Low: number
}

export function MarketDataView() {
  const [symbol, setSymbol] = useState("")
  const [marketData, setMarketData] = useState<MarketData | null>(null)

  const fetchMarketData = async () => {
    try {
      const response = await fetch(`/api/market-data?symbol=${symbol}`)
      const data = await response.json()
      setMarketData(data)
    } catch (error) {
      console.error("Failed to fetch market data:", error)
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex space-x-2">
        <Input
          placeholder="Enter ticker symbol"
          value={symbol}
          onChange={(e) => setSymbol(e.target.value.toUpperCase())}
        />
        <Button onClick={fetchMarketData}>Fetch Data</Button>
      </div>

      {marketData && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <Card>
            <CardHeader>
              <CardTitle>Price Chart</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={[]}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip />
                    <Line type="monotone" dataKey="price" stroke="#8884d8" />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Key Statistics</CardTitle>
            </CardHeader>
            <CardContent>
              {/* Market data display */}
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}
