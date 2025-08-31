"use client"

import React, { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Alert, AlertDescription } from '@/components/ui/alert'
import {
  TrendingUp,
  TrendingDown,
  AlertTriangle,
  CheckCircle,
  Activity,
  DollarSign,
  Target,
  Shield
} from 'lucide-react'
import { Portfolio } from '@/types/portfolio'

interface RiskMetrics {
  currentDrawdown: number
  dailyPnL: number
  volatility: number
  sharpeRatio: number
  maxDrawdown: number
  winRate: number
  totalPositions: number
  activeBots: number
}

interface RiskAlert {
  id: string
  type: 'warning' | 'danger' | 'info'
  message: string
  timestamp: string
  botId?: string
}

interface PortfolioRiskDashboardProps {
  portfolio: Portfolio
  riskMetrics: RiskMetrics
  alerts: RiskAlert[]
}

export function PortfolioRiskDashboard({
  portfolio,
  riskMetrics,
  alerts
}: PortfolioRiskDashboardProps) {
  const [realTimeMetrics, setRealTimeMetrics] = useState(riskMetrics)

  useEffect(() => {
    // Simulate real-time updates
    const interval = setInterval(() => {
      setRealTimeMetrics(prev => ({
        ...prev,
        currentDrawdown: Math.max(0, prev.currentDrawdown + (Math.random() - 0.5) * 0.5),
        dailyPnL: prev.dailyPnL + (Math.random() - 0.5) * 100
      }))
    }, 5000)

    return () => clearInterval(interval)
  }, [])

  const getRiskLevel = (value: number, threshold: number, type: 'high' | 'low') => {
    if (type === 'high') {
      if (value >= threshold * 0.9) return 'danger'
      if (value >= threshold * 0.7) return 'warning'
      return 'safe'
    } else {
      if (value <= threshold * 0.1) return 'danger'
      if (value <= threshold * 0.3) return 'warning'
      return 'safe'
    }
  }

  const getRiskColor = (level: string) => {
    switch (level) {
      case 'danger': return 'text-red-600'
      case 'warning': return 'text-yellow-600'
      default: return 'text-green-600'
    }
  }

  const getRiskBadgeVariant = (level: string) => {
    switch (level) {
      case 'danger': return 'destructive' as const
      case 'warning': return 'secondary' as const
      default: return 'default' as const
    }
  }

  const drawdownLevel = getRiskLevel(realTimeMetrics.currentDrawdown, portfolio.riskParameters.maxDrawdown, 'high')
  const dailyLossLevel = getRiskLevel(Math.abs(realTimeMetrics.dailyPnL), portfolio.riskParameters.maxDailyLoss * portfolio.value / 100, 'high')

  return (
    <div className="space-y-6">
      {/* Risk Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Current Drawdown</p>
                <p className={`text-2xl font-bold ${getRiskColor(drawdownLevel)}`}>
                  {realTimeMetrics.currentDrawdown.toFixed(2)}%
                </p>
              </div>
              <TrendingDown className={`w-8 h-8 ${getRiskColor(drawdownLevel)}`} />
            </div>
            <Progress
              value={(realTimeMetrics.currentDrawdown / portfolio.riskParameters.maxDrawdown) * 100}
              className="mt-3"
            />
            <p className="text-xs text-muted-foreground mt-1">
              Max: {portfolio.riskParameters.maxDrawdown}%
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Daily P&L</p>
                <p className={`text-2xl font-bold ${realTimeMetrics.dailyPnL >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  ${realTimeMetrics.dailyPnL.toFixed(2)}
                </p>
              </div>
              {realTimeMetrics.dailyPnL >= 0 ? (
                <TrendingUp className="w-8 h-8 text-green-600" />
              ) : (
                <TrendingDown className="w-8 h-8 text-red-600" />
              )}
            </div>
            <Badge
              variant={dailyLossLevel === 'safe' ? 'default' : getRiskBadgeVariant(dailyLossLevel)}
              className="mt-2"
            >
              {dailyLossLevel === 'safe' ? 'Within Limits' : 'Near Limit'}
            </Badge>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Portfolio Volatility</p>
                <p className="text-2xl font-bold text-blue-600">
                  {realTimeMetrics.volatility.toFixed(2)}%
                </p>
              </div>
              <Activity className="w-8 h-8 text-blue-600" />
            </div>
            <p className="text-xs text-muted-foreground mt-2">
              30-day rolling volatility
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Active Bots</p>
                <p className="text-2xl font-bold text-purple-600">
                  {realTimeMetrics.activeBots}
                </p>
              </div>
              <Shield className="w-8 h-8 text-purple-600" />
            </div>
            <p className="text-xs text-muted-foreground mt-2">
              {realTimeMetrics.totalPositions} total positions
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Risk Alerts */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <AlertTriangle className="w-5 h-5 mr-2" />
            Risk Alerts
          </CardTitle>
        </CardHeader>
        <CardContent>
          {alerts.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <CheckCircle className="w-12 h-12 mx-auto mb-4 text-green-500" />
              <p>No risk alerts at this time</p>
              <p className="text-sm">All risk parameters are within acceptable limits</p>
            </div>
          ) : (
            <div className="space-y-3">
              {alerts.map(alert => (
                <Alert key={alert.id} className={
                  alert.type === 'danger' ? 'border-red-500' :
                  alert.type === 'warning' ? 'border-yellow-500' : 'border-blue-500'
                }>
                  <AlertTriangle className="h-4 w-4" />
                  <AlertDescription>
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="font-medium">{alert.message}</p>
                        <p className="text-sm text-muted-foreground">
                          {new Date(alert.timestamp).toLocaleString()}
                          {alert.botId && ` • Bot: ${alert.botId}`}
                        </p>
                      </div>
                      <Badge variant={
                        alert.type === 'danger' ? 'destructive' :
                        alert.type === 'warning' ? 'secondary' : 'default'
                      }>
                        {alert.type}
                      </Badge>
                    </div>
                  </AlertDescription>
                </Alert>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Risk Limits Summary */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Target className="w-5 h-5 mr-2" />
            Risk Limits Summary
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-sm font-medium">Max Drawdown</span>
                <span className="text-sm">{portfolio.riskParameters.maxDrawdown}%</span>
              </div>
              <Progress value={(realTimeMetrics.currentDrawdown / portfolio.riskParameters.maxDrawdown) * 100} />
              <p className="text-xs text-muted-foreground">
                Current: {realTimeMetrics.currentDrawdown.toFixed(2)}%
              </p>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-sm font-medium">Max Daily Loss</span>
                <span className="text-sm">${(portfolio.riskParameters.maxDailyLoss * portfolio.value / 100).toFixed(0)}</span>
              </div>
              <Progress value={(Math.abs(realTimeMetrics.dailyPnL) / (portfolio.riskParameters.maxDailyLoss * portfolio.value / 100)) * 100} />
              <p className="text-xs text-muted-foreground">
                Current: ${Math.abs(realTimeMetrics.dailyPnL).toFixed(0)}
              </p>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-sm font-medium">Max Position Size</span>
                <span className="text-sm">{portfolio.riskParameters.maxPositionSize}%</span>
              </div>
              <Progress value={65} /> {/* Mock value */}
              <p className="text-xs text-muted-foreground">
                Largest position: 15%
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
