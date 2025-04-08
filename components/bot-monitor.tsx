import { useEffect, useState } from "react"
import { BotWebSocket } from "@/lib/websocket"
import { Bot, Position, Trade } from "@/types/bot"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"

interface BotMonitorProps {
  bot: Bot
  onPositionUpdate?: (position: Position) => void
  onTradeUpdate?: (trade: Trade) => void
}

export function BotMonitor({ bot, onPositionUpdate, onTradeUpdate }: BotMonitorProps) {
  const [positions, setPositions] = useState<Position[]>([])
  const [recentTrades, setRecentTrades] = useState<Trade[]>([])
  const [status, setStatus] = useState(bot.status)
  const [performance, setPerformance] = useState(bot.performance)

  useEffect(() => {
    const ws = new BotWebSocket(`wss://api.example.com/bots/${bot.id}`)

    ws.subscribe('bot_update', (data: Bot) => {
      setStatus(data.status)
      setPerformance(data.performance)
    })

    ws.subscribe('position_update', (data: Position) => {
      setPositions(prev => {
        const index = prev.findIndex(p => p.id === data.id)
        if (index >= 0) {
          const updated = [...prev]
          updated[index] = data
          return updated
        }
        return [...prev, data]
      })
      onPositionUpdate?.(data)
    })

    ws.subscribe('trade_update', (data: Trade) => {
      setRecentTrades(prev => [data, ...prev].slice(0, 50))
      onTradeUpdate?.(data)
    })

    return () => ws.close()
  }, [bot.id])

  return (
    <div className="grid gap-4">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            {bot.name}
            <Badge variant={status === 'active' ? 'success' : 'secondary'}>
              {status}
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-2">
            <div className="flex justify-between">
              <span>Total P&L:</span>
              <span className={performance?.totalPnL >= 0 ? 'text-green-500' : 'text-red-500'}>
                ${performance?.totalPnL.toFixed(2)}
              </span>
            </div>
            <div className="flex justify-between">
              <span>Win Rate:</span>
              <span>{performance?.winRate.toFixed(2)}%</span>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Active Positions</CardTitle>
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-[200px]">
            {positions.map(position => (
              <div key={position.id} className="flex justify-between py-2 border-b">
                <span>{position.symbol}</span>
                <span className={position.pnl >= 0 ? 'text-green-500' : 'text-red-500'}>
                  ${position.pnl?.toFixed(2)}
                </span>
              </div>
            ))}
          </ScrollArea>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Recent Trades</CardTitle>
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-[200px]">
            {recentTrades.map(trade => (
              <div key={trade.id} className="flex justify-between py-2 border-b">
                <span>{trade.symbol} {trade.side}</span>
                <span>${trade.price.toFixed(2)}</span>
              </div>
            ))}
          </ScrollArea>
        </CardContent>
      </Card>
    </div>
  )
}
