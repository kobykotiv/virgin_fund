"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import {
  Activity,
  AlertTriangle,
  ArrowDown,
  ArrowUp,
  Clock,
  DollarSign,
  Settings,
} from "lucide-react"

interface BotViewProps {
  bot: any // We'll properly type this later
}

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

export function SimpleView({ bot }: BotViewProps) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "text-green-500"
      case "paused":
        return "text-yellow-500"
      case "error":
        return "text-red-500"
      default:
        return "text-gray-500"
    }
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{bot.name}</CardTitle>
        <Activity className={`h-4 w-4 ${getStatusColor(bot.status)}`} />
      </CardHeader>
      <CardContent>
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm text-muted-foreground">Today's P&L</span>
          <span
            className={`font-medium ${
              bot.performance?.dailyPnL >= 0
                ? "text-green-500"
                : "text-red-500"
            }`}
          >
            {formatCurrency(bot.performance?.dailyPnL || 0)}
          </span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-sm text-muted-foreground">Win Rate</span>
          <span className="font-medium">
            {((bot.performance?.winRate || 0) * 100).toFixed(1)}%
          </span>
        </div>
      </CardContent>
    </Card>
  )
}

export function AdvancedView({ bot }: BotViewProps) {
  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-sm font-medium">{bot.name}</CardTitle>
            <p className="text-xs text-muted-foreground mt-1">
              {bot.strategy.type}
            </p>
          </div>
          <Badge
            variant={bot.status === "active" ? "default" : "secondary"}
            className="capitalize"
          >
            {bot.status}
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div>
            <div className="flex justify-between items-baseline mb-1">
              <span className="text-sm text-muted-foreground">Performance</span>
              <span
                className={`text-sm font-medium ${
                  bot.performance?.totalPnL >= 0
                    ? "text-green-500"
                    : "text-red-500"
                }`}
              >
                {formatCurrency(bot.performance?.totalPnL || 0)}
              </span>
            </div>
            <Progress
              value={bot.performance?.successRate * 100 || 0}
              className="h-1"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-xs text-muted-foreground">Win Rate</p>
              <p className="text-sm font-medium">
                {((bot.performance?.winRate || 0) * 100).toFixed(1)}%
              </p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Trades</p>
              <p className="text-sm font-medium">
                {bot.performance?.totalTrades || 0}
              </p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Avg. Return</p>
              <p className="text-sm font-medium">
                {formatPercentage(bot.performance?.avgReturn || 0)}
              </p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Last Trade</p>
              <p className="text-sm font-medium">
                {bot.lastTrade
                  ? new Date(bot.lastTrade).toLocaleDateString()
                  : "N/A"}
              </p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

export function ExpertView({ bot }: BotViewProps) {
  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-sm font-medium">{bot.name}</CardTitle>
            <div className="flex items-center gap-2 mt-1">
              <Badge variant="outline" className="text-xs">
                {bot.strategy.type}
              </Badge>
              <Badge
                variant={bot.status === "active" ? "default" : "secondary"}
                className="text-xs capitalize"
              >
                {bot.status}
              </Badge>
            </div>
          </div>
          {bot.status === "error" && (
            <AlertTriangle className="h-4 w-4 text-red-500" />
          )}
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <div className="flex items-center text-sm text-muted-foreground">
                <DollarSign className="h-4 w-4 mr-1" />
                Daily P&L
              </div>
              <p
                className={`text-lg font-medium ${
                  bot.performance?.dailyPnL >= 0
                    ? "text-green-500"
                    : "text-red-500"
                }`}
              >
                {formatCurrency(bot.performance?.dailyPnL || 0)}
                <span className="text-xs ml-1">
                  ({formatPercentage(bot.performance?.dailyReturn || 0)})
                </span>
              </p>
            </div>
            <div className="space-y-2">
              <div className="flex items-center text-sm text-muted-foreground">
                <Activity className="h-4 w-4 mr-1" />
                Total P&L
              </div>
              <p
                className={`text-lg font-medium ${
                  bot.performance?.totalPnL >= 0
                    ? "text-green-500"
                    : "text-red-500"
                }`}
              >
                {formatCurrency(bot.performance?.totalPnL || 0)}
              </p>
            </div>
          </div>

          <div>
            <div className="flex justify-between items-baseline mb-1">
              <span className="text-sm text-muted-foreground">Success Rate</span>
              <span className="text-sm font-medium">
                {((bot.performance?.successRate || 0) * 100).toFixed(1)}%
              </span>
            </div>
            <Progress
              value={bot.performance?.successRate * 100 || 0}
              className="h-1"
            />
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div>
              <p className="text-xs text-muted-foreground">Win Rate</p>
              <p className="text-sm font-medium">
                {((bot.performance?.winRate || 0) * 100).toFixed(1)}%
              </p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Total Trades</p>
              <p className="text-sm font-medium">
                {bot.performance?.totalTrades || 0}
              </p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Avg. Return</p>
              <p className="text-sm font-medium">
                {formatPercentage(bot.performance?.avgReturn || 0)}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-xs text-muted-foreground">Assets</p>
              <div className="flex flex-wrap gap-1 mt-1">
                {bot.assets?.map((asset: string) => (
                  <Badge key={asset} variant="outline" className="text-xs">
                    {asset}
                  </Badge>
                ))}
              </div>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Last Activity</p>
              <div className="flex items-center mt-1">
                <Clock className="h-3 w-3 mr-1 text-muted-foreground" />
                <span className="text-xs">
                  {bot.lastActivity
                    ? new Date(bot.lastActivity).toLocaleString()
                    : "N/A"}
                </span>
              </div>
            </div>
          </div>

          {bot.status === "error" && (
            <div className="mt-2 p-2 bg-red-50 text-red-700 rounded text-xs">
              {bot.errorMessage || "An error occurred with this bot"}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
