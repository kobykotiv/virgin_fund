"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ArrowDown, ArrowUp, Clock, DollarSign, Percent } from "lucide-react"
import { Bot } from "@/types/bot"

interface BotPerformanceProps {
  bot: Bot
  onTimeframeChange?: (timeframe: string) => void
}

export function BotPerformance({ bot, onTimeframeChange }: BotPerformanceProps) {
  const [timeframe, setTimeframe] = useState("24h")
  const [chart, setChart] = useState("price")

  const handleTimeframeChange = (value: string) => {
    setTimeframe(value)
    onTimeframeChange?.(value)
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">{bot.name}</h2>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Badge variant="outline">
              {bot.type.charAt(0).toUpperCase() + bot.type.slice(1)}
            </Badge>
            <span>•</span>
            <span>{bot.assets.join(", ")}</span>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Select value={timeframe} onValueChange={handleTimeframeChange}>
            <SelectTrigger className="w-[120px]">
              <SelectValue placeholder="Timeframe" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="1h">1 Hour</SelectItem>
              <SelectItem value="24h">24 Hours</SelectItem>
              <SelectItem value="7d">7 Days</SelectItem>
              <SelectItem value="30d">30 Days</SelectItem>
              <SelectItem value="all">All Time</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total PNL</p>
                <h3 className={`text-2xl font-bold ${
                  bot.performance?.pnlTotal >= 0 ? "text-green-500" : "text-red-500"
                }`}>
                  ${Math.abs(bot.performance?.pnlTotal || 0).toFixed(2)}
                </h3>
              </div>
              <Badge variant={bot.performance?.pnlTotal >= 0 ? "default" : "destructive"}>
                {bot.performance?.pnlTotal >= 0 ? <ArrowUp className="h-3 w-3" /> : <ArrowDown className="h-3 w-3" />}
                {Math.abs(bot.performance?.pnlPercentage || 0).toFixed(2)}%
              </Badge>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Trades</p>
                <h3 className="text-2xl font-bold">{bot.performance?.totalTrades || 0}</h3>
              </div>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Win Rate</p>
                <h3 className="text-2xl font-bold">
                  {((bot.performance?.winRate || 0) * 100).toFixed(1)}%
                </h3>
              </div>
              <Percent className="h-4 w-4 text-muted-foreground" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Volume</p>
                <h3 className="text-2xl font-bold">
                  ${(bot.performance?.totalVolume || 0).toFixed(2)}
                </h3>
              </div>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Performance Chart</CardTitle>
              <CardDescription>Visual representation of bot performance</CardDescription>
            </div>
            <Tabs value={chart} onValueChange={setChart} className="w-[400px]">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="price">Price</TabsTrigger>
                <TabsTrigger value="pnl">PNL</TabsTrigger>
                <TabsTrigger value="trades">Trades</TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
        </CardHeader>
        <CardContent>
          <div className="h-[400px] flex items-center justify-center text-muted-foreground">
            {/* Placeholder for chart component */}
            Chart visualization will be implemented here
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-2 gap-4">
        <Card>
          <CardHeader>
            <CardTitle>Recent Trades</CardTitle>
            <CardDescription>Latest trading activity</CardDescription>
          </CardHeader>
          <CardContent>
            {bot.trades?.length > 0 ? (
              <div className="space-y-4">
                {bot.trades.map((trade) => (
                  <div key={trade.id} className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">{trade.symbol}</p>
                      <p className="text-sm text-muted-foreground">
                        {new Date(trade.timestamp).toLocaleString()}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className={`font-medium ${
                        trade.pnl >= 0 ? "text-green-500" : "text-red-500"
                      }`}>
                        {trade.pnl >= 0 ? "+" : "-"}${Math.abs(trade.pnl).toFixed(2)}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {trade.type} • {trade.quantity} @ ${trade.price}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center text-muted-foreground">
                <p>No trades yet</p>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Statistics</CardTitle>
            <CardDescription>Detailed performance metrics</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Best Trade</p>
                <p className="text-lg font-bold text-green-500">
                  +${(bot.performance?.bestTrade || 0).toFixed(2)}
                </p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Worst Trade</p>
                <p className="text-lg font-bold text-red-500">
                  -${Math.abs(bot.performance?.worstTrade || 0).toFixed(2)}
                </p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Avg. Trade Duration</p>
                <p className="text-lg font-bold">
                  {bot.performance?.avgTradeDuration || "N/A"}
                </p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Success Rate</p>
                <p className="text-lg font-bold">
                  {((bot.performance?.successRate || 0) * 100).toFixed(1)}%
                </p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Max Drawdown</p>
                <p className="text-lg font-bold text-red-500">
                  {(bot.performance?.maxDrawdown || 0).toFixed(2)}%
                </p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Sharpe Ratio</p>
                <p className="text-lg font-bold">
                  {(bot.performance?.sharpeRatio || 0).toFixed(2)}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}