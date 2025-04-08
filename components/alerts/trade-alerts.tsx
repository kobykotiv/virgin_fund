"use client"

import { useEffect, useState } from "react"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import { useToast } from "@/components/ui/use-toast"
import { Position, Trade } from "@/types/bot"

interface Alert {
  id: string
  type: "info" | "warning" | "error" | "success"
  message: string
  timestamp: Date
}

interface TradeAlertsProps {
  positions: Position[]
  trades: Trade[]
}

export function TradeAlerts({ positions, trades }: TradeAlertsProps) {
  const [alerts, setAlerts] = useState<Alert[]>([])
  const { toast } = useToast()

  useEffect(() => {
    // Connect to WebSocket for real-time alerts
    const ws = new WebSocket('wss://api.example.com/alerts')

    ws.onmessage = (event) => {
      const alert: Alert = JSON.parse(event.data)
      setAlerts(prev => [alert, ...prev].slice(0, 50))
      
      // Show toast for important alerts
      if (alert.type === "error" || alert.type === "warning") {
        toast({
          title: alert.type === "error" ? "Error" : "Warning",
          description: alert.message,
          variant: alert.type === "error" ? "destructive" : "default"
        })
      }
    }

    return () => ws.close()
  }, [])

  // Monitor positions for alerts
  useEffect(() => {
    positions.forEach(position => {
      const pnlPercent = ((position.currentPrice - position.avgPrice) / position.avgPrice) * 100
      
      // Alert on significant moves
      if (Math.abs(pnlPercent) > 5) {
        const alertType = pnlPercent > 0 ? "success" : "warning"
        const alert: Alert = {
          id: `${position.symbol}-${Date.now()}`,
          type: alertType,
          message: `${position.symbol} moved ${pnlPercent.toFixed(2)}%`,
          timestamp: new Date()
        }
        setAlerts(prev => [alert, ...prev].slice(0, 50))
      }
    })
  }, [positions])

  return (
    <Card>
      <CardHeader>
        <CardTitle>Trade Alerts</CardTitle>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[300px]">
          <div className="space-y-2">
            {alerts.map(alert => (
              <div 
                key={alert.id}
                className="flex items-center justify-between p-2 border rounded"
              >
                <div className="flex items-center gap-2">
                  <Badge variant={
                    alert.type === "error" ? "destructive" :
                    alert.type === "warning" ? "warning" :
                    alert.type === "success" ? "success" :
                    "default"
                  }>
                    {alert.type}
                  </Badge>
                  <span>{alert.message}</span>
                </div>
                <span className="text-sm text-muted-foreground">
                  {alert.timestamp.toLocaleTimeString()}
                </span>
              </div>
            ))}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  )
}
