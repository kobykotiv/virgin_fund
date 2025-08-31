"use client"
import React, { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Play, Pause, Settings, TrendingUp, AlertTriangle } from 'lucide-react'

interface TradingBot {
  id: string
  name: string
  status: 'running' | 'stopped' | 'error'
  strategy: string
  portfolioId: string
  lastRun: string
  pnl: number
}

export const BotsWindow: React.FC = () => {
  const [bots, setBots] = useState<TradingBot[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Load bots from localStorage or API
    loadBots()
  }, [])

  const loadBots = () => {
    const stored = localStorage.getItem('tradingBots')
    if (stored) {
      setBots(JSON.parse(stored))
    } else {
      // Mock data for demonstration
      setBots([
        {
          id: '1',
          name: 'Momentum Bot',
          status: 'running',
          strategy: 'Momentum',
          portfolioId: 'portfolio-1',
          lastRun: new Date().toISOString(),
          pnl: 1250.50
        },
        {
          id: '2',
          name: 'Mean Reversion Bot',
          status: 'stopped',
          strategy: 'Mean Reversion',
          portfolioId: 'portfolio-2',
          lastRun: new Date(Date.now() - 3600000).toISOString(),
          pnl: -320.75
        }
      ])
    }
    setLoading(false)
  }

  const toggleBotStatus = (botId: string) => {
    setBots(prev => prev.map(bot =>
      bot.id === botId
        ? { ...bot, status: bot.status === 'running' ? 'stopped' : 'running' as const }
        : bot
    ))
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'running': return 'bg-green-500'
      case 'stopped': return 'bg-gray-500'
      case 'error': return 'bg-red-500'
      default: return 'bg-gray-500'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'running': return <Play className="w-4 h-4" />
      case 'stopped': return <Pause className="w-4 h-4" />
      case 'error': return <AlertTriangle className="w-4 h-4" />
      default: return <Pause className="w-4 h-4" />
    }
  }

  if (loading) {
    return (
      <div className="p-4">
        <div className="animate-pulse">
          <div className="h-4 bg-gray-300 rounded w-1/4 mb-4"></div>
          <div className="space-y-3">
            <div className="h-20 bg-gray-300 rounded"></div>
            <div className="h-20 bg-gray-300 rounded"></div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="p-4 space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Trading Bots</h3>
        <Button size="sm">
          <Settings className="w-4 h-4 mr-2" />
          Create Bot
        </Button>
      </div>

      {bots.length === 0 ? (
        <div className="text-center py-8 text-muted-foreground">
          <TrendingUp className="w-12 h-12 mx-auto mb-4 opacity-50" />
          <p>No trading bots configured yet.</p>
          <p className="text-sm">Create your first automated trading strategy.</p>
        </div>
      ) : (
        <div className="grid gap-4">
          {bots.map((bot) => (
            <Card key={bot.id} className="hover:shadow-md transition-shadow">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className={`w-3 h-3 rounded-full ${getStatusColor(bot.status)}`}></div>
                    <CardTitle className="text-base">{bot.name}</CardTitle>
                    <Badge variant="outline">{bot.strategy}</Badge>
                  </div>
                  <Button
                    size="sm"
                    variant={bot.status === 'running' ? 'destructive' : 'default'}
                    onClick={() => toggleBotStatus(bot.id)}
                  >
                    {getStatusIcon(bot.status)}
                    <span className="ml-2">
                      {bot.status === 'running' ? 'Stop' : 'Start'}
                    </span>
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-muted-foreground">Portfolio</p>
                    <p className="font-medium">{bot.portfolioId}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">P&L</p>
                    <p className={`font-medium ${bot.pnl >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                      ${bot.pnl.toFixed(2)}
                    </p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Last Run</p>
                    <p className="font-medium">
                      {new Date(bot.lastRun).toLocaleString()}
                    </p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Status</p>
                    <Badge variant={bot.status === 'running' ? 'default' : 'secondary'}>
                      {bot.status}
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <div className="mt-6 p-4 bg-muted/50 rounded-lg">
        <h4 className="font-medium mb-2">Quick Actions</h4>
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            View All Strategies
          </Button>
          <Button variant="outline" size="sm">
            Performance Analytics
          </Button>
          <Button variant="outline" size="sm">
            Risk Management
          </Button>
        </div>
      </div>
    </div>
  )
}

export default BotsWindow
