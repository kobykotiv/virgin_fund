"use client"

import { ArrowDownRightIcon, ArrowUpRightIcon, LineChart } from "lucide-react"
import { Badge } from "@/components/ui/badge"

export function SignalsList() {
  // In a real app, this would be fetched from an API
  const signals = [
    {
      ticker: "AAPL",
      action: "buy",
      price: 173.45,
      strength: "strong",
      indicator: "MACD Crossover",
      timestamp: new Date(Date.now() - 25 * 60000).toISOString(), // 25 minutes ago
    },
    {
      ticker: "TSLA",
      action: "sell",
      price: 235.12,
      strength: "medium",
      indicator: "RSI Overbought",
      timestamp: new Date(Date.now() - 47 * 60000).toISOString(), // 47 minutes ago
    },
    {
      ticker: "BTC-USD",
      action: "buy",
      price: 36752.18,
      strength: "strong",
      indicator: "Support Level Bounce",
      timestamp: new Date(Date.now() - 112 * 60000).toISOString(), // 112 minutes ago
    },
    {
      ticker: "MSFT",
      action: "buy",
      price: 345.87,
      strength: "weak",
      indicator: "Golden Cross",
      timestamp: new Date(Date.now() - 174 * 60000).toISOString(), // 174 minutes ago
    },
    {
      ticker: "ETH-USD",
      action: "sell",
      price: 1762.54,
      strength: "medium",
      indicator: "Volume Spike",
      timestamp: new Date(Date.now() - 203 * 60000).toISOString(), // 203 minutes ago
    },
  ]

  // Helper function to format the time
  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp)
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
  }

  // Helper function to get minutes ago
  const getMinutesAgo = (timestamp: string) => {
    const now = new Date()
    const signalTime = new Date(timestamp)
    const diffMs = now.getTime() - signalTime.getTime()
    const diffMins = Math.round(diffMs / 60000)
    
    if (diffMins < 60) {
      return `${diffMins}m ago`
    } else {
      const hours = Math.floor(diffMins / 60)
      return `${hours}h ago`
    }
  }

  return (
    <div className="w-full h-full overflow-auto p-2">
      <div className="divide-y">
        {signals.map((signal, index) => (
          <div key={index} className="py-3 first:pt-0 last:pb-0">
            <div className="flex justify-between items-start mb-1">
              <div className="flex items-center">
                <LineChart className="h-4 w-4 mr-1 text-muted-foreground" />
                <span className="font-medium">{signal.ticker}</span>
              </div>
              <Badge 
                variant={signal.action === "buy" ? "success" : "destructive"}
                className="ml-auto flex items-center gap-1"
              >
                {signal.action === "buy" ? (
                  <ArrowUpRightIcon className="h-3 w-3" />
                ) : (
                  <ArrowDownRightIcon className="h-3 w-3" />
                )}
                {signal.action.toUpperCase()}
              </Badge>
            </div>
            
            <div className="flex justify-between text-sm">
              <div className="text-muted-foreground">{signal.indicator}</div>
              <div className="font-medium">${signal.price.toLocaleString()}</div>
            </div>
            
            <div className="flex justify-between items-center mt-1">
              <Badge 
                variant="outline" 
                className={
                  signal.strength === "strong" ? "border-green-500 text-green-500" :
                  signal.strength === "medium" ? "border-yellow-500 text-yellow-500" :
                  "border-muted-foreground text-muted-foreground"
                }
              >
                {signal.strength}
              </Badge>
              <span className="text-xs text-muted-foreground">{getMinutesAgo(signal.timestamp)}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

