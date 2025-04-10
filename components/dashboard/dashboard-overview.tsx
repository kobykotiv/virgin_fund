"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { PerformanceChart } from "@/components/performance-chart"
import { PortfolioAllocation } from "@/components/portfolio-allocation"
import { LiveTicker } from "@/components/live-ticker"
import { NewsWidget } from "@/components/news-widget"
import { FearGreedWidget } from "@/components/fear-greed-widget"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { RefreshCw, ArrowUp, ArrowDown } from "lucide-react"

interface DashboardOverviewProps {
  portfolio: any
  isLoading: boolean
  onRefresh: () => void
}

export default function DashboardOverview({ portfolio, isLoading, onRefresh }: DashboardOverviewProps) {
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(value)
  }

  const formatPercentage = (value: number) => {
    return `${value > 0 ? "+" : ""}${value.toFixed(2)}%`
  }

  const getPerformanceColor = (value: number) => {
    return value >= 0 ? "text-green-500" : "text-red-500"
  }

  return (
    <div className="flex flex-col space-y-4">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Portfolio Value</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(portfolio?.totalValue || 0)}</div>
            <p className="text-xs text-muted-foreground flex items-center">
              {portfolio?.dailyChange >= 0 ? (
                <ArrowUp className="h-4 w-4 text-green-500 mr-1" />
              ) : (
                <ArrowDown className="h-4 w-4 text-red-500 mr-1" />
              )}
              <span className={getPerformanceColor(portfolio?.dailyChange || 0)}>
                {formatPercentage(portfolio?.dailyChange || 0)} today
              </span>
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Positions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{portfolio?.positions?.length || 0}</div>
            <p className="text-xs text-muted-foreground">
              {portfolio?.longPositions || 0} long, {portfolio?.shortPositions || 0} short
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total P&L</CardTitle>
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${getPerformanceColor(portfolio?.totalPnL || 0)}`}>
              {formatCurrency(portfolio?.totalPnL || 0)}
            </div>
            <p className="text-xs text-muted-foreground">
              {formatPercentage(portfolio?.totalPnLPercent || 0)} all time
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Win Rate</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatPercentage(portfolio?.winRate || 0)}</div>
            <p className="text-xs text-muted-foreground">
              {portfolio?.totalTrades || 0} total trades
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-4">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Performance Overview</CardTitle>
              <Button variant="outline" size="sm" onClick={onRefresh} disabled={isLoading}>
                <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? "animate-spin" : ""}`} />
                {isLoading ? "Updating..." : "Refresh"}
              </Button>
            </div>
          </CardHeader>
          <CardContent className="pl-2">
            <PerformanceChart data={portfolio?.performanceHistory} />
          </CardContent>
        </Card>

        <Card className="col-span-3">
          <CardHeader>
            <CardTitle>Portfolio Allocation</CardTitle>
          </CardHeader>
          <CardContent>
            <PortfolioAllocation data={portfolio?.positions} />
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-4">
          <CardHeader>
            <CardTitle>Market Overview</CardTitle>
          </CardHeader>
          <CardContent>
            <LiveTicker 
              symbols={portfolio?.positions?.map((p: any) => p.symbol) || []}
              refreshInterval={15000}
            />
          </CardContent>
        </Card>

        <Card className="col-span-3">
          <CardHeader>
            <CardTitle>Market Sentiment</CardTitle>
          </CardHeader>
          <CardContent>
            <FearGreedWidget />
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-1">
        <Card>
          <CardHeader>
            <CardTitle>Latest News</CardTitle>
            <CardDescription>Market news that might impact your trading</CardDescription>
          </CardHeader>
          <CardContent>
            <NewsWidget limit={5} />
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

