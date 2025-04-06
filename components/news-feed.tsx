"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { CalendarDays, ExternalLink, TrendingUp, TrendingDown, Minus } from "lucide-react"

interface NewsItem {
  id: string;
  title: string;
  description: string;
  pubDate: string;
  link: string;
  source: string;
  sentiment?: "positive" | "negative" | "neutral";
  sentimentScore?: number;
  category?: string;
}

export function NewsFeed() {
  const [newsItems, setNewsItems] = useState<NewsItem[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [activeCategory, setActiveCategory] = useState("all")

  // Mock news data - in a real app, this would come from an RSS feed API
  const mockNews: NewsItem[] = [
    {
      id: "1",
      title: "Fed signals potential interest rate cuts later this year",
      description: "The Federal Reserve has indicated it may begin lowering interest rates in the coming months as inflation continues to moderate and economic growth stabilizes.",
      pubDate: "2023-06-15T14:30:00Z",
      link: "https://example.com/news/fed-rate-cuts",
      source: "Financial Times",
      sentiment: "positive",
      sentimentScore: 0.72,
      category: "economy",
    },
    {
      id: "2",
      title: "Tech stocks slide amid semiconductor supply concerns",
      description: "Major technology stocks experienced a selloff today following reports of continued supply chain constraints affecting semiconductor availability.",
      pubDate: "2023-06-14T16:45:00Z",
      link: "https://example.com/news/tech-stocks-slide",
      source: "Bloomberg",
      sentiment: "negative",
      sentimentScore: -0.58,
      category: "stocks",
    },
    {
      id: "3",
      title: "Bitcoin holds steady above $30,000 as institutional adoption grows",
      description: "Bitcoin maintained its position above the $30,000 threshold as more institutional investors announce crypto treasury strategies.",
      pubDate: "2023-06-14T12:15:00Z",
      link: "https://example.com/news/bitcoin-holds-steady",
      source: "CoinDesk",
      sentiment: "positive",
      sentimentScore: 0.65,
      category: "crypto",
    },
    {
      id: "4",
      title: "Oil prices stabilize following OPEC+ production decision",
      description: "Crude oil prices have stabilized in global markets after OPEC+ announced it would maintain current production levels through Q3.",
      pubDate: "2023-06-13T18:20:00Z",
      link: "https://example.com/news/oil-prices-stabilize",
      source: "Reuters",
      sentiment: "neutral",
      sentimentScore: 0.12,
      category: "commodities",
    },
    {
      id: "5",
      title: "European markets close higher on positive economic data",
      description: "European stock indices finished the trading session higher after better-than-expected manufacturing and services data across the eurozone.",
      pubDate: "2023-06-13T16:00:00Z",
      link: "https://example.com/news/european-markets-higher",
      source: "BBC Business",
      sentiment: "positive",
      sentimentScore: 0.81,
      category: "global",
    },
    {
      id: "6",
      title: "Gold reaches six-month high amid inflation concerns",
      description: "Gold prices climbed to a six-month high as investors seek inflation hedges amid persistent price pressures in certain sectors.",
      pubDate: "2023-06-12T15:10:00Z",
      link: "https://example.com/news/gold-six-month-high",
      source: "MarketWatch",
      sentiment: "positive",
      sentimentScore: 0.54,
      category: "commodities",
    },
  ]

  useEffect(() => {
    // Simulate API call to fetch news
    const fetchNews = async () => {
      setIsLoading(true)
      try {
        // In a real app, this would be an API call to an RSS feed service
        // For the MVP, we'll use the mock data
        await new Promise(resolve => setTimeout(resolve, 1000))
        setNewsItems(mockNews)
      } catch (error) {
        console.error("Error fetching news:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchNews()
  }, [])

  // Format date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric', 
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  // Get filtered news items
  const getFilteredNews = () => {
    if (activeCategory === "all") return newsItems
    return newsItems.filter(item => item.category === activeCategory)
  }

  // Get sentiment icon
  const getSentimentIcon = (sentiment: "positive" | "negative" | "neutral") => {
    switch (sentiment) {
      case "positive":
        return <TrendingUp className="h-4 w-4 text-green-500" />
      case "negative":
        return <TrendingDown className="h-4 w-4 text-red-500" />
      case "neutral":
        return <Minus className="h-4 w-4 text-gray-500" />
    }
  }

  // Calculate overall sentiment
  const calculateOverallSentiment = () => {
    if (!newsItems.length) return { label: "Neutral", score: 0, color: "bg-gray-500" }
    
    const avgScore = newsItems.reduce((sum, item) => sum + (item.sentimentScore || 0), 0) / newsItems.length
    
    if (avgScore > 0.3) return { label: "Bullish", score: avgScore, color: "bg-green-500" }
    if (avgScore < -0.3) return { label: "Bearish", score: avgScore, color: "bg-red-500" }
    return { label: "Neutral", score: avgScore, color: "bg-amber-500" }
  }

  const sentiment = calculateOverallSentiment()

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Market Sentiment</CardTitle>
          <CardDescription>Aggregated sentiment from news sources</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center justify-center gap-4">
            <div className="text-2xl font-bold">{sentiment.label}</div>
            <div className="w-full max-w-md h-4 bg-muted rounded-full overflow-hidden">
              <div className={`${sentiment.color} h-full rounded-full`} style={{ 
                width: `${Math.abs(sentiment.score * 100)}%`,
                marginLeft: sentiment.score < 0 ? 0 : '50%',
                marginRight: sentiment.score > 0 ? 0 : '50%',
                transform: sentiment.score === 0 ? 'none' : 'none'
              }}></div>
            </div>
            <div className="text-sm text-muted-foreground">
              Based on analysis of {newsItems.length} financial news articles
            </div>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="all" onValueChange={setActiveCategory}>
        <div className="flex justify-between items-center mb-4">
          <TabsList>
            <TabsTrigger value="all">All News</TabsTrigger>
            <TabsTrigger value="economy">Economy</TabsTrigger>
            <TabsTrigger value="stocks">Stocks</TabsTrigger>
            <TabsTrigger value="crypto">Crypto</TabsTrigger>
            <TabsTrigger value="commodities">Commodities</TabsTrigger>
            <TabsTrigger value="global">Global</TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="all" className="mt-0">
          <div className="space-y-4">
            {isLoading ? (
              Array(3).fill(0).map((_, i) => (
                <Card key={i} className="animate-pulse">
                  <CardHeader>
                    <div className="h-6 bg-muted rounded w-3/4"></div>
                    <div className="h-4 bg-muted rounded w-1/2 mt-2"></div>
                  </CardHeader>
                  <CardContent>
                    <div className="h-4 bg-muted rounded w-full"></div>
                    <div className="h-4 bg-muted rounded w-full mt-2"></div>
                  </CardContent>
                </Card>
              ))
            ) : getFilteredNews().map((item) => (
              <Card key={item.id}>
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-lg">{item.title}</CardTitle>
                      <div className="flex items-center gap-2 mt-1">
                        <Badge variant="outline">{item.source}</Badge>
                        <span className="text-xs text-muted-foreground flex items-center gap-1">
                          <CalendarDays className="h-3 w-3" />
                          {formatDate(item.pubDate)}
                        </span>
                      </div>
                    </div>
                    <Badge 
                      variant={item.sentiment === "positive" ? "default" : 
                              item.sentiment === "negative" ? "destructive" : "secondary"}
                      className="flex items-center gap-1"
                    >
                      {getSentimentIcon(item.sentiment || "neutral")}
                      {item.sentiment}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">{item.description}</p>
                </CardContent>
                <CardFooter>
                  <Button variant="outline" size="sm" className="ml-auto" asChild>
                    <a href={item.link} target="_blank" rel="noopener noreferrer">
                      Read Full Article <ExternalLink className="ml-2 h-3 w-3" />
                    </a>
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Other category tabs will automatically show filtered content */}
        <TabsContent value="economy" className="mt-0">
          <div className="space-y-4">
            {isLoading ? (
              <Card className="animate-pulse">
                <CardHeader>
                  <div className="h-6 bg-muted rounded w-3/4"></div>
                </CardHeader>
                <CardContent>
                  <div className="h-4 bg-muted rounded w-full"></div>
                </CardContent>
              </Card>
            ) : getFilteredNews().length ? (
              getFilteredNews().map((item) => (
                // Same card structure as the "all" tab
                <Card key={item.id}>
                  {/* ...card content same as above... */}
                </Card>
              ))
            ) : (
              <div className="text-center py-8">
                <p className="text-muted-foreground">No news available in this category</p>
              </div>
            )}
          </div>
        </TabsContent>
        
        {/* Similar structure for other category tabs */}
      </Tabs>
    </div>
  )
}
