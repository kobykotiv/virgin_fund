"use client"

import React, { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Switch } from '@/components/ui/switch'
import { Progress } from '@/components/ui/progress'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  Play,
  Pause,
  Square,
  Settings,
  TrendingUp,
  TrendingDown,
  BarChart3,
  Zap,
  Target,
  Shield,
  AlertTriangle,
  CheckCircle
} from 'lucide-react'
import { Portfolio, RiskParameters } from '@/types/portfolio'
import { Bot as BotType } from '@/types/bot'

interface BacktestConfig {
  startDate: string
  endDate: string
  initialCapital: number
  commission: number
  slippage: number
  benchmark: string
  riskParameters: RiskParameters
  rebalanceFrequency: 'daily' | 'weekly' | 'monthly'
  maxPositions: number
}

interface BacktestResult {
  id: string
  status: 'running' | 'completed' | 'failed'
  progress: number
  totalReturn: number
  annualizedReturn: number
  volatility: number
  sharpeRatio: number
  maxDrawdown: number
  winRate: number
  totalTrades: number
  profitFactor: number
  calmarRatio: number
  alpha: number
  beta: number
  riskAdjustedReturn: number
  trades: Array<{
    date: string
    symbol: string
    action: 'BUY' | 'SELL'
    price: number
    quantity: number
    pnl: number
  }>
  equityCurve: Array<{
    date: string
    value: number
    drawdown: number
  }>
}

interface BacktestingIntegrationProps {
  portfolio: Portfolio
  connectedBots: BotType[]
  onRunBacktest: (config: BacktestConfig) => Promise<BacktestResult>
}

