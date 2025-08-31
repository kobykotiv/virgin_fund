"use client"

import React, { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Slider } from '@/components/ui/slider'
import {
  Zap,
  TrendingUp,
  TrendingDown,
  Target,
  Settings,
  Play,
  Pause,
  RotateCcw,
  BarChart3,
  Brain,
  Cpu,
  Activity,
  CheckCircle,
  AlertTriangle
} from 'lucide-react'
import { Bot as BotType } from '@/types/bot'
import { Portfolio } from '@/types/portfolio'

interface OptimizationConfig {
  algorithm: 'grid_search' | 'random_search' | 'bayesian' | 'genetic' | 'reinforcement'
  maxIterations: number
  timeLimit: number // minutes
  parallelJobs: number
  earlyStopping: boolean
  earlyStoppingRounds: number
  crossValidation: boolean
  cvFolds: number
  objective: 'sharpe_ratio' | 'total_return' | 'max_drawdown' | 'win_rate' | 'profit_factor'
  constraints: {
    maxDrawdown: number
    maxPositionSize: number
    minWinRate: number
    maxVolatility: number
  }
}

interface OptimizationResult {
  id: string
  status: 'running' | 'completed' | 'failed'
  progress: number
  bestParameters: Record<string, any>
  bestScore: number
  iterations: number
  totalEvaluations: number
  optimizationHistory: Array<{
    iteration: number
    parameters: Record<string, any>
    score: number
    timestamp: Date
  }>
  parameterImportance: Array<{
    parameter: string
    importance: number
  }>
  convergencePlot: Array<{
    iteration: number
    bestScore: number
  }>
}

interface BotOptimizationProps {
  bot: BotType
  portfolio: Portfolio
  onRunOptimization: (config: OptimizationConfig) => Promise<OptimizationResult>
  onApplyOptimizedParameters: (parameters: Record<string, any>) => void
}

