"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { NewsArticleCard } from "@/components/news-article"
import { Skeleton } from "@/components/ui/skeleton"
import { RefreshCw, ExternalLink } from "lucide-react"
import { useRouter } from "next/navigation"
import { getNewsForTicker, type NewsArticle } from "@/lib/news-service"

interface TickerNewsProps {
  ticker: string
  limit?: number
}

export function TickerNews({ ticker, limit = 3 }: TickerNewsProps) {
  const [news, setNews] = useState<NewsArticle[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    if (ticker) {
      loadNews()
    }
  }, [ticker])

  const loadNews = async () => {
    if (!ticker) return

    setIsLoading(true)
    try {
      const articles = await getNewsForTicker(ticker, limit)
      setNews(articles)
    } catch (error) {
      console.error(`Error loading news for ${ticker}:`, error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex justify-between items-center">
          <CardTitle className="text-base">News for {ticker}</CardTitle>
          <Button variant="outline" size="sm" onClick={loadNews} disabled={isLoading}>
            <RefreshCw className={`h-3.5 w-3.5 mr-2 ${isLoading ? "animate-spin" : ""}`} />
            Refresh
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {isLoading ? (
          // Loading skeletons
          Array.from({ length: limit }).map((_, i) => (
            <div key={i} className="border rounded-lg p-4 space-y-3">
              <Skeleton className="h-6 w-3/4" />
              <Skeleton className="h-4 w-1/4" />
              <Skeleton className="h-20 w-full" />
            </div>
          ))
        ) : news.length === 0 ? (
          <div className="text-center py-6 text-muted-foreground">No news articles found for {ticker}</div>
        ) : (
          <>
            {news.map((article) => (
              <NewsArticleCard
                key={article.id}
                article={article}
                onSave={(article) => {
                  // Save article to localStorage
                  const saved = localStorage.getItem("savedArticles")
                  const savedArticles = saved ? JSON.parse(saved) : []

                  // Check if already saved
                  if (!savedArticles.some((a: any) => a.id === article.id)) {
                    localStorage.setItem("savedArticles", JSON.stringify([...savedArticles, article]))
                  }
                }}
                onShare={(article) => {
                  // Copy URL to clipboard
                  navigator.clipboard.writeText(article.url)
                }}
              />
            ))}

            <Button variant="outline" className="w-full" onClick={() => router.push(`/news?ticker=${ticker}`)}>
              <ExternalLink className="h-4 w-4 mr-2" />
              View All {ticker} News
            </Button>
          </>
        )}
      </CardContent>
    </Card>
  )
}

