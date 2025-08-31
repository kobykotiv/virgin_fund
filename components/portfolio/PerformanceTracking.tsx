"use client"

import React, { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  TrendingUp,
  TrendingDown,
  BarChart3,
  PieChart,
  Calendar,
  DollarSign,
  Target,
  Activity,
  Award,
  AlertTriangle
} from 'lucide-react'
import { Portfolio } from '@/types/portfolio'

interface PerformanceMetrics {
  totalReturn: number
  annualizedReturn: number
  volatility: number
  sharpeRatio: number
  maxDrawdown: number
  winRate: number
  profitFactor: number
  calmarRatio: number
  sortinoRatio: number
  alpha: number
  beta: number
}

interface PerformanceData {
  date: string
  portfolioValue: number
  dailyReturn: number
  cumulativeReturn: number
  drawdown: number
}

interface PerformanceTrackingProps {
  portfolio: Portfolio
  performanceData: PerformanceData[]
  metrics: PerformanceMetrics
  timeframe: '1D' | '1W' | '1M' | '3M' | '6M' | '1Y' | 'ALL'
  onTimeframeChange: (timeframe: string) => void
}

export function PerformanceTracking({
  portfolio,
  performanceData,
  metrics,
  timeframe,
  onTimeframeChange
}: PerformanceTrackingProps) {
  const [selectedMetric, setSelectedMetric] = useState('returns')

  const getMetricColor = (value: number, benchmark?: number) => {
    if (benchmark !== undefined) {
      if (value > benchmark) return 'text-green-600'
      if (value < benchmark * 0.8) return 'text-red-600'
      return 'text-yellow-600'
    }
    if (value > 0) return 'text-green-600'
    if (value < 0) return 'text-red-600'
    return 'text-gray-600'
  }

  const getMetricStatus = (metric: keyof PerformanceMetrics, value: number) => {
    const thresholds = {
      totalReturn: 0,
      annualizedReturn: 0.07, // 7% benchmark
      volatility: 0.20, // 20% max volatility
      sharpeRatio: 1.0, // Minimum Sharpe ratio
      maxDrawdown: portfolio.riskParameters?.maxDrawdown / 100 || 0.10,
      winRate: 0.50, // 50% minimum win rate
      profitFactor: 1.0, // Minimum profit factor
      calmarRatio: 1.0, // Minimum Calmar ratio
      sortinoRatio: 1.0, // Minimum Sortino ratio
      alpha: 0,
      beta: 1.0
    }

    const threshold = thresholds[metric]
    if (value >= threshold) return 'good'
    if (value >= threshold * 0.8) return 'warning'
    return 'poor'
  }

  const formatMetric = (metric: keyof PerformanceMetrics, value: number) => {
    const formatters = {
      totalReturn: (v: number) => `${(v * 100).toFixed(2)}%`,
      annualizedReturn: (v: number) => `${(v * 100).toFixed(2)}%`,
      volatility: (v: number) => `${(v * 100).toFixed(2)}%`,
      sharpeRatio: (v: number) => v.toFixed(2),
      maxDrawdown: (v: number) => `${(v * 100).toFixed(2)}%`,
      winRate: (v: number) => `${(v * 100).toFixed(1)}%`,
      profitFactor: (v: number) => v.toFixed(2),
      calmarRatio: (v: number) => v.toFixed(2),
      sortinoRatio: (v: number) => v.toFixed(2),
      alpha: (v: number) => `${(v * 100).toFixed(2)}%`,
      beta: (v: number) => v.toFixed(2)
    }

    return formatters[metric]?.(value) || value.toString()
  }

  const getMetricDescription = (metric: keyof PerformanceMetrics) => {
    const descriptions = {
      totalReturn: 'Total return since inception',
      annualizedReturn: 'Annualized return (compounded)',
      volatility: 'Portfolio volatility (standard deviation)',
      sharpeRatio: 'Risk-adjusted return (higher is better)',
      maxDrawdown: 'Maximum peak-to-trough decline',
      winRate: 'Percentage of profitable trades',
      profitFactor: 'Gross profit / Gross loss ratio',
      calmarRatio: 'Annual return / Max drawdown',
      sortinoRatio: 'Downside risk-adjusted return',
      alpha: 'Excess return over benchmark',
      beta: 'Market sensitivity (1.0 = market)'
    }

    return descriptions[metric] || ''
  }

  return (
    <div className="space-y-6">
      {/* Performance Header */}
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-2xl font-bold">Performance Tracking</h2>
              <p className="text-muted-foreground">Monitor portfolio performance and risk metrics</p>
            </div>
            <Select value={timeframe} onValueChange={onTimeframeChange}>
              <SelectTrigger className="w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1D">1 Day</SelectItem>
                <SelectItem value="1W">1 Week</SelectItem>
                <SelectItem value="1M">1 Month</SelectItem>
                <SelectItem value="3M">3 Months</SelectItem>
                <SelectItem value="6M">6 Months</SelectItem>
                <SelectItem value="1Y">1 Year</SelectItem>
                <SelectItem value="ALL">All Time</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className={`text-3xl font-bold ${getMetricColor(metrics.totalReturn)}`}>
                {formatMetric('totalReturn', metrics.totalReturn)}
              </div>
              <div className="text-sm text-muted-foreground">Total Return</div>
            </div>
            <div className="text-center">
              <div className={`text-3xl font-bold ${getMetricColor(metrics.annualizedReturn, 0.07)}`}>
                {formatMetric('annualizedReturn', metrics.annualizedReturn)}
              </div>
              <div className="text-sm text-muted-foreground">Annualized</div>
            </div>
            <div className="text-center">
              <div className={`text-3xl font-bold ${getMetricColor(metrics.sharpeRatio, 1.0)}`}>
                {formatMetric('sharpeRatio', metrics.sharpeRatio)}
              </div>
              <div className="text-sm text-muted-foreground">Sharpe Ratio</div>
            </div>
            <div className="text-center">
              <div className={`text-3xl font-bold ${getMetricColor(-metrics.maxDrawdown)}`}>
                {formatMetric('maxDrawdown', metrics.maxDrawdown)}
              </div>
              <div className="text-sm text-muted-foreground">Max Drawdown</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Detailed Metrics */}
      <Tabs value={selectedMetric} onValueChange={setSelectedMetric} className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="returns">Returns</TabsTrigger>
          <TabsTrigger value="risk">Risk Metrics</TabsTrigger>
          <TabsTrigger value="ratios">Ratios</TabsTrigger>
          <TabsTrigger value="market">Market</TabsTrigger>
        </TabsList>

        <TabsContent value="returns" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {(['totalReturn', 'annualizedReturn'] as const).map(metric => (
              <Card key={metric}>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">
                        {metric.replace(/([A-Z])/g, ' $1').toLowerCase()}
                      </p>
                      <p className={`text-2xl font-bold ${getMetricColor(metrics[metric])}`}>
                        {formatMetric(metric, metrics[metric])}
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">
                        {getMetricDescription(metric)}
                      </p>
                    </div>
                    <Badge variant={
                      getMetricStatus(metric, metrics[metric]) === 'good' ? 'default' :
                      getMetricStatus(metric, metrics[metric]) === 'warning' ? 'secondary' : 'destructive'
                    }>
                      {getMetricStatus(metric, metrics[metric]) === 'good' ? 'Good' :
                       getMetricStatus(metric, metrics[metric]) === 'warning' ? 'OK' : 'Poor'}
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="risk" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {(['volatility', 'maxDrawdown', 'winRate'] as const).map(metric => (
              <Card key={metric}>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">
                        {metric.replace(/([A-Z])/g, ' $1').toLowerCase()}
                      </p>
                      <p className={`text-2xl font-bold ${getMetricColor(
                        metric === 'maxDrawdown' ? -metrics[metric] : metrics[metric],
                        metric === 'volatility' ? 0.20 :
                        metric === 'maxDrawdown' ? portfolio.riskParameters?.maxDrawdown / 100 || 0.10 :
                        metric === 'winRate' ? 0.50 : undefined
                      )}`}>
                        {formatMetric(metric, metrics[metric])}
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">
                        {getMetricDescription(metric)}
                      </p>
                    </div>
                    <Badge variant={
                      getMetricStatus(metric, metrics[metric]) === 'good' ? 'default' :
                      getMetricStatus(metric, metrics[metric]) === 'warning' ? 'secondary' : 'destructive'
                    }>
                      {getMetricStatus(metric, metrics[metric]) === 'good' ? 'Good' :
                       getMetricStatus(metric, metrics[metric]) === 'warning' ? 'OK' : 'Poor'}
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="ratios" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {(['sharpeRatio', 'profitFactor', 'calmarRatio', 'sortinoRatio'] as const).map(metric => (
              <Card key={metric}>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">
                        {metric.replace(/([A-Z])/g, ' $1').toLowerCase()}
                      </p>
                      <p className={`text-2xl font-bold ${getMetricColor(metrics[metric], 1.0)}`}>
                        {formatMetric(metric, metrics[metric])}
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">
                        {getMetricDescription(metric)}
                      </p>
                    </div>
                    <Badge variant={
                      getMetricStatus(metric, metrics[metric]) === 'good' ? 'default' :
                      getMetricStatus(metric, metrics[metric]) === 'warning' ? 'secondary' : 'destructive'
                    }>
                      {getMetricStatus(metric, metrics[metric]) === 'good' ? 'Good' :
                       getMetricStatus(metric, metrics[metric]) === 'warning' ? 'OK' : 'Poor'}
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="market" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {(['alpha', 'beta'] as const).map(metric => (
              <Card key={metric}>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">
                        {metric.charAt(0).toUpperCase() + metric.slice(1)}
                      </p>
                      <p className={`text-2xl font-bold ${getMetricColor(
                        metrics[metric],
                        metric === 'alpha' ? 0 : 1.0
                      )}`}>
                        {formatMetric(metric, metrics[metric])}
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">
                        {getMetricDescription(metric)}
                      </p>
                    </div>
                    <Badge variant={
                      getMetricStatus(metric, metrics[metric]) === 'good' ? 'default' :
                      getMetricStatus(metric, metrics[metric]) === 'warning' ? 'secondary' : 'destructive'
                    }>
                      {getMetricStatus(metric, metrics[metric]) === 'good' ? 'Good' :
                       getMetricStatus(metric, metrics[metric]) === 'warning' ? 'OK' : 'Poor'}
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>

      {/* Performance Chart Placeholder */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <BarChart3 className="w-5 h-5 mr-2" />
            Performance Chart
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-12 text-muted-foreground">
            <BarChart3 className="w-16 h-16 mx-auto mb-4 opacity-50" />
            <p className="text-lg font-medium">Interactive Charts Coming Soon</p>
            <p className="text-sm">Portfolio value, returns, and drawdown visualization</p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
