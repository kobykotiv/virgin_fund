"use client"

import { useEffect, useState } from "react"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Clock, Trending } from "lucide-react"

interface NewsItem {
  id: string
  title: string
  summary: string
  source: string
  url: string
  sentiment: "positive" | "negative" | "neutral"
  impactScore: number
  timestamp: string
  symbols: string[]
}

interface NewsWidgetProps {
  limit?: number
}

export function NewsWidget({ limit = 5 }: NewsWidgetProps) {
  const [news, setNews] = useState<NewsItem[]>([])
  const [loading, setLoading] = useState(true)

  const fetchNews = async () => {
    try {
      const response = await fetch(`/api/market-news?limit=${limit}`)
      if (!response.ok) throw new Error("Failed to fetch news")
      const data = await response.json()
      setNews(data)
    } catch (error) {
      console.error("Error fetching news:", error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchNews()
    // Refresh every 5 minutes
    const interval = setInterval(fetchNews, 300000)
    return () => clearInterval(interval)
  }, [limit])

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp)
    const now = new Date()
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60))

    if (diffInMinutes < 60) {
      return `${diffInMinutes}m ago`
    }
    
    const diffInHours = Math.floor(diffInMinutes / 60)
    if (diffInHours < 24) {
      return `${diffInHours}h ago`
    }

    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      hour: "numeric",
      minute: "numeric",
    })
  }

  const getSentimentColor = (sentiment: string) => {
    switch (sentiment) {
      case "positive":
        return "bg-green-100 text-green-800 hover:bg-green-200"
      case "negative":
        return "bg-red-100 text-red-800 hover:bg-red-200"
      default:
        return "bg-gray-100 text-gray-800 hover:bg-gray-200"
    }
  }

  if (loading) {
    return (
      <div className="space-y-4">
        {[...Array(limit)].map((_, i) => (
          <Card key={i} className="p-4 animate-pulse">
            <div className="h-4 w-3/4 bg-muted rounded mb-2"></div>
            <div className="h-4 w-1/2 bg-muted rounded"></div>
          </Card>
        ))}
      </div>
    )
  }

  if (news.length === 0) {
    return (
      <Card className="p-6 text-center text-muted-foreground">
        No recent news available
      </Card>
    )
  }

  return (
    <div className="space-y-4">
      {news.map((item) => (
        <Card key={item.id} className="p-4 hover:bg-muted/50 transition-colors">
          <div className="space-y-2">
            <div className="flex items-start justify-between gap-4">
              <h3 className="font-medium line-clamp-2">
                <a
                  href={item.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:underline"
                >
                  {item.title}
                </a>
              </h3>
              <Badge
                variant="secondary"
                className={`shrink-0 ${getSentimentColor(item.sentiment)}`}
              >
                {item.sentiment}
              </Badge>
            </div>

            <p className="text-sm text-muted-foreground line-clamp-2">
              {item.summary}
            </p>

            <div className="flex items-center justify-between text-xs text-muted-foreground">
              <div className="flex items-center gap-4">
                <span className="flex items-center">
                  <Clock className="h-3 w-3 mr-1" />
                  {formatTimestamp(item.timestamp)}
                </span>
                <span>{item.source}</span>
              </div>

              {item.impactScore > 7 && (
                <span className="flex items-center text-orange-500">
                  <Trending className="h-3 w-3 mr-1" />
                  High Impact
                </span>
              )}
            </div>

            {item.symbols.length > 0 && (
              <div className="flex flex-wrap gap-1 mt-2">
                {item.symbols.map((symbol) => (
                  <Badge key={symbol} variant="outline" className="text-xs">
                    {symbol}
                  </Badge>
                ))}
              </div>
            )}
          </div>
        </Card>
      ))}
    </div>
  )
}

