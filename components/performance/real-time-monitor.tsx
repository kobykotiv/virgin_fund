"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { LineChart } from "@/components/ui/charts"
import { Position, Trade } from "@/types/bot"

interface MonitorProps {
  botId: string
  initialPositions: Position[]
  onPositionUpdate?: (position: Position) => void
}

export function RealTimeMonitor({ botId, initialPositions, onPositionUpdate }: MonitorProps) {
  const [positions, setPositions] = useState(initialPositions)
  const [equity, setEquity] = useState<{timestamp: number, value: number}[]>([])
  const [recentTrades, setRecentTrades] = useState<Trade[]>([])

  useEffect(() => {
    // Connect to WebSocket for real-time updates
    const ws = new WebSocket(`wss://api.example.com/bots/${botId}/stream`)
    
    ws.onmessage = (event) => {
      const data = JSON.parse(event.data)
      
      switch (data.type) {
        case 'position':
          setPositions(prev => {
            const updated = [...prev]
            const index = updated.findIndex(p => p.id === data.position.id)
            if (index >= 0) {
              updated[index] = data.position
            } else {
              updated.push(data.position)
            }
            onPositionUpdate?.(data.position)
            return updated
          })
          break
          
        case 'trade':
          setRecentTrades(prev => [data.trade, ...prev].slice(0, 50))
          break
          
        case 'equity':
          setEquity(prev => [...prev, data.equity])
          break
      }
    }

    return () => ws.close()
  }, [botId])

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Live Performance</CardTitle>
        </CardHeader>
        <CardContent>
          <LineChart
            data={equity}
            xField="timestamp"
            yField="value"
            height={300}
          />
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <CardHeader>
            <CardTitle>Active Positions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {positions.map(position => (
                <div key={position.id} className="flex justify-between">
                  <span>{position.symbol}</span>
                  <span className={position.unrealizedPnl >= 0 ? 'text-green-500' : 'text-red-500'}>
                    ${position.unrealizedPnl?.toFixed(2)}
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Recent Trades</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {recentTrades.map(trade => (
                <div key={trade.id} className="flex justify-between text-sm">
                  <span>{trade.symbol} {trade.side}</span>
                  <span>${trade.price.toFixed(2)}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
