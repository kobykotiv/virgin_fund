"use client"

import { useState, useEffect } from "react"
import { NewsArticleCard } from "@/components/news-article"
import { Button, buttonVariants } from "@/components/ui/button"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Skeleton } from "@/components/ui/skeleton"
import { RefreshCw, AlertCircle } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"
import {
  searchNews,
  getLatestNews,
  getBreakingNews,
  type NewsArticle,
  type NewsSearchParams,
  NewsSentiment,
} from "@/lib/news-service"

interface NewsListProps {
  initialTicker?: string
}

export function NewsList({ initialTicker }: NewsListProps) {
  const [articles, setArticles] = useState<NewsArticle[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [activeTab, setActiveTab] = useState<"all" | "breaking" | "positive" | "negative">("all")
  const [searchParams, setSearchParams] = useState<NewsSearchParams>({
    ticker: initialTicker,
    limit: 20,
  })
  const { toast } = useToast()
  const [savedArticles, setSavedArticles] = useState<NewsArticle[]>([])

  useEffect(() => {
    loadNews()
  }, [initialTicker, activeTab])

  useEffect(() => {
    // Load saved articles from localStorage
    const saved = localStorage.getItem("savedArticles")
    if (saved) {
      setSavedArticles(JSON.parse(saved))
    }
  }, [])

  const loadNews = async () => {
    setIsLoading(true)
    try {
      let newsArticles: NewsArticle[] = []

      switch (activeTab) {
        case "breaking":
          newsArticles = await getBreakingNews(20)
          break
        case "positive":
          newsArticles = await searchNews({
            ...searchParams,
            sentiment: NewsSentiment.POSITIVE,
          })
          break
        case "negative":
          newsArticles = await searchNews({
            ...searchParams,
            sentiment: NewsSentiment.NEGATIVE,
          })
          break
        default:
          if (initialTicker) {
            newsArticles = await searchNews(searchParams)
          } else {
            newsArticles = await getLatestNews(20)
          }
      }

      setArticles(newsArticles)
    } catch (error) {
      console.error("Error loading news:", error)
      toast({
        title: "Error",
        description: "Failed to load news articles",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleSearch = (params: NewsSearchParams) => {
    setSearchParams(params)
    setActiveTab("all")

    setIsLoading(true)
    searchNews(params)
      .then((results) => {
        setArticles(results)
      })
      .catch((error) => {
        console.error("Error searching news:", error)
        toast({
          title: "Error",
          description: "Failed to search news articles",
          variant: "destructive",
        })
      })
      .finally(() => {
        setIsLoading(false)
      })
  }

  const handleSaveArticle = (article: NewsArticle) => {
    // Check if already saved
    if (savedArticles.some((a) => a.id === article.id)) {
      // Remove from saved
      const updated = savedArticles.filter((a) => a.id !== article.id)
      setSavedArticles(updated)
      localStorage.setItem("savedArticles", JSON.stringify(updated))

      toast({
        title: "Article Removed",
        description: "Article removed from saved items",
      })
    } else {
      // Add to saved
      const updated = [...savedArticles, article]
      setSavedArticles(updated)
      localStorage.setItem("savedArticles", JSON.stringify(updated))

      toast({
        title: "Article Saved",
        description: "Article saved for later reading",
      })
    }
  }

  const handleShareArticle = (article: NewsArticle) => {
    // In a real app, this would open a share dialog
    // For demo purposes, we'll copy the URL to clipboard
    navigator.clipboard.writeText(article.url)

    toast({
      title: "Link Copied",
      description: "Article link copied to clipboard",
    })
  }

  const isArticleSaved = (articleId: string) => {
    return savedArticles.some((a) => a.id === articleId)
  }

  return (
    <div className="space-y-4">
      <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as any)}>
        <TabsList>
          <TabsTrigger value="all">All News</TabsTrigger>
          <TabsTrigger value="breaking">Breaking</TabsTrigger>
          <TabsTrigger value="positive">Positive</TabsTrigger>
          <TabsTrigger value="negative">Negative</TabsTrigger>
        </TabsList>
      </Tabs>

      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">
          {activeTab === "breaking"
            ? "Breaking News"
            : activeTab === "positive"
              ? "Positive News"
              : activeTab === "negative"
                ? "Negative News"
                : searchParams.ticker
                  ? `News for ${searchParams.ticker}`
                  : "Latest News"}
        </h2>
        <Button className={buttonVariants({ variant: "outline", size: "sm" })} onClick={loadNews} disabled={isLoading}>
          <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? "animate-spin" : ""}`} />
          Refresh
        </Button>
      </div>

      <div className="space-y-4">
        {isLoading ? (
          // Loading skeletons
          Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="border rounded-lg p-4 space-y-3">
              <Skeleton className="h-6 w-3/4" />
              <Skeleton className="h-4 w-1/4" />
              <Skeleton className="h-20 w-full" />
              <div className="flex gap-2">
                <Skeleton className="h-6 w-16" />
                <Skeleton className="h-6 w-16" />
              </div>
            </div>
          ))
        ) : articles.length === 0 ? (
          <div className="text-center py-12 border rounded-lg">
            <AlertCircle className="mx-auto h-12 w-12 text-muted-foreground" />
            <h3 className="mt-4 text-lg font-medium">No News Found</h3>
            <p className="text-muted-foreground">Try adjusting your search criteria or check back later.</p>
          </div>
        ) : (
          articles.map((article) => (
            <NewsArticleCard
              key={article.id}
              article={article}
              onSave={handleSaveArticle}
              onShare={handleShareArticle}
            />
          ))
        )}
      </div>

      {!isLoading && articles.length > 0 && (
        <div className="flex justify-center mt-6">
          <Button className={buttonVariants({ variant: "outline" })}>Load More</Button>
        </div>
      )}
    </div>
  )
}
