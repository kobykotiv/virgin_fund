"use client"
import React, { useState, useCallback } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  Plus,
  Trash2,
  Play,
  Save,
  TrendingUp,
  TrendingDown,
  BarChart3,
  Zap,
  Target,
  AlertTriangle
} from 'lucide-react'

interface IndicatorConfig {
  id: string
  type: 'sma' | 'ema' | 'rsi' | 'macd' | 'bollinger' | 'stochastic' | 'atr' | 'cci' | 'williams' | 'obv'
  name: string
  params: Record<string, number>
  color: string
}

interface Condition {
  id: string
  indicatorId: string
  operator: '>' | '<' | '>=' | '<=' | '==' | 'crosses_above' | 'crosses_below'
  value: number
  logic: 'AND' | 'OR'
}

interface Strategy {
  id: string
  name: string
  description: string
  indicators: IndicatorConfig[]
  entryConditions: Condition[]
  exitConditions: Condition[]
  riskManagement: {
    stopLoss: number
    takeProfit: number
    maxDrawdown: number
  }
  status: 'draft' | 'active' | 'inactive'
  createdAt: string
  lastModified: string
}

const INDICATOR_TYPES = [
  { value: 'sma', label: 'Simple Moving Average', params: { period: 20 } },
  { value: 'ema', label: 'Exponential Moving Average', params: { period: 20 } },
  { value: 'rsi', label: 'Relative Strength Index', params: { period: 14 } },
  { value: 'macd', label: 'MACD', params: { fastPeriod: 12, slowPeriod: 26, signalPeriod: 9 } },
  { value: 'bollinger', label: 'Bollinger Bands', params: { period: 20, standardDeviations: 2 } },
  { value: 'stochastic', label: 'Stochastic Oscillator', params: { kPeriod: 14, dPeriod: 3 } },
  { value: 'atr', label: 'Average True Range', params: { period: 14 } },
  { value: 'cci', label: 'Commodity Channel Index', params: { period: 20 } },
  { value: 'williams', label: 'Williams %R', params: { period: 14 } },
  { value: 'obv', label: 'On-Balance Volume', params: {} as Record<string, number> }
]

const COLORS = ['#3b82f6', '#ef4444', '#10b981', '#f59e0b', '#8b5cf6', '#06b6d4', '#84cc16', '#f97316']

