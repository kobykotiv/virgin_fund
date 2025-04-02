"use client"

import { useState } from 'react'
import { DemoBot } from '@/types/portfolio'
import { Card } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { LineChart, PieChart, BarChart } from '@/components/charts'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  AlertCircle,
  ArrowUpRight,
  ArrowDownRight,
  BarChart as BarChartIcon,
  PieChart as PieChartIcon,
  Settings,
  Activity,
  Clock,
  DollarSign,
  TrendingUp,
  Layers,
  Shield,
} from "lucide-react"
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import AnimatedBackdrop from '@/components/ui/AnimatedBackdrop'
import LiveMetrics from '@/components/ui/LiveMetrics'

interface BotDetailViewProps {
  bot: DemoBot
  onBack?: () => void
}

export function BotDetailView({ bot, onBack }: BotDetailViewProps) {
  const [activeTab, setActiveTab] = useState('overview')
  
  // Calculate some metrics for the bot
  const totalMarketValue = bot.positions.reduce((sum, pos) => sum + pos.marketValue, 0)
  const totalUnrealizedPnL = bot.positions.reduce((sum, pos) => sum + pos.unrealizedPnL, 0)
  const pnlPercentage = (totalUnrealizedPnL / bot.costBasis) * 100
  
  // Historical performance simulation
  const dailyPerformance = Array.from({ length: 30 }, (_, i) => {
    const baseValue = bot.performance[bot.performance.length - 1] || 100
    return baseValue * (1 + (Math.sin(i * 0.2) * 0.02)) // simulated oscillating performance
  })
  
  // Trading activity simulation
  const tradingActivity = [
    { date: '2023-06-15', action: 'BUY', symbol: 'AAPL', quantity: 20, price: 180.25 },
    { date: '2023-06-12', action: 'SELL', symbol: 'MSFT', quantity: 5, price: 325.75 },
    { date: '2023-06-10', action: 'BUY', symbol: 'GOOGL', quantity: 10, price: 2730.50 },
    { date: '2023-06-05', action: 'BUY', symbol: 'TSLA', quantity: 15, price: 190.75 },
    { date: '2023-06-01', action: 'SELL', symbol: 'META', quantity: 25, price: 275.25 },
  ]

  // Strategy parameters (simulated)
  const strategyParams = {
    type: 'Momentum',
    timeframe: '1h',
    entryConditions: [
      { indicator: 'RSI', condition: '< 30', value: '30' },
      { indicator: 'MACD', condition: 'Crossover', value: 'Signal' },
    ],
    exitConditions: [
      { indicator: 'RSI', condition: '> 70', value: '70' },
      { indicator: 'Trailing Stop', condition: '%', value: '2%' },
    ],
    riskManagement: {
      maxPositionSize: '5% of portfolio',
      stopLoss: '2%',
      takeProfit: '5%',
      maxOpenPositions: 8,
    }
  }

  // Risk metrics
  const riskMetrics = [
    { name: 'Sharpe Ratio', value: 1.82 },
    { name: 'Max Drawdown', value: -12.5 },
    { name: 'Win Rate', value: 62.5 },
    { name: 'Avg Win/Loss', value: 1.35 },
    { name: 'Beta', value: 0.87 },
    { name: 'Volatility', value: 14.3 },
  ]

  // Live metrics for the bot
  const botMetrics = [
    {
      label: "Total Value",
      value: totalMarketValue + bot.costBasis * (1 - bot.margin),
      previousValue: bot.costBasis,
      precision: 2,
      unit: "USD"
    },
    {
      label: "Unrealized P&L",
      value: totalUnrealizedPnL,
      precision: 2,
      unit: "USD",
      color: totalUnrealizedPnL >= 0 ? "green" : "red"
    },
    {
      label: "Return",
      value: pnlPercentage,
      precision: 2,
      isPercentage: true,
      color: pnlPercentage >= 0 ? "green" : "red"
    },
    {
      label: "Margin Used",
      value: bot.margin * 100,
      precision: 1,
      isPercentage: true
    }
  ]

  return (
    <AnimatedBackdrop variant="gradient" speed="slow">
      <div className="container mx-auto py-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-3xl font-bold">{bot.nickname}</h1>
              <Badge variant="outline">{strategyParams.type}</Badge>
            </div>
            <p className="text-muted-foreground">ID: {bot.id}</p>
          </div>
          
          {onBack && (
            <Button variant="outline" onClick={onBack}>
              Back to Bots
            </Button>
          )}
        </div>
        
        {/* Live Metrics Dashboard */}
        <Card className="p-6 mb-6 bg-background/80 backdrop-blur-sm">
          <LiveMetrics 
            metrics={botMetrics} 
            variant="cards" 
            animation="count"
            showTrend
          />
        </Card>
        
        {/* Tabs */}
        <Tabs defaultValue="overview" value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid grid-cols-5 mb-6">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="positions">Positions</TabsTrigger>
            <TabsTrigger value="strategy">Strategy</TabsTrigger>
            <TabsTrigger value="performance">Performance</TabsTrigger>
            <TabsTrigger value="risk">Risk Analysis</TabsTrigger>
          </TabsList>
          
          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Performance Chart */}
              <Card className="p-6 bg-background/80 backdrop-blur-sm">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-medium flex items-center gap-2">
                    <Activity className="h-5 w-5" />
                    Performance History
                  </h3>
                </div>
                <div className="h-64">
                  <LineChart data={dailyPerformance} showGrid showTooltip />
                </div>
              </Card>
              
              {/* Asset Allocation */}
              <Card className="p-6 bg-background/80 backdrop-blur-sm">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-medium flex items-center gap-2">
                    <PieChartIcon className="h-5 w-5" />
                    Asset Allocation
                  </h3>
                </div>
                <div className="h-64">
                  <PieChart data={bot.allocation} showLegend />
                </div>
              </Card>
              
              {/* Recent Trading Activity */}
              <Card className="p-6 bg-background/80 backdrop-blur-sm">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-medium flex items-center gap-2">
                    <Clock className="h-5 w-5" />
                    Recent Trading Activity
                  </h3>
                </div>
                <div className="max-h-64 overflow-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Date</TableHead>
                        <TableHead>Action</TableHead>
                        <TableHead>Symbol</TableHead>
                        <TableHead className="text-right">Quantity</TableHead>
                        <TableHead className="text-right">Price</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {tradingActivity.map((trade, i) => (
                        <TableRow key={i}>
                          <TableCell>{trade.date}</TableCell>
                          <TableCell>
                            <Badge variant={trade.action === 'BUY' ? 'default' : 'destructive'}>
                              {trade.action}
                            </Badge>
                          </TableCell>
                          <TableCell>{trade.symbol}</TableCell>
                          <TableCell className="text-right">{trade.quantity}</TableCell>
                          <TableCell className="text-right">${trade.price.toFixed(2)}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </Card>
              
              {/* Bot Settings Overview */}
              <Card className="p-6 bg-background/80 backdrop-blur-sm">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-medium flex items-center gap-2">
                    <Settings className="h-5 w-5" />
                    Bot Configuration
                  </h3>
                </div>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="font-medium">Strategy Type:</span>
                    <span>{strategyParams.type}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-medium">Timeframe:</span>
                    <span>{strategyParams.timeframe}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-medium">Max Position Size:</span>
                    <span>{strategyParams.riskManagement.maxPositionSize}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-medium">Stop Loss:</span>
                    <span>{strategyParams.riskManagement.stopLoss}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-medium">Take Profit:</span>
                    <span>{strategyParams.riskManagement.takeProfit}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-medium">Max Open Positions:</span>
                    <span>{strategyParams.riskManagement.maxOpenPositions}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-medium">Cost Basis:</span>
                    <span>${bot.costBasis.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-medium">Margin Used:</span>
                    <span>{(bot.margin * 100).toFixed(1)}%</span>
                  </div>
                </div>
              </Card>
            </div>
          </TabsContent>
          
          {/* Positions Tab */}
          <TabsContent value="positions">
            <Card className="p-6 bg-background/80 backdrop-blur-sm">
              <h3 className="text-xl font-medium mb-4 flex items-center gap-2">
                <Layers className="h-5 w-5" />
                Current Positions
              </h3>
              
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Symbol</TableHead>
                    <TableHead className="text-right">Quantity</TableHead>
                    <TableHead className="text-right">Avg. Price</TableHead>
                    <TableHead className="text-right">Current Price</TableHead>
                    <TableHead className="text-right">Market Value</TableHead>
                    <TableHead className="text-right">Unrealized P&L</TableHead>
                    <TableHead className="text-right">% Change</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {bot.positions.map((position) => {
                    const percentChange = ((position.currentPrice - position.avgPrice) / position.avgPrice) * 100;
                    return (
                      <TableRow key={position.symbol}>
                        <TableCell className="font-medium">{position.symbol}</TableCell>
                        <TableCell className="text-right">{position.quantity}</TableCell>
                        <TableCell className="text-right">${position.avgPrice.toFixed(2)}</TableCell>
                        <TableCell className="text-right">${position.currentPrice.toFixed(2)}</TableCell>
                        <TableCell className="text-right">${position.marketValue.toFixed(2)}</TableCell>
                        <TableCell className="text-right">
                          <span className={position.unrealizedPnL >= 0 ? "text-green-500" : "text-red-500"}>
                            ${position.unrealizedPnL.toFixed(2)}
                          </span>
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex items-center justify-end">
                            {percentChange >= 0 ? (
                              <ArrowUpRight className="h-4 w-4 text-green-500 mr-1" />
                            ) : (
                              <ArrowDownRight className="h-4 w-4 text-red-500 mr-1" />
                            )}
                            <span className={percentChange >= 0 ? "text-green-500" : "text-red-500"}>
                              {Math.abs(percentChange).toFixed(2)}%
                            </span>
                          </div>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
              
              {/* Add some margin utilization metrics */}
              <div className="mt-6 space-y-4">
                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-sm font-medium">Margin Utilization</span>
                    <span className="text-sm">{(bot.margin * 100).toFixed(1)}%</span>
                  </div>
                  <Progress value={bot.margin * 100} className="h-2" />
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <Card className="p-4">
                    <h4 className="text-sm text-muted-foreground mb-1">Total Cost Basis</h4>
                    <p className="text-2xl font-bold">${bot.costBasis.toLocaleString()}</p>
                  </Card>
                  
                  <Card className="p-4">
                    <h4 className="text-sm text-muted-foreground mb-1">Total Market Value</h4>
                    <p className="text-2xl font-bold">${totalMarketValue.toLocaleString()}</p>
                  </Card>
                  
                  <Card className="p-4">
                    <h4 className="text-sm text-muted-foreground mb-1">Available Cash</h4>
                    <p className="text-2xl font-bold">
                      ${(bot.costBasis * (1 - bot.margin)).toLocaleString()}
                    </p>
                  </Card>
                </div>
              </div>
            </Card>
          </TabsContent>
          
          {/* Strategy Tab */}
          <TabsContent value="strategy">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card className="p-6 bg-background/80 backdrop-blur-sm">
                <h3 className="text-xl font-medium mb-4 flex items-center gap-2">
                  <TrendingUp className="h-5 w-5" />
                  Strategy Parameters
                </h3>
                
                <div className="space-y-6">
                  <div>
                    <h4 className="text-lg font-medium mb-2">Entry Conditions</h4>
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Indicator</TableHead>
                          <TableHead>Condition</TableHead>
                          <TableHead>Value</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {strategyParams.entryConditions.map((condition, index) => (
                          <TableRow key={index}>
                            <TableCell>{condition.indicator}</TableCell>
                            <TableCell>{condition.condition}</TableCell>
                            <TableCell>{condition.value}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                  
                  <div>
                    <h4 className="text-lg font-medium mb-2">Exit Conditions</h4>
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Indicator</TableHead>
                          <TableHead>Condition</TableHead>
                          <TableHead>Value</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {strategyParams.exitConditions.map((condition, index) => (
                          <TableRow key={index}>
                            <TableCell>{condition.indicator}</TableCell>
                            <TableCell>{condition.condition}</TableCell>
                            <TableCell>{condition.value}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                </div>
              </Card>
              
              <Card className="p-6 bg-background/80 backdrop-blur-sm">
                <h3 className="text-xl font-medium mb-4 flex items-center gap-2">
                  <Shield className="h-5 w-5" />
                  Risk Management
                </h3>
                
                <div className="space-y-4">
                  <div>
                    <h4 className="text-lg font-medium mb-2">Risk Parameters</h4>
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="font-medium">Max Position Size:</span>
                        <span>{strategyParams.riskManagement.maxPositionSize}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="font-medium">Stop Loss:</span>
                        <span>{strategyParams.riskManagement.stopLoss}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="font-medium">Take Profit:</span>
                        <span>{strategyParams.riskManagement.takeProfit}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="font-medium">Max Open Positions:</span>
                        <span>{strategyParams.riskManagement.maxOpenPositions}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="text-lg font-medium mb-2">Margin Usage</h4>
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="font-medium">Current Leverage:</span>
                        <span>{(1 / (1 - bot.margin)).toFixed(2)}x</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="font-medium">Margin Used:</span>
                        <span>{(bot.margin * 100).toFixed(1)}%</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="font-medium">Available Margin:</span>
                        <span>{((1 - bot.margin) * 100).toFixed(1)}%</span>
                      </div>
                    </div>
                  </div>
                  
                  {/* Connected Assets section */}
                  <div>
                    <h4 className="text-lg font-medium mb-2">Connected Assets</h4>
                    <div className="flex flex-wrap gap-2">
                      {bot.assets.map((asset) => (
                        <Badge key={asset} variant="secondary">{asset}</Badge>
                      ))}
                    </div>
                  </div>
                </div>
              </Card>
            </div>
          </TabsContent>
          
          {/* Performance Tab */}
          <TabsContent value="performance">
            <Card className="p-6 bg-background/80 backdrop-blur-sm">
              <h3 className="text-xl font-medium mb-4 flex items-center gap-2">
                <BarChartIcon className="h-5 w-5" />
                Performance Metrics
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="text-lg font-medium mb-2">Daily Returns</h4>
                  <div className="h-64">
                    <LineChart data={dailyPerformance} showGrid showTooltip />
                  </div>
                </div>
                
                <div>
                  <h4 className="text-lg font-medium mb-2">Key Performance Indicators</h4>
                  <Table>
                    <TableBody>
                      <TableRow>
                        <TableCell className="font-medium">Total Return</TableCell>
                        <TableCell className="text-right">
                          <span className={pnlPercentage >= 0 ? "text-green-500" : "text-red-500"}>
                            {pnlPercentage >= 0 ? '+' : ''}{pnlPercentage.toFixed(2)}%
                          </span>
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell className="font-medium">Annualized Return</TableCell>
                        <TableCell className="text-right">
                          {(pnlPercentage * 3.65).toFixed(2)}%
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell className="font-medium">Win Rate</TableCell>
                        <TableCell className="text-right">62.5%</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell className="font-medium">Profit Factor</TableCell>
                        <TableCell className="text-right">1.85</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell className="font-medium">Sharpe Ratio</TableCell>
                        <TableCell className="text-right">1.82</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell className="font-medium">Max Drawdown</TableCell>
                        <TableCell className="text-right">-12.5%</TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </div>
                
                <div>
                  <h4 className="text-lg font-medium mb-2">Monthly Returns</h4>
                  <div className="h-64">
                    <BarChart 
                      data={{
                        labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
                        values: [3.2, -1.8, 4.5, 2.1, -0.5, 5.2]
                      }}
                    />
                  </div>
                </div>
                
                <div>
                  <h4 className="text-lg font-medium mb-2">Trade Distribution</h4>
                  <div className="h-64">
                    <PieChart
                      data={{
                        'Winning Trades': 62.5,
                        'Losing Trades': 37.5
                      }}
                      showLegend
                    />
                  </div>
                </div>
              </div>
            </Card>
          </TabsContent>
          
          {/* Risk Analysis Tab */}
          <TabsContent value="risk">
            <Card className="p-6 bg-background/80 backdrop-blur-sm">
              <h3 className="text-xl font-medium mb-4 flex items-center gap-2">
                <AlertCircle className="h-5 w-5" />
                Risk Analysis
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="text-lg font-medium mb-2">Risk Metrics</h4>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Metric</TableHead>
                        <TableHead className="text-right">Value</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {riskMetrics.map((metric) => (
                        <TableRow key={metric.name}>
                          <TableCell className="font-medium">{metric.name}</TableCell>
                          <TableCell className="text-right">
                            {metric.name.includes('Drawdown') ? 
                              `${metric.value}%` : 
                              metric.name.includes('Rate') ? 
                                `${metric.value}%` : 
                                metric.value
                            }
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
                
                <div>
                  <h4 className="text-lg font-medium mb-2">Drawdown History</h4>
                  <div className="h-64">
                    <LineChart 
                      data={[0, -2, -5, -8, -10, -12.5, -10, -7, -5, -8, -6, -3, 0, -2, -4]} 
                      showGrid 
                      showTooltip
                      colorOverride="hsl(var(--destructive))"
                    />
                  </div>
                </div>
                
                <div>
                  <h4 className="text-lg font-medium mb-2">Leverage Impact</h4>
                  <div className="space-y-3">
                    <div>
                      <div className="flex justify-between mb-1">
                        <span className="text-sm font-medium">Current Leverage</span>
                        <span className="text-sm">{(1 / (1 - bot.margin)).toFixed(2)}x</span>
                      </div>
                      <Progress value={(1 / (1 - bot.margin)) * 25} className="h-2" />
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <h5 className="text-sm text-muted-foreground mb-1">Profit Multiplier</h5>
                        <p className="text-lg font-bold">{(1 / (1 - bot.margin)).toFixed(2)}x</p>
                        <p className="text-xs text-muted-foreground">Higher leverage amplifies profits</p>
                      </div>
                      
                      <div>
                        <h5 className="text-sm text-muted-foreground mb-1">Loss Multiplier</h5>
                        <p className="text-lg font-bold">{(1 / (1 - bot.margin)).toFixed(2)}x</p>
                        <p className="text-xs text-muted-foreground">But also amplifies losses</p>
                      </div>
                    </div>
                    
                    <div>
                      <h5 className="text-sm font-medium">Liquidation Risk</h5>
                      <p className="text-xs text-muted-foreground mb-1">
                        Portfolio would be liquidated if losses exceed:
                      </p>
                      <p className="text-lg font-bold text-destructive">
                        {((1 - bot.margin) * 100).toFixed(1)}% of portfolio value
                      </p>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h4 className="text-lg font-medium mb-2">Asset Correlation</h4>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Asset Pair</TableHead>
                        <TableHead className="text-right">Correlation</TableHead>
                        <TableHead className="text-right">Risk Level</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      <TableRow>
                        <TableCell>AAPL-MSFT</TableCell>
                        <TableCell className="text-right">0.72</TableCell>
                        <TableCell className="text-right">
                          <Badge variant="warning">Medium</Badge>
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>MSFT-GOOGL</TableCell>
                        <TableCell className="text-right">0.68</TableCell>
                        <TableCell className="text-right">
                          <Badge variant="warning">Medium</Badge>
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>AAPL-GOOGL</TableCell>
                        <TableCell className="text-right">0.54</TableCell>
                        <TableCell className="text-right">
                          <Badge variant="secondary">Low</Badge>
                        </TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </div>
              </div>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </AnimatedBackdrop>
  )
}
