"use client"

import { useEffect, useState } from "react"
import { Card } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"

interface SentimentData {
  value: number
  classification: string
  timestamp: string
  previousClose: number
  previousWeek: number
  previousMonth: number
}

export function FearGreedWidget() {
  const [data, setData] = useState<SentimentData | null>(null)
  const [loading, setLoading] = useState(true)

  const fetchSentimentData = async () => {
    try {
      const response = await fetch("/api/market-sentiment")
      if (!response.ok) throw new Error("Failed to fetch sentiment data")
      const data = await response.json()
      setData(data)
    } catch (error) {
      console.error("Error fetching sentiment data:", error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchSentimentData()
    // Refresh every 5 minutes
    const interval = setInterval(fetchSentimentData, 300000)
    return () => clearInterval(interval)
  }, [])

  const getClassification = (value: number) => {
    if (value <= 20) return { text: "Extreme Fear", color: "bg-red-500" }
    if (value <= 40) return { text: "Fear", color: "bg-orange-500" }
    if (value <= 60) return { text: "Neutral", color: "bg-yellow-500" }
    if (value <= 80) return { text: "Greed", color: "bg-green-500" }
    return { text: "Extreme Greed", color: "bg-emerald-500" }
  }

  const formatDate = (timestamp: string) => {
    return new Date(timestamp).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      hour: "numeric",
      minute: "numeric",
    })
  }

  if (loading) {
    return (
      <div className="space-y-4 animate-pulse">
        <div className="h-4 w-32 bg-muted rounded"></div>
        <div className="h-8 w-full bg-muted rounded"></div>
        <div className="space-y-2">
          <div className="h-4 w-24 bg-muted rounded"></div>
          <div className="h-4 w-full bg-muted rounded"></div>
        </div>
      </div>
    )
  }

  if (!data) {
    return (
      <Card className="p-6 text-center text-muted-foreground">
        Unable to load market sentiment data
      </Card>
    )
  }

  const classification = getClassification(data.value)

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-baseline">
        <h3 className="font-medium">{classification.text}</h3>
        <span className="text-2xl font-bold">{Math.round(data.value)}</span>
      </div>

      <Progress
        value={data.value}
        className="h-2"
        indicatorClassName={classification.color}
      />

      <div className="grid grid-cols-2 gap-4 text-sm">
        <div>
          <p className="text-muted-foreground">Previous Close</p>
          <p className="font-medium">{Math.round(data.previousClose)}</p>
        </div>
        <div>
          <p className="text-muted-foreground">1 Week Ago</p>
          <p className="font-medium">{Math.round(data.previousWeek)}</p>
        </div>
      </div>

      <div className="text-xs text-muted-foreground">
        Last updated: {formatDate(data.timestamp)}
      </div>
    </div>
  )
}