export function BotOptimization({
  bot,
  portfolio,
  onRunOptimization,
  onApplyOptimizedParameters
}: BotOptimizationProps) {
  const [optimizationConfig, setOptimizationConfig] = useState<OptimizationConfig>({
    algorithm: 'bayesian',
    maxIterations: 100,
    timeLimit: 30,
    parallelJobs: 4,
    earlyStopping: true,
    earlyStoppingRounds: 10,
    crossValidation: true,
    cvFolds: 5,
    objective: 'sharpe_ratio',
    constraints: {
      maxDrawdown: portfolio.riskParameters.maxDrawdown / 100,
      maxPositionSize: portfolio.riskParameters.maxPositionSize / 100,
      minWinRate: 0.5,
      maxVolatility: portfolio.riskParameters.volatilityLimit / 100
    }
  })

  const [optimizationResult, setOptimizationResult] = useState<OptimizationResult | null>(null)
  const [isRunning, setIsRunning] = useState(false)
  const [selectedTab, setSelectedTab] = useState('setup')

  const runOptimization = async () => {
    setIsRunning(true)
    setOptimizationResult(null)

    try {
      const result = await onRunOptimization(optimizationConfig)
      setOptimizationResult(result)
      setSelectedTab('results')
    } catch (error) {
      console.error('Optimization failed:', error)
      setOptimizationResult({
        id: 'failed',
        status: 'failed',
        progress: 0,
        bestParameters: {},
        bestScore: 0,
        iterations: 0,
        totalEvaluations: 0,
        optimizationHistory: [],
        parameterImportance: [],
        convergencePlot: []
      })
    } finally {
      setIsRunning(false)
    }
  }

  const getAlgorithmDescription = (algorithm: string) => {
    switch (algorithm) {
      case 'grid_search':
        return 'Systematically tests all parameter combinations within specified ranges'
      case 'random_search':
        return 'Randomly samples parameter combinations for efficient exploration'
      case 'bayesian':
        return 'Uses probabilistic models to intelligently select parameter combinations'
      case 'genetic':
        return 'Evolutionary algorithm that mimics natural selection'
      case 'reinforcement':
        return 'Learns optimal parameters through trial and reward'
      default:
        return ''
    }
  }

  const getObjectiveDescription = (objective: string) => {
    switch (objective) {
      case 'sharpe_ratio':
        return 'Risk-adjusted return (higher is better)'
      case 'total_return':
        return 'Total portfolio return (higher is better)'
      case 'max_drawdown':
        return 'Maximum drawdown (lower is better)'
      case 'win_rate':
        return 'Percentage of winning trades (higher is better)'
      case 'profit_factor':
        return 'Gross profit divided by gross loss (higher is better)'
      default:
        return ''
    }
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Brain className="w-5 h-5 mr-2" />
            Bot Optimization - {bot.name}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs value={selectedTab} onValueChange={setSelectedTab} className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="setup">Setup</TabsTrigger>
              <TabsTrigger value="constraints">Constraints</TabsTrigger>
              <TabsTrigger value="running" disabled={!isRunning && !optimizationResult}>Running</TabsTrigger>
              <TabsTrigger value="results" disabled={!optimizationResult}>Results</TabsTrigger>
            </TabsList>

            <TabsContent value="setup" className="space-y-4">
              <Alert>
                <Brain className="h-4 w-4" />
                <AlertDescription>
                  Optimize your bot's parameters using advanced algorithms to maximize performance while respecting risk constraints.
                </AlertDescription>
              </Alert>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="algorithm">Optimization Algorithm</Label>
                  <Select
                    value={optimizationConfig.algorithm}
                    onValueChange={(value: any) => setOptimizationConfig(prev => ({ ...prev, algorithm: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="grid_search">Grid Search</SelectItem>
                      <SelectItem value="random_search">Random Search</SelectItem>
                      <SelectItem value="bayesian">Bayesian Optimization</SelectItem>
                      <SelectItem value="genetic">Genetic Algorithm</SelectItem>
                      <SelectItem value="reinforcement">Reinforcement Learning</SelectItem>
                    </SelectContent>
                  </Select>
                  <p className="text-xs text-muted-foreground mt-1">
                    {getAlgorithmDescription(optimizationConfig.algorithm)}
                  </p>
                </div>
                <div>
                  <Label htmlFor="objective">Optimization Objective</Label>
                  <Select
                    value={optimizationConfig.objective}
                    onValueChange={(value: any) => setOptimizationConfig(prev => ({ ...prev, objective: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="sharpe_ratio">Sharpe Ratio</SelectItem>
                      <SelectItem value="total_return">Total Return</SelectItem>
                      <SelectItem value="max_drawdown">Max Drawdown</SelectItem>
                      <SelectItem value="win_rate">Win Rate</SelectItem>
                      <SelectItem value="profit_factor">Profit Factor</SelectItem>
                    </SelectContent>
                  </Select>
                  <p className="text-xs text-muted-foreground mt-1">
                    {getObjectiveDescription(optimizationConfig.objective)}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="max-iterations">Max Iterations</Label>
                  <Input
                    id="max-iterations"
                    type="number"
                    value={optimizationConfig.maxIterations}
                    onChange={(e) => setOptimizationConfig(prev => ({ ...prev, maxIterations: Number(e.target.value) }))}
                  />
                </div>
                <div>
                  <Label htmlFor="time-limit">Time Limit (minutes)</Label>
                  <Input
                    id="time-limit"
                    type="number"
                    value={optimizationConfig.timeLimit}
                    onChange={(e) => setOptimizationConfig(prev => ({ ...prev, timeLimit: Number(e.target.value) }))}
                  />
                </div>
                <div>
                  <Label htmlFor="parallel-jobs">Parallel Jobs</Label>
                  <Input
                    id="parallel-jobs"
                    type="number"
                    value={optimizationConfig.parallelJobs}
                    onChange={(e) => setOptimizationConfig(prev => ({ ...prev, parallelJobs: Number(e.target.value) }))}
                  />
                </div>
              </div>

              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="early-stopping"
                    checked={optimizationConfig.earlyStopping}
                    onChange={(e) => setOptimizationConfig(prev => ({ ...prev, earlyStopping: e.target.checked }))}
                  />
                  <Label htmlFor="early-stopping">Early Stopping</Label>
                </div>
                {optimizationConfig.earlyStopping && (
                  <div>
                    <Label htmlFor="early-stopping-rounds">Rounds</Label>
                    <Input
                      id="early-stopping-rounds"
                      type="number"
                      value={optimizationConfig.earlyStoppingRounds}
                      onChange={(e) => setOptimizationConfig(prev => ({ ...prev, earlyStoppingRounds: Number(e.target.value) }))}
                      className="w-20"
                    />
                  </div>
                )}
              </div>

              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="cross-validation"
                    checked={optimizationConfig.crossValidation}
                    onChange={(e) => setOptimizationConfig(prev => ({ ...prev, crossValidation: e.target.checked }))}
                  />
                  <Label htmlFor="cross-validation">Cross Validation</Label>
                </div>
                {optimizationConfig.crossValidation && (
                  <div>
                    <Label htmlFor="cv-folds">Folds</Label>
                    <Input
                      id="cv-folds"
                      type="number"
                      value={optimizationConfig.cvFolds}
                      onChange={(e) => setOptimizationConfig(prev => ({ ...prev, cvFolds: Number(e.target.value) }))}
                      className="w-20"
                    />
                  </div>
                )}
              </div>

              <div className="flex justify-end">
                <Button onClick={runOptimization} disabled={isRunning}>
                  {isRunning ? (
                    <>
                      <Play className="w-4 h-4 mr-2 animate-pulse" />
                      Running Optimization...
                    </>
                  ) : (
                    <>
                      <Zap className="w-4 h-4 mr-2" />
                      Start Optimization
                    </>
                  )}
                </Button>
              </div>
            </TabsContent>

            <TabsContent value="constraints" className="space-y-4">
              <Alert>
                <Shield className="h-4 w-4" />
                <AlertDescription>
                  Set risk constraints that the optimization must respect. Parameters violating these constraints will be penalized.
                </AlertDescription>
              </Alert>

              <div className="grid grid-cols-2 gap-6">
                <div>
                  <Label>Max Drawdown</Label>
                  <div className="mt-2">
                    <Slider
                      value={[optimizationConfig.constraints.maxDrawdown * 100]}
                      onValueChange={([value]) => setOptimizationConfig(prev => ({
                        ...prev,
                        constraints: { ...prev.constraints, maxDrawdown: value / 100 }
                      }))}
                      max={50}
                      step={0.5}
                      className="w-full"
                    />
                    <div className="text-sm text-muted-foreground mt-1">
                      {(optimizationConfig.constraints.maxDrawdown * 100).toFixed(1)}%
                    </div>
                  </div>
                </div>
                <div>
                  <Label>Max Position Size</Label>
                  <div className="mt-2">
                    <Slider
                      value={[optimizationConfig.constraints.maxPositionSize * 100]}
                      onValueChange={([value]) => setOptimizationConfig(prev => ({
                        ...prev,
                        constraints: { ...prev.constraints, maxPositionSize: value / 100 }
                      }))}
                      max={100}
                      step={1}
                      className="w-full"
                    />
                    <div className="text-sm text-muted-foreground mt-1">
                      {(optimizationConfig.constraints.maxPositionSize * 100).toFixed(1)}%
                    </div>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div>
                  <Label>Min Win Rate</Label>
                  <div className="mt-2">
                    <Slider
                      value={[optimizationConfig.constraints.minWinRate * 100]}
                      onValueChange={([value]) => setOptimizationConfig(prev => ({
                        ...prev,
                        constraints: { ...prev.constraints, minWinRate: value / 100 }
                      }))}
                      max={100}
                      step={1}
                      className="w-full"
                    />
                    <div className="text-sm text-muted-foreground mt-1">
                      {(optimizationConfig.constraints.minWinRate * 100).toFixed(1)}%
                    </div>
                  </div>
                </div>
                <div>
                  <Label>Max Volatility</Label>
                  <div className="mt-2">
                    <Slider
                      value={[optimizationConfig.constraints.maxVolatility * 100]}
                      onValueChange={([value]) => setOptimizationConfig(prev => ({
                        ...prev,
                        constraints: { ...prev.constraints, maxVolatility: value / 100 }
                      }))}
                      max={100}
                      step={0.5}
                      className="w-full"
                    />
                    <div className="text-sm text-muted-foreground mt-1">
                      {(optimizationConfig.constraints.maxVolatility * 100).toFixed(1)}%
                    </div>
                  </div>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="running" className="space-y-4">
              {isRunning && (
                <div className="text-center py-8">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                  <p className="text-lg font-medium">Running Optimization...</p>
                  <p className="text-muted-foreground">Using {optimizationConfig.algorithm} algorithm</p>
                  <div className="mt-4">
                    <div className="flex justify-between text-sm mb-2">
                      <span>Progress</span>
                      <span>0%</span>
                    </div>
                    <Progress value={0} />
                  </div>
                </div>
              )}

              {optimizationResult && optimizationResult.status === 'running' && (
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between text-sm mb-2">
                      <span>Progress</span>
                      <span>{optimizationResult.progress}%</span>
                    </div>
                    <Progress value={optimizationResult.progress} />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-blue-600">
                        {optimizationResult.iterations}
                      </div>
                      <div className="text-sm text-muted-foreground">Iterations</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-green-600">
                        {optimizationResult.bestScore.toFixed(4)}
                      </div>
                      <div className="text-sm text-muted-foreground">Best Score</div>
                    </div>
                  </div>
                  <div className="text-center text-muted-foreground">
                    <p>Exploring parameter space and evaluating combinations...</p>
                  </div>
                </div>
              )}
            </TabsContent>

            <TabsContent value="results" className="space-y-4">
              {optimizationResult && optimizationResult.status === 'completed' && (
                <>
                  {/* Best Parameters */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center">
                        <CheckCircle className="w-5 h-5 mr-2 text-green-600" />
                        Optimization Complete
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                        <div className="text-center">
                          <div className="text-2xl font-bold text-green-600">
                            {optimizationResult.bestScore.toFixed(4)}
                          </div>
                          <div className="text-sm text-muted-foreground">Best Score</div>
                        </div>
                        <div className="text-center">
                          <div className="text-2xl font-bold text-blue-600">
                            {optimizationResult.iterations}
                          </div>
                          <div className="text-sm text-muted-foreground">Iterations</div>
                        </div>
                        <div className="text-center">
                          <div className="text-2xl font-bold text-purple-600">
                            {optimizationResult.totalEvaluations}
                          </div>
                          <div className="text-sm text-muted-foreground">Evaluations</div>
                        </div>
                        <div className="text-center">
                          <div className="text-2xl font-bold text-orange-600">
                            {((Date.now() - optimizationResult.optimizationHistory[0]?.timestamp.getTime()) / 1000 / 60).toFixed(1)}m
                          </div>
                          <div className="text-sm text-muted-foreground">Duration</div>
                        </div>
                      </div>

                      <div className="flex justify-end">
                        <Button onClick={() => onApplyOptimizedParameters(optimizationResult.bestParameters)}>
                          Apply Optimized Parameters
                        </Button>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Parameter Importance */}
                  <Card>
                    <CardHeader>
                      <CardTitle>Parameter Importance</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {optimizationResult.parameterImportance.map((param, index) => (
                          <div key={index} className="flex items-center justify-between">
                            <div className="font-medium">{param.parameter}</div>
                            <div className="flex items-center space-x-2">
                              <Progress value={param.importance * 100} className="w-24" />
                              <span className="text-sm text-muted-foreground w-12">
                                {(param.importance * 100).toFixed(0)}%
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>

                  {/* Convergence Plot */}
                  <Card>
                    <CardHeader>
                      <CardTitle>Optimization Convergence</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-center py-8">
                        <BarChart3 className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
                        <p className="text-muted-foreground">
                          Convergence plot showing best score improvement over iterations
                        </p>
                        <p className="text-sm text-muted-foreground mt-2">
                          Final best score: {optimizationResult.bestScore.toFixed(4)}
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                </>
              )}

              {optimizationResult && optimizationResult.status === 'failed' && (
                <Alert className="border-red-500">
                  <AlertTriangle className="h-4 w-4" />
                  <AlertDescription>
                    Optimization failed to complete. Please check your configuration and try again.
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