export function BacktestingIntegration({
  portfolio,
  connectedBots,
  onRunBacktest
}: BacktestingIntegrationProps) {
  const [backtestConfig, setBacktestConfig] = useState<BacktestConfig>({
    startDate: '2023-01-01',
    endDate: '2024-01-01',
    initialCapital: 100000,
    commission: 0.001,
    slippage: 0.0005,
    benchmark: 'SPY',
    riskParameters: portfolio.riskParameters,
    rebalanceFrequency: 'monthly',
    maxPositions: 10
  })

  const [backtestResult, setBacktestResult] = useState<BacktestResult | null>(null)
  const [isRunning, setIsRunning] = useState(false)
  const [selectedTab, setSelectedTab] = useState('setup')

  const runBacktest = async () => {
    setIsRunning(true)
    setBacktestResult(null)

    try {
      const result = await onRunBacktest(backtestConfig)
      setBacktestResult(result)
      setSelectedTab('results')
    } catch (error) {
      console.error('Backtest failed:', error)
      setBacktestResult({
        id: 'failed',
        status: 'failed',
        progress: 0,
        totalReturn: 0,
        annualizedReturn: 0,
        volatility: 0,
        sharpeRatio: 0,
        maxDrawdown: 0,
        winRate: 0,
        totalTrades: 0,
        profitFactor: 0,
        calmarRatio: 0,
        alpha: 0,
        beta: 0,
        riskAdjustedReturn: 0,
        trades: [],
        equityCurve: []
      })
    } finally {
      setIsRunning(false)
    }
  }

  const getRiskScore = (result: BacktestResult) => {
    let score = 0

    // Return metrics (40% weight)
    if (result.totalReturn > 0.5) score += 20
    else if (result.totalReturn > 0.2) score += 15
    else if (result.totalReturn > 0) score += 10

    // Risk metrics (30% weight)
    if (result.maxDrawdown < portfolio.riskParameters.maxDrawdown / 100) score += 15
    else if (result.maxDrawdown < (portfolio.riskParameters.maxDrawdown / 100) * 1.5) score += 10

    if (result.sharpeRatio > 1.5) score += 10
    else if (result.sharpeRatio > 1.0) score += 5

    // Win rate (20% weight)
    if (result.winRate > 0.6) score += 12
    else if (result.winRate > 0.5) score += 8

    // Profit factor (10% weight)
    if (result.profitFactor > 1.5) score += 6
    else if (result.profitFactor > 1.2) score += 3

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

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <BarChart3 className="w-5 h-5 mr-2" />
            Backtesting with Risk Controls
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs value={selectedTab} onValueChange={setSelectedTab} className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="setup">Setup</TabsTrigger>
              <TabsTrigger value="risk">Risk Parameters</TabsTrigger>
              <TabsTrigger value="running" disabled={!isRunning && !backtestResult}>Running</TabsTrigger>
              <TabsTrigger value="results" disabled={!backtestResult}>Results</TabsTrigger>
            </TabsList>

            <TabsContent value="setup" className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="start-date">Start Date</Label>
                  <Input
                    id="start-date"
                    type="date"
                    value={backtestConfig.startDate}
                    onChange={(e) => setBacktestConfig(prev => ({ ...prev, startDate: e.target.value }))}
                  />
                </div>
                <div>
                  <Label htmlFor="end-date">End Date</Label>
                  <Input
                    id="end-date"
                    type="date"
                    value={backtestConfig.endDate}
                    onChange={(e) => setBacktestConfig(prev => ({ ...prev, endDate: e.target.value }))}
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="initial-capital">Initial Capital</Label>
                  <Input
                    id="initial-capital"
                    type="number"
                    value={backtestConfig.initialCapital}
                    onChange={(e) => setBacktestConfig(prev => ({ ...prev, initialCapital: Number(e.target.value) }))}
                  />
                </div>
                <div>
                  <Label htmlFor="commission">Commission (%)</Label>
                  <Input
                    id="commission"
                    type="number"
                    step="0.001"
                    value={backtestConfig.commission}
                    onChange={(e) => setBacktestConfig(prev => ({ ...prev, commission: Number(e.target.value) }))}
                  />
                </div>
                <div>
                  <Label htmlFor="slippage">Slippage (%)</Label>
                  <Input
                    id="slippage"
                    type="number"
                    step="0.001"
                    value={backtestConfig.slippage}
                    onChange={(e) => setBacktestConfig(prev => ({ ...prev, slippage: Number(e.target.value) }))}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="benchmark">Benchmark</Label>
                  <Select
                    value={backtestConfig.benchmark}
                    onValueChange={(value) => setBacktestConfig(prev => ({ ...prev, benchmark: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="SPY">S&P 500 (SPY)</SelectItem>
                      <SelectItem value="QQQ">Nasdaq 100 (QQQ)</SelectItem>
                      <SelectItem value="IWM">Russell 2000 (IWM)</SelectItem>
                      <SelectItem value="VTI">Total Stock Market (VTI)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="rebalance">Rebalance Frequency</Label>
                  <Select
                    value={backtestConfig.rebalanceFrequency}
                    onValueChange={(value: 'daily' | 'weekly' | 'monthly') =>
                      setBacktestConfig(prev => ({ ...prev, rebalanceFrequency: value }))
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="daily">Daily</SelectItem>
                      <SelectItem value="weekly">Weekly</SelectItem>
                      <SelectItem value="monthly">Monthly</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="flex justify-end">
                <Button onClick={runBacktest} disabled={isRunning}>
                  {isRunning ? (
                    <>
                      <Play className="w-4 h-4 mr-2 animate-pulse" />
                      Running Backtest...
                    </>
                  ) : (
                    <>
                      <Play className="w-4 h-4 mr-2" />
                      Run Backtest
                    </>
                  )}
                </Button>
              </div>
            </TabsContent>

            <TabsContent value="risk" className="space-y-4">
              <Alert>
                <Shield className="h-4 w-4" />
                <AlertDescription>
                  Risk parameters from your portfolio will be applied during backtesting to ensure realistic results.
                </AlertDescription>
              </Alert>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Max Drawdown</Label>
                  <div className="text-2xl font-bold text-red-600">
                    {portfolio.riskParameters.maxDrawdown}%
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Backtest will stop if drawdown exceeds this limit
                  </p>
                </div>
                <div>
                  <Label>Max Position Size</Label>
                  <div className="text-2xl font-bold text-blue-600">
                    {portfolio.riskParameters.maxPositionSize}%
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Maximum allocation per position
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Max Daily Loss</Label>
                  <div className="text-2xl font-bold text-orange-600">
                    {portfolio.riskParameters.maxDailyLoss}%
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Maximum loss allowed per day
                  </p>
                </div>
                <div>
                  <Label>Volatility Limit</Label>
                  <div className="text-2xl font-bold text-purple-600">
                    {portfolio.riskParameters.volatilityLimit}%
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Maximum portfolio volatility threshold
                  </p>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="running" className="space-y-4">
              {isRunning && (
                <div className="text-center py-8">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                  <p className="text-lg font-medium">Running Backtest...</p>
                  <p className="text-muted-foreground">This may take a few minutes</p>
                </div>
              )}

              {backtestResult && backtestResult.status === 'running' && (
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between text-sm mb-2">
                      <span>Progress</span>
                      <span>{backtestResult.progress}%</span>
                    </div>
                    <Progress value={backtestResult.progress} />
                  </div>
                  <div className="text-center text-muted-foreground">
                    <p>Processing historical data and applying risk controls...</p>
                  </div>
                </div>
              )}
            </TabsContent>

            <TabsContent value="results" className="space-y-4">
              {backtestResult && backtestResult.status === 'completed' && (
                <>
                  {/* Risk Score */}
                  <Card>
                    <CardContent className="p-6">
                      <div className="text-center">
                        <div className={`text-6xl font-bold ${getRiskScoreColor(getRiskScore(backtestResult))}`}>
                          {getRiskScore(backtestResult)}
                        </div>
                        <div className="text-lg font-medium mt-2">
                          {getRiskScoreLabel(getRiskScore(backtestResult))}
                        </div>
                        <p className="text-sm text-muted-foreground mt-1">
                          Risk-adjusted performance score
                        </p>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Key Metrics */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <Card>
                      <CardContent className="p-4 text-center">
                        <div className={`text-2xl font-bold ${backtestResult.totalReturn >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                          {(backtestResult.totalReturn * 100).toFixed(1)}%
                        </div>
                        <div className="text-sm text-muted-foreground">Total Return</div>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardContent className="p-4 text-center">
                        <div className="text-2xl font-bold text-blue-600">
                          {backtestResult.sharpeRatio.toFixed(2)}
                        </div>
                        <div className="text-sm text-muted-foreground">Sharpe Ratio</div>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardContent className="p-4 text-center">
                        <div className="text-2xl font-bold text-red-600">
                          {(backtestResult.maxDrawdown * 100).toFixed(1)}%
                        </div>
                        <div className="text-sm text-muted-foreground">Max Drawdown</div>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardContent className="p-4 text-center">
                        <div className="text-2xl font-bold text-green-600">
                          {(backtestResult.winRate * 100).toFixed(1)}%
                        </div>
                        <div className="text-sm text-muted-foreground">Win Rate</div>
                      </CardContent>
                    </Card>
                  </div>

                  {/* Detailed Results */}
                  <Card>
                    <CardHeader>
                      <CardTitle>Backtest Summary</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm">
                        <div>
                          <span className="text-muted-foreground">Total Trades:</span>
                          <span className="ml-2 font-medium">{backtestResult.totalTrades}</span>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Profit Factor:</span>
                          <span className="ml-2 font-medium">{backtestResult.profitFactor.toFixed(2)}</span>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Calmar Ratio:</span>
                          <span className="ml-2 font-medium">{backtestResult.calmarRatio.toFixed(2)}</span>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Alpha:</span>
                          <span className={`ml-2 font-medium ${backtestResult.alpha >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                            {(backtestResult.alpha * 100).toFixed(2)}%
                          </span>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Beta:</span>
                          <span className="ml-2 font-medium">{backtestResult.beta.toFixed(2)}</span>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Volatility:</span>
                          <span className="ml-2 font-medium">{(backtestResult.volatility * 100).toFixed(1)}%</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </>
              )}

              {backtestResult && backtestResult.status === 'failed' && (
                <Alert className="border-red-500">
                  <AlertTriangle className="h-4 w-4" />
                  <AlertDescription>
                    Backtest failed to complete. Please check your configuration and try again.
                  </AlertDescription>
                </Alert>
              )}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  )
}
