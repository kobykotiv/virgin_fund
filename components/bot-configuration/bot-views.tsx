import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Activity, DollarSign, TrendingUp, TrendingDown, 
  AlertTriangle, Shield, Settings2, LineChart
} from "lucide-react"

import type { Bot as ClientBot } from "@/types/bot";
import type { ComponentType } from "react";

type MaybeBot = Partial<ClientBot> & Record<string, any>;

export function SimpleView({ bot }: { bot: MaybeBot }) {
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-lg">{bot.name}</CardTitle>
        <CardDescription>{bot.type}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <div className="flex justify-between">
            <span>Status</span>
            <Badge className={bot.status === 'active' ? 'bg-green-500 text-white' : 'bg-secondary text-secondary-foreground'}>
              {bot.status}
            </Badge>
          </div>
          <div className="flex justify-between">
            <span>P&L</span>
            <span className={bot.pnl >= 0 ? 'text-green-500' : 'text-red-500'}>
              {bot.pnl >= 0 ? '+' : ''}{bot.pnl.toFixed(2)}%
            </span>
          </div>
          <div className="flex justify-between">
            <span>Trades</span>
            <span>{bot.totalTrades}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

export function AdvancedView({ bot }: { bot: MaybeBot }) {
  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-start">
          <div>
            <CardTitle>{bot.name}</CardTitle>
            <CardDescription>{bot.strategy}</CardDescription>
          </div>
          <div className="space-y-1 text-right">
            <Badge className={bot.status === 'active' ? 'bg-green-500 text-white' : 'bg-secondary text-secondary-foreground'}>
              {bot.status}
            </Badge>
            <p className="text-xs text-muted-foreground">
              Running since {new Date(bot.startDate).toLocaleDateString()}
            </p>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-3 gap-4">
          <MetricCard
            label="Win Rate"
            value={`${(bot.metrics.winRate * 100).toFixed(1)}%`}
            icon={Activity}
            trend={bot.metrics.winRate > 0.5 ? 'up' : 'down'}
          />
          <MetricCard
            label="Profit Factor"
            value={bot.metrics.profitFactor.toFixed(2)}
            icon={DollarSign}
            trend={bot.metrics.profitFactor > 1 ? 'up' : 'down'}
          />
          <MetricCard
            label="Active Trades"
            value={bot.metrics.activeTrades}
            icon={LineChart}
          />
        </div>

        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span>Capital Usage</span>
            <span>{bot.capitalUsage}%</span>
          </div>
          <Progress value={bot.capitalUsage} />
        </div>
      </CardContent>
    </Card>
  )
}

export function ExpertView({ bot }: { bot: MaybeBot }) {
  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between">
          <div>
            <CardTitle>{bot.name}</CardTitle>
            <CardDescription>Advanced Analytics</CardDescription>
          </div>
          <div className="flex items-center space-x-2">
            <Shield className={`h-5 w-5 ${bot.riskScore < 50 ? 'text-green-500' : 'text-yellow-500'}`} />
            <Badge className={bot.status === 'active' ? 'bg-green-500 text-white' : 'bg-secondary text-secondary-foreground'}>
              {bot.status}
            </Badge>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="metrics">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="metrics">Metrics</TabsTrigger>
            <TabsTrigger value="risk">Risk</TabsTrigger>
            <TabsTrigger value="trades">Trades</TabsTrigger>
          </TabsList>

          <TabsContent value="metrics" className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <MetricCard
                label="CAGR"
                value={`${bot.metrics.cagr.toFixed(2)}%`}
                icon={TrendingUp}
                trend={bot.metrics.cagr > 0 ? 'up' : 'down'}
              />
              <MetricCard
                label="Max Drawdown"
                value={`${bot.metrics.maxDrawdown.toFixed(2)}%`}
                icon={TrendingDown}
                trend="down"
              />
              <MetricCard
                label="Sharpe Ratio"
                value={bot.metrics.sharpeRatio.toFixed(2)}
                icon={Activity}
                trend={bot.metrics.sharpeRatio > 1 ? 'up' : 'down'}
              />
              <MetricCard
                label="Risk Score"
                value={`${bot.riskScore}/100`}
                icon={Shield}
                trend={bot.riskScore < 50 ? 'up' : 'down'}
              />
            </div>
          </TabsContent>

          <TabsContent value="risk" className="space-y-4">
            <div className="space-y-2">
              <div className="text-sm font-medium">Position Risk</div>
              <div className="grid grid-cols-2 gap-4">
                <div className="flex justify-between text-sm">
                  <span>Capital at Risk</span>
                  <span>{bot.riskMetrics.capitalAtRisk}%</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Leverage Used</span>
                  <span>{bot.riskMetrics.leverageUsed}x</span>
                </div>
              </div>
              <Progress 
                value={bot.riskMetrics.capitalAtRisk} 
                className="h-2"
              />
            </div>
          </TabsContent>

          <TabsContent value="trades" className="space-y-4">
            {/* Trade history table */}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}

function MetricCard({ label, value, icon: Icon, trend }: { label: string, value: string | number, icon: ComponentType<any>, trend?: 'up' | 'down' | 'neutral' }) {
  return (
    <div className="p-4 border rounded-lg space-y-2">
      <div className="flex justify-between items-center">
        <Icon className="h-4 w-4 text-muted-foreground" />
        <span className={`text-sm ${
          trend === 'up' ? 'text-green-500' : 
          trend === 'down' ? 'text-red-500' : 
          'text-muted-foreground'
        }`}>{value}</span>
      </div>
      <div className="text-sm font-medium">{label}</div>
    </div>
  )
}
