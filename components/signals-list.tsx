"use client"

import { useEffect, useState } from "react"
import { Badge } from "@/components/ui/badge"

interface Signal {
  asset: string
  signal: "Buy" | "Sell" | "Hold"
  strength: "Strong" | "Moderate" | "Neutral" | "Weak"
  indicator: string
  timestamp: string
}

export function SignalsList() {
  const [signals, setSignals] = useState<Signal[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Generate mock signals data
    const generateSignals = () => {
      setIsLoading(true)

      const assets = ["BTC/USD", "ETH/USD", "AAPL", "TSLA", "MSFT", "AMZN", "SOL/USD", "NVDA", "GOOGL"]
      const indicators = [
        "MACD Crossover",
        "RSI Overbought",
        "RSI Oversold",
        "Golden Cross",
        "Death Cross",
        "Support Level",
        "Resistance Level",
        "Volume Spike",
        "Bollinger Bands Squeeze",
      ]
      const signalTypes: ["Buy", "Sell", "Hold"] = ["Buy", "Sell", "Hold"]
      const strengthTypes: ["Strong", "Moderate", "Neutral", "Weak"] = ["Strong", "Moderate", "Neutral", "Weak"]

      const mockSignals: Signal[] = []

      // Generate 8 random signals
      for (let i = 0; i < 8; i++) {
        const asset = assets[Math.floor(Math.random() * assets.length)]
        const signal = signalTypes[Math.floor(Math.random() * signalTypes.length)]
        const strength = strengthTypes[Math.floor(Math.random() * strengthTypes.length)]
        const indicator = indicators[Math.floor(Math.random() * indicators.length)]

        // Create timestamp within the last 24 hours
        const now = new Date()
        const hoursAgo = Math.floor(Math.random() * 24)
        const minutesAgo = Math.floor(Math.random() * 60)
        now.setHours(now.getHours() - hoursAgo)
        now.setMinutes(now.getMinutes() - minutesAgo)

        mockSignals.push({
          asset,
          signal,
          strength,
          indicator,
          timestamp: now.toISOString(),
        })
      }

      // Sort by timestamp (newest first)
      mockSignals.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())

      setSignals(mockSignals)
      setIsLoading(false)
    }

    generateSignals()
  }, [])

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="animate-pulse text-muted-foreground">Loading signals data...</div>
      </div>
    )
  }

  // Format timestamp to relative time
  const formatRelativeTime = (timestamp: string) => {
    const now = new Date()
    const signalTime = new Date(timestamp)
    const diffMs = now.getTime() - signalTime.getTime()
    const diffMins = Math.floor(diffMs / 60000)
    const diffHours = Math.floor(diffMins / 60)

    if (diffHours > 0) {
      return `${diffHours}h ago`
    } else {
      return `${diffMins}m ago`
    }
  }

  return (
    <div className="h-full overflow-auto">
      <div className="space-y-3">
        {signals.map((signal, index) => (
          <div
            key={index}
            className="flex items-center justify-between p-3 bg-background/80 backdrop-blur-sm rounded-md"
          >
            <div>
              <div className="flex items-center gap-2">
                <p className="font-medium">{signal.asset}</p>
                <span className="text-xs text-muted-foreground">{formatRelativeTime(signal.timestamp)}</span>
              </div>
              <p className="text-xs text-muted-foreground">{signal.indicator}</p>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs">{signal.strength}</span>
              <Badge
                variant={signal.signal === "Buy" ? "default" : signal.signal === "Sell" ? "destructive" : "outline"}
              >
                {signal.signal}
              </Badge>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

