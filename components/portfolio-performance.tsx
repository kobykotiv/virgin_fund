"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { useEffect, useState } from "react"
import { ArrowUp, ArrowDown } from "lucide-react"

interface PortfolioPerformanceProps {
  portfolioId: string
}

export function PortfolioPerformance({ portfolioId }: PortfolioPerformanceProps) {
  const [metrics, setMetrics] = useState({
    totalValue: 0,
    dayChange: 0,
    monthChange: 0,
    totalReturn: 0,
    riskMetrics: {
      sharpe: 0,
      drawdown: 0,
      volatility: 0
    }
  })

  useEffect(() => {
    const fetchMetrics = async () => {
      try {
        const response = await fetch(`/api/db/portfolios/${portfolioId}/metrics`)
        if (response.ok) {
          const data = await response.json()
          setMetrics(data)
        }
      } catch (error) {
        console.error("Failed to fetch portfolio metrics:", error)
      }
    }

    fetchMetrics()
    const interval = setInterval(fetchMetrics, 60000)
    return () => clearInterval(interval)
  }, [portfolioId])

  return (
    <Card>
      <CardHeader>
        <CardTitle>Portfolio Performance</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="space-y-2">
            <p className="text-sm text-muted-foreground">Total Value</p>
            <p className="text-2xl font-bold">${metrics.totalValue.toLocaleString()}</p>
          </div>
          <div className="space-y-2">
            <p className="text-sm text-muted-foreground">24h Change</p>
            <div className="flex items-center gap-2">
              <Badge variant={metrics.dayChange >= 0 ? "default" : "destructive"}>
                {metrics.dayChange >= 0 ? <ArrowUp className="h-3 w-3" /> : <ArrowDown className="h-3 w-3" />}
                {Math.abs(metrics.dayChange)}%
              </Badge>
            </div>
          </div>
          <div className="space-y-2">
            <p className="text-sm text-muted-foreground">Max Drawdown</p>
            <p className="text-2xl font-bold text-red-500">
              {metrics.riskMetrics.drawdown}%
            </p>
          </div>
          <div className="space-y-2">
            <p className="text-sm text-muted-foreground">Sharpe Ratio</p>
            <p className="text-2xl font-bold">
              {metrics.riskMetrics.sharpe.toFixed(2)}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
