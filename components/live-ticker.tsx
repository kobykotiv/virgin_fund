"use client"

import { useEffect, useState } from "react"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ArrowUp, ArrowDown } from "lucide-react"

interface TickerData {
  symbol: string
  price: number
  change: number
  changePercent: number
  volume: number
}

interface LiveTickerProps {
  symbols?: string[]
  refreshInterval?: number
}

export function LiveTicker({ symbols = [], refreshInterval = 15000 }: LiveTickerProps) {
  const [tickerData, setTickerData] = useState<TickerData[]>([])
  const [loading, setLoading] = useState(true)

  const fetchTickerData = async () => {
    try {
      // In a real implementation, this would fetch from your market data provider
      const data = await Promise.all(
        symbols.map(async (symbol) => {
          try {
            const response = await fetch(`/api/market-data?symbol=${symbol}`)
            if (!response.ok) throw new Error(`Failed to fetch ${symbol}`)
            return await response.json()
          } catch (err) {
            console.error(`Error fetching ${symbol}:`, err)
            return {
              symbol,
              price: 0,
              change: 0,
              changePercent: 0,
              volume: 0,
              error: true,
            }
          }
        })
      )
      setTickerData(data.filter((d) => !d.error))
    } catch (error) {
      console.error("Error fetching ticker data:", error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (symbols.length > 0) {
      fetchTickerData()
      const interval = setInterval(fetchTickerData, refreshInterval)
      return () => clearInterval(interval)
    }
  }, [symbols, refreshInterval])

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(value)
  }

  const formatNumber = (value: number) => {
    return new Intl.NumberFormat("en-US", {
      maximumFractionDigits: 2,
    }).format(value)
  }

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 animate-pulse">
        {[1, 2, 3].map((i) => (
          <Card key={i} className="p-4">
            <div className="h-6 w-24 bg-muted rounded mb-2"></div>
            <div className="h-8 w-32 bg-muted rounded"></div>
          </Card>
        ))}
      </div>
    )
  }

  if (tickerData.length === 0) {
    return (
      <Card className="p-6 text-center text-muted-foreground">
        No market data available
      </Card>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {tickerData.map((ticker) => (
        <Card key={ticker.symbol} className="p-4 hover:bg-muted/50 transition-colors">
          <div className="flex items-center justify-between mb-2">
            <span className="font-medium">{ticker.symbol}</span>
            <Badge
              variant={ticker.changePercent >= 0 ? "default" : "destructive"}
              className="text-xs"
            >
              {ticker.changePercent >= 0 ? (
                <ArrowUp className="h-3 w-3 mr-1" />
              ) : (
                <ArrowDown className="h-3 w-3 mr-1" />
              )}
              {formatNumber(Math.abs(ticker.changePercent))}%
            </Badge>
          </div>
          <div className="flex items-baseline space-x-2">
            <span className="text-2xl font-bold">
              {formatCurrency(ticker.price)}
            </span>
            <span
              className={`text-sm ${
                ticker.change >= 0 ? "text-green-500" : "text-red-500"
              }`}
            >
              {ticker.change >= 0 ? "+" : ""}
              {formatCurrency(ticker.change)}
            </span>
          </div>
          <div className="mt-2 text-xs text-muted-foreground">
            Volume: {ticker.volume.toLocaleString()}
          </div>
        </Card>
      ))}
    </div>
  )
}

