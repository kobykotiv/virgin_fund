"use client"

import React, { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import {
  TrendingUp,
  TrendingDown,
  BarChart3,
  PieChart,
  Activity,
  Target,
  Shield,
  AlertTriangle,
  CheckCircle,
  Zap,
  Calendar,
  DollarSign,
  Percent
} from 'lucide-react'
import { Portfolio, RiskParameters } from '@/types/portfolio'
import { Bot as BotType } from '@/types/bot'

interface AnalyticsData {
  totalValue: number
  totalReturn: number
  annualizedReturn: number
  volatility: number
  sharpeRatio: number
  maxDrawdown: number
  winRate: number
  profitFactor: number
  alpha: number
  beta: number
  calmarRatio: number
  sortinoRatio: number
  informationRatio: number
  trackingError: number
  valueAtRisk: number
  expectedShortfall: number
  riskAdjustedReturn: number
  benchmarkComparison: {
    benchmark: string
    portfolioReturn: number
    benchmarkReturn: number
    excessReturn: number
  }
  sectorAllocation: Array<{
    sector: string
    allocation: number
    return: number
    risk: number
  }>
  performanceByPeriod: Array<{
    period: string
    return: number
    volatility: number
    sharpeRatio: number
  }>
  riskMetrics: {
    concentration: number
    liquidity: number
    diversification: number
    stressTest: number
  }
}

interface AdvancedAnalyticsProps {
  portfolio: Portfolio
  connectedBots: BotType[]
  analyticsData: AnalyticsData
  timeRange: '1M' | '3M' | '6M' | '1Y' | '2Y' | '5Y' | 'ALL'
  onTimeRangeChange: (range: '1M' | '3M' | '6M' | '1Y' | '2Y' | '5Y' | 'ALL') => void
}

export function AdvancedAnalytics({
  portfolio,
  connectedBots,
  analyticsData,
  timeRange,
  onTimeRangeChange
}: AdvancedAnalyticsProps) {
  const [selectedTab, setSelectedTab] = useState('overview')

  const getRiskScore = () => {
    let score = 0

    // Return metrics (30% weight)
    if (analyticsData.totalReturn > 0.5) score += 15
    else if (analyticsData.totalReturn > 0.2) score += 10
    else if (analyticsData.totalReturn > 0) score += 5

    // Risk metrics (40% weight)
    if (analyticsData.maxDrawdown < portfolio.riskParameters.maxDrawdown / 100) score += 20
    else if (analyticsData.maxDrawdown < (portfolio.riskParameters.maxDrawdown / 100) * 1.5) score += 15

    if (analyticsData.sharpeRatio > 1.5) score += 10
    else if (analyticsData.sharpeRatio > 1.0) score += 5

    if (analyticsData.volatility < portfolio.riskParameters.volatilityLimit / 100) score += 10
    else if (analyticsData.volatility < (portfolio.riskParameters.volatilityLimit / 100) * 1.2) score += 5

    // Diversification (20% weight)
    if (analyticsData.riskMetrics.diversification > 0.7) score += 12
    else if (analyticsData.riskMetrics.diversification > 0.5) score += 8

    // Win rate (10% weight)
    if (analyticsData.winRate > 0.6) score += 6
    else if (analyticsData.winRate > 0.5) score += 3

    return Math.min(100, score)
  }

  const getRiskScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600'
    if (score >= 60) return 'text-yellow-600'
    return 'text-red-600'
  }

  const getRiskScoreLabel = (score: number) => {
    if (score >= 80) return 'Excellent'
    if (score >= 60) return 'Good'
    if (score >= 40) return 'Fair'
    return 'Poor'
  }

  const getMetricColor = (value: number, thresholds: { excellent: number, good: number, fair: number }) => {
    if (value >= thresholds.excellent) return 'text-green-600'
    if (value >= thresholds.good) return 'text-yellow-600'
    if (value >= thresholds.fair) return 'text-orange-600'
    return 'text-red-600'
  }

  return (
    <div className="space-y-6">
      {/* Header with Time Range Selector */}
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Advanced Analytics</h2>
        <Select value={timeRange} onValueChange={onTimeRangeChange}>
          <SelectTrigger className="w-32">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="1M">1 Month</SelectItem>
            <SelectItem value="3M">3 Months</SelectItem>
            <SelectItem value="6M">6 Months</SelectItem>
            <SelectItem value="1Y">1 Year</SelectItem>
            <SelectItem value="2Y">2 Years</SelectItem>
            <SelectItem value="5Y">5 Years</SelectItem>
            <SelectItem value="ALL">All Time</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Risk Score Overview */}
      <Card>
        <CardContent className="p-6">
          <div className="text-center">
            <div className={`text-6xl font-bold ${getRiskScoreColor(getRiskScore())}`}>
              {getRiskScore()}
            </div>
            <div className="text-lg font-medium mt-2">
              {getRiskScoreLabel(getRiskScore())}
            </div>
            <p className="text-sm text-muted-foreground mt-1">
              Overall Risk-Adjusted Performance Score
            </p>
          </div>
        </CardContent>
      </Card>

      <Tabs value={selectedTab} onValueChange={setSelectedTab} className="w-full">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="performance">Performance</TabsTrigger>
          <TabsTrigger value="risk">Risk Analysis</TabsTrigger>
          <TabsTrigger value="allocation">Allocation</TabsTrigger>
          <TabsTrigger value="comparison">Benchmark</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          {/* Key Metrics Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Card>
              <CardContent className="p-4 text-center">
                <DollarSign className="w-8 h-8 mx-auto mb-2 text-blue-600" />
                <div className="text-2xl font-bold">
                  ${analyticsData.totalValue.toLocaleString()}
                </div>
                <div className="text-sm text-muted-foreground">Total Value</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 text-center">
                <TrendingUp className={`w-8 h-8 mx-auto mb-2 ${analyticsData.totalReturn >= 0 ? 'text-green-600' : 'text-red-600'}`} />
                <div className={`text-2xl font-bold ${analyticsData.totalReturn >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {(analyticsData.totalReturn * 100).toFixed(1)}%
                </div>
                <div className="text-sm text-muted-foreground">Total Return</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 text-center">
                <Activity className="w-8 h-8 mx-auto mb-2 text-purple-600" />
                <div className="text-2xl font-bold text-purple-600">
                  {(analyticsData.volatility * 100).toFixed(1)}%
                </div>
                <div className="text-sm text-muted-foreground">Volatility</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 text-center">
                <Target className="w-8 h-8 mx-auto mb-2 text-orange-600" />
                <div className="text-2xl font-bold text-orange-600">
                  {analyticsData.sharpeRatio.toFixed(2)}
                </div>
                <div className="text-sm text-muted-foreground">Sharpe Ratio</div>
              </CardContent>
            </Card>
          </div>

          {/* Risk Metrics */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Shield className="w-5 h-5 mr-2" />
                Risk Metrics
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-red-600">
                    {(analyticsData.maxDrawdown * 100).toFixed(1)}%
                  </div>
                  <div className="text-sm text-muted-foreground">Max Drawdown</div>
                  <Progress
                    value={Math.min(100, (analyticsData.maxDrawdown * 100) / (portfolio.riskParameters.maxDrawdown / 100) * 100)}
                    className="mt-2"
                  />
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600">
                    {(analyticsData.valueAtRisk * 100).toFixed(1)}%
                  </div>
                  <div className="text-sm text-muted-foreground">VaR (95%)</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600">
                    {(analyticsData.winRate * 100).toFixed(1)}%
                  </div>
                  <div className="text-sm text-muted-foreground">Win Rate</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-purple-600">
                    {analyticsData.profitFactor.toFixed(2)}
                  </div>
                  <div className="text-sm text-muted-foreground">Profit Factor</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="performance" className="space-y-4">
          {/* Performance by Period */}
          <Card>
            <CardHeader>
              <CardTitle>Performance by Period</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {analyticsData.performanceByPeriod.map((period, index) => (
                  <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex-1">
                      <div className="font-medium">{period.period}</div>
                      <div className="text-sm text-muted-foreground">
                        Return: {(period.return * 100).toFixed(1)}% |
                        Volatility: {(period.volatility * 100).toFixed(1)}%
                      </div>
                    </div>
                    <div className="text-right">
                      <div className={`text-lg font-bold ${period.return >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                        {(period.return * 100).toFixed(1)}%
                      </div>
                      <div className="text-sm text-muted-foreground">
                        Sharpe: {period.sharpeRatio.toFixed(2)}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Advanced Ratios */}
          <Card>
            <CardHeader>
              <CardTitle>Advanced Performance Ratios</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600">
                    {analyticsData.alpha.toFixed(2)}
                  </div>
                  <div className="text-sm text-muted-foreground">Alpha</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600">
                    {analyticsData.beta.toFixed(2)}
                  </div>
                  <div className="text-sm text-muted-foreground">Beta</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-purple-600">
                    {analyticsData.calmarRatio.toFixed(2)}
                  </div>
                  <div className="text-sm text-muted-foreground">Calmar Ratio</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-orange-600">
                    {analyticsData.sortinoRatio.toFixed(2)}
                  </div>
                  <div className="text-sm text-muted-foreground">Sortino Ratio</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-red-600">
                    {analyticsData.informationRatio.toFixed(2)}
                  </div>
                  <div className="text-sm text-muted-foreground">Information Ratio</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-indigo-600">
                    {(analyticsData.trackingError * 100).toFixed(1)}%
                  </div>
                  <div className="text-sm text-muted-foreground">Tracking Error</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="risk" className="space-y-4">
          {/* Risk Analysis */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <AlertTriangle className="w-5 h-5 mr-2" />
                Risk Analysis
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-red-600">
                    {(analyticsData.expectedShortfall * 100).toFixed(1)}%
                  </div>
                  <div className="text-sm text-muted-foreground">Expected Shortfall</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-orange-600">
                    {analyticsData.riskMetrics.concentration.toFixed(1)}%
                  </div>
                  <div className="text-sm text-muted-foreground">Concentration</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600">
                    {analyticsData.riskMetrics.liquidity.toFixed(1)}%
                  </div>
                  <div className="text-sm text-muted-foreground">Liquidity</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600">
                    {(analyticsData.riskMetrics.diversification * 100).toFixed(1)}%
                  </div>
                  <div className="text-sm text-muted-foreground">Diversification</div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Risk vs Return Scatter */}
          <Card>
            <CardHeader>
              <CardTitle>Risk vs Return Analysis</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8">
                <BarChart3 className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
                <p className="text-muted-foreground">
                  Risk vs Return scatter plot would be displayed here
                </p>
                <p className="text-sm text-muted-foreground mt-2">
                  Current: {(analyticsData.totalReturn * 100).toFixed(1)}% return at {(analyticsData.volatility * 100).toFixed(1)}% volatility
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="allocation" className="space-y-4">
          {/* Sector Allocation */}
          <Card>
            <CardHeader>
              <CardTitle>Sector Allocation & Performance</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {analyticsData.sectorAllocation.map((sector, index) => (
                  <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex-1">
                      <div className="font-medium">{sector.sector}</div>
                      <div className="text-sm text-muted-foreground">
                        Allocation: {(sector.allocation * 100).toFixed(1)}%
                      </div>
                    </div>
                    <div className="text-right">
                      <div className={`text-lg font-bold ${sector.return >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                        {(sector.return * 100).toFixed(1)}%
                      </div>
                      <div className="text-sm text-muted-foreground">
                        Risk: {(sector.risk * 100).toFixed(1)}%
                      </div>
                    </div>
                    <div className="ml-4 w-24">
                      <Progress value={sector.allocation * 100} />
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="comparison" className="space-y-4">
          {/* Benchmark Comparison */}
          <Card>
            <CardHeader>
              <CardTitle>Benchmark Comparison</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600">
                    {analyticsData.benchmarkComparison.benchmark}
                  </div>
                  <div className="text-sm text-muted-foreground">Benchmark</div>
                </div>
                <div className="text-center">
                  <div className={`text-2xl font-bold ${analyticsData.benchmarkComparison.portfolioReturn >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {(analyticsData.benchmarkComparison.portfolioReturn * 100).toFixed(1)}%
                  </div>
                  <div className="text-sm text-muted-foreground">Portfolio Return</div>
                </div>
                <div className="text-center">
                  <div className={`text-2xl font-bold ${analyticsData.benchmarkComparison.benchmarkReturn >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {(analyticsData.benchmarkComparison.benchmarkReturn * 100).toFixed(1)}%
                  </div>
                  <div className="text-sm text-muted-foreground">Benchmark Return</div>
                </div>
              </div>
              <div className="mt-6 text-center">
                <div className={`text-3xl font-bold ${analyticsData.benchmarkComparison.excessReturn >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {(analyticsData.benchmarkComparison.excessReturn * 100).toFixed(1)}%
                </div>
                <div className="text-lg text-muted-foreground">Excess Return</div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
