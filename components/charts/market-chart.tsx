"use client"

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Loader2 } from 'lucide-react'
import { MarketDataBar } from '@/types/market'
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  Legend,
  CandlestickChart,
  Candlestick
} from 'recharts'

interface MarketChartProps {
  symbol: string
  apiKey?: string
  secretKey?: string
  isPaper?: boolean
  isDemoMode?: boolean
}

export function MarketChart({ symbol, apiKey, secretKey, isPaper = true, isDemoMode = false }: MarketChartProps) {
  const [data, setData] = useState<MarketDataBar[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [timeframe, setTimeframe] = useState('1D')
  const [chartType, setChartType] = useState('area')
  const [period, setPeriod] = useState('1M')
  
  const fetchMarketData = async () => {
    if (!symbol) return
    
    setIsLoading(true)
    
    try {
      // Calculate date range based on period
      const endDate = new Date()
      const startDate = new Date()
      
      switch (period) {
        case '1W':
          startDate.setDate(endDate.getDate() - 7)
          break
        case '1M':
          startDate.setMonth(endDate.getMonth() - 1)
          break
        case '3M':
          startDate.setMonth(endDate.getMonth() - 3)
          break
        case '6M':
          startDate.setMonth(endDate.getMonth() - 6)
          break
        case '1Y':
          startDate.setFullYear(endDate.getFullYear() - 1)
          break
        case 'YTD':
          startDate.setMonth(0)
          startDate.setDate(1)
          break
        default:
          startDate.setMonth(endDate.getMonth() - 1)
      }
      
      // Format dates for API
      const startDateStr = startDate.toISOString().split('T')[0]
      const endDateStr = endDate.toISOString().split('T')[0]
      
      if (isDemoMode) {
        // Generate mock data for demo mode
        const mockData = generateMockMarketData(startDate, endDate, timeframe)
        setData(mockData)
      } else {
        // Fetch real data from API
        const response = await fetch(`/api/alpaca/market?symbol=${symbol}&timeframe=${timeframe}&start=${startDateStr}&end=${endDateStr}`)
        
        if (!response.ok) {
          throw new Error('Failed to fetch market data')
        }
        
        const result = await response.json()
        setData(result)
      }
    } catch (error) {
      console.error('Error fetching market data:', error)
    } finally {
      setIsLoading(false)
    }
  }
  
  // Fetch data on initial load and when parameters change
  useEffect(() => {
    fetchMarketData()
  }, [symbol, timeframe, period, isDemoMode])
  
  // Format data for chart display
  const formattedData = data.map(bar => ({
    date: new Date(bar.t).toLocaleDateString(),
    open: bar.o,
    high: bar.h,
    low: bar.l,
    close: bar.c,
    volume: bar.v
  }))
  
  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>{symbol}</CardTitle>
            <CardDescription>Market data visualization</CardDescription>
          </div>
          <div className="flex space-x-2">
            <Select value={timeframe} onValueChange={setTimeframe}>
              <SelectTrigger className="w-[100px]">
                <SelectValue placeholder="Timeframe" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1Min">1 Min</SelectItem>
                <SelectItem value="5Min">5 Min</SelectItem>
                <SelectItem value="15Min">15 Min</SelectItem>
                <SelectItem value="1H">1 Hour</SelectItem>
                <SelectItem value="1D">1 Day</SelectItem>
              </SelectContent>
            </Select>
            
            <Select value={period} onValueChange={setPeriod}>
              <SelectTrigger className="w-[100px]">
                <SelectValue placeholder="Period" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1W">1 Week</SelectItem>
                <SelectItem value="1M">1 Month</SelectItem>
                <SelectItem value="3M">3 Months</SelectItem>
                <SelectItem value="6M">6 Months</SelectItem>
                <SelectItem value="1Y">1 Year</SelectItem>
                <SelectItem value="YTD">YTD</SelectItem>
              </SelectContent>
            </Select>
            
            <Button
              variant="outline"
              size="sm"
              onClick={fetchMarketData}
              disabled={isLoading}
            >
              {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Refresh'}
            </Button>
          </div>
        </div>
      </CardHeader>
      
      <CardContent>
        <Tabs value={chartType} onValueChange={setChartType}>
          <TabsList className="mb-4">
            <TabsTrigger value="area">Area</TabsTrigger>
            <TabsTrigger value="candle">Candlestick</TabsTrigger>
            <TabsTrigger value="bar">Volume</TabsTrigger>
          </TabsList>
          
          <TabsContent value="area" className="h-[400px]">
            {isLoading ? (
              <div className="h-full flex items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
              </div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={formattedData}>
                  <defs>
                    <linearGradient id="colorPrice" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.8} />
                      <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="date" />
                  <YAxis domain={['auto', 'auto']} />
                  <CartesianGrid strokeDasharray="3 3" />
                  <Tooltip />
                  <Area
                    type="monotone"
                    dataKey="close"
                    stroke="hsl(var(--primary))"
                    fillOpacity={1}
                    fill="url(#colorPrice)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            )}
          </TabsContent>
          
          <TabsContent value="candle" className="h-[400px]">
            {isLoading ? (
              <div className="h-full flex items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
              </div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <CandlestickChart data={formattedData}>
                  <XAxis dataKey="date" />
                  <YAxis domain={['auto', 'auto']} />
                  <CartesianGrid strokeDasharray="3 3" />
                  <Tooltip />
                  <Candlestick
                    yAccessor={d => [d.open, d.high, d.low, d.close]}
                    fill="hsl(var(--primary))"
                    stroke="hsl(var(--primary))"
                  />
                </CandlestickChart>
              </ResponsiveContainer>
            )}
          </TabsContent>
          
          <TabsContent value="bar" className="h-[400px]">
            {isLoading ? (
              <div className="h-full flex items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
              </div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={formattedData}>
                  <XAxis dataKey="date" />
                  <YAxis />
                  <CartesianGrid strokeDasharray="3 3" />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="volume" fill="hsl(var(--primary))" />
                </BarChart>
              </ResponsiveContainer>
            )}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}

// Helper function to generate mock market data for demo mode
function generateMockMarketData(startDate: Date, endDate: Date, timeframe: string): MarketDataBar[] {
  const data: MarketDataBar[] = []
  let currentDate = new Date(startDate)
  let price = 100 + Math.random() * 50 // Random starting price
  
  while (currentDate <= endDate) {
    // Skip weekends for daily data
    const day = currentDate.getDay()
    if (timeframe === '1D' && (day === 0 || day === 6)) {
      currentDate = new Date(currentDate.setDate(currentDate.getDate() + 1))
      continue
    }
    
    // Random daily change (-2% to +2%)
    const change = (Math.random() - 0.5) * 4
    const open = price
    const close = price * (1 + change / 100)
    const high = Math.max(open, close) * (1 + Math.random() * 0.01)
    const low = Math.min(open, close) * (1 - Math.random() * 0.01)
    const volume = Math.floor(Math.random() * 1000000) + 500000
    
    data.push({
      t: currentDate.toISOString(),
      o: open,
      h: high,
      l: low,
      c: close,
      v: volume
    })
    
    price = close
    
    // Increment date based on timeframe
    switch (timeframe) {
      case '1Min':
        currentDate = new Date(currentDate.setMinutes(currentDate.getMinutes() + 1))
        break
      case '5Min':
        currentDate = new Date(currentDate.setMinutes(currentDate.getMinutes() + 5))
        break
      case '15Min':
        currentDate = new Date(currentDate.setMinutes(currentDate.getMinutes() + 15))
        break
      case '1H':
        currentDate = new Date(currentDate.setHours(currentDate.getHours() + 1))
        break
      case '1D':
      default:
        currentDate = new Date(currentDate.setDate(currentDate.getDate() + 1))
    }
  }
  
  return data
}
