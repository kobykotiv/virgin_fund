"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ArrowUp, ArrowDown, RefreshCw, Search } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { fetchMarketData } from "@/lib/bot-api"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import dynamic from 'next/dynamic'
import { getMarketDataService, type MarketData } from "@/services/market-data-service"
import { useAuth } from "@/providers/auth-provider"

// Dynamically import TradingView widget to avoid SSR issues
const TradingViewWidget = dynamic(
  () => import('react-tradingview-widget').then((mod) => mod.default),
  { ssr: false }
)

interface TickerData {
  symbol: string
  price: number
  change: number
  volume: number
  lastUpdated: Date
}

interface LiveTickerProps {
  symbols: string[]
  refreshInterval?: number // in milliseconds
  showCharts?: boolean;
}

export function LiveTicker({ symbols, refreshInterval = 15000, showCharts = false }: LiveTickerProps) {
  const [tickerData, setTickerData] = useState<TickerData[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date())
  const [searchQuery, setSearchQuery] = useState("")
  const [activeView, setActiveView] = useState<"grid" | "list">("grid")
  const [favoriteSymbols, setFavoriteSymbols] = useState<string[]>([])
  const [selectedSymbol, setSelectedSymbol] = useState<string | null>(null)
  const { apiConfig } = useAuth()

  useEffect(() => {
    if (!apiConfig?.keyId || !apiConfig?.secretKey) return;

    const service = getMarketDataService(apiConfig.keyId, apiConfig.secretKey);
    service.connect();

    // Initialize with current data
    fetchInitialData();

    // Set up WebSocket subscriptions for each symbol
    const handleMarketData = (symbol: string) => (data: MarketData) => {
      setTickerData(current => {
        const index = current.findIndex(t => t.symbol === symbol);
        if (index === -1) {
          return [...current, {
            symbol: data.symbol,
            price: data.price,
            change: data.changePercent,
            volume: data.volume,
            lastUpdated: new Date()
          }];
        }
        const updated = [...current];
        updated[index] = {
          ...updated[index],
          price: data.price,
          change: data.changePercent,
          volume: data.volume,
          lastUpdated: new Date()
        };
        return updated;
      });
      setLastUpdated(new Date());
    };

    // Subscribe to updates for each symbol
    symbols.forEach(symbol => {
      service.subscribe(symbol, handleMarketData(symbol));
    });

    return () => {
      // Cleanup subscriptions
      symbols.forEach(symbol => {
        service.unsubscribe(symbol, handleMarketData(symbol));
      });
      service.disconnect();
    };
  }, [symbols, apiConfig]);

  const fetchInitialData = async () => {
    try {
      setIsLoading(true);
      const data = await Promise.all(symbols.map(symbol => fetchMarketData(symbol)));
      setTickerData(data.map(item => ({
        symbol: item.symbol,
        price: item.price,
        change: item.change,
        volume: item.volume,
        lastUpdated: new Date()
      })));
    } catch (error) {
      console.error("Error fetching initial ticker data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleManualRefresh = () => {
    fetchInitialData()
  }

  const toggleFavorite = (symbol: string) => {
    if (favoriteSymbols.includes(symbol)) {
      setFavoriteSymbols(favoriteSymbols.filter((s) => s !== symbol))
    } else {
      setFavoriteSymbols([...favoriteSymbols, symbol])
    }
  }

  const handleSymbolSelect = (symbol: string) => {
    setSelectedSymbol(symbol === selectedSymbol ? null : symbol);
  };

  const filteredData = searchQuery
    ? tickerData.filter((ticker) => ticker.symbol.toLowerCase().includes(searchQuery.toLowerCase()))
    : tickerData

  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <CardTitle className="text-lg">Live Market Data</CardTitle>
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <div className="relative w-full sm:w-auto">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search symbols..."
                className="pl-8 h-9 w-full sm:w-[180px]"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <Tabs
              value={activeView}
              onValueChange={(v) => setActiveView(v as "grid" | "list")}
              className="hidden sm:block"
            >
              <TabsList className="h-9">
                <TabsTrigger value="grid" className="px-3">
                  Grid
                </TabsTrigger>
                <TabsTrigger value="list" className="px-3">
                  List
                </TabsTrigger>
              </TabsList>
            </Tabs>
            <Button
              variant="outline"
              size="sm"
              className="h-9 w-9 p-0"
              onClick={handleManualRefresh}
              disabled={isLoading}
            >
              <RefreshCw className={`h-4 w-4 ${isLoading ? "animate-spin" : ""}`} />
              <span className="sr-only">Refresh</span>
            </Button>
          </div>
        </div>
        <div className="text-xs text-muted-foreground mt-2">Last updated: {lastUpdated.toLocaleTimeString()}</div>
      </CardHeader>
      <CardContent>
        {activeView === "grid" ? (
          <div className="space-y-4">
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3">
              {isLoading && tickerData.length === 0 ? (
                Array.from({ length: symbols.length }).map((_, index) => <TickerSkeleton key={index} />)
              ) : filteredData.length === 0 ? (
                <div className="col-span-full text-center py-6 text-muted-foreground">No matching symbols found</div>
              ) : (
                filteredData.map((ticker) => (
                  <div key={ticker.symbol} onClick={() => showCharts && handleSymbolSelect(ticker.symbol)} className={showCharts ? 'cursor-pointer' : ''}>
                    <TickerItem
                      ticker={ticker}
                      isFavorite={favoriteSymbols.includes(ticker.symbol)}
                      onToggleFavorite={() => toggleFavorite(ticker.symbol)}
                    />
                  </div>
                ))
              )}
            </div>
            
            {showCharts && selectedSymbol && (
              <Card className="mt-4">
                <CardHeader>
                  <CardTitle className="text-base">{selectedSymbol} Chart</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-[400px]">
                    <TradingViewWidget
                      symbol={selectedSymbol}
                      theme="light"
                      autosize
                      interval="D"
                      locale="en"
                      timezone="Etc/UTC"
                      style="1"
                      hide_side_toolbar={false}
                      allow_symbol_change={true}
                      save_image={true}
                      enable_publishing={false}
                    />
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-2 px-3 font-medium">Symbol</th>
                  <th className="text-right py-2 px-3 font-medium">Price</th>
                  <th className="text-right py-2 px-3 font-medium">Change</th>
                  <th className="text-right py-2 px-3 font-medium">Volume</th>
                </tr>
              </thead>
              <tbody>
                {isLoading && tickerData.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="text-center py-6 text-muted-foreground">
                      Loading market data...
                    </td>
                  </tr>
                ) : filteredData.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="text-center py-6 text-muted-foreground">
                      No matching symbols found
                    </td>
                  </tr>
                ) : (
                  filteredData.map((ticker) => (
                    <tr key={ticker.symbol} className="border-b">
                      <td className="py-2 px-3 font-medium">{ticker.symbol}</td>
                      <td className="py-2 px-3 text-right font-mono">${ticker.price.toFixed(2)}</td>
                      <td className={`py-2 px-3 text-right ${ticker.change >= 0 ? "text-green-500" : "text-red-500"}`}>
                        {ticker.change >= 0 ? "+" : ""}
                        {ticker.change.toFixed(2)}%
                      </td>
                      <td className="py-2 px-3 text-right">{ticker.volume.toLocaleString()}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

function TickerItem({
  ticker,
  isFavorite,
  onToggleFavorite,
}: {
  ticker: TickerData
  isFavorite: boolean
  onToggleFavorite: () => void
}) {
  // Simulate real-time price fluctuations
  const [currentPrice, setCurrentPrice] = useState(ticker.price)
  const [priceFlash, setPriceFlash] = useState<"up" | "down" | null>(null)

  useEffect(() => {
    // Flash effect when price changes
    if (ticker.price !== currentPrice) {
      setPriceFlash(ticker.price > currentPrice ? "up" : "down")
      setCurrentPrice(ticker.price)

      // Remove flash effect after animation completes
      const timeout = setTimeout(() => {
        setPriceFlash(null)
      }, 1000)

      return () => clearTimeout(timeout)
    }
  }, [ticker.price, currentPrice])

  return (
    <div className="border rounded-lg p-3 flex flex-col">
      <div className="flex justify-between items-center mb-1">
        <span className="font-semibold">{ticker.symbol}</span>
        <Badge variant={ticker.change >= 0 ? "success" : "destructive"} className="text-xs">
          {ticker.change >= 0 ? <ArrowUp className="h-3 w-3 mr-1" /> : <ArrowDown className="h-3 w-3 mr-1" />}
          {Math.abs(ticker.change).toFixed(2)}%
        </Badge>
      </div>
      <div
        className={`text-lg font-mono font-bold transition-colors duration-500 ${
          priceFlash === "up" ? "text-green-500" : priceFlash === "down" ? "text-red-500" : ""
        }`}
      >
        ${ticker.price.toFixed(2)}
      </div>
      <div className="flex justify-between items-center mt-1">
        <div className="text-xs text-muted-foreground">Vol: {ticker.volume.toLocaleString()}</div>
        <Button variant="ghost" size="sm" className="h-6 w-6 p-0" onClick={onToggleFavorite}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill={isFavorite ? "currentColor" : "none"}
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className={isFavorite ? "text-yellow-400" : "text-muted-foreground"}
          >
            <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
          </svg>
        </Button>
      </div>
    </div>
  )
}

function TickerSkeleton() {
  return (
    <div className="border rounded-lg p-3 flex flex-col animate-pulse">
      <div className="flex justify-between items-center mb-1">
        <div className="h-4 w-16 bg-muted rounded"></div>
        <div className="h-4 w-12 bg-muted rounded"></div>
      </div>
      <div className="h-6 w-24 bg-muted rounded mt-1"></div>
      <div className="h-3 w-20 bg-muted rounded mt-2"></div>
    </div>
  )
}

