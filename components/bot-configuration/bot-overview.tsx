import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Button } from "@/components/ui/button"
import {
  Activity, Wallet, BarChart2, TrendingUp, 
  AlertTriangle, ShieldCheck, Network, Lock
} from "lucide-react"

import type { Bot as ClientBot } from "@/types/bot";
import type { ComponentType } from "react";

type MaybeBot = Partial<ClientBot> & Record<string, any>;

export function SimpleBotOverview({ bot }: { bot: MaybeBot }) {
  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-start">
          <div>
            <CardTitle>{bot.name}</CardTitle>
            <CardDescription>Simple trading bot overview</CardDescription>
          </div>
          <Badge className={bot.status === 'active' ? 'bg-green-500 text-white' : 'bg-secondary text-secondary-foreground'}>
            {bot.status}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <div className="text-sm text-muted-foreground">Total Profit/Loss</div>
            <div className={`text-2xl font-bold ${bot.pnl >= 0 ? 'text-green-500' : 'text-red-500'}`}>
              {bot.pnl >= 0 ? '+' : ''}{bot.pnl.toFixed(2)}%
            </div>
          </div>
          <div className="space-y-2">
            <div className="text-sm text-muted-foreground">Active Trades</div>
            <div className="text-2xl font-bold">{bot.activeTrades}</div>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <div className="text-sm text-muted-foreground">Portfolio Value</div>
            <div className="text-2xl font-bold">
              ${bot.portfolio.currentValue.toLocaleString()}
            </div>
          </div>
          <div className="space-y-2">
            <div className="text-sm text-muted-foreground">Daily Change</div>
            <div className={`text-2xl font-bold ${bot.portfolio.dailyChange >= 0 ? 'text-green-500' : 'text-red-500'}`}>
              {bot.portfolio.dailyChange >= 0 ? '+' : ''}{bot.portfolio.dailyChange.toFixed(2)}%
            </div>
          </div>
        </div>
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span>Cash Balance</span>
            <span>${bot.portfolio.cashBalance.toLocaleString()}</span>
          </div>
          <Progress value={(bot.portfolio.cashBalance / bot.portfolio.currentValue) * 100} />
        </div>
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span>Position Types</span>
            <span>{bot.portfolio.positions.filter(p => p.assetType === 'stock').length} Stocks, 
                  {bot.portfolio.positions.filter(p => p.assetType === 'crypto').length} Crypto</span>
          </div>
          <div className="grid grid-cols-2 gap-2">
            {bot.portfolio.positions.filter((p: any) => p.assetType !== 'basket').map((position: any) => (
              <div key={position.id} className="flex justify-between items-center text-sm">
                <Badge className="border bg-transparent text-foreground">{position.ticker}</Badge>
                <span className={position.avgPrice < position.currentPrice ? 'text-green-500' : 'text-red-500'}>
                  ${position.currentPrice.toLocaleString()}
                </span>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

export function AdvancedBotOverview({ bot }: { bot: MaybeBot }) {
  const getPositionValue = (position: Record<string, any>) => {
    if (position.assetType === 'basket') {
      return position.positions.reduce((sum: number, pos: Record<string, any>) => 
        sum + (pos.quantity * pos.currentPrice), 0)
    }
    return position.quantity * position.currentPrice
  }

  const totalValue = bot.portfolio.positions.reduce((sum: number, pos: any) => 
    sum + getPositionValue(pos), 0)

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between">
          <div>
            <CardTitle>{bot.name}</CardTitle>
            <CardDescription>Advanced trading metrics</CardDescription>
          </div>
          <div className="space-y-2 text-right">
            <Badge className={bot.status === 'active' ? 'bg-green-500 text-white' : 'bg-secondary text-secondary-foreground'}>
              {bot.status}
            </Badge>
            <div className="text-sm text-muted-foreground">
              Running since {new Date(bot.startedAt).toLocaleDateString()}
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Performance Metrics */}
        <div className="grid grid-cols-3 gap-4">
          <MetricCard
            icon={Activity}
            label="Win Rate"
            value={`${(bot.metrics.winRate * 100).toFixed(1)}%`}
            trend={bot.metrics.winRate > 0.5 ? 'up' : 'down'}
          />
          <MetricCard
            icon={Wallet}
            label="Profit Factor"
            value={bot.metrics.profitFactor.toFixed(2)}
            trend={bot.metrics.profitFactor > 1 ? 'up' : 'down'}
          />
          <MetricCard
            icon={BarChart2}
            label="Sharpe Ratio"
            value={bot.metrics.sharpeRatio.toFixed(2)}
            trend={bot.metrics.sharpeRatio > 1 ? 'up' : 'down'}
          />
        </div>

        <div className="grid grid-cols-3 gap-4">
          <MetricCard
            icon={Activity}
            label="Portfolio Return"
            value={`${(bot.portfolio.totalReturn * 100).toFixed(1)}%`}
            trend={bot.portfolio.totalReturn > 0 ? 'up' : 'down'}
          />
          <MetricCard
            icon={Wallet}
            label="Cash Allocation"
            value={`${((bot.portfolio.cashBalance / bot.portfolio.currentValue) * 100).toFixed(1)}%`}
            trend="neutral"
          />
          <MetricCard
            icon={BarChart2}
            label="Invested Amount"
            value={`$${(bot.portfolio.currentValue - bot.portfolio.cashBalance).toLocaleString()}`}
            trend="neutral"
          />
        </div>

        {/* Portfolio Allocation */}
        <div className="space-y-4">
          <div className="flex justify-between text-sm">
            <span>Portfolio Allocation</span>
            <span>
              {bot.portfolio.positions.filter(p => p.assetType === 'stock').length} Stocks, 
              {bot.portfolio.positions.filter(p => p.assetType === 'crypto').length} Crypto,
              {bot.portfolio.positions.filter(p => p.assetType === 'basket').length} Baskets
            </span>
          </div>
          <div className="grid grid-cols-2 gap-2">
            {bot.portfolio.positions.map((position: any) => (
              <div key={position.id} className="flex justify-between items-center text-sm">
            <Badge className="flex items-center gap-2 border bg-transparent text-foreground">
              {position.assetType === 'basket' ? position.name : position.ticker}
              {position.assetType === 'basket' && (
                <span className="text-xs opacity-70">({position.positions.length})</span>
              )}
              <span className={`ml-1 text-xs ${getReturnClass(position)}`}>
                {getPositionReturn(position)}%
              </span>
            </Badge>
                <span>{((getPositionValue(position) / totalValue) * 100).toFixed(1)}%</span>
              </div>
            ))}
          </div>
        </div>

        {/* Historical Performance */}
        <div className="space-y-4">
          <div className="flex justify-between text-sm">
            <span>Historical Performance</span>
            <span className={getReturnClass(bot.portfolio)}>
              {bot.portfolio.return >= 0 ? '+' : ''}{bot.portfolio.return}%
            </span>
          </div>
          <Progress 
            value={Math.min(Math.abs(bot.portfolio.return), 100)} 
            className={bot.portfolio.return >= 0 ? 'bg-green-500' : 'bg-red-500'} 
          />
        </div>

        {/* Risk Management */}
        <div className="space-y-4">
          <div className="flex justify-between text-sm">
            <span>Capital Usage</span>
            <span>{bot.capitalUsage}%</span>
          </div>
          <Progress value={bot.capitalUsage} />
        </div>

        <div className="space-y-4">
          <div className="flex justify-between text-sm">
            <span>Asset Allocation</span>
            <span>{bot.portfolio.positions.length} positions</span>
          </div>
          <div className="grid grid-cols-2 gap-2">
            {bot.portfolio.positions.map((position: any) => (
              <div key={position.id} className="flex justify-between items-center text-sm">
                <Badge className="border bg-transparent text-foreground">
                  {position.assetType === 'basket' ? position.name : position.ticker}
                  <span className="ml-1 text-xs opacity-70">
                    {position.assetType === 'basket' ? `(${position.positions.length})` : ''}
                  </span>
                </Badge>
                <span>{((getPositionValue(position) / totalValue) * 100).toFixed(1)}%</span>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

function getReturnClass(position: Record<string, any>) {
  if (!position.avgPrice || !position.currentPrice) return ''
  const returnPct = ((position.currentPrice - position.avgPrice) / position.avgPrice) * 100
  return returnPct >= 0 ? 'text-green-500' : 'text-red-500'
}

function getPositionReturn(position: Record<string, any>) {
  if (!position.avgPrice || !position.currentPrice) return 0
  return (((position.currentPrice - position.avgPrice) / position.avgPrice) * 100).toFixed(1)
}

export function ExpertBotOverview({ bot }: { bot: MaybeBot }) {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex justify-between">
            <div>
              <CardTitle>{bot.name}</CardTitle>
              <CardDescription>Expert trading analytics</CardDescription>
            </div>
            <div className="flex items-center space-x-2">
              <ShieldCheck className={`h-5 w-5 ${bot.riskScore < 50 ? 'text-green-500' : 'text-yellow-500'}`} />
              <Badge className={bot.status === 'active' ? 'success' : 'secondary'}>
                {bot.status}
              </Badge>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Advanced Metrics Grid */}
          <div className="grid grid-cols-4 gap-4">
            <MetricCard
              icon={TrendingUp}
              label="CAGR"
              value={`${bot.metrics.cagr.toFixed(2)}%`}
              trend={bot.metrics.cagr > 0 ? 'up' : 'down'}
            />
            <MetricCard
              icon={AlertTriangle}
              label="Max Drawdown"
              value={`${bot.metrics.maxDrawdown.toFixed(2)}%`}
              trend="down"
            />
            <MetricCard
              icon={Network}
              label="Sortino Ratio"
              value={bot.metrics.sortinoRatio.toFixed(2)}
              trend={bot.metrics.sortinoRatio > 1 ? 'up' : 'down'}
            />
            <MetricCard
              icon={Lock}
              label="Risk Score"
              value={`${bot.riskScore}/100`}
              trend={bot.riskScore < 50 ? 'up' : 'down'}
            />
          </div>

          {/* Position Distribution */}
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <div className="text-sm font-medium">Position Distribution</div>
              <div className="text-sm text-muted-foreground">{bot.totalPositions} total</div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              {Object.entries(bot.positionTypes).map(([type, count]: [string, any]) => (
                <div key={type} className="flex justify-between items-center">
                  <Badge className="border bg-transparent text-foreground">{type}</Badge>
              <Badge className="border bg-transparent text-foreground">{type}</Badge>
              <Badge className="border bg-transparent text-foreground">{type}</Badge>
                  <span>{((count / bot.totalPositions) * 100).toFixed(1)}%</span>
                </div>
              ))}
            </div>
          </div>

          {/* Risk Management Status */}
          <div className="space-y-2">
            <div className="text-sm font-medium">Risk Management</div>
            <div className="grid grid-cols-2 gap-4">
              <div className="flex justify-between text-sm">
                <span>Position Limit Used</span>
                <span>{bot.riskMetrics.positionLimitUsed}%</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Capital at Risk</span>
                <span>{bot.riskMetrics.capitalAtRisk}%</span>
              </div>
            </div>
            <Progress 
              value={bot.riskMetrics.capitalAtRisk} 
              className="h-2"
            />
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

function MetricCard({ icon: Icon, label, value, trend }: { icon: ComponentType<any>, label: string, value: string, trend?: 'up' | 'down' | 'neutral' }) {
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
