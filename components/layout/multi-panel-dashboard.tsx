"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
} from "recharts"
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
} from "lucide-react"
import { LiveTicker } from "@/components/live-ticker"
import { useToast } from "@/components/ui/use-toast"

interface MultiPanelDashboardProps {
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

export function MultiPanelDashboard({ apiConfig, onBotAction, isLoading, portfolio }: MultiPanelDashboardProps) {
  const [activePanel, setActivePanel] = useState("overview")
  const { toast } = useToast()

  // Mock data for demonstration
  const mockData = {
    portfolioValue: 125000,
    todaysPnL: 2340.50,
    activeBots: 8,
    totalPositions: 15,
    performanceData: [
      { name: 'Jan', value: 4000 },
      { name: 'Feb', value: 3000 },
      { name: 'Mar', value: 5000 },
      { name: 'Apr', value: 4500 },
      { name: 'May', value: 6000 },
      { name: 'Jun', value: 5500 },
    ]
  }

  return (
    <div className="grid grid-cols-12 gap-4 h-full">
      {/* Left Sidebar - Navigation & Quick Stats */}
      <div className="col-span-3 space-y-4">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg">Quick Stats</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Portfolio Value</span>
              <span className="font-semibold">${mockData.portfolioValue.toLocaleString()}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Today's P&L</span>
              <span className="font-semibold text-green-500">+${mockData.todaysPnL.toFixed(2)}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Active Bots</span>
              <Badge variant="secondary">{mockData.activeBots}</Badge>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg">Navigation</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <Button
                variant={activePanel === "overview" ? "default" : "ghost"}
                className="w-full justify-start"
                onClick={() => setActivePanel("overview")}
              >
                <Activity className="mr-2 h-4 w-4" />
                Overview
              </Button>
              <Button
                variant={activePanel === "portfolio" ? "default" : "ghost"}
                className="w-full justify-start"
                onClick={() => setActivePanel("portfolio")}
              >
                <Wallet className="mr-2 h-4 w-4" />
                Portfolio
              </Button>
              <Button
                variant={activePanel === "bots" ? "default" : "ghost"}
                className="w-full justify-start"
                onClick={() => setActivePanel("bots")}
              >
                <Settings className="mr-2 h-4 w-4" />
                Bots
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Area */}
      <div className="col-span-6 space-y-4">
        {activePanel === "overview" && (
          <>
            <Card>
              <CardHeader>
                <CardTitle>Performance Overview</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={mockData.performanceData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Line type="monotone" dataKey="value" stroke="#8884d8" strokeWidth={2} />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Market Data</CardTitle>
              </CardHeader>
              <CardContent>
                <LiveTicker symbols={['AAPL', 'GOOGL', 'AMZN']} />
              </CardContent>
            </Card>
          </>
        )}

        {activePanel === "portfolio" && (
          <Card>
            <CardHeader>
              <CardTitle>Portfolio Positions</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Symbol</TableHead>
                    <TableHead>Quantity</TableHead>
                    <TableHead>Avg Price</TableHead>
                    <TableHead>Current Price</TableHead>
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
        )}

        {activePanel === "bots" && (
          <Card>
            <CardHeader>
              <CardTitle>Bot Management</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <h4 className="font-medium">Momentum Bot</h4>
                    <p className="text-sm text-muted-foreground">Active - Running strategy</p>
                  </div>
                  <div className="flex space-x-2">
                    <Button size="sm" variant="outline">
                      <Pause className="h-4 w-4" />
                    </Button>
                    <Button size="sm" variant="outline">
                      <Settings className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <h4 className="font-medium">Mean Reversion Bot</h4>
                    <p className="text-sm text-muted-foreground">Paused - Awaiting signal</p>
                  </div>
                  <div className="flex space-x-2">
                    <Button size="sm" variant="outline">
                      <Play className="h-4 w-4" />
                    </Button>
                    <Button size="sm" variant="outline">
                      <Settings className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Right Sidebar - Additional Info */}
      <div className="col-span-3 space-y-4">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg">Recent Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
                <div className="flex-1">
                  <p className="text-sm">Bot "Momentum" executed trade</p>
                  <p className="text-xs text-muted-foreground">2 minutes ago</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                <div className="flex-1">
                  <p className="text-sm">Portfolio rebalanced</p>
                  <p className="text-xs text-muted-foreground">15 minutes ago</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-orange-500 rounded-full mt-2"></div>
                <div className="flex-1">
                  <p className="text-sm">New signal detected</p>
                  <p className="text-xs text-muted-foreground">1 hour ago</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg">Alerts</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center space-x-2 p-2 bg-yellow-50 dark:bg-yellow-900/20 rounded">
                <AlertTriangle className="h-4 w-4 text-yellow-500" />
                <span className="text-sm">High volatility detected</span>
              </div>
              <div className="flex items-center space-x-2 p-2 bg-green-50 dark:bg-green-900/20 rounded">
                <TrendingUp className="h-4 w-4 text-green-500" />
                <span className="text-sm">Target profit reached</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}