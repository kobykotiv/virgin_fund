"use client"

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ExternalLink, ThumbsUp, ThumbsDown, Share2, Bookmark, AlertTriangle } from "lucide-react"
import { formatRelativeTime, type NewsArticle, NewsSentiment } from "@/lib/news-service"
import Link from "next/link"

interface NewsArticleProps {
  article: NewsArticle
  onSave?: (article: NewsArticle) => void
  onShare?: (article: NewsArticle) => void
  expanded?: boolean
}

export function NewsArticleCard({ article, onSave, onShare, expanded = false }: NewsArticleProps) {
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

  const getSentimentIcon = (sentiment?: NewsSentiment) => {
    switch (sentiment) {
      case NewsSentiment.POSITIVE:
        return <ThumbsUp className="h-4 w-4" />
      case NewsSentiment.NEGATIVE:
        return <ThumbsDown className="h-4 w-4" />
      default:
        return null
    }
  }

  return (
    <Card className={expanded ? "w-full" : "w-full"}>
      <CardHeader className="pb-2">
        {article.isBreaking && (
          <Badge variant="destructive" className="mb-2 w-fit">
            <AlertTriangle className="h-3 w-3 mr-1" />
            Breaking News
          </Badge>
        )}
        <div className="flex justify-between items-start gap-2">
          <CardTitle className={`text-base sm:text-lg ${expanded ? "text-xl" : ""}`}>{article.title}</CardTitle>
        </div>
        <CardDescription className="flex items-center justify-between mt-1">
          <div className="flex items-center gap-2">
            <span>{article.source}</span>
            <span>•</span>
            <span>{formatRelativeTime(article.publishedAt)}</span>
          </div>
          <div className={`flex items-center gap-1 ${getSentimentColor(article.sentiment)}`}>
            {getSentimentIcon(article.sentiment)}
            <span className="text-xs font-medium capitalize">{article.sentiment}</span>
          </div>
        </CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground">{article.summary}</p>

        {expanded && article.content && <div className="mt-4 text-sm">{article.content}</div>}

        <div className="flex flex-wrap gap-2 mt-3">
          {article.tickers.map((ticker) => (
            <Badge key={ticker} variant="outline" className="font-mono">
              {ticker}
            </Badge>
          ))}
        </div>
      </CardContent>
      <CardFooter className="flex justify-between pt-2">
        <div className="flex gap-2">
          {onSave && (
            <Button variant="ghost" size="sm" onClick={() => onSave(article)}>
              <Bookmark className="h-4 w-4 mr-1" />
              <span className="sr-only sm:not-sr-only sm:text-xs">Save</span>
            </Button>
          )}
          {onShare && (
            <Button variant="ghost" size="sm" onClick={() => onShare(article)}>
              <Share2 className="h-4 w-4 mr-1" />
              <span className="sr-only sm:not-sr-only sm:text-xs">Share</span>
            </Button>
          )}
        </div>
        <Button variant="outline" size="sm" asChild>
          <Link href={article.url} target="_blank" rel="noopener noreferrer">
            <ExternalLink className="h-4 w-4 mr-1" />
            <span className="text-xs">Read Full Article</span>
          </Link>
        </Button>
      </CardFooter>
    </Card>
  )
}