export const StrategyBuilderWindow: React.FC = () => {
  const [strategies, setStrategies] = useState<Strategy[]>([])
  const [currentStrategy, setCurrentStrategy] = useState<Strategy>({
    id: '',
    name: '',
    description: '',
    indicators: [],
    entryConditions: [],
    exitConditions: [],
    riskManagement: {
      stopLoss: 5,
      takeProfit: 10,
      maxDrawdown: 20
    },
    status: 'draft',
    createdAt: new Date().toISOString(),
    lastModified: new Date().toISOString()
  })
  const [selectedTab, setSelectedTab] = useState('indicators')
  const [testResults, setTestResults] = useState<any>(null)

  const addIndicator = useCallback(() => {
    const indicatorType = INDICATOR_TYPES[0]
    const newIndicator: IndicatorConfig = {
      id: `indicator_${Date.now()}`,
      type: indicatorType.value as any,
      name: `${indicatorType.label} ${currentStrategy.indicators.length + 1}`,
      params: { ...indicatorType.params },
      color: COLORS[currentStrategy.indicators.length % COLORS.length]
    }

    setCurrentStrategy(prev => ({
      ...prev,
      indicators: [...prev.indicators, newIndicator],
      lastModified: new Date().toISOString()
    }))
  }, [currentStrategy.indicators.length])

  const removeIndicator = useCallback((id: string) => {
    setCurrentStrategy(prev => ({
      ...prev,
      indicators: prev.indicators.filter(ind => ind.id !== id),
      entryConditions: prev.entryConditions.filter(cond => cond.indicatorId !== id),
      exitConditions: prev.exitConditions.filter(cond => cond.indicatorId !== id),
      lastModified: new Date().toISOString()
    }))
  }, [])

  const updateIndicator = useCallback((id: string, updates: Partial<IndicatorConfig>) => {
    setCurrentStrategy(prev => ({
      ...prev,
      indicators: prev.indicators.map(ind =>
        ind.id === id ? { ...ind, ...updates } : ind
      ),
      lastModified: new Date().toISOString()
    }))
  }, [])

  const addCondition = useCallback((type: 'entry' | 'exit') => {
    if (currentStrategy.indicators.length === 0) return

    const newCondition: Condition = {
      id: `condition_${Date.now()}`,
      indicatorId: currentStrategy.indicators[0].id,
      operator: '>',
      value: 0,
      logic: 'AND'
    }

    setCurrentStrategy(prev => ({
      ...prev,
      [type === 'entry' ? 'entryConditions' : 'exitConditions']: [
        ...(type === 'entry' ? prev.entryConditions : prev.exitConditions),
        newCondition
      ],
      lastModified: new Date().toISOString()
    }))
  }, [currentStrategy.indicators])

  const removeCondition = useCallback((type: 'entry' | 'exit', id: string) => {
    setCurrentStrategy(prev => ({
      ...prev,
      [type === 'entry' ? 'entryConditions' : 'exitConditions']:
        (type === 'entry' ? prev.entryConditions : prev.exitConditions).filter(cond => cond.id !== id),
      lastModified: new Date().toISOString()
    }))
  }, [])

  const updateCondition = useCallback((type: 'entry' | 'exit', id: string, updates: Partial<Condition>) => {
    setCurrentStrategy(prev => ({
      ...prev,
      [type === 'entry' ? 'entryConditions' : 'exitConditions']:
        (type === 'entry' ? prev.entryConditions : prev.exitConditions).map(cond =>
          cond.id === id ? { ...cond, ...updates } : cond
        ),
      lastModified: new Date().toISOString()
    }))
  }, [])

  const saveStrategy = useCallback(() => {
    if (!currentStrategy.name.trim()) return

    const strategyToSave = {
      ...currentStrategy,
      id: currentStrategy.id || `strategy_${Date.now()}`,
      lastModified: new Date().toISOString()
    }

    setStrategies(prev => {
      const existingIndex = prev.findIndex(s => s.id === strategyToSave.id)
      if (existingIndex >= 0) {
        const updated = [...prev]
        updated[existingIndex] = strategyToSave
        return updated
      }
      return [...prev, strategyToSave]
    })

    // Save to localStorage
    localStorage.setItem('tradingStrategies', JSON.stringify(
      strategies.find(s => s.id === strategyToSave.id)
        ? strategies.map(s => s.id === strategyToSave.id ? strategyToSave : s)
        : [...strategies, strategyToSave]
    ))

    setCurrentStrategy(strategyToSave)
  }, [currentStrategy, strategies])

  const testStrategy = useCallback(async () => {
    // Mock strategy testing - in real implementation, this would run against historical data
    setTestResults({
      totalTrades: 45,
      winRate: 0.62,
      totalReturn: 15.8,
      maxDrawdown: 8.2,
      sharpeRatio: 1.45,
      trades: [
        { date: '2025-01-15', type: 'BUY', price: 150.25, result: 'WIN' },
        { date: '2025-01-20', type: 'SELL', price: 165.80, result: 'WIN' },
        // ... more mock trades
      ]
    })
  }, [])

  const loadStrategy = useCallback((strategy: Strategy) => {
    setCurrentStrategy(strategy)
  }, [])

  const createNewStrategy = useCallback(() => {
    setCurrentStrategy({
      id: '',
      name: '',
      description: '',
      indicators: [],
      entryConditions: [],
      exitConditions: [],
      riskManagement: {
        stopLoss: 5,
        takeProfit: 10,
        maxDrawdown: 20
      },
      status: 'draft',
      createdAt: new Date().toISOString(),
      lastModified: new Date().toISOString()
    })
  }, [])

  return (
    <div className="w-full h-full bg-background p-4 overflow-auto">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold">Strategy Builder</h2>
          <p className="text-muted-foreground">Create and test automated trading strategies</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={createNewStrategy}>
            <Plus className="w-4 h-4 mr-2" />
            New Strategy
          </Button>
          <Button onClick={saveStrategy} disabled={!currentStrategy.name.trim()}>
            <Save className="w-4 h-4 mr-2" />
            Save
          </Button>
          <Button onClick={testStrategy} variant="secondary">
            <Play className="w-4 h-4 mr-2" />
            Test Strategy
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Strategy List */}
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle className="text-lg">Saved Strategies</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {strategies.length === 0 ? (
                <p className="text-muted-foreground text-sm">No strategies saved yet</p>
              ) : (
                strategies.map(strategy => (
                  <div
                    key={strategy.id}
                    className="p-3 border rounded cursor-pointer hover:bg-muted/50"
                    onClick={() => loadStrategy(strategy)}
                  >
                    <div className="font-medium">{strategy.name}</div>
                    <div className="text-sm text-muted-foreground">
                      {strategy.indicators.length} indicators • {strategy.entryConditions.length} entry conditions
                    </div>
                    <Badge variant={strategy.status === 'active' ? 'default' : 'secondary'} className="mt-1">
                      {strategy.status}
                    </Badge>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>

        {/* Strategy Builder */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="text-lg">Strategy Configuration</CardTitle>
          </CardHeader>
          <CardContent>
            <Tabs value={selectedTab} onValueChange={setSelectedTab}>
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="basic">Basic</TabsTrigger>
                <TabsTrigger value="indicators">Indicators</TabsTrigger>
                <TabsTrigger value="conditions">Conditions</TabsTrigger>
                <TabsTrigger value="risk">Risk</TabsTrigger>
              </TabsList>

              <TabsContent value="basic" className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="strategy-name">Strategy Name</Label>
                    <Input
                      id="strategy-name"
                      value={currentStrategy.name}
                      onChange={(e) => setCurrentStrategy(prev => ({ ...prev, name: e.target.value }))}
                      placeholder="e.g., RSI Momentum Strategy"
                    />
                  </div>
                  <div>
                    <Label htmlFor="strategy-status">Status</Label>
                    <Select
                      value={currentStrategy.status}
                      onValueChange={(value: 'draft' | 'active' | 'inactive') =>
                        setCurrentStrategy(prev => ({ ...prev, status: value }))
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="draft">Draft</SelectItem>
                        <SelectItem value="active">Active</SelectItem>
                        <SelectItem value="inactive">Inactive</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div>
                  <Label htmlFor="strategy-description">Description</Label>
                  <Input
                    id="strategy-description"
                    value={currentStrategy.description}
                    onChange={(e) => setCurrentStrategy(prev => ({ ...prev, description: e.target.value }))}
                    placeholder="Brief description of your strategy"
                  />
                </div>
              </TabsContent>

              <TabsContent value="indicators" className="space-y-4">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-medium">Technical Indicators</h3>
                  <Button onClick={addIndicator} size="sm">
                    <Plus className="w-4 h-4 mr-2" />
                    Add Indicator
                  </Button>
                </div>

                <div className="space-y-3">
                  {currentStrategy.indicators.map(indicator => (
                    <Card key={indicator.id} className="p-4">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-2">
                          <div
                            className="w-4 h-4 rounded"
                            style={{ backgroundColor: indicator.color }}
                          />
                          <span className="font-medium">{indicator.name}</span>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => removeIndicator(indicator.id)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>

                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <Label>Type</Label>
                          <Select
                            value={indicator.type}
                            onValueChange={(value: any) => updateIndicator(indicator.id, { type: value })}
                          >
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              {INDICATOR_TYPES.map(type => (
                                <SelectItem key={type.value} value={type.value}>
                                  {type.label}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>

                        {Object.entries(indicator.params).map(([param, value]) => (
                          <div key={param}>
                            <Label>{param.replace(/([A-Z])/g, ' $1').toLowerCase()}</Label>
                            <Input
                              type="number"
                              value={value}
                              onChange={(e) => updateIndicator(indicator.id, {
                                params: { ...indicator.params, [param]: parseFloat(e.target.value) || 0 }
                              })}
                            />
                          </div>
                        ))}
                      </div>
                    </Card>
                  ))}

                  {currentStrategy.indicators.length === 0 && (
                    <div className="text-center py-8 text-muted-foreground">
                      <BarChart3 className="w-12 h-12 mx-auto mb-4 opacity-50" />
                      <p>No indicators added yet</p>
                      <p className="text-sm">Add technical indicators to build your strategy</p>
                    </div>
                  )}
                </div>
              </TabsContent>

              <TabsContent value="conditions" className="space-y-6">
                {/* Entry Conditions */}
                <div>
                  <div className="flex justify-between items-center mb-4">
                    <h4 className="text-lg font-medium flex items-center">
                      <TrendingUp className="w-5 h-5 mr-2 text-green-500" />
                      Entry Conditions
                    </h4>
                    <Button onClick={() => addCondition('entry')} size="sm" disabled={currentStrategy.indicators.length === 0}>
                      <Plus className="w-4 h-4 mr-2" />
                      Add Entry
                    </Button>
                  </div>

                  <div className="space-y-3">
                    {currentStrategy.entryConditions.map(condition => (
                      <Card key={condition.id} className="p-3">
                        <div className="flex items-center gap-3">
                          <Select
                            value={condition.indicatorId}
                            onValueChange={(value) => updateCondition('entry', condition.id, { indicatorId: value })}
                          >
                            <SelectTrigger className="w-40">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              {currentStrategy.indicators.map(ind => (
                                <SelectItem key={ind.id} value={ind.id}>
                                  {ind.name}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>

                          <Select
                            value={condition.operator}
                            onValueChange={(value: any) => updateCondition('entry', condition.id, { operator: value })}
                          >
                            <SelectTrigger className="w-32">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value=">">{'>'}</SelectItem>
                              <SelectItem value="<">{'<'}</SelectItem>
                              <SelectItem value=">=">{'>='}</SelectItem>
                              <SelectItem value="<=">{'<='}</SelectItem>
                              <SelectItem value="==">==</SelectItem>
                              <SelectItem value="crosses_above">Crosses Above</SelectItem>
                              <SelectItem value="crosses_below">Crosses Below</SelectItem>
                            </SelectContent>
                          </Select>

                          <Input
                            type="number"
                            value={condition.value}
                            onChange={(e) => updateCondition('entry', condition.id, { value: parseFloat(e.target.value) || 0 })}
                            className="w-24"
                          />

                          <Select
                            value={condition.logic}
                            onValueChange={(value: any) => updateCondition('entry', condition.id, { logic: value })}
                          >
                            <SelectTrigger className="w-20">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="AND">AND</SelectItem>
                              <SelectItem value="OR">OR</SelectItem>
                            </SelectContent>
                          </Select>

                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => removeCondition('entry', condition.id)}
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </Card>
                    ))}

                    {currentStrategy.entryConditions.length === 0 && (
                      <div className="text-center py-4 text-muted-foreground">
                        <Target className="w-8 h-8 mx-auto mb-2 opacity-50" />
                        <p className="text-sm">No entry conditions defined</p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Exit Conditions */}
                <div>
                  <div className="flex justify-between items-center mb-4">
                    <h4 className="text-lg font-medium flex items-center">
                      <TrendingDown className="w-5 h-5 mr-2 text-red-500" />
                      Exit Conditions
                    </h4>
                    <Button onClick={() => addCondition('exit')} size="sm" disabled={currentStrategy.indicators.length === 0}>
                      <Plus className="w-4 h-4 mr-2" />
                      Add Exit
                    </Button>
                  </div>

                  <div className="space-y-3">
                    {currentStrategy.exitConditions.map(condition => (
                      <Card key={condition.id} className="p-3">
                        <div className="flex items-center gap-3">
                          <Select
                            value={condition.indicatorId}
                            onValueChange={(value) => updateCondition('exit', condition.id, { indicatorId: value })}
                          >
                            <SelectTrigger className="w-40">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              {currentStrategy.indicators.map(ind => (
                                <SelectItem key={ind.id} value={ind.id}>
                                  {ind.name}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>

                          <Select
                            value={condition.operator}
                            onValueChange={(value: any) => updateCondition('exit', condition.id, { operator: value })}
                          >
                            <SelectTrigger className="w-32">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value=">">{'>'}</SelectItem>
                              <SelectItem value="<">{'<'}</SelectItem>
                              <SelectItem value=">=">{'>='}</SelectItem>
                              <SelectItem value="<=">{'<='}</SelectItem>
                              <SelectItem value="==">==</SelectItem>
                              <SelectItem value="crosses_above">Crosses Above</SelectItem>
                              <SelectItem value="crosses_below">Crosses Below</SelectItem>
                            </SelectContent>
                          </Select>

                          <Input
                            type="number"
                            value={condition.value}
                            onChange={(e) => updateCondition('exit', condition.id, { value: parseFloat(e.target.value) || 0 })}
                            className="w-24"
                          />

                          <Select
                            value={condition.logic}
                            onValueChange={(value: any) => updateCondition('exit', condition.id, { logic: value })}
                          >
                            <SelectTrigger className="w-20">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="AND">AND</SelectItem>
                              <SelectItem value="OR">OR</SelectItem>
                            </SelectContent>
                          </Select>

                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => removeCondition('exit', condition.id)}
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </Card>
                    ))}

                    {currentStrategy.exitConditions.length === 0 && (
                      <div className="text-center py-4 text-muted-foreground">
                        <AlertTriangle className="w-8 h-8 mx-auto mb-2 opacity-50" />
                        <p className="text-sm">No exit conditions defined</p>
                      </div>
                    )}
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="risk" className="space-y-4">
                <h3 className="text-lg font-medium">Risk Management</h3>

                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <Label htmlFor="stop-loss">Stop Loss (%)</Label>
                    <Input
                      id="stop-loss"
                      type="number"
                      step="0.1"
                      value={currentStrategy.riskManagement.stopLoss}
                      onChange={(e) => setCurrentStrategy(prev => ({
                        ...prev,
                        riskManagement: {
                          ...prev.riskManagement,
                          stopLoss: parseFloat(e.target.value) || 0
                        }
                      }))}
                    />
                  </div>

                  <div>
                    <Label htmlFor="take-profit">Take Profit (%)</Label>
                    <Input
                      id="take-profit"
                      type="number"
                      step="0.1"
                      value={currentStrategy.riskManagement.takeProfit}
                      onChange={(e) => setCurrentStrategy(prev => ({
                        ...prev,
                        riskManagement: {
                          ...prev.riskManagement,
                          takeProfit: parseFloat(e.target.value) || 0
                        }
                      }))}
                    />
                  </div>

                  <div>
                    <Label htmlFor="max-drawdown">Max Drawdown (%)</Label>
                    <Input
                      id="max-drawdown"
                      type="number"
                      step="0.1"
                      value={currentStrategy.riskManagement.maxDrawdown}
                      onChange={(e) => setCurrentStrategy(prev => ({
                        ...prev,
                        riskManagement: {
                          ...prev.riskManagement,
                          maxDrawdown: parseFloat(e.target.value) || 0
                        }
                      }))}
                    />
                  </div>
                </div>

                <div className="p-4 bg-muted/50 rounded">
                  <h4 className="font-medium mb-2">Risk Summary</h4>
                  <div className="grid grid-cols-3 gap-4 text-sm">
                    <div>
                      <span className="text-muted-foreground">Risk/Reward:</span>
                      <span className="ml-2 font-medium">
                        1:{(currentStrategy.riskManagement.takeProfit / currentStrategy.riskManagement.stopLoss).toFixed(1)}
                      </span>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Max Loss:</span>
                      <span className="ml-2 font-medium text-red-600">
                        -{currentStrategy.riskManagement.stopLoss}%
                      </span>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Max Gain:</span>
                      <span className="ml-2 font-medium text-green-600">
                        +{currentStrategy.riskManagement.takeProfit}%
                      </span>
                    </div>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>

      {/* Test Results */}
      {testResults && (
        <Card className="mt-6">
          <CardHeader>
            <CardTitle className="text-lg flex items-center">
              <Zap className="w-5 h-5 mr-2" />
              Backtest Results
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">{testResults.totalTrades}</div>
                <div className="text-sm text-muted-foreground">Total Trades</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">{(testResults.winRate * 100).toFixed(1)}%</div>
                <div className="text-sm text-muted-foreground">Win Rate</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">+{testResults.totalReturn}%</div>
                <div className="text-sm text-muted-foreground">Total Return</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-red-600">-{testResults.maxDrawdown}%</div>
                <div className="text-sm text-muted-foreground">Max Drawdown</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-600">{testResults.sharpeRatio}</div>
                <div className="text-sm text-muted-foreground">Sharpe Ratio</div>
              </div>
            </div>

            <div>
              <h4 className="font-medium mb-3">Recent Trades</h4>
              <div className="space-y-2 max-h-40 overflow-y-auto">
                {testResults.trades.slice(0, 10).map((trade: any, index: number) => (
                  <div key={index} className="flex justify-between items-center p-2 bg-muted/50 rounded">
                    <div className="flex items-center gap-3">
                      <Badge variant={trade.type === 'BUY' ? 'default' : 'destructive'}>
                        {trade.type}
                      </Badge>
                      <span className="text-sm">{trade.date}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-sm">${trade.price}</span>
                      <Badge variant={trade.result === 'WIN' ? 'default' : 'secondary'}>
                        {trade.result}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
