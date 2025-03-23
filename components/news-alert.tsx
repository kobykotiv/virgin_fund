"use client"

import { useState, useEffect } from "react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import { X, AlertTriangle, ExternalLink } from "lucide-react"
import { getBreakingNews, type NewsArticle } from "@/lib/news-service"
import { useRouter } from "next/navigation"

export function NewsAlert() {
  const [breakingNews, setBreakingNews] = useState<NewsArticle | null>(null)
  const [dismissed, setDismissed] = useState<string[]>([])
  const router = useRouter()

  useEffect(() => {
    // Check for breaking news every 5 minutes
    checkBreakingNews()
    const interval = setInterval(checkBreakingNews, 5 * 60 * 1000)

    return () => clearInterval(interval)
  }, [])

  useEffect(() => {
    // Load dismissed alerts from localStorage
    const saved = localStorage.getItem("dismissedAlerts")
    if (saved) {
      setDismissed(JSON.parse(saved))
    }
  }, [])

  const checkBreakingNews = async () => {
    try {
      const news = await getBreakingNews(5)

      // Filter out dismissed alerts
      const filteredNews = news.filter((article) => !dismissed.includes(article.id))

      if (filteredNews.length > 0) {
        setBreakingNews(filteredNews[0])
      } else {
        setBreakingNews(null)
      }
    } catch (error) {
      console.error("Error checking breaking news:", error)
    }
  }

  const handleDismiss = () => {
    if (breakingNews) {
      const updated = [...dismissed, breakingNews.id]
      setDismissed(updated)
      localStorage.setItem("dismissedAlerts", JSON.stringify(updated))
      setBreakingNews(null)
    }
  }

  if (!breakingNews) return null

  return (
    <Alert variant="destructive" className="fixed bottom-4 right-4 w-96 z-50 bg-red-50 border-red-200 text-red-900">
      <AlertTriangle className="h-4 w-4 text-red-600" />
      <AlertTitle className="text-red-800 flex justify-between items-center">
        Breaking News
        <Button variant="ghost" size="sm" onClick={handleDismiss} className="h-6 w-6 p-0 text-red-800 hover:bg-red-100">
          <X className="h-4 w-4" />
        </Button>
      </AlertTitle>
      <AlertDescription className="text-red-700">
        <p className="text-sm mt-1">{breakingNews.title}</p>
        <div className="flex justify-between items-center mt-2">
          <span className="text-xs">{breakingNews.source}</span>
          <Button
            variant="outline"
            size="sm"
            onClick={() => router.push("/news")}
            className="h-7 text-xs border-red-300 text-red-800 hover:bg-red-100"
          >
            <ExternalLink className="h-3 w-3 mr-1" />
            View Details
          </Button>
        </div>
      </AlertDescription>
    </Alert>
  )
}

