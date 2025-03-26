"use client"

import { useState, useEffect } from "react"
import { useParams } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { TickerNews } from "@/components/ticker-news"
import { Skeleton } from "@/components/ui/skeleton"
import { ArrowUp, ArrowDown, RefreshCw, LineChart, BarChart2, Newspaper } from "lucide-react"
import { fetchMarketData } from "@/lib/bot-api"
import dynamic from 'next/dynamic'

// Dynamically import TradingView widget
const TradingViewWidget = dynamic(
  () => import('react-tradingview-widget').then((mod) => mod.default),
  { ssr: false }
)

export default function TickerPage() {
  const params = useParams()
  const symbol = params.symbol as string
  const [marketData, setMarketData] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [activeTab, setActiveTab] = useState("overview")

  useEffect(() => {
    if (symbol) {
      loadMarketData()
    }
  }, [symbol])

  const loadMarketData = async () => {
    setIsLoading(true)
    try {
      const data = await fetchMarketData(symbol)
      setMarketData(data)
    } catch (error) {
      console.error(`Error loading market data for ${symbol}:`, error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold font-mono">{symbol}</h1>
          <p className="text-muted-foreground">
            {/* In a real app, we would display the company name here */}
            {symbol === "AAPL"
              ? "Apple Inc."
              : symbol === "MSFT"
                ? "Microsoft Corporation"
                : symbol === "GOOGL"
                  ? "Alphabet Inc."
                  : symbol === "AMZN"
                    ? "Amazon.com Inc."
                    : symbol === "TSLA"
                      ? "Tesla, Inc."
                      : "Stock Details"}
          </p>
        </div>
        <Button variant="outline" onClick={loadMarketData} disabled={isLoading}>
          <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? "animate-spin" : ""}`} />
          Refresh
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader className="pb-2">
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-3xl font-bold">
                    ${isLoading ? "—" : marketData?.price.toFixed(2)}
                  </CardTitle>
                  <CardDescription className="flex items-center mt-1">
                    {isLoading ? (
                      <Skeleton className="h-5 w-20" />
                    ) : marketData?.change >= 0 ? (
                      <span className="flex items-center text-green-500">
                        <ArrowUp className="h-4 w-4 mr-1" />+{marketData.change.toFixed(2)}%
                      </span>
                    ) : (
                      <span className="flex items-center text-red-500">
                        <ArrowDown className="h-4 w-4 mr-1" />
                        {marketData.change.toFixed(2)}%
                      </span>
                    )}
                  </CardDescription>
                </div>
                <Badge variant="outline" className="text-xs">
                  {isLoading ? "Loading..." : "Market Open"}
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
                <div>
                  <div className="text-sm text-muted-foreground">Open</div>
                  <div className="font-medium">{isLoading ? "—" : `$${(marketData.price * 0.99).toFixed(2)}`}</div>
                </div>
                <div>
                  <div className="text-sm text-muted-foreground">High</div>
                  <div className="font-medium">{isLoading ? "—" : `$${(marketData.price * 1.02).toFixed(2)}`}</div>
                </div>
                <div>
                  <div className="text-sm text-muted-foreground">Low</div>
                  <div className="font-medium">{isLoading ? "—" : `$${(marketData.price * 0.98).toFixed(2)}`}</div>
                </div>
                <div>
                  <div className="text-sm text-muted-foreground">Volume</div>
                  <div className="font-medium">{isLoading ? "—" : marketData.volume.toLocaleString()}</div>
                </div>
              </div>

              <div className="h-[400px] border rounded-md overflow-hidden">
                <TradingViewWidget
                  symbol={symbol}
                  theme="light"
                  autosize
                  interval="D"
                  timezone="Etc/UTC"
                  style="1"
                  locale="en"
                  toolbar_bg="#f1f3f6"
                  enable_publishing={false}
                  hide_side_toolbar={false}
                  allow_symbol_change={true}
                  details={true}
                  hotlist={true}
                  calendar={true}
                />
              </div>
            </CardContent>
          </Card>

          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList>
              <TabsTrigger value="overview">
                <LineChart className="h-4 w-4 mr-2" />
                Overview
              </TabsTrigger>
              <TabsTrigger value="fundamentals">
                <BarChart2 className="h-4 w-4 mr-2" />
                Fundamentals
              </TabsTrigger>
              <TabsTrigger value="news">
                <Newspaper className="h-4 w-4 mr-2" />
                News
              </TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-4 mt-4">
              <Card>
                <CardHeader>
                  <CardTitle>Company Overview</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    {symbol === "AAPL"
                      ? "Apple Inc. designs, manufactures, and markets smartphones, personal computers, tablets, wearables, and accessories worldwide. The company offers iPhone, Mac, iPad, and wearables, home, and accessories."
                      : "Company description would appear here."}
                  </p>

                  <div className="grid grid-cols-2 gap-4 mt-6">
                    <div>
                      <h3 className="text-sm font-medium">Sector</h3>
                      <p className="text-muted-foreground">
                        {symbol === "AAPL" || symbol === "MSFT" || symbol === "GOOGL"
                          ? "Technology"
                          : symbol === "AMZN"
                            ? "Consumer Cyclical"
                            : symbol === "TSLA"
                              ? "Automotive"
                              : "Sector information"}
                      </p>
                    </div>
                    <div>
                      <h3 className="text-sm font-medium">Industry</h3>
                      <p className="text-muted-foreground">
                        {symbol === "AAPL"
                          ? "Consumer Electronics"
                          : symbol === "MSFT"
                            ? "Software—Infrastructure"
                            : symbol === "GOOGL"
                              ? "Internet Content & Information"
                              : symbol === "AMZN"
                                ? "Internet Retail"
                                : symbol === "TSLA"
                                  ? "Auto Manufacturers"
                                  : "Industry information"}
                      </p>
                    </div>
                    <div>
                      <h3 className="text-sm font-medium">Employees</h3>
                      <p className="text-muted-foreground">
                        {symbol === "AAPL"
                          ? "154,000"
                          : symbol === "MSFT"
                            ? "221,000"
                            : symbol === "GOOGL"
                              ? "156,500"
                              : symbol === "AMZN"
                                ? "1,540,000"
                                : symbol === "TSLA"
                                  ? "127,855"
                                  : "Employee count"}
                      </p>
                    </div>
                    <div>
                      <h3 className="text-sm font-medium">Founded</h3>
                      <p className="text-muted-foreground">
                        {symbol === "AAPL"
                          ? "1976"
                          : symbol === "MSFT"
                            ? "1975"
                            : symbol === "GOOGL"
                              ? "1998"
                              : symbol === "AMZN"
                                ? "1994"
                                : symbol === "TSLA"
                                  ? "2003"
                                  : "Founded year"}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="fundamentals" className="space-y-4 mt-4">
              <Card>
                <CardHeader>
                  <CardTitle>Financial Data</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-6">
                    <div>
                      <h3 className="text-sm font-medium">Market Cap</h3>
                      <p className="text-xl font-semibold">
                        {symbol === "AAPL"
                          ? "$2.87T"
                          : symbol === "MSFT"
                            ? "$2.75T"
                            : symbol === "GOOGL"
                              ? "$1.70T"
                              : symbol === "AMZN"
                                ? "$1.45T"
                                : symbol === "TSLA"
                                  ? "$751.43B"
                                  : "$XX.XXB"}
                      </p>
                    </div>
                    <div>
                      <h3 className="text-sm font-medium">P/E Ratio</h3>
                      <p className="text-xl font-semibold">
                        {symbol === "AAPL"
                          ? "32.15"
                          : symbol === "MSFT"
                            ? "37.42"
                            : symbol === "GOOGL"
                              ? "25.67"
                              : symbol === "AMZN"
                                ? "60.12"
                                : symbol === "TSLA"
                                  ? "75.89"
                                  : "XX.XX"}
                      </p>
                    </div>
                    <div>
                      <h3 className="text-sm font-medium">Dividend Yield</h3>
                      <p className="text-xl font-semibold">
                        {symbol === "AAPL"
                          ? "0.50%"
                          : symbol === "MSFT"
                            ? "0.75%"
                            : symbol === "GOOGL"
                              ? "—"
                              : symbol === "AMZN"
                                ? "—"
                                : symbol === "TSLA"
                                  ? "—"
                                  : "X.XX%"}
                      </p>
                    </div>
                    <div>
                      <h3 className="text-sm font-medium">EPS (TTM)</h3>
                      <p className="text-xl font-semibold">
                        {symbol === "AAPL"
                          ? "$6.14"
                          : symbol === "MSFT"
                            ? "$9.21"
                            : symbol === "GOOGL"
                              ? "$5.80"
                              : symbol === "AMZN"
                                ? "$2.90"
                                : symbol === "TSLA"
                                  ? "$4.30"
                                  : "$X.XX"}
                      </p>
                    </div>
                    <div>
                      <h3 className="text-sm font-medium">52-Week High</h3>
                      <p className="text-xl font-semibold">
                        {symbol === "AAPL"
                          ? "$198.23"
                          : symbol === "MSFT"
                            ? "$420.10"
                            : symbol === "GOOGL"
                              ? "$153.78"
                              : symbol === "AMZN"
                                ? "$185.05"
                                : symbol === "TSLA"
                                  ? "$299.29"
                                  : "$XXX.XX"}
                      </p>
                    </div>
                    <div>
                      <h3 className="text-sm font-medium">52-Week Low</h3>
                      <p className="text-xl font-semibold">
                        {symbol === "AAPL"
                          ? "$124.17"
                          : symbol === "MSFT"
                            ? "$275.37"
                            : symbol === "GOOGL"
                              ? "$102.21"
                              : symbol === "AMZN"
                                ? "$101.15"
                                : symbol === "TSLA"
                                  ? "$152.37"
                                  : "$XXX.XX"}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="news" className="mt-4">
              <TickerNews ticker={symbol} limit={10} />
            </TabsContent>
          </Tabs>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Related Symbols</CardTitle>
            </CardHeader>
            <CardContent>
              <LiveTicker 
                symbols={getRelatedSymbols(symbol)} 
                refreshInterval={10000}
                showCharts={false}
              />
            </CardContent>
          </Card>
          
          <TickerNews ticker={symbol} limit={5} />
        </div>
      </div>
    </div>
  )
}

// Helper function to get related symbols
function getRelatedSymbols(symbol: string): string[] {
  const relatedMap: Record<string, string[]> = {
    'AAPL': ['MSFT', 'GOOGL', 'META'],
    'MSFT': ['AAPL', 'GOOGL', 'AMZN'],
    'GOOGL': ['AAPL', 'MSFT', 'META'],
    'AMZN': ['MSFT', 'GOOGL', 'TSLA'],
    'TSLA': ['RIVN', 'GM', 'F'],
    'META': ['GOOGL', 'SNAP', 'PINS'],
    'BTC-USD': ['ETH-USD', 'SOL-USD', 'BNB-USD'],
    'ETH-USD': ['BTC-USD', 'SOL-USD', 'ADA-USD'],
  };

  return relatedMap[symbol] || ['AAPL', 'MSFT', 'GOOGL'];
}

