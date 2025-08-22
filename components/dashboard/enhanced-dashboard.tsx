"use client"

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Button } from '@/components/ui/button'
import { 
  Wallet, LineChart, RefreshCw, Activity, DollarSign, 
  TrendingUp, TrendingDown, BarChart2, PieChart, ArrowRight,
  Settings, AlertTriangle 
} from 'lucide-react'
import { useToast } from '@/components/ui/use-toast'
import { useAuth } from '@/providers/auth-provider'
import { MarketDataService } from '@/services/market-data'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'

// Mock data for demonstration
import { mockPortfolioData, mockPerformanceData, mockMarketData } from '@/lib/mock-data'

// Define props interface
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
  const [orders, setOrders] = useState<any[]>([])
  const [marketData, setMarketData] = useState<any[]>([])
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date())
  const { toast } = useToast()
  const { isDemoMode } = useAuth()
  
  // Calculate summary metrics
  const totalBots = portfolio?.bots?.length || 0
  const activeBots = portfolio?.bots?.filter((bot: any) => bot.status === 'active').length || 0
  const pausedBots = portfolio?.bots?.filter((bot: any) => bot.status === 'paused').length || 0
  const errorBots = portfolio?.bots?.filter((bot: any) => bot.status === 'error').length || 0
  
  const totalPnL = portfolio?.performance?.totalPnL || 0
  const avgPnlPercentage = portfolio?.performance?.avgPnlPercentage || 0
  
  const loadDashboardData = async () => {
    setIsLoading(true)
    
    try {
      // In a real implementation, this would fetch actual data from the API
      // For now, we'll simulate a delay and use mock data
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      if (isDemoMode || !apiConfig) {
        // Use mock data in demo mode
        setPortfolio({
          value: 125350.75,
          bots: [
            { id: 1, name: 'Mean Reversion Bot', status: 'active', assets: ['AAPL', 'MSFT'], updatedAt: new Date() },
            { id: 2, name: 'Trend Following Bot', status: 'active', assets: ['TSLA', 'AMZN'], updatedAt: new Date() },
            { id: 3, name: 'Grid Trading Bot', status: 'paused', assets: ['BTC/USD', 'ETH/USD'], updatedAt: new Date() },
            { id: 4, name: 'MA Crossover Bot', status: 'error', assets: ['GOOGL'], updatedAt: new Date() },
          ],
          positions: [
            { symbol: 'AAPL', quantity: 10, avgPrice: 180.25, currentPrice: 190.50, pnl: 102.50 },
            { symbol: 'MSFT', quantity: 5, avgPrice: 330.10, currentPrice: 345.75, pnl: 78.25 },
            { symbol: 'TSLA', quantity: 3, avgPrice: 240.50, currentPrice: 225.30, pnl: -45.60 },
          ],
          performance: {
            totalPnL: 15350.75,
            avgPnlPercentage: 12.25,
          }
        })
        
        setOrders([
          { id: 1, symbol: 'AAPL', side: 'buy', type: 'market', quantity: 5, status: 'filled', createdAt: new Date() },
          { id: 2, symbol: 'MSFT', side: 'sell', type: 'limit', quantity: 2, status: 'open', createdAt: new Date() },
          { id: 3, symbol: 'TSLA', side: 'buy', type: 'market', quantity: 1, status: 'filled', createdAt: new Date() },
        ])
        
        setMarketData([
          { symbol: 'AAPL', price: 190.50, changePercent: 1.25, volume: 45000000, open: 188.75, high: 191.20, low: 188.50 },
          { symbol: 'MSFT', price: 345.75, changePercent: 0.85, volume: 32000000, open: 343.20, high: 347.50, low: 342.90 },
          { symbol: 'GOOGL', price: 142.30, changePercent: -0.45, volume: 28000000, open: 143.10, high: 143.75, low: 141.90 },
          { symbol: 'AMZN', price: 178.75, changePercent: 2.10, volume: 38000000, open: 175.20, high: 179.30, low: 174.80 },
          { symbol: 'TSLA', price: 225.30, changePercent: -1.20, volume: 52000000, open: 228.40, high: 229.50, low: 224.10 },
        ])
      } else {
        // In a real implementation, this would use the MarketDataService to fetch real data
        // For this example, we'll still use mock data
        setPortfolio(mockPortfolioData)
        setOrders(mockPortfolioData.orders)
        setMarketData(mockMarketData)
      }
      
      setLastUpdated(new Date())
      
      toast({
        title: "Dashboard Updated",
        description: "Latest market data and portfolio information loaded.",
      })
    } catch (error) {
      console.error("Error loading dashboard data:", error)
      toast({
        title: "Update Failed",
        description: "Failed to update dashboard data. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }
  
  // Load data on initial render
  useEffect(() => {
    loadDashboardData()
    // In a real implementation, you might want to set up polling or WebSocket connections here
    const intervalId = setInterval(loadDashboardData, 60000) // Update every minute
    
    return () => clearInterval(intervalId)
  }, [apiConfig, isDemoMode])
  
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Trading Dashboard</h1>
        <div className="flex items-center space-x-2">
          <p className="text-sm text-muted-foreground">
            Last updated: {lastUpdated.toLocaleTimeString()}
          </p>
          <Button variant="outline" size="sm" onClick={loadDashboardData} disabled={isLoading}>
            {isLoading ? (
              <>
                <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                Updating...
              </>
            ) : (
              <>
                <RefreshCw className="mr-2 h-4 w-4" />
                Refresh
              </>
            )}
          </Button>
        </div>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>API Configuration Status</CardTitle>
          <CardDescription>
            {isDemoMode 
              ? "You're in demo mode. All data is simulated." 
              : apiConfig 
                ? "Connected to Alpaca Markets API" 
                : "API not configured. Set up your credentials to access live data."}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row justify-between gap-4">
            <div className="space-y-2">
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
                <Badge className="outline">
                  {isDemoMode ? "Demo Mode" : apiConfig?.isPaper ? "Paper Trading" : "Live Trading"}
                </Badge>
              </div>
              <div className="flex justify-between">
                <span className="text-sm font-medium">Data Source:</span>
                <Badge className="outline bg-green-50 text-green-700 border-green-200">
                  {isDemoMode ? "Simulated Data" : "Alpaca Markets + Yahoo Finance"}
                </Badge>
              </div>
            </div>
            
            {!isDemoMode && (
              <Button
                variant="outline"
                size="sm"
                className="text-xs"
                onClick={() => {
                  // This would trigger the API settings modal in a real implementation
                  toast({
                    title: "API Settings",
                    description: "API settings modal would open here",
                  })
                }}
              >
                <Settings className="h-3.5 w-3.5 mr-2" />
                Update API Settings
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
      
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="portfolio">Portfolio</TabsTrigger>
          <TabsTrigger value="bots">Bots</TabsTrigger>
          <TabsTrigger value="market">Market Data</TabsTrigger>
        </TabsList>
        
        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Bot Status</CardTitle>
                <Activity className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <Skeleton className="h-8 w-full" />
                ) : (
                  <>
                    <div className="text-2xl font-bold">{totalBots}</div>
                    <div className="flex flex-wrap gap-2 mt-2">
                      <Badge className="secondary bg-green-100 text-green-800 hover:bg-green-200">
                        {activeBots} active
                      </Badge>
                      <Badge className="secondary bg-gray-100 text-gray-800 hover:bg-gray-200">
                        {pausedBots} paused
                      </Badge>
                      {errorBots > 0 && (
                        <Badge className="secondary bg-red-100 text-red-800 hover:bg-red-200">
                          {errorBots} error
                        </Badge>
                      )}
                    </div>
                  </>
                )}
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total P&L</CardTitle>
                <DollarSign className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <Skeleton className="h-8 w-full" />
                ) : (
                  <>
                    <div className="text-2xl font-bold">${totalPnL.toFixed(2)}</div>
                    <p className="text-xs text-muted-foreground flex items-center mt-1">
                      {avgPnlPercentage > 0 ? (
                        <>
                          <TrendingUp className="h-3 w-3 text-green-500 mr-1" />
                          <span className="text-green-500">+{avgPnlPercentage.toFixed(2)}% avg return</span>
                        </>
                      ) : (
                        <>
                          <TrendingDown className="h-3 w-3 text-red-500 mr-1" />
                          <span className="text-red-500">{avgPnlPercentage.toFixed(2)}% avg return</span>
                        </>
                      )}
                    </p>
                  </>
                )}
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Portfolio Value</CardTitle>
                <Wallet className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <Skeleton className="h-8 w-full" />
                ) : (
                  <>
                    <div className="text-2xl font-bold">${portfolio?.value.toFixed(2) || "0.00"}</div>
                    <p className="text-xs text-muted-foreground mt-1">
                      {portfolio?.positions?.length || 0} active positions
                    </p>
                  </>
                )}
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Market Sentiment</CardTitle>
                <LineChart className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <Skeleton className="h-8 w-full" />
                ) : (
                  <>
                    <div className="text-2xl font-bold">Neutral</div>
                    <div className="w-full bg-muted h-2 rounded-full mt-2">
                      <div className="bg-amber-500 h-2 rounded-full w-1/2"></div>
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">50/100 Fear & Greed Index</p>
                  </>
                )}
              </CardContent>
            </Card>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="md:col-span-2">
              <CardHeader>
                <CardTitle>Portfolio Performance</CardTitle>
                <CardDescription>30-day performance history</CardDescription>
              </CardHeader>
              <CardContent className="h-80">
                {isLoading ? (
                  <Skeleton className="h-full w-full" />
                ) : (
                  <div className="h-full flex items-center justify-center bg-muted rounded-md">
                    <p className="text-muted-foreground">Performance chart will render here</p>
                  </div>
                )}
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Recent Activity</CardTitle>
                <CardDescription>Latest bot actions and trades</CardDescription>
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <div className="space-y-4">
                    {[1, 2, 3, 4].map((i) => (
                      <div key={i} className="flex items-start space-x-3">
                        <Skeleton className="h-8 w-8 rounded-full" />
                        <div className="space-y-2">
                          <Skeleton className="h-4 w-48" />
                          <Skeleton className="h-3 w-32" />
                        </div>
                      </div>
                    ))}
                  </div>
                ) : portfolio?.bots?.length > 0 ? (
                  <div className="space-y-4">
                    {portfolio.bots.slice(0, 4).map((bot: any) => (
                      <div key={bot.id} className="flex items-start space-x-3">
                        <div
                          className={`mt-0.5 rounded-full p-1.5 ${
                            bot.status === "active"
                              ? "bg-green-500/20 text-green-500"
                              : bot.status === "error"
                                ? "bg-red-500/20 text-red-500"
                                : "bg-gray-500/20 text-gray-500"
                          }`}
                        >
                          {bot.status === "active" ? (
                            <Activity className="h-4 w-4" />
                          ) : bot.status === "error" ? (
                            <AlertTriangle className="h-4 w-4" />
                          ) : (
                            <RefreshCw className="h-4 w-4" />
                          )}
                        </div>
                        <div className="space-y-1">
                          <p className="text-sm font-medium">{bot.name}</p>
                          <p className="text-xs text-muted-foreground">
                            Last updated: {new Date(bot.updatedAt).toLocaleString()}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground py-8 text-center">No bot activity to display</p>
                )}
              </CardContent>
              {portfolio?.bots?.length > 0 && (
                <CardFooter>
                  <Button variant="outline" size="sm" className="w-full">
                    View All Activity <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </CardFooter>
              )}
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="portfolio" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Positions</CardTitle>
              <CardDescription>Current portfolio holdings</CardDescription>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="space-y-4">
                  {[1, 2, 3].map((i) => (
                    <Skeleton key={i} className="h-12 w-full" />
                  ))}
                </div>
              ) : portfolio?.positions?.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left py-2 px-4 font-medium">Symbol</th>
                        <th className="text-left py-2 px-4 font-medium">Quantity</th>
                        <th className="text-left py-2 px-4 font-medium">Avg Price</th>
                        <th className="text-left py-2 px-4 font-medium">Current Price</th>
                        <th className="text-right py-2 px-4 font-medium">P&L</th>
                      </tr>
                    </thead>
                    <tbody>
                      {portfolio.positions.map((position: any) => (
                        <tr key={position.symbol} className="border-b">
                          <td className="py-2 px-4">{position.symbol}</td>
                          <td className="py-2 px-4">{position.quantity}</td>
                          <td className="py-2 px-4">${position.avgPrice.toFixed(2)}</td>
                          <td className="py-2 px-4">${position.currentPrice.toFixed(2)}</td>
                          <td className={`py-2 px-4 text-right ${position.pnl >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                            {position.pnl >= 0 ? '+' : ''}${position.pnl.toFixed(2)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <p className="text-sm text-muted-foreground py-8 text-center">No positions to display</p>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="bots" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Trading Bots</CardTitle>
              <CardDescription>Manage your automated trading bots</CardDescription>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="space-y-4">
                  {[1, 2, 3].map((i) => (
                    <Skeleton key={i} className="h-20 w-full" />
                  ))}
                </div>
              ) : portfolio?.bots?.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left py-2 px-4 font-medium">Name</th>
                        <th className="text-left py-2 px-4 font-medium">Status</th>
                        <th className="text-left py-2 px-4 font-medium">Assets</th>
                        <th className="text-right py-2 px-4 font-medium">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {portfolio.bots.map((bot: any) => (
                        <tr key={bot.id} className="border-b">
                          <td className="py-3 px-4 font-medium">{bot.name}</td>
                          <td className="py-3 px-4">
                            <Badge className={
                              bot.status === 'active' ? 'default' : 
                              bot.status === 'paused' ? 'secondary' : 'destructive'
                            }>
                              {bot.status.charAt(0).toUpperCase() + bot.status.slice(1)}
                            </Badge>
                          </td>
                          <td className="py-3 px-4">{bot.assets.join(', ')}</td>
                          <td className="py-3 px-4 text-right">
                            <Button variant="outline" size="sm" className="mr-2">Edit</Button>
                            <Button size="sm">{bot.status === 'active' ? 'Pause' : 'Activate'}</Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="text-center py-8">
                  <p className="text-muted-foreground mb-4">No trading bots configured</p>
                  <Button>Create New Bot</Button>
                </div>
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
              {isLoading ? (
                <div className="space-y-4">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <Skeleton key={i} className="h-12 w-full" />
                  ))}
                </div>
              ) : marketData.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left py-2 px-4 font-medium">Symbol</th>
                        <th className="text-left py-2 px-4 font-medium">Price</th>
                        <th className="text-left py-2 px-4 font-medium">Change</th>
                        <th className="text-left py-2 px-4 font-medium">Volume</th>
                        <th className="text-left py-2 px-4 font-medium">Open</th>
                        <th className="text-left py-2 px-4 font-medium">High</th>
                        <th className="text-left py-2 px-4 font-medium">Low</th>
                      </tr>
                    </thead>
                    <tbody>
                      {marketData.map((data: any) => (
                        <tr key={data.symbol} className="border-b">
                          <td className="py-3 px-4 font-medium">{data.symbol}</td>
                          <td className="py-3 px-4">${data.price.toFixed(2)}</td>
                          <td className={`py-3 px-4 ${data.changePercent > 0 ? 'text-green-500' : 'text-red-500'}`}>
                            {data.changePercent > 0 ? '+' : ''}{data.changePercent.toFixed(2)}%
                          </td>
                          <td className="py-3 px-4">{data.volume.toLocaleString()}</td>
                          <td className="py-3 px-4">${data.open.toFixed(2)}</td>
                          <td className="py-3 px-4">${data.high.toFixed(2)}</td>
                          <td className="py-3 px-4">${data.low.toFixed(2)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <p className="text-sm text-muted-foreground py-8 text-center">No market data available</p>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
