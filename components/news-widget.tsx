"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button, buttonVariants } from "@/components/ui/button"
import { Badge, badgeVariants } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { RefreshCw, Newspaper, ExternalLink, AlertCircle } from "lucide-react"
import { useRouter } from "next/navigation"
import { getLatestNews, getBreakingNews, formatRelativeTime, type NewsArticle, NewsSentiment } from "@/lib/news-service"

interface NewsWidgetProps {
  ticker?: string
  limit?: number
}

export function NewsWidget({ ticker, limit = 5 }: NewsWidgetProps) {
  const [news, setNews] = useState<NewsArticle[]>([])
  const [breakingNews, setBreakingNews] = useState<NewsArticle[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    loadNews()
  }, [ticker])

  const loadNews = async () => {
    setIsLoading(true)
    try {
      // Load breaking news
      const breaking = await getBreakingNews(2)
      setBreakingNews(breaking)

      // Load latest news or ticker-specific news
      let articles: NewsArticle[]
      if (ticker) {
        articles = await getLatestNews(limit)
        // Filter for the ticker
        articles = articles.filter(
          (article) =>
            article.tickers.includes(ticker) || article.title.includes(ticker) || article.summary.includes(ticker),
        )
      } else {
        articles = await getLatestNews(limit)
      }

      setNews(articles)
    } catch (error) {
      console.error("Error loading news:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const getSentimentColor = (sentiment?: NewsSentiment) => {
    switch (sentiment) {
      case NewsSentiment.POSITIVE:
        return "text-green-500"
      case NewsSentiment.NEGATIVE:
        return "text-red-500"
      default:
        return "text-gray-500"
    }
  }

  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex justify-between items-center">
          <div>
            <CardTitle className="text-base">Market News</CardTitle>
            <CardDescription>{ticker ? `Latest news for ${ticker}` : "Latest market news"}</CardDescription>
          </div>
          <Button className={buttonVariants({ variant: "outline", size: "sm" })} onClick={loadNews} disabled={isLoading}>
            <RefreshCw className={`h-3.5 w-3.5 mr-2 ${isLoading ? "animate-spin" : ""}`} />
            Refresh
          </Button>
        </div>
      </CardHeader>
      <CardContent className="pb-2">
        {breakingNews.length > 0 && (
          <div className="mb-4">
            <h3 className="text-sm font-medium mb-2 flex items-center">
              <AlertCircle className="h-4 w-4 text-red-500 mr-1" />
              Breaking News
            </h3>
            <div className="space-y-2">
              {breakingNews.map((article) => (
                <div key={article.id} className="p-3 border rounded-md bg-red-50">
                  <h4 className="font-medium text-sm">{article.title}</h4>
                  <div className="flex justify-between items-center mt-1">
                    <div className="text-xs text-muted-foreground">
                      {article.source} • {formatRelativeTime(article.publishedAt)}
                    </div>
                    <Badge className={`${badgeVariants({ variant: "outline" })} font-mono text-xs`}>
                      {article.tickers[0]}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {isLoading ? (
          <div className="space-y-4">
            {Array.from({ length: limit }).map((_, i) => (
              <div key={i} className="flex gap-2">
                <Skeleton className="h-12 w-12 rounded-md" />
                <div className="flex-1">
                  <Skeleton className="h-4 w-full mb-2" />
                  <Skeleton className="h-3 w-2/3" />
                </div>
              </div>
            ))}
          </div>
        ) : news.length === 0 ? (
          <div className="text-center py-6 text-muted-foreground">No news articles found</div>
        ) : (
          <div className="space-y-4">
            {news.map((article) => (
              <div key={article.id} className="flex gap-3">
                <div className="flex-shrink-0 w-10 h-10 bg-muted rounded-md flex items-center justify-center">
                  <Newspaper className="h-5 w-5 text-muted-foreground" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-sm font-medium truncate">{article.title}</h3>
                  <div className="flex justify-between items-center mt-1">
                    <div className="text-xs text-muted-foreground flex items-center gap-2">
                      <span>{article.source}</span>
                      <span>•</span>
                      <span>{formatRelativeTime(article.publishedAt)}</span>
                    </div>
                    <div className={`text-xs ${getSentimentColor(article.sentiment)}`}>{article.sentiment}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
      <CardFooter className="pt-2">
        <Button className={`${buttonVariants({ variant: "outline", size: "sm" })} w-full`} onClick={() => router.push("/news")}>
          <ExternalLink className="h-4 w-4 mr-2" />
          View All News
        </Button>
      </CardFooter>
    </Card>
  )
}
