"use client"

import { useState } from "react"
import { FileMenuNav } from "@/components/navigation/file-menu-nav"
import { TradingSidebar } from "@/components/navigation/trading-sidebar"
import { TradingNotifications } from "@/components/notifications/trading-notifications"
import { TradingAchievements } from "@/components/gamification/trading-achievements"
import { MultiPanelDashboard } from "@/components/layout/multi-panel-dashboard"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { TrendingUp, TrendingDown, DollarSign, Activity, Users } from "lucide-react"
import { cn } from "@/lib/utils"

interface DashboardLayoutProps {
  children: React.ReactNode
  showAchievements?: boolean
  className?: string
}

// Mock data for dashboard panels
const mockPanels = [
  {
    id: "portfolio-overview",
    title: "Portfolio Overview",
    component: (
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="text-center p-4 bg-green-50 dark:bg-green-950/20 rounded-lg">
            <div className="text-2xl font-bold text-green-600">$45,230</div>
            <div className="text-sm text-muted-foreground">Total Value</div>
            <div className="text-xs text-green-600 mt-1">+2.4% today</div>
          </div>
          <div className="text-center p-4 bg-blue-50 dark:bg-blue-950/20 rounded-lg">
            <div className="text-2xl font-bold text-blue-600">$12,450</div>
            <div className="text-sm text-muted-foreground">Day's P&L</div>
            <div className="text-xs text-green-600 mt-1">+1.8%</div>
          </div>
        </div>
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span>AAPL</span>
            <span className="text-green-600">+2.1%</span>
          </div>
          <div className="flex justify-between text-sm">
            <span>GOOGL</span>
            <span className="text-red-600">-0.8%</span>
          </div>
          <div className="flex justify-between text-sm">
            <span>MSFT</span>
            <span className="text-green-600">+1.5%</span>
          </div>
        </div>
      </div>
    ),
    width: 400,
    minWidth: 300,
    maxWidth: 600,
    visible: true,
    defaultWidth: 400
  },
  {
    id: "market-indicators",
    title: "Market Indicators",
    component: (
      <div className="space-y-4">
        <div className="grid grid-cols-1 gap-3">
          <div className="flex items-center justify-between p-3 border rounded-lg">
            <div className="flex items-center space-x-2">
              <TrendingUp className="h-4 w-4 text-green-500" />
              <span className="text-sm font-medium">S&P 500</span>
            </div>
            <div className="text-right">
              <div className="text-sm font-bold">4,185.50</div>
              <div className="text-xs text-green-600">+0.8%</div>
            </div>
          </div>
          <div className="flex items-center justify-between p-3 border rounded-lg">
            <div className="flex items-center space-x-2">
              <TrendingDown className="h-4 w-4 text-red-500" />
              <span className="text-sm font-medium">NASDAQ</span>
            </div>
            <div className="text-right">
              <div className="text-sm font-bold">12,845.20</div>
              <div className="text-xs text-red-600">-0.3%</div>
            </div>
          </div>
          <div className="flex items-center justify-between p-3 border rounded-lg">
            <div className="flex items-center space-x-2">
              <Activity className="h-4 w-4 text-blue-500" />
              <span className="text-sm font-medium">VIX</span>
            </div>
            <div className="text-right">
              <div className="text-sm font-bold">18.45</div>
              <div className="text-xs text-green-600">-2.1%</div>
            </div>
          </div>
        </div>
      </div>
    ),
    width: 350,
    minWidth: 250,
    maxWidth: 500,
    visible: true,
    defaultWidth: 350
  },
  {
    id: "recent-activity",
    title: "Recent Activity",
    component: (
      <div className="space-y-3">
        <div className="flex items-center space-x-3 p-3 bg-accent/30 rounded-lg">
          <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
            <DollarSign className="h-4 w-4 text-white" />
          </div>
          <div className="flex-1">
            <p className="text-sm font-medium">Bought 10 shares of AAPL</p>
            <p className="text-xs text-muted-foreground">2 hours ago</p>
          </div>
          <Badge variant="outline" className="text-xs">$1,750.00</Badge>
        </div>
        <div className="flex items-center space-x-3 p-3 bg-accent/30 rounded-lg">
          <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
            <Users className="h-4 w-4 text-white" />
          </div>
          <div className="flex-1">
            <p className="text-sm font-medium">Followed trader @ProTrader2024</p>
            <p className="text-xs text-muted-foreground">4 hours ago</p>
          </div>
          <Badge variant="outline" className="text-xs">+5 XP</Badge>
        </div>
        <div className="flex items-center space-x-3 p-3 bg-accent/30 rounded-lg">
          <div className="w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center">
            <Activity className="h-4 w-4 text-white" />
          </div>
          <div className="flex-1">
            <p className="text-sm font-medium">Completed technical analysis</p>
            <p className="text-xs text-muted-foreground">1 day ago</p>
          </div>
          <Badge variant="outline" className="text-xs">+25 XP</Badge>
        </div>
      </div>
    ),
    width: 320,
    minWidth: 280,
    maxWidth: 450,
    visible: true,
    defaultWidth: 320
  }
]

export function EnhancedDashboardLayout({
  children,
  showAchievements = false,
  className
}: DashboardLayoutProps) {
  const [panels, setPanels] = useState(mockPanels)
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)

  const handlePanelResize = (panelId: string, newWidth: number) => {
    setPanels(prev => prev.map(panel =>
      panel.id === panelId ? { ...panel, width: newWidth } : panel
    ))
  }

  const handlePanelToggle = (panelId: string) => {
    setPanels(prev => prev.map(panel =>
      panel.id === panelId ? { ...panel, visible: !panel.visible } : panel
    ))
  }

  const handleResetLayout = () => {
    setPanels(mockPanels)
  }

  return (
    <div className={cn("h-screen flex flex-col bg-background", className)}>
      {/* Top Menu Bar */}
      <div className="h-12 bg-card border-b flex items-center px-4 shadow-sm">
        <FileMenuNav />
        <div className="ml-auto flex items-center space-x-4">
          {/* User menu and other top bar items would go here */}
          <div className="text-sm text-muted-foreground">
            Market Open • 2:45 PM EST
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <TradingSidebar />

        {/* Main Dashboard Area */}
        <div className="flex-1 flex flex-col">
          {showAchievements ? (
            <div className="flex-1 p-6 overflow-auto">
              <TradingAchievements />
            </div>
          ) : (
            <MultiPanelDashboard
              panels={panels}
              onPanelResize={handlePanelResize}
              onPanelToggle={handlePanelToggle}
              onResetLayout={handleResetLayout}
              className="flex-1"
            />
          )}
        </div>
      </div>

      {/* Floating Notifications */}
      <TradingNotifications />
    </div>
  )
}
