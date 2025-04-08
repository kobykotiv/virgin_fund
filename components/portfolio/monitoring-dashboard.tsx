"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { Position, Trade } from "@/types/bot"
import { PortfolioMetrics } from "@/lib/portfolio/metrics"
import { LineChart, BarChart, HeatMap } from "@/components/ui/charts"

interface MonitoringDashboardProps {
  positions: Position[]
  trades: Trade[]
  metrics: PortfolioMetrics
  onPositionUpdate?: (position: Position) => void
}

export function MonitoringDashboard({
  positions,
  trades,
  metrics,
  onPositionUpdate
}: MonitoringDashboardProps) {
  const [websocket, setWebsocket] = useState<WebSocket | null>(null)

  useEffect(() => {
    const ws = new WebSocket('wss://api.example.com/portfolio/stream')
    
    ws.onmessage = (event) => {
      const data = JSON.parse(event.data)
      if (data.type === 'position_update') {
        onPositionUpdate?.(data.position)
      }
    }

    setWebsocket(ws)
    return () => ws.close()
  }, [])

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-4 gap-4">
        <MetricCard
          title="Sharpe Ratio"
          value={metrics.sharpeRatio.toFixed(2)}
          status={metrics.sharpeRatio > 1 ? "positive" : "neutral"}
        />
        <MetricCard
          title="Value at Risk (95%)"
          value={`${(metrics.valueAtRisk * 100).toFixed(2)}%`}
          status="negative"
        />
        <MetricCard
          title="Beta"
          value={metrics.beta.toFixed(2)}
          status={metrics.beta < 1 ? "positive" : "neutral"}
        />
        <MetricCard
          title="Max Drawdown"
          value={`${(metrics.maxDrawdown * 100).toFixed(2)}%`}
          status="negative"
        />
      </div>

      <Tabs defaultValue="overview">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="positions">Positions</TabsTrigger>
          <TabsTrigger value="correlations">Correlations</TabsTrigger>
          <TabsTrigger value="trades">Recent Trades</TabsTrigger>
        </TabsList>

        <TabsContent value="overview">
          <Card>
            <CardContent className="pt-6">
              <LineChart
                data={positions.map(p => ({
                  symbol: p.symbol,
                  value: p.quantity * p.currentPrice
                }))}
                xField="symbol"
                yField="value"
                height={300}
              />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="correlations">
          <Card>
            <CardContent className="pt-6">
              <HeatMap
                data={metrics.correlationMatrix}
                labels={positions.map(p => p.symbol)}
                height={400}
              />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="trades">
          <Card>
            <CardContent>
              <div className="space-y-2">
                {trades.slice(0, 10).map(trade => (
                  <div key={trade.timestamp} className="flex justify-between items-center">
                    <span>{trade.symbol}</span>
                    <span>{trade.side}</span>
                    <span>{trade.quantity}</span>
                    <span>${trade.price}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

function MetricCard({ title, value, status }: { 
  title: string
  value: string
  status: 'positive' | 'negative' | 'neutral'
}) {
  const statusColors = {
    positive: 'text-green-500',
    negative: 'text-red-500',
    neutral: 'text-blue-500'
  }

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className={`text-2xl font-bold ${statusColors[status]}`}>
          {value}
        </div>
      </CardContent>
    </Card>
  )
}
