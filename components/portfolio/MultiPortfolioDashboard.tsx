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
import {
  Plus,
  TrendingUp,
  TrendingDown,
  BarChart3,
  PieChart,
  Activity,
  Target,
  Shield,
  AlertTriangle,
  CheckCircle,
  Settings,
  Copy,
  Trash2,
  Eye,
  EyeOff
} from 'lucide-react'
import { Portfolio } from '@/types/portfolio'
import { Bot as BotType } from '@/types/bot'

interface MultiPortfolioDashboardProps {
  portfolios: Portfolio[]
  connectedBots: BotType[]
  onCreatePortfolio: (portfolio: Omit<Portfolio, 'id'>) => void
  onUpdatePortfolio: (id: string, updates: Partial<Portfolio>) => void
  onDeletePortfolio: (id: string) => void
  onDuplicatePortfolio: (id: string) => void
}

export function MultiPortfolioDashboard({
  portfolios,
  connectedBots,
  onCreatePortfolio,
  onUpdatePortfolio,
  onDeletePortfolio,
  onDuplicatePortfolio
}: MultiPortfolioDashboardProps) {
  const [selectedTab, setSelectedTab] = useState('overview')
  const [selectedPortfolios, setSelectedPortfolios] = useState<string[]>([])
  const [isCreatingPortfolio, setIsCreatingPortfolio] = useState(false)
  const [newPortfolio, setNewPortfolio] = useState({
    name: '',
    description: '',
    initialCapital: 100000,
    riskParameters: {
      maxDrawdown: 20,
      maxPositionSize: 10,
      maxDailyLoss: 5,
      volatilityLimit: 25
    }
  })

  const totalValue = portfolios.reduce((sum, p) => sum + p.totalValue, 0)
  const totalReturn = portfolios.reduce((sum, p) => sum + p.totalReturn, 0) / portfolios.length
  const avgRiskScore = portfolios.reduce((sum, p) => sum + p.riskScore, 0) / portfolios.length

  const getPortfolioRiskColor = (riskScore: number) => {
    if (riskScore >= 80) return 'text-green-600'
    if (riskScore >= 60) return 'text-yellow-600'
    return 'text-red-600'
  }

  const getPortfolioRiskLabel = (riskScore: number) => {
    if (riskScore >= 80) return 'Low Risk'
    if (riskScore >= 60) return 'Medium Risk'
    return 'High Risk'
  }

  const handleCreatePortfolio = () => {
    if (newPortfolio.name.trim()) {
      onCreatePortfolio({
        ...newPortfolio,
        id: `portfolio_${Date.now()}`,
        totalValue: newPortfolio.initialCapital,
        totalReturn: 0,
        riskScore: 85, // Default good risk score
        positions: [],
        botConnections: [],
        createdAt: new Date(),
        updatedAt: new Date()
      })
      setNewPortfolio({
        name: '',
        description: '',
        initialCapital: 100000,
        riskParameters: {
          maxDrawdown: 20,
          maxPositionSize: 10,
          maxDailyLoss: 5,
          volatilityLimit: 25
        }
      })
      setIsCreatingPortfolio(false)
    }
  }

  const togglePortfolioSelection = (portfolioId: string) => {
    setSelectedPortfolios(prev =>
      prev.includes(portfolioId)
        ? prev.filter(id => id !== portfolioId)
        : [...prev, portfolioId]
    )
  }

  const selectedPortfolioData = portfolios.filter(p => selectedPortfolios.includes(p.id))
  const selectedTotalValue = selectedPortfolioData.reduce((sum, p) => sum + p.totalValue, 0)
  const selectedTotalReturn = selectedPortfolioData.length > 0
    ? selectedPortfolioData.reduce((sum, p) => sum + p.totalReturn, 0) / selectedPortfolioData.length
    : 0

  return (
    <div className="space-y-6">
      {/* Header with Actions */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Multi-Portfolio Dashboard</h2>
          <p className="text-muted-foreground">
            Manage multiple portfolios with cross-portfolio analytics
          </p>
        </div>
        <Button onClick={() => setIsCreatingPortfolio(true)}>
          <Plus className="w-4 h-4 mr-2" />
          New Portfolio
        </Button>
      </div>

      {/* Portfolio Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4 text-center">
            <BarChart3 className="w-8 h-8 mx-auto mb-2 text-blue-600" />
            <div className="text-2xl font-bold">{portfolios.length}</div>
            <div className="text-sm text-muted-foreground">Total Portfolios</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <TrendingUp className={`w-8 h-8 mx-auto mb-2 ${totalReturn >= 0 ? 'text-green-600' : 'text-red-600'}`} />
            <div className={`text-2xl font-bold ${totalReturn >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              ${(totalValue / 1000).toFixed(0)}K
            </div>
            <div className="text-sm text-muted-foreground">Total Value</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <Activity className="w-8 h-8 mx-auto mb-2 text-purple-600" />
            <div className={`text-2xl font-bold ${totalReturn >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              {(totalReturn * 100).toFixed(1)}%
            </div>
            <div className="text-sm text-muted-foreground">Avg Return</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <Shield className={`w-8 h-8 mx-auto mb-2 ${getPortfolioRiskColor(avgRiskScore)}`} />
            <div className={`text-2xl font-bold ${getPortfolioRiskColor(avgRiskScore)}`}>
              {avgRiskScore.toFixed(0)}
            </div>
            <div className="text-sm text-muted-foreground">Avg Risk Score</div>
          </CardContent>
        </Card>
      </div>

      <Tabs value={selectedTab} onValueChange={setSelectedTab} className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="comparison">Comparison</TabsTrigger>
          <TabsTrigger value="allocation">Allocation</TabsTrigger>
          <TabsTrigger value="risk">Risk Analysis</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          {/* Create Portfolio Modal */}
          {isCreatingPortfolio && (
            <Card>
              <CardHeader>
                <CardTitle>Create New Portfolio</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="portfolio-name">Name</Label>
                    <Input
                      id="portfolio-name"
                      value={newPortfolio.name}
                      onChange={(e) => setNewPortfolio(prev => ({ ...prev, name: e.target.value }))}
                      placeholder="My Portfolio"
                    />
                  </div>
                  <div>
                    <Label htmlFor="initial-capital">Initial Capital</Label>
                    <Input
                      id="initial-capital"
                      type="number"
                      value={newPortfolio.initialCapital}
                      onChange={(e) => setNewPortfolio(prev => ({ ...prev, initialCapital: Number(e.target.value) }))}
                    />
                  </div>
                </div>
                <div>
                  <Label htmlFor="portfolio-description">Description (Optional)</Label>
                  <Input
                    id="portfolio-description"
                    value={newPortfolio.description}
                    onChange={(e) => setNewPortfolio(prev => ({ ...prev, description: e.target.value }))}
                    placeholder="Portfolio description"
                  />
                </div>
                <div className="flex justify-end space-x-2">
                  <Button variant="outline" onClick={() => setIsCreatingPortfolio(false)}>
                    Cancel
                  </Button>
                  <Button onClick={handleCreatePortfolio}>
                    Create Portfolio
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Portfolio List */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {portfolios.map((portfolio) => (
              <Card key={portfolio.id} className="relative">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">{portfolio.name}</CardTitle>
                    <div className="flex space-x-1">
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => togglePortfolioSelection(portfolio.id)}
                      >
                        {selectedPortfolios.includes(portfolio.id) ? (
                          <Eye className="w-4 h-4" />
                        ) : (
                          <EyeOff className="w-4 h-4" />
                        )}
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => onDuplicatePortfolio(portfolio.id)}
                      >
                        <Copy className="w-4 h-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => onDeletePortfolio(portfolio.id)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                  {portfolio.description && (
                    <p className="text-sm text-muted-foreground">{portfolio.description}</p>
                  )}
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">Value</span>
                      <span className="font-medium">${portfolio.totalValue.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">Return</span>
                      <span className={`font-medium ${portfolio.totalReturn >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                        {(portfolio.totalReturn * 100).toFixed(1)}%
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">Risk Score</span>
                      <Badge className={getPortfolioRiskColor(portfolio.riskScore)}>
                        {getPortfolioRiskLabel(portfolio.riskScore)}
                      </Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">Bots Connected</span>
                      <span className="font-medium">{portfolio.botConnections.length}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="comparison" className="space-y-4">
          {selectedPortfolios.length === 0 ? (
            <Alert>
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>
                Select portfolios from the overview tab to compare them here.
              </AlertDescription>
            </Alert>
          ) : (
            <>
              {/* Selected Portfolios Summary */}
              <Card>
                <CardHeader>
                  <CardTitle>Portfolio Comparison Summary</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-blue-600">
                        {selectedPortfolios.length}
                      </div>
                      <div className="text-sm text-muted-foreground">Selected</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-green-600">
                        ${(selectedTotalValue / 1000).toFixed(0)}K
                      </div>
                      <div className="text-sm text-muted-foreground">Combined Value</div>
                    </div>
                    <div className="text-center">
                      <div className={`text-2xl font-bold ${selectedTotalReturn >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                        {(selectedTotalReturn * 100).toFixed(1)}%
                      </div>
                      <div className="text-sm text-muted-foreground">Avg Return</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-purple-600">
                        {selectedPortfolioData.reduce((sum, p) => sum + p.botConnections.length, 0)}
                      </div>
                      <div className="text-sm text-muted-foreground">Total Bots</div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Individual Portfolio Comparison */}
              <div className="space-y-4">
                {selectedPortfolioData.map((portfolio) => (
                  <Card key={portfolio.id}>
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="font-medium">{portfolio.name}</h3>
                        <Badge className={getPortfolioRiskColor(portfolio.riskScore)}>
                          {getPortfolioRiskLabel(portfolio.riskScore)}
                        </Badge>
                      </div>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                        <div>
                          <span className="text-muted-foreground">Value:</span>
                          <span className="ml-2 font-medium">${portfolio.totalValue.toLocaleString()}</span>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Return:</span>
                          <span className={`ml-2 font-medium ${portfolio.totalReturn >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                            {(portfolio.totalReturn * 100).toFixed(1)}%
                          </span>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Positions:</span>
                          <span className="ml-2 font-medium">{portfolio.positions.length}</span>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Bots:</span>
                          <span className="ml-2 font-medium">{portfolio.botConnections.length}</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </>
          )}
        </TabsContent>

        <TabsContent value="allocation" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Cross-Portfolio Allocation</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {portfolios.map((portfolio) => {
                  const allocation = (portfolio.totalValue / totalValue) * 100
                  return (
                    <div key={portfolio.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex-1">
                        <div className="font-medium">{portfolio.name}</div>
                        <div className="text-sm text-muted-foreground">
                          ${portfolio.totalValue.toLocaleString()} | {(portfolio.totalReturn * 100).toFixed(1)}% return
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-lg font-bold text-blue-600">
                          {allocation.toFixed(1)}%
                        </div>
                        <div className="text-sm text-muted-foreground">of total</div>
                      </div>
                      <div className="ml-4 w-24">
                        <Progress value={allocation} />
                      </div>
                    </div>
                  )
                })}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="risk" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Cross-Portfolio Risk Analysis</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-medium mb-4">Risk Distribution</h3>
                  <div className="space-y-3">
                    {portfolios.map((portfolio) => (
                      <div key={portfolio.id} className="flex items-center justify-between">
                        <span className="text-sm">{portfolio.name}</span>
                        <div className="flex items-center space-x-2">
                          <Progress value={portfolio.riskScore} className="w-20" />
                          <span className={`text-sm font-medium ${getPortfolioRiskColor(portfolio.riskScore)}`}>
                            {portfolio.riskScore}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                <div>
                  <h3 className="font-medium mb-4">Risk Summary</h3>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Average Risk Score</span>
                      <span className={`font-medium ${getPortfolioRiskColor(avgRiskScore)}`}>
                        {avgRiskScore.toFixed(1)}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Lowest Risk Portfolio</span>
                      <span className="font-medium">
                        {portfolios.reduce((min, p) => p.riskScore < min.riskScore ? p : min).name}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Highest Risk Portfolio</span>
                      <span className="font-medium">
                        {portfolios.reduce((max, p) => p.riskScore > max.riskScore ? p : max).name}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Risk Diversity</span>
                      <span className="font-medium">
                        {portfolios.length > 1 ? 'Good' : 'Limited'}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
