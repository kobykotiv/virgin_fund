"use client"

import { useState } from "react"
import { NewsSearch } from "@/components/news-search"
import { NewsList } from "@/components/news-list"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Bookmark, TrendingUp, AlertCircle } from "lucide-react"
import type { NewsSearchParams } from "@/lib/news-service"

export default function NewsPage() {
  const [searchParams, setSearchParams] = useState<NewsSearchParams>({})
  const [activeTab, setActiveTab] = useState<"feed" | "saved">("feed")

  const handleSearch = (params: NewsSearchParams) => {
    setSearchParams(params)
  }

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Market News</h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle>News Search</CardTitle>
              <CardDescription>Search for news by keyword, ticker symbol, or use advanced filters</CardDescription>
            </CardHeader>
            <CardContent>
              <NewsSearch onSearch={handleSearch} />
            </CardContent>
          </Card>

          <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as "feed" | "saved")}>
            <TabsList>
              <TabsTrigger value="feed">News Feed</TabsTrigger>
              <TabsTrigger value="saved">
                Saved Articles
                <Badge variant="secondary" className="ml-2">
                  {typeof window !== "undefined" && localStorage.getItem("savedArticles")
                    ? JSON.parse(localStorage.getItem("savedArticles") || "[]").length
                    : 0}
                </Badge>
              </TabsTrigger>
            </TabsList>
            <TabsContent value="feed" className="mt-6">
              <NewsList initialTicker={searchParams.ticker} />
            </TabsContent>
            <TabsContent value="saved" className="mt-6">
              {typeof window !== "undefined" &&
              localStorage.getItem("savedArticles") &&
              JSON.parse(localStorage.getItem("savedArticles") || "[]").length > 0 ? (
                <div className="space-y-4">
                  {JSON.parse(localStorage.getItem("savedArticles") || "[]").map((article: any) => (
                    <div key={article.id} className="border rounded-lg p-4">
                      <h3 className="font-medium">{article.title}</h3>
                      <p className="text-sm text-muted-foreground mt-2">{article.summary}</p>
                      <div className="flex justify-between items-center mt-4">
                        <div className="text-xs text-muted-foreground">
                          {article.source} • {new Date(article.publishedAt).toLocaleDateString()}
                        </div>
                        <Badge variant="outline" className="font-mono">
                          {article.tickers[0]}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12 border rounded-lg">
                  <Bookmark className="mx-auto h-12 w-12 text-muted-foreground" />
                  <h3 className="mt-4 text-lg font-medium">No Saved Articles</h3>
                  <p className="text-muted-foreground">Save articles to read them later.</p>
                </div>
              )}
            </TabsContent>
          </Tabs>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Market Sentiment</CardTitle>
              <CardDescription>Overall market sentiment based on news</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-center py-6">
                <div className="w-32 h-32 rounded-full border-8 border-green-500 flex items-center justify-center">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-500">65%</div>
                    <div className="text-sm text-muted-foreground">Bullish</div>
                  </div>
                </div>
              </div>
              <div className="space-y-4 mt-4">
                <div className="flex justify-between items-center">
                  <span>Positive News</span>
                  <Badge variant="outline" className="bg-green-50 text-green-700">
                    65%
                  </Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span>Neutral News</span>
                  <Badge variant="outline" className="bg-gray-50 text-gray-700">
                    20%
                  </Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span>Negative News</span>
                  <Badge variant="outline" className="bg-red-50 text-red-700">
                    15%
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Trending Topics</CardTitle>
              <CardDescription>Popular topics in financial news</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                <Badge className="bg-blue-500 hover:bg-blue-600 cursor-pointer">Earnings</Badge>
                <Badge className="bg-purple-500 hover:bg-purple-600 cursor-pointer">Tech Stocks</Badge>
                <Badge className="bg-green-500 hover:bg-green-600 cursor-pointer">Interest Rates</Badge>
                <Badge className="bg-yellow-500 hover:bg-yellow-600 cursor-pointer">Inflation</Badge>
                <Badge className="bg-red-500 hover:bg-red-600 cursor-pointer">Market Volatility</Badge>
                <Badge className="bg-indigo-500 hover:bg-indigo-600 cursor-pointer">AI</Badge>
                <Badge className="bg-pink-500 hover:bg-pink-600 cursor-pointer">Crypto</Badge>
                <Badge className="bg-orange-500 hover:bg-orange-600 cursor-pointer">Energy</Badge>
                <Badge className="bg-teal-500 hover:bg-teal-600 cursor-pointer">Healthcare</Badge>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Breaking Alerts</CardTitle>
              <CardDescription>Important market events</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-start gap-3 p-3 border rounded-md bg-red-50">
                  <AlertCircle className="h-5 w-5 text-red-500 mt-0.5" />
                  <div>
                    <h4 className="font-medium text-red-800">Fed Announces Rate Decision</h4>
                    <p className="text-xs text-red-700 mt-1">
                      Federal Reserve raises interest rates by 25 basis points
                    </p>
                    <div className="text-xs text-red-600 mt-2">10 minutes ago</div>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-3 border rounded-md bg-amber-50">
                  <TrendingUp className="h-5 w-5 text-amber-500 mt-0.5" />
                  <div>
                    <h4 className="font-medium text-amber-800">Market Watch</h4>
                    <p className="text-xs text-amber-700 mt-1">
                      S&P 500 reaches new all-time high amid strong earnings
                    </p>
                    <div className="text-xs text-amber-600 mt-2">35 minutes ago</div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

