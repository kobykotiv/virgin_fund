"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  Activity,
  DollarSign,
  TrendingUp,
  AlertTriangle,
  Play,
  Pause,
  Trash,
  RefreshCw,
  Settings,
  Wallet,
  Grid3X3,
  List,
  BarChart3,
} from "lucide-react"
import { useToast } from "@/components/ui/use-toast"

interface CompactDashboardProps {
  apiConfig?: {
    keyId: string
    secretKey: string
    baseUrl: string
    isPaper: boolean
  } | null
  onBotAction: (botId: string, action: 'start' | 'stop' | 'delete') => Promise<void>
  isLoading: boolean
  portfolio?: {
    positions: any[]
    totalValue: number
    cashBalance: number
  }
}

export function CompactDashboard({ apiConfig, onBotAction, isLoading, portfolio }: CompactDashboardProps) {
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const { toast } = useToast()

  // Mock data for demonstration
  const mockData = {
    portfolioValue: 125000,
    todaysPnL: 2340.50,
    activeBots: 8,
    totalPositions: 15,
  }

  const quickStats = [
    {
      title: "Portfolio Value",
      value: `$${mockData.portfolioValue.toLocaleString()}`,
      change: "+2.5%",
      icon: DollarSign,
      color: "text-blue-500"
    },
    {
      title: "Today's P&L",
      value: `+$${mockData.todaysPnL.toFixed(2)}`,
      change: "+1.8%",
      icon: TrendingUp,
      color: "text-green-500"
    },
    {
      title: "Active Bots",
      value: mockData.activeBots.toString(),
      change: "6 running",
      icon: Activity,
      color: "text-purple-500"
    },
    {
      title: "Open Positions",
      value: mockData.totalPositions.toString(),
      change: "8 assets",
      icon: Wallet,
      color: "text-orange-500"
    }
  ]

  const mockBots = [
    { id: 1, name: "Momentum Bot", status: "active", pnl: 1250, winRate: 68 },
    { id: 2, name: "Mean Reversion", status: "paused", pnl: -340, winRate: 52 },
    { id: 3, name: "Arbitrage Bot", status: "active", pnl: 890, winRate: 74 },
    { id: 4, name: "Scalping Bot", status: "active", pnl: 567, winRate: 61 },
  ]

  return (
    <div className="space-y-4">
      {/* Compact Header with View Toggle */}
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Dashboard</h2>
        <div className="flex items-center space-x-2">
          <Button
            variant={viewMode === 'grid' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setViewMode('grid')}
          >
            <Grid3X3 className="h-4 w-4" />
          </Button>
          <Button
            variant={viewMode === 'list' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setViewMode('list')}
          >
            <List className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Quick Stats - Always visible */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {quickStats.map((stat, index) => (
          <Card key={index} className="p-4">
            <div className="flex items-center space-x-3">
              <stat.icon className={`h-5 w-5 ${stat.color}`} />
              <div className="flex-1 min-w-0">
                <p className="text-xs text-muted-foreground truncate">{stat.title}</p>
                <p className="text-sm font-semibold truncate">{stat.value}</p>
                <p className={`text-xs ${stat.color} truncate`}>{stat.change}</p>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Main Content */}
      {viewMode === 'grid' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {/* Portfolio Summary */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg">Top Positions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {portfolio?.positions?.slice(0, 3).map((position, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-sm">{position.symbol}</p>
                      <p className="text-xs text-muted-foreground">{position.quantity} shares</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium">${position.marketValue?.toFixed(0)}</p>
                      <p className={`text-xs ${position.pnl >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                        {position.pnl >= 0 ? '+' : ''}${position.pnl?.toFixed(0)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Bot Status */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg">Bot Status</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {mockBots.slice(0, 3).map((bot) => (
                  <div key={bot.id} className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-sm">{bot.name}</p>
                      <Badge variant={bot.status === 'active' ? 'default' : 'secondary'} className="text-xs">
                        {bot.status}
                      </Badge>
                    </div>
                    <div className="text-right">
                      <p className={`text-sm font-medium ${bot.pnl >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                        {bot.pnl >= 0 ? '+' : ''}${bot.pnl}
                      </p>
                      <p className="text-xs text-muted-foreground">{bot.winRate}% win</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg">Quick Actions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-2">
                <Button size="sm" variant="outline">
                  <Play className="h-4 w-4 mr-1" />
                  Start Bot
                </Button>
                <Button size="sm" variant="outline">
                  <Settings className="h-4 w-4 mr-1" />
                  Settings
                </Button>
                <Button size="sm" variant="outline">
                  <BarChart3 className="h-4 w-4 mr-1" />
                  Analytics
                </Button>
                <Button size="sm" variant="outline">
                  <RefreshCw className="h-4 w-4 mr-1" />
                  Refresh
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      ) : (
        /* List View */
        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Portfolio Positions</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Symbol</TableHead>
                    <TableHead>Qty</TableHead>
                    <TableHead>Avg Price</TableHead>
                    <TableHead>Current</TableHead>
                    <TableHead>P&L</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {portfolio?.positions?.slice(0, 5).map((position, index) => (
                    <TableRow key={index}>
                      <TableCell className="font-medium">{position.symbol}</TableCell>
                      <TableCell>{position.quantity}</TableCell>
                      <TableCell>${position.avgPrice?.toFixed(2)}</TableCell>
                      <TableCell>${position.currentPrice?.toFixed(2)}</TableCell>
                      <TableCell className={position.pnl >= 0 ? "text-green-500" : "text-red-500"}>
                        ${position.pnl?.toFixed(2)}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Bot Management</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Bot Name</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>P&L</TableHead>
                    <TableHead>Win Rate</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {mockBots.map((bot) => (
                    <TableRow key={bot.id}>
                      <TableCell className="font-medium">{bot.name}</TableCell>
                      <TableCell>
                        <Badge variant={bot.status === 'active' ? 'default' : 'secondary'}>
                          {bot.status}
                        </Badge>
                      </TableCell>
                      <TableCell className={bot.pnl >= 0 ? "text-green-500" : "text-red-500"}>
                        {bot.pnl >= 0 ? '+' : ''}${bot.pnl}
                      </TableCell>
                      <TableCell>{bot.winRate}%</TableCell>
                      <TableCell>
                        <div className="flex space-x-1">
                          <Button size="sm" variant="outline">
                            {bot.status === 'active' ? <Pause className="h-3 w-3" /> : <Play className="h-3 w-3" />}
                          </Button>
                          <Button size="sm" variant="outline">
                            <Settings className="h-3 w-3" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}
