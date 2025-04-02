"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { PerformanceChart } from "@/components/performance-chart"
import { PortfolioAllocation } from "@/components/portfolio-allocation"
import { LiveTicker } from "@/components/live-ticker"
import { NewsWidget } from "@/components/news-widget"
import { FearGreedWidget } from "@/components/fear-greed-widget"
import { ArrowUpRight } from "lucide-react"
import { Badge } from "@/components/ui/badge"

export default function DashboardOverview() {
  return (
    <div className="flex flex-col space-y-4">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Portfolio Value</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold animate-in slide-in-from-bottom duration-500">$4,523,189.42</div>
            <p className="text-xs text-muted-foreground flex items-center">
              <ArrowUpRight className="h-4 w-4 text-green-500 mr-1" />
              <span>+32.8% from last month</span>
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Trading Bots</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">127</div>
            <p className="text-xs text-muted-foreground">98% win rate across all strategies</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Profit</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-500">+$892,234.56</div>
            <p className="text-xs text-muted-foreground">+47.2% annualized return</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Success Metrics</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">96.8%</div>
            <p className="text-xs text-muted-foreground">Sharpe Ratio: 3.45</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-4">
          <CardHeader>
            <CardTitle>Performance Analytics</CardTitle>
          </CardHeader>
          <CardContent className="pl-2">
            <PerformanceChart />
            <div className="mt-4 grid grid-cols-3 gap-4 text-sm">
              <div className="bg-green-50 dark:bg-green-900/20 p-2 rounded-lg">
                <p className="text-xs text-muted-foreground">Alpha</p>
                <p className="font-bold">+12.4%</p>
              </div>
              <div className="bg-blue-50 dark:bg-blue-900/20 p-2 rounded-lg">
                <p className="text-xs text-muted-foreground">Beta</p>
                <p className="font-bold">0.82</p>
              </div>
              <div className="bg-purple-50 dark:bg-purple-900/20 p-2 rounded-lg">
                <p className="text-xs text-muted-foreground">Max Drawdown</p>
                <p className="font-bold text-green-600">-3.2%</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="col-span-3">
          <CardHeader>
            <CardTitle>Portfolio Diversification</CardTitle>
          </CardHeader>
          <CardContent>
            <PortfolioAllocation />
            <div className="mt-4 grid grid-cols-2 gap-4 text-sm">
              <div className="border rounded-lg p-2">
                <p className="text-xs text-muted-foreground">Risk Score</p>
                <p className="font-bold text-amber-600">Moderate</p>
              </div>
              <div className="border rounded-lg p-2">
                <p className="text-xs text-muted-foreground">Optimization</p>
                <p className="font-bold text-green-600">98.5%</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card className="col-span-2">
          <CardHeader>
            <CardTitle>Market Overview</CardTitle>
          </CardHeader>
          <CardContent>
            <LiveTicker 
              symbols={["BTC", "ETH", "SOL", "AAPL", "MSFT", "GOOGL", "TSLA"]} 
              showCharts={true} 
            />
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>AI Market Sentiment</CardTitle>
          </CardHeader>
          <CardContent>
            <FearGreedWidget />
            <div className="mt-4 space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-sm">Bull Probability</span>
                <span className="text-sm font-bold text-green-500">87%</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm">Market Trend</span>
                <Badge variant="default">Strong Buy</Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

