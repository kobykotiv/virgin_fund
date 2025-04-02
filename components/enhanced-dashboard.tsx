"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
  AreaChart,
  Area,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  ComposedChart,
  Scatter,
} from "recharts"
import {
  Activity,
  ArrowDown,
  ArrowUp,
  DollarSign,
  TrendingUp,
  AlertTriangle,
  Pause,
  RefreshCw,
  Settings,
  Wallet,
} from "lucide-react"
import { LiveTicker } from "@/components/live-ticker"
import { fetchPortfolio } from "@/services/portfolio-service"
import { BotService } from "@/services/bot-service"
import { fetchOrders } from "@/services/order-service"
import { getMultipleMarketData } from "@/services/market-data-service"
import { useToast } from "@/components/ui/use-toast"
import { Skeleton } from "@/components/ui/skeleton"
import { useAuth } from "@/providers/auth-provider"

interface EnhancedDashboardProps {
  apiConfig?: {
    keyId: string
    secretKey: string
    baseUrl: string
    isPaper: boolean
  } | null
}

export function EnhancedDashboard({ apiConfig }: EnhancedDashboardProps) {
  const [isLoading, setIsLoading] = useState(true)
  const [activeTab, setActiveTab] = useState("overview")
  const [portfolio, setPortfolio] = useState<any>(null)
  const [bots, setBots] = useState<any[]>([])
  const [orders, setOrders] = useState<any[]>([])
  const [marketData, setMarketData] = useState<any[]>([])
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date())
  const { toast } = useToast()
  const { isDemoMode } = useAuth()

  // Get unique assets from portfolio and bots
  const getUniqueAssets = () => {
    const portfolioAssets = portfolio?.positions?.map((p: any) => p.symbol) || []
    const botAssets = bots.flatMap((bot) => bot.assets || [])
    return Array.from(new Set([...portfolioAssets, ...botAssets]))
  }

  const loadDashboardData = async () => {
    setIsLoading(true)
    try {
      // Fetch portfolio data
      const portfolioData = await fetchPortfolio()
      setPortfolio(portfolioData)

      // Fetch bots data
      const botsData = await fetchBots()
      setBots(botsData)

      // Fetch orders data
      const ordersData = await fetchOrders()
      setOrders(ordersData)

      // Fetch market data for all assets
      const assets = getUniqueAssets()
      if (assets.length > 0) {
        // Try to fetch from Alpaca first
        try {
          const marketDataResult = await getMultipleMarketData(assets)
          setMarketData(marketDataResult)
        } catch (error) {
          console.error("Error fetching from primary market data source:", error)

          // Fallback to Yahoo Finance for stocks and CoinGecko for crypto
          const marketDataPromises = assets.map(async (symbol) => {
            // Determine if it's a crypto asset
            const isCrypto =
              symbol.includes("BTC") ||
              symbol.includes("ETH") ||
              symbol.includes("-USD") ||
              symbol.includes("SOL") ||
              symbol.includes("ADA") ||
              symbol.includes("DOT")

            try {
              // Use appropriate API based on asset type
              const endpoint = isCrypto
                ? `/api/coingecko/market?symbol=${symbol}`
                : `/api/yahoo/market?symbol=${symbol}`

              const response = await fetch(endpoint)
              if (!response.ok) throw new Error(`Failed to fetch ${symbol}`)

              return await response.json()
            } catch (err) {
              console.error(`Error fetching data for ${symbol}:`, err)
              // Return a placeholder with error status
              return {
                symbol,
                price: 0,
                change: 0,
                changePercent: 0,
                volume: 0,
                open: 0,
                high: 0,
                low: 0,
                error: true,
              }
            }
          })

          const fallbackMarketData = await Promise.all(marketDataPromises)
          setMarketData(fallbackMarketData.filter((data) => !data.error))

          // Show toast notification about fallback
          toast({
            title: "Using fallback data source",
            description: "Primary market data source unavailable. Using alternative sources.",
            variant: "warning",
          })
        }
      }

      setLastUpdated(new Date())
    } catch (error) {
      console.error("Error loading dashboard data:", error)
      toast({
        title: "Error",
        description: "Failed to load dashboard data",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    loadDashboardData()

    // Set up interval to refresh data every 60 seconds
    const interval = setInterval(loadDashboardData, 60000)

    return () => clearInterval(interval)
  }, [])

  // Calculate summary statistics
  const activeBots = bots.filter((bot) => bot.status === "active").length
  const pausedBots = bots.filter((bot) => bot.status === "paused").length
  const errorBots = bots.filter((bot) => bot.status === "error").length
  const totalBots = bots.length

  // Calculate total profit/loss
  const totalPnL = bots.reduce((sum, bot) => sum + (bot.performance?.totalPnL || 0), 0)
  const avgPnlPercentage =
    bots.length > 0 ? bots.reduce((sum, bot) => sum + (bot.performance?.pnlPercentage || 0), 0) / bots.length : 0

  // Calculate total trades
  const totalTrades = bots.reduce((sum, bot) => sum + (bot.performance?.totalTrades || 0), 0)

  // Generate performance data for chart
  const performanceData = bots.map((bot) => ({
    name: bot.name,
    performance: bot.performance?.pnlPercentage || 0,
    trades: bot.performance?.totalTrades || 0,
  }))

  // Generate mock historical performance data
  const historicalData = Array.from({ length: 30 }, (_, i) => {
    const date = new Date()
    date.setDate(date.getDate() - (30 - i))
    return {
      date: date.toISOString().split("T")[0],
      value: Math.random() * 10 - 2 + i * 0.2,
    }
  })

  // Generate portfolio allocation data for pie chart
  const portfolioAllocationData =
    portfolio?.positions?.map((position: any) => ({
      name: position.symbol,
      value: position.marketValue,
    })) || []

  // Generate bot type distribution data for pie chart
  const botTypeData = [
    { name: "Indicator", value: bots.filter((bot) => bot.type === "indicator").length },
    { name: "Grid", value: bots.filter((bot) => bot.type === "grid").length },
    { name: "DCA", value: bots.filter((bot) => bot.type === "dca").length },
    { name: "Basket", value: bots.filter((bot) => bot.type === "basket").length },
  ].filter((item) => item.value > 0)

  // Colors for pie charts
  const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884D8", "#82CA9D"]

  // Format currency
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value)
  }

  // Format percentage
  const formatPercentage = (value: number) => {
    return `${value > 0 ? "+" : ""}${value.toFixed(2)}%`
  }

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      {/* Live Market Ticker with smooth animations */}
      <div className="bg-card/50 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-10 w-full border-b">
        <LiveTicker 
          symbols={getUniqueAssets()} 
          refreshInterval={15000}
          className="py-2"
        />
      </div>

      <Tabs defaultValue="overview" value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-4 lg:w-[400px]">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="performance">Performance</TabsTrigger>
          <TabsTrigger value="portfolio">Portfolio</TabsTrigger>
          <TabsTrigger value="market">Market</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Enhanced metric cards with animations */}
            <Card className="hover:shadow-lg transition-all">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Portfolio Value</CardTitle>
                <Wallet className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <Skeleton className="h-8 w-32" />
                ) : (
                  <div className="space-y-1">
                    <div className="text-2xl font-bold animate-in slide-in-from-bottom">
                      {formatCurrency(portfolio?.totalValue || 0)}
                    </div>
                    <p className="text-xs text-muted-foreground flex items-center">
                      <ArrowUp className="h-3 w-3 mr-1 text-green-500" />
                      <span>+2.5% today</span>
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Bot Status</CardTitle>
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{totalBots}</div>
                <div className="flex flex-wrap gap-2 mt-2">
                  <Badge variant="success" className="text-xs">
                    {activeBots} active
                  </Badge>
                  <Badge variant="secondary" className="text-xs">
                    {pausedBots} paused
                  </Badge>
                  {errorBots > 0 && (
                    <Badge variant="destructive" className="text-xs">
                      {errorBots} error
                    </Badge>
                  )}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total P&L</CardTitle>
                <DollarSign className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">${totalPnL.toFixed(2)}</div>
                <p className="text-xs text-muted-foreground flex items-center mt-1">
                  {avgPnlPercentage > 0 ? (
                    <>
                      <ArrowUp className="h-3 w-3 text-green-500 mr-1" />
                      <span className="text-green-500">+{avgPnlPercentage.toFixed(2)}% avg return</span>
                    </>
                  ) : (
                    <>
                      <ArrowDown className="h-3 w-3 text-red-500 mr-1" />
                      <span className="text-red-500">{avgPnlPercentage.toFixed(2)}% avg return</span>
                    </>
                  )}
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Trading Activity</CardTitle>
                <Activity className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{totalTrades}</div>
                <p className="text-xs text-muted-foreground mt-1">Total trades executed</p>
              </CardContent>
            </Card>
          </div>

          {/* API Configuration Card */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">API Configuration</CardTitle>
              <CardDescription>
                {isDemoMode ? "Running in Demo Mode - Using simulated data" : "Current Alpaca API connection details"}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm font-medium">Base URL:</span>
                    <span className="text-sm font-mono">
                      {isDemoMode ? "demo.trading-platform.local" : apiConfig?.baseUrl || "Not configured"}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm font-medium">Key ID:</span>
                    <span className="text-sm font-mono">
                      {isDemoMode
                        ? "DEMO_KEY_ID"
                        : apiConfig
                          ? `${apiConfig.keyId.substring(0, 5)}...${apiConfig.keyId.substring(apiConfig.keyId.length - 5)}`
                          : "Not configured"}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm font-medium">Environment:</span>
                    <Badge variant="outline">
                      {isDemoMode ? "Demo Mode" : apiConfig?.isPaper ? "Paper Trading" : "Live Trading"}
                    </Badge>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm font-medium">Data Source:</span>
                    <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                      {isDemoMode ? "Simulated Data" : "Alpaca Markets + Yahoo Finance"}
                    </Badge>
                  </div>
                </div>
                <div className="flex items-center justify-center md:justify-end">
                  <Button
                    variant="outline"
                    size="sm"
                    className="text-xs"
                    onClick={() => {
                      // This would trigger the API settings modal in a real implementation
                      const event = new CustomEvent("openApiSettings")
                      window.dispatchEvent(event)
                    }}
                  >
                    <Settings className="h-3.5 w-3.5 mr-2" />
                    Update API Settings
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Bot Types</CardTitle>
                <CardDescription>Distribution of bot strategies</CardDescription>
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <div className="space-y-4">
                    {[1, 2, 3, 4].map((i) => (
                      <Skeleton key={i} className="h-6 w-full" />
                    ))}
                  </div>
                ) : botTypeData.length > 0 ? (
                  <div className="h-[250px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={botTypeData}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                          outerRadius={80}
                          fill="#8884d8"
                          dataKey="value"
                        >
                          {botTypeData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip formatter={(value) => [value, "Bots"]} />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                ) : (
                  <div className="text-center py-10 text-muted-foreground">No bots configured yet</div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Recent Activity</CardTitle>
                <CardDescription>Latest bot updates and trades</CardDescription>
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <div className="space-y-4">
                    {[1, 2, 3, 4, 5].map((i) => (
                      <div key={i} className="flex items-start space-x-3">
                        <Skeleton className="h-6 w-6 rounded-full" />
                        <div className="space-y-1 flex-1">
                          <Skeleton className="h-4 w-3/4" />
                          <Skeleton className="h-3 w-1/2" />
                        </div>
                      </div>
                    ))}
                  </div>
                ) : bots.length > 0 ? (
                  <div className="space-y-4">
                    {bots
                      .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
                      .slice(0, 5)
                      .map((bot) => (
                        <div key={bot.id} className="flex items-start space-x-3">
                          <div
                            className={`mt-0.5 rounded-full p-1 ${
                              bot.status === "active"
                                ? "bg-green-500/20 text-green-500"
                                : bot.status === "error"
                                  ? "bg-red-500/20 text-red-500"
                                  : "bg-gray-500/20 text-gray-500"
                            }`}
                          >
                            {bot.status === "active" ? (
                              <Activity className="h-3 w-3" />
                            ) : bot.status === "error" ? (
                              <AlertTriangle className="h-3 w-3" />
                            ) : (
                              <Pause className="h-3 w-3" />
                            )}
                          </div>
                          <div className="space-y-1">
                            <p className="text-sm font-medium leading-none">{bot.name}</p>
                            <p className="text-xs text-muted-foreground">
                              Last updated {new Date(bot.updatedAt).toLocaleDateString()} at{" "}
                              {new Date(bot.updatedAt).toLocaleTimeString()}
                            </p>
                          </div>
                        </div>
                      ))}
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground">No recent activity</p>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Recent Orders */}
          <Card>
            <CardHeader>
              <CardTitle>Recent Orders</CardTitle>
              <CardDescription>Latest trading activity</CardDescription>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="space-y-4">
                  {[1, 2, 3].map((i) => (
                    <Skeleton key={i} className="h-12 w-full" />
                  ))}
                </div>
              ) : orders.length > 0 ? (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Symbol</TableHead>
                      <TableHead>Side</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Quantity</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Created</TableHead>
                            <Badge variant={order.side === "buy" ? "default" : "secondary"}>
                              {order.side.toUpperCase()}
                            </Badge>
                          </TableCell>
                          <TableCell>{order.type.toUpperCase()}</TableCell>
                          <TableCell>{order.quantity}</TableCell>
                          <TableCell>
                            <Badge variant={order.status === "filled" ? "success" : "outline"}>
                              {order.status.toUpperCase()}
                            </Badge>
                          </TableCell>
                          <TableCell>{new Date(order.createdAt).toLocaleString()}</TableCell>
                        </TableRow>
                      ))}
                  </TableBody>
                </Table>
              ) : (
                <div className="text-center py-6 text-muted-foreground">No orders placed yet</div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="performance" className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle>Portfolio Performance</CardTitle>
                  <CardDescription>30-day performance history</CardDescription>
                </div>
                <Button variant="outline" size="sm" className="h-8" onClick={loadDashboardData} disabled={isLoading}>
                  {isLoading ? (
                    <RefreshCw className="h-3.5 w-3.5 mr-2 animate-spin" />
                  ) : (
                    <RefreshCw className="h-3.5 w-3.5 mr-2" />
                  )}
                  Refresh
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <Skeleton className="h-80 w-full" />
              ) : (
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart
                      data={historicalData}
                      margin={{
                        top: 5,
                        right: 30,
                        left: 20,
                        bottom: 5,
                      }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="date" />
                      <YAxis label={{ value: "P&L (%)", angle: -90, position: "insideLeft" }} />
                      <Tooltip />
                      <Legend />
                      <Area
                        type="monotone"
                        dataKey="value"
                        stroke="hsl(var(--primary))"
                        fill="hsl(var(--primary)/0.2)"
                        name="P&L (%)"
                        activeDot={{ r: 8 }}
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Bot Performance</CardTitle>
              <CardDescription>Performance comparison across all trading bots</CardDescription>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <Skeleton className="h-80 w-full" />
              ) : performanceData.length > 0 ? (
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={performanceData}
                      margin={{
                        top: 5,
                        right: 30,
                        left: 20,
                        bottom: 5,
                      }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis label={{ value: "Performance (%)", angle: -90, position: "insideLeft" }} />
                      <Tooltip
                        formatter={(value, name) => [
                          `${Number.parseFloat(value as string).toFixed(2)}%`,
                          "Performance",
                        ]}
                      />
                      <Bar
                        dataKey="performance"
                        fill="hsl(var(--primary))"
                        name="Performance (%)"
                        radius={[4, 4, 0, 0]}
                      />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              ) : (
                <div className="text-center py-10 text-muted-foreground">No performance data available yet</div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Trading Activity</CardTitle>
              <CardDescription>Number of trades by bot</CardDescription>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <Skeleton className="h-80 w-full" />
              ) : performanceData.length > 0 ? (
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={performanceData}
                      margin={{
                        top: 5,
                        right: 30,
                        left: 20,
                        bottom: 5,
                      }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis label={{ value: "Trades", angle: -90, position: "insideLeft" }} />
                      <Tooltip formatter={(value) => [value, "Trades"]} />
                      <Bar dataKey="trades" fill="#82ca9d" name="Trades" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              ) : (
                <div className="text-center py-10 text-muted-foreground">No trading activity data available yet</div>
              )}
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Price Correlation Analysis</CardTitle>
              <CardDescription>Correlation between different assets in your portfolio</CardDescription>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <Skeleton className="h-80 w-full" />
              ) : marketData.length > 1 ? (
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <ComposedChart
                      data={marketData.map((data) => ({
                        symbol: data.symbol,
                        price: data.price,
                        volume: data.volume / 1000000, // Convert to millions for better visualization
                        change: data.changePercent,
                      }))}
                      margin={{
                        top: 20,
                        right: 30,
                        left: 20,
                        bottom: 20,
                      }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="symbol" />
                      <YAxis yAxisId="left" label={{ value: "Price ($)", angle: -90, position: "insideLeft" }} />
                      <YAxis
                        yAxisId="right"
                        orientation="right"
                        label={{ value: "Volume (M)", angle: 90, position: "insideRight" }}
                      />
                      <Tooltip
                        formatter={(value, name, props) => {
                          if (name === "volume") return [`${value.toFixed(2)}M`, "Volume"]
                          if (name === "price") return [`$${value.toFixed(2)}`, "Price"]
                          if (name === "change") return [`${value.toFixed(2)}%`, "Change"]
                          return [value, name]
                        }}
                      />
                      <Legend />
                      <Bar yAxisId="right" dataKey="volume" fill="#8884d8" name="Volume (M)" />
                      <Line yAxisId="left" type="monotone" dataKey="price" stroke="#ff7300" name="Price ($)" />
                      <Scatter yAxisId="left" dataKey="price" fill="red" name="Current Price" />
                    </ComposedChart>
                  </ResponsiveContainer>
                </div>
              ) : (
                <div className="text-center py-10 text-muted-foreground">
                  Insufficient data for correlation analysis
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="portfolio" className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle>Portfolio Allocation</CardTitle>
                  <CardDescription>Current asset distribution</CardDescription>
                </div>
                <Button variant="outline" size="sm" className="h-8" onClick={loadDashboardData} disabled={isLoading}>
                  {isLoading ? (
                    <RefreshCw className="h-3.5 w-3.5 mr-2 animate-spin" />
                  ) : (
                    <RefreshCw className="h-3.5 w-3.5 mr-2" />
                  )}
                  Refresh
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <Skeleton className="h-80 w-full" />
              ) : portfolioAllocationData.length > 0 ? (
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={portfolioAllocationData}
                        cx="50%"
                        cy="50%"
                        labelLine={true}
                        label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(1)}%`}
                        outerRadius={100}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {portfolioAllocationData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip formatter={(value) => [formatCurrency(Number(value)), "Value"]} />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              ) : (
                <div className="text-center py-10 text-muted-foreground">No portfolio data available</div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Portfolio Holdings</CardTitle>
              <CardDescription>Current positions and performance</CardDescription>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="space-y-4">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <Skeleton key={i} className="h-12 w-full" />
                  ))}
                </div>
              ) : portfolio?.positions?.length > 0 ? (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Symbol</TableHead>
                      <TableHead>Quantity</TableHead>
                      <TableHead>Avg Price</TableHead>
                      <TableHead>Current Price</TableHead>
                      <TableHead>Market Value</TableHead>
                      <TableHead>Unrealized P&L</TableHead>
                      <TableHead>Change</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {portfolio.positions.map((position: any) => (
                      <TableRow key={position.symbol}>
                        <TableCell className="font-medium">{position.symbol}</TableCell>
                        <TableCell>{position.quantity}</TableCell>
                        <TableCell>${position.averagePrice.toFixed(2)}</TableCell>
                        <TableCell>${position.currentPrice.toFixed(2)}</TableCell>
                        <TableCell>{formatCurrency(position.marketValue)}</TableCell>
                        <TableCell className={position.unrealizedPnL >= 0 ? "text-green-500" : "text-red-500"}>
                          {formatCurrency(position.unrealizedPnL)}
                        </TableCell>
                        <TableCell className={position.percentChange >= 0 ? "text-green-500" : "text-red-500"}>
                          {formatPercentage(position.percentChange)}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              ) : (
                <div className="text-center py-6 text-muted-foreground">No positions in portfolio</div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="market" className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle>Market Data</CardTitle>
                  <CardDescription>Current prices for assets used in your bots</CardDescription>
                </div>
                <Button variant="outline" size="sm" className="h-8" onClick={loadDashboardData} disabled={isLoading}>
                  {isLoading ? (
                    <>
                      <RefreshCw className="h-3.5 w-3.5 mr-2 animate-spin" />
                      Loading...
                    </>
                  ) : (
                    <>
                      <RefreshCw className="h-3.5 w-3.5 mr-2" />
                      Refresh
                    </>
                  )}
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Symbol</TableHead>
                    <TableHead>Price</TableHead>
                    <TableHead>Change</TableHead>
                    <TableHead>Volume</TableHead>
                    <TableHead>Open</TableHead>
                    <TableHead>High</TableHead>
                    <TableHead>Low</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {isLoading ? (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center py-6 text-muted-foreground">
                        <RefreshCw className="h-5 w-5 animate-spin mx-auto" />
                        <p className="mt-2 text-sm">Loading market data...</p>
                      </TableCell>
                    </TableRow>
                  ) : marketData.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center py-6 text-muted-foreground">
                        No market data available
                      </TableCell>
                    </TableRow>
                  ) : (
                    marketData.map((data) => (
                      <TableRow key={data.symbol}>
                        <TableCell className="font-medium">{data.symbol}</TableCell>
                        <TableCell>${data.price.toFixed(2)}</TableCell>
                        <TableCell className={data.changePercent > 0 ? "text-green-500" : "text-red-500"}>
                          {data.changePercent > 0 ? "+" : ""}
                          {data.changePercent.toFixed(2)}%
                        </TableCell>
                        <TableCell>{data.volume.toLocaleString()}</TableCell>
                        <TableCell>${data.open.toFixed(2)}</TableCell>
                        <TableCell>${data.high.toFixed(2)}</TableCell>
                        <TableCell>${data.low.toFixed(2)}</TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>

          {/* Order Book Visualization */}
          <Card>
            <CardHeader>
              <CardTitle>Order Book Visualization</CardTitle>
              <CardDescription>Simulated order book depth for selected assets</CardDescription>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <Skeleton className="h-80 w-full" />
              ) : marketData.length > 0 ? (
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      layout="vertical"
                      data={[
                        { price: "Sell 5", volume: 120, type: "ask" },
                        { price: "Sell 4", volume: 150, type: "ask" },
                        { price: "Sell 3", volume: 200, type: "ask" },
                        { price: "Sell 2", volume: 300, type: "ask" },
                        { price: "Sell 1", volume: 400, type: "ask" },
                        { price: "Buy 1", volume: 450, type: "bid" },
                        { price: "Buy 2", volume: 350, type: "bid" },
                        { price: "Buy 3", volume: 250, type: "bid" },
                        { price: "Buy 4", volume: 180, type: "bid" },
                        { price: "Buy 5", volume: 100, type: "bid" },
                      ]}
                      margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis type="number" />
                      <YAxis dataKey="price" type="category" />
                      <Tooltip formatter={(value) => [value, "Volume"]} />
                      <Legend />
                      <Bar dataKey="volume" name="Volume" radius={[0, 4, 4, 0]}>
                        {[
                          { price: "Sell 5", volume: 120, type: "ask" },
                          { price: "Sell 4", volume: 150, type: "ask" },
                          { price: "Sell 3", volume: 200, type: "ask" },
                          { price: "Sell 2", volume: 300, type: "ask" },
                          { price: "Sell 1", volume: 400, type: "ask" },
                          { price: "Buy 1", volume: 450, type: "bid" },
                          { price: "Buy 2", volume: 350, type: "bid" },
                          { price: "Buy 3", volume: 250, type: "bid" },
                          { price: "Buy 4", volume: 180, type: "bid" },
                          { price: "Buy 5", volume: 100, type: "bid" },
                        ].map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.type === "ask" ? "#ef4444" : "#22c55e"} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              ) : (
                <div className="text-center py-10 text-muted-foreground">
                  No market data available for order book visualization
                </div>
              )}
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Real-Time Price Movement</CardTitle>
              <CardDescription>Live price updates for selected assets</CardDescription>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <Skeleton className="h-80 w-full" />
              ) : marketData.length > 0 ? (
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart
                      data={marketData.map((data) => ({
                        symbol: data.symbol,
                        price: data.price,
                        open: data.open || data.price * 0.99,
                        high: data.high || data.price * 1.01,
                        low: data.low || data.price * 0.98,
                      }))}
                      margin={{
                        top: 5,
                        right: 30,
                        left: 20,
                        bottom: 5,
                      }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="symbol" />
                      <YAxis domain={["auto", "auto"]} />
                      <Tooltip
                        formatter={(value) => [`$${Number(value).toFixed(2)}`, "Price"]}
                        labelFormatter={(label) => `Symbol: ${label}`}
                      />
                      <Legend />
                      <Line
                        type="monotone"
                        dataKey="price"
                        stroke="hsl(var(--primary))"
                        activeDot={{ r: 8 }}
                        name="Current Price"
                        strokeWidth={2}
                      />
                      <Line
                        type="monotone"
                        dataKey="open"
                        stroke="#8884d8"
                        name="Open Price"
                        strokeDasharray="5 5"
                        strokeWidth={1}
                      />
                      <Line
                        type="monotone"
                        dataKey="high"
                        stroke="#82ca9d"
                        name="High"
                        strokeDasharray="3 3"
                        strokeWidth={1}
                      />
                      <Line
                        type="monotone"
                        dataKey="low"
                        stroke="#ff7300"
                        name="Low"
                        strokeDasharray="3 3"
                        strokeWidth={1}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              ) : (
                <div className="text-center py-10 text-muted-foreground">No market data available</div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

