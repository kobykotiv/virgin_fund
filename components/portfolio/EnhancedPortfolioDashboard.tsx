"use client"

import React, { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  Portfolio,
  Bot as BotType
} from '@/types/bot'
import { PortfolioBotIntegration } from './PortfolioBotIntegration'
import { PortfolioRiskDashboard } from './PortfolioRiskDashboard'
import { PortfolioOverview } from './PortfolioOverview'
import {
  BarChart3,
  PieChart,
  TrendingUp,
  Bot,
  Shield,
  Settings,
  Activity
} from 'lucide-react'

interface EnhancedPortfolioDashboardProps {
  portfolio: Portfolio
  availableBots: BotType[]
  onUpdatePortfolio: (portfolio: Portfolio) => void
}

export function EnhancedPortfolioDashboard({
  portfolio,
  availableBots,
  onUpdatePortfolio
}: EnhancedPortfolioDashboardProps) {
  const [activeTab, setActiveTab] = useState('overview')

  // Mock risk metrics - in real implementation, this would come from API
  const riskMetrics = {
    currentDrawdown: 3.2,
    dailyPnL: 1250.50,
    volatility: 12.5,
    sharpeRatio: 1.8,
    maxDrawdown: portfolio.riskParameters?.maxDrawdown || 10,
    winRate: 0.68,
    totalPositions: portfolio.connectedBots?.length || 0,
    activeBots: portfolio.connectedBots?.filter(bot => bot.isActive).length || 0
  }

  // Mock alerts - in real implementation, this would come from risk monitoring system
  const alerts = [
    {
      id: '1',
      type: 'warning' as const,
      message: 'Drawdown approaching 80% of maximum allowed limit',
      timestamp: new Date().toISOString(),
      botId: 'growth-bot-1'
    },
    {
      id: '2',
      type: 'info' as const,
      message: 'Portfolio rebalancing completed successfully',
      timestamp: new Date(Date.now() - 3600000).toISOString()
    }
  ]

  const getPortfolioHealth = () => {
    const drawdownRatio = riskMetrics.currentDrawdown / riskMetrics.maxDrawdown
    if (drawdownRatio > 0.8) return { status: 'critical', color: 'text-red-600', bg: 'bg-red-50' }
    if (drawdownRatio > 0.6) return { status: 'warning', color: 'text-yellow-600', bg: 'bg-yellow-50' }
    return { status: 'healthy', color: 'text-green-600', bg: 'bg-green-50' }
  }

  const portfolioHealth = getPortfolioHealth()

  return (
    <div className="space-y-6">
      {/* Portfolio Header */}
      <Card className={`${portfolioHealth.bg} border-l-4 ${
        portfolioHealth.status === 'critical' ? 'border-l-red-500' :
        portfolioHealth.status === 'warning' ? 'border-l-yellow-500' : 'border-l-green-500'
      }`}>
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold">{portfolio.name}</h1>
              <p className="text-muted-foreground mt-1">{portfolio.focus}</p>
              <div className="flex items-center space-x-4 mt-3">
                <Badge variant="outline" className="text-sm">
                  Risk: {portfolio.risk}
                </Badge>
                <Badge variant="outline" className="text-sm">
                  {portfolio.connectedBots?.length || 0} Connected Bots
                </Badge>
                <Badge variant={portfolioHealth.status === 'healthy' ? 'default' : 'secondary'} className="text-sm">
                  {portfolioHealth.status === 'healthy' ? 'Healthy' :
                   portfolioHealth.status === 'warning' ? 'Warning' : 'Critical'}
                </Badge>
              </div>
            </div>
            <div className="text-right">
              <div className="text-3xl font-bold">${portfolio.value.toLocaleString()}</div>
              <div className={`text-lg ${portfolio.return >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                {portfolio.return >= 0 ? '+' : ''}{portfolio.return}%
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Navigation Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="overview" className="flex items-center">
            <BarChart3 className="w-4 h-4 mr-2" />
            Overview
          </TabsTrigger>
          <TabsTrigger value="bots" className="flex items-center">
            <Bot className="w-4 h-4 mr-2" />
            Bot Integration
          </TabsTrigger>
          <TabsTrigger value="risk" className="flex items-center">
            <Shield className="w-4 h-4 mr-2" />
            Risk Management
          </TabsTrigger>
          <TabsTrigger value="analytics" className="flex items-center">
            <TrendingUp className="w-4 h-4 mr-2" />
            Analytics
          </TabsTrigger>
          <TabsTrigger value="settings" className="flex items-center">
            <Settings className="w-4 h-4 mr-2" />
            Settings
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <PortfolioOverview />
        </TabsContent>

        <TabsContent value="bots" className="space-y-6">
          <PortfolioBotIntegration
            portfolio={portfolio}
            availableBots={availableBots}
            onUpdatePortfolio={onUpdatePortfolio}
          />
        </TabsContent>

        <TabsContent value="risk" className="space-y-6">
          <PortfolioRiskDashboard
            portfolio={portfolio}
            riskMetrics={riskMetrics}
            alerts={alerts}
          />
        </TabsContent>

        <TabsContent value="analytics" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Portfolio Analytics</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-12 text-muted-foreground">
                <PieChart className="w-16 h-16 mx-auto mb-4 opacity-50" />
                <p className="text-lg font-medium">Advanced Analytics Coming Soon</p>
                <p className="text-sm">Performance charts, drawdown analysis, and strategy attribution</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="settings" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Portfolio Settings</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-12 text-muted-foreground">
                <Settings className="w-16 h-16 mx-auto mb-4 opacity-50" />
                <p className="text-lg font-medium">Portfolio Configuration</p>
                <p className="text-sm">Risk parameters, rebalancing rules, and notification settings</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-3">
            <Button variant="outline">
              <Activity className="w-4 h-4 mr-2" />
              Rebalance Portfolio
            </Button>
            <Button variant="outline">
              <Shield className="w-4 h-4 mr-2" />
              Update Risk Limits
            </Button>
            <Button variant="outline">
              <Bot className="w-4 h-4 mr-2" />
              Sync All Bots
            </Button>
            <Button variant="outline">
              <TrendingUp className="w-4 h-4 mr-2" />
              Generate Report
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
