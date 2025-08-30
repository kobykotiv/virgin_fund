# 🚀 Virgin Fund Trading App Layout Instructions

## Overview
Build a professional, addictive FOSS trading platform with file menu-style navigation and comprehensive stock screener capabilities. This guide transforms your minimal theme into a feature-rich trading application.

## 🎯 Core Objectives
- **File Menu Navigation**: Desktop-style navigation for web
- **Addictive UX**: Gamification, real-time updates, smooth animations
- **Stock Screener**: Advanced filtering and scanning capabilities
- **Professional Layout**: Multi-panel, resizable, customizable interface
- **Real-time Features**: Live data, notifications, alerts

---

## 📁 1. Enhanced Navigation System

### File Menu Style Navigation Structure

```tsx
// components/navigation/file-menu-nav.tsx
"use client"

import { useState, useEffect } from "react"
import { ChevronDown, ChevronRight, FileText, Settings, HelpCircle } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

interface MenuItem {
  id: string
  label: string
  icon?: React.ReactNode
  shortcut?: string
  children?: MenuItem[]
  action?: () => void
  separator?: boolean
}

const fileMenuItems: MenuItem[] = [
  {
    id: "file",
    label: "File",
    children: [
      { id: "new-workspace", label: "New Workspace", shortcut: "Ctrl+N" },
      { id: "open-workspace", label: "Open Workspace", shortcut: "Ctrl+O" },
      { id: "save-workspace", label: "Save Workspace", shortcut: "Ctrl+S" },
      { separator: true },
      { id: "import-data", label: "Import Data", shortcut: "Ctrl+I" },
      { id: "export-data", label: "Export Data", shortcut: "Ctrl+E" },
      { separator: true },
      { id: "exit", label: "Exit", shortcut: "Ctrl+Q" }
    ]
  },
  {
    id: "view",
    label: "View",
    children: [
      { id: "fullscreen", label: "Toggle Fullscreen", shortcut: "F11" },
      { id: "sidebar", label: "Toggle Sidebar", shortcut: "Ctrl+B" },
      { id: "toolbar", label: "Toggle Toolbar" },
      { separator: true },
      { id: "zoom-in", label: "Zoom In", shortcut: "Ctrl++" },
      { id: "zoom-out", label: "Zoom Out", shortcut: "Ctrl+-" },
      { id: "reset-zoom", label: "Reset Zoom", shortcut: "Ctrl+0" }
    ]
  },
  {
    id: "trading",
    label: "Trading",
    children: [
      { id: "new-order", label: "New Order", shortcut: "Ctrl+T" },
      { id: "modify-order", label: "Modify Order", shortcut: "Ctrl+M" },
      { id: "cancel-order", label: "Cancel Order", shortcut: "Ctrl+X" },
      { separator: true },
      { id: "watchlist", label: "Watchlist Manager", shortcut: "Ctrl+W" },
      { id: "screener", label: "Stock Screener", shortcut: "Ctrl+F" },
      { id: "backtest", label: "Backtesting", shortcut: "Ctrl+K" }
    ]
  },
  {
    id: "tools",
    label: "Tools",
    children: [
      { id: "calculator", label: "Financial Calculator", shortcut: "Ctrl+L" },
      { id: "converter", label: "Currency Converter" },
      { id: "heatmap", label: "Market Heatmap" },
      { separator: true },
      { id: "options-chain", label: "Options Chain" },
      { id: "technical-analysis", label: "Technical Analysis" },
      { id: "fundamental-analysis", label: "Fundamental Analysis" }
    ]
  },
  {
    id: "window",
    label: "Window",
    children: [
      { id: "new-window", label: "New Window", shortcut: "Ctrl+Shift+N" },
      { id: "close-window", label: "Close Window", shortcut: "Ctrl+W" },
      { separator: true },
      { id: "tile-windows", label: "Tile Windows" },
      { id: "cascade-windows", label: "Cascade Windows" }
    ]
  },
  {
    id: "help",
    label: "Help",
    children: [
      { id: "documentation", label: "Documentation", shortcut: "F1" },
      { id: "tutorials", label: "Video Tutorials" },
      { id: "faq", label: "FAQ" },
      { separator: true },
      { id: "about", label: "About Virgin Fund" }
    ]
  }
]

export function FileMenuNav() {
  const [activeMenus, setActiveMenus] = useState<Set<string>>(new Set())

  const handleMenuClick = (menuId: string) => {
    setActiveMenus(prev => {
      const newSet = new Set(prev)
      if (newSet.has(menuId)) {
        newSet.delete(menuId)
      } else {
        newSet.add(menuId)
      }
      return newSet
    })
  }

  const handleMenuItemClick = (item: MenuItem) => {
    if (item.action) {
      item.action()
    }
    setActiveMenus(new Set())
  }

  return (
    <div className="flex items-center space-x-1 bg-muted/30 px-2 py-1 rounded-md border">
      {fileMenuItems.map((menu) => (
        <DropdownMenu key={menu.id}>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="sm"
              className={cn(
                "h-8 px-3 text-sm font-medium",
                activeMenus.has(menu.id) && "bg-accent"
              )}
            >
              {menu.label}
              <ChevronDown className="ml-1 h-3 w-3" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start" className="w-56">
            {menu.children?.map((item, index) => (
              item.separator ? (
                <DropdownMenuSeparator key={`sep-${index}`} />
              ) : (
                <DropdownMenuItem
                  key={item.id}
                  onClick={() => handleMenuItemClick(item)}
                  className="flex items-center justify-between"
                >
                  <div className="flex items-center">
                    {item.icon}
                    <span>{item.label}</span>
                  </div>
                  {item.shortcut && (
                    <span className="text-xs text-muted-foreground ml-auto">
                      {item.shortcut}
                    </span>
                  )}
                </DropdownMenuItem>
              )
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      ))}
    </div>
  )
}
```

### Enhanced Sidebar Navigation

```tsx
// components/navigation/trading-sidebar.tsx
"use client"

import { useState } from "react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import {
  BarChart3,
  TrendingUp,
  TrendingDown,
  Search,
  Star,
  Clock,
  DollarSign,
  PieChart,
  Activity,
  Settings,
  ChevronLeft,
  ChevronRight
} from "lucide-react"

interface SidebarSection {
  id: string
  title: string
  icon: React.ReactNode
  items: SidebarItem[]
}

interface SidebarItem {
  id: string
  label: string
  icon?: React.ReactNode
  badge?: string | number
  active?: boolean
  href?: string
}

const sidebarSections: SidebarSection[] = [
  {
    id: "markets",
    title: "Markets",
    icon: <BarChart3 className="h-4 w-4" />,
    items: [
      { id: "watchlist", label: "Watchlist", icon: <Star className="h-4 w-4" />, badge: 12 },
      { id: "screener", label: "Stock Screener", icon: <Search className="h-4 w-4" /> },
      { id: "heatmap", label: "Market Heatmap", icon: <Activity className="h-4 w-4" /> },
      { id: "gainers", label: "Top Gainers", icon: <TrendingUp className="h-4 w-4" /> },
      { id: "losers", label: "Top Losers", icon: <TrendingDown className="h-4 w-4" /> }
    ]
  },
  {
    id: "portfolio",
    title: "Portfolio",
    icon: <PieChart className="h-4 w-4" />,
    items: [
      { id: "overview", label: "Overview", icon: <BarChart3 className="h-4 w-4" /> },
      { id: "positions", label: "Positions", icon: <DollarSign className="h-4 w-4" />, badge: 8 },
      { id: "orders", label: "Orders", icon: <Clock className="h-4 w-4" />, badge: 3 },
      { id: "performance", label: "Performance", icon: <TrendingUp className="h-4 w-4" /> }
    ]
  },
  {
    id: "analysis",
    title: "Analysis",
    icon: <Activity className="h-4 w-4" />,
    items: [
      { id: "technical", label: "Technical Analysis", icon: <BarChart3 className="h-4 w-4" /> },
      { id: "fundamental", label: "Fundamental Analysis", icon: <PieChart className="h-4 w-4" /> },
      { id: "backtest", label: "Backtesting", icon: <Activity className="h-4 w-4" /> },
      { id: "calculators", label: "Calculators", icon: <DollarSign className="h-4 w-4" /> }
    ]
  }
]

export function TradingSidebar() {
  const [collapsed, setCollapsed] = useState(false)
  const [activeItem, setActiveItem] = useState("watchlist")

  return (
    <div className={cn(
      "flex flex-col bg-card border-r transition-all duration-300",
      collapsed ? "w-16" : "w-64"
    )}>
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b">
        {!collapsed && (
          <h2 className="font-semibold text-lg">Trading Hub</h2>
        )}
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setCollapsed(!collapsed)}
          className="h-8 w-8 p-0"
        >
          {collapsed ? (
            <ChevronRight className="h-4 w-4" />
          ) : (
            <ChevronLeft className="h-4 w-4" />
          )}
        </Button>
      </div>

      {/* Navigation Sections */}
      <ScrollArea className="flex-1">
        <div className="p-2 space-y-4">
          {sidebarSections.map((section) => (
            <div key={section.id}>
              {!collapsed && (
                <div className="flex items-center px-2 py-1 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                  {section.icon}
                  <span className="ml-2">{section.title}</span>
                </div>
              )}
              <div className="space-y-1 mt-2">
                {section.items.map((item) => (
                  <Button
                    key={item.id}
                    variant={activeItem === item.id ? "secondary" : "ghost"}
                    className={cn(
                      "w-full justify-start h-9",
                      collapsed ? "px-2" : "px-3",
                      activeItem === item.id && "bg-accent"
                    )}
                    onClick={() => setActiveItem(item.id)}
                  >
                    {item.icon}
                    {!collapsed && (
                      <>
                        <span className="ml-2 flex-1 text-left">{item.label}</span>
                        {item.badge && (
                          <span className="ml-auto bg-primary text-primary-foreground text-xs px-2 py-0.5 rounded-full">
                            {item.badge}
                          </span>
                        )}
                      </>
                    )}
                  </Button>
                ))}
              </div>
              {!collapsed && <Separator className="my-4" />}
            </div>
          ))}
        </div>
      </ScrollArea>

      {/* Footer */}
      <div className="p-4 border-t">
        <Button
          variant="ghost"
          className={cn("w-full justify-start", collapsed ? "px-2" : "px-3")}
        >
          <Settings className="h-4 w-4" />
          {!collapsed && <span className="ml-2">Settings</span>}
        </Button>
      </div>
    </div>
  )
}
```

---

## 🎮 2. Addictive UX Features

### Real-time Notifications System

```tsx
// components/notifications/trading-notifications.tsx
"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { X, TrendingUp, TrendingDown, AlertTriangle, CheckCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

interface Notification {
  id: string
  type: 'success' | 'warning' | 'error' | 'info'
  title: string
  message: string
  timestamp: Date
  action?: {
    label: string
    onClick: () => void
  }
}

export function TradingNotifications() {
  const [notifications, setNotifications] = useState<Notification[]>([])

  // Simulate real-time notifications
  useEffect(() => {
    const interval = setInterval(() => {
      const types: Notification['type'][] = ['success', 'warning', 'error', 'info']
      const messages = [
        { title: "Price Alert", message: "AAPL crossed $150 resistance" },
        { title: "Order Filled", message: "Buy order for TSLA executed" },
        { title: "Market News", message: "Fed announces interest rate decision" },
        { title: "Portfolio Update", message: "Your portfolio is up 2.3% today" }
      ]

      const randomMessage = messages[Math.floor(Math.random() * messages.length)]
      const newNotification: Notification = {
        id: Date.now().toString(),
        type: types[Math.floor(Math.random() * types.length)],
        ...randomMessage,
        timestamp: new Date()
      }

      setNotifications(prev => [newNotification, ...prev.slice(0, 4)]) // Keep max 5
    }, 30000) // Every 30 seconds

    return () => clearInterval(interval)
  }, [])

  const removeNotification = (id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id))
  }

  const getIcon = (type: Notification['type']) => {
    switch (type) {
      case 'success': return <CheckCircle className="h-5 w-5 text-green-500" />
      case 'warning': return <AlertTriangle className="h-5 w-5 text-yellow-500" />
      case 'error': return <AlertTriangle className="h-5 w-5 text-red-500" />
      case 'info': return <TrendingUp className="h-5 w-5 text-blue-500" />
    }
  }

  return (
    <div className="fixed top-4 right-4 z-50 space-y-2">
      <AnimatePresence>
        {notifications.map((notification) => (
          <motion.div
            key={notification.id}
            initial={{ opacity: 0, x: 300, scale: 0.3 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: 300, scale: 0.3 }}
            transition={{ type: "spring", stiffness: 500, damping: 30 }}
            className="bg-card border rounded-lg shadow-lg p-4 min-w-80 max-w-md"
          >
            <div className="flex items-start space-x-3">
              {getIcon(notification.type)}
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <h4 className="font-semibold text-sm">{notification.title}</h4>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => removeNotification(notification.id)}
                    className="h-6 w-6 p-0"
                  >
                    <X className="h-3 w-3" />
                  </Button>
                </div>
                <p className="text-sm text-muted-foreground mt-1">
                  {notification.message}
                </p>
                <div className="flex items-center justify-between mt-3">
                  <span className="text-xs text-muted-foreground">
                    {notification.timestamp.toLocaleTimeString()}
                  </span>
                  {notification.action && (
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={notification.action.onClick}
                      className="h-7 text-xs"
                    >
                      {notification.action.label}
                    </Button>
                  )}
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  )
}
```

### Gamification Elements

```tsx
// components/gamification/trading-achievements.tsx
"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Trophy, Star, Target, TrendingUp, Award } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"

interface Achievement {
  id: string
  title: string
  description: string
  icon: React.ReactNode
  progress: number
  maxProgress: number
  unlocked: boolean
  rarity: 'common' | 'rare' | 'epic' | 'legendary'
}

export function TradingAchievements() {
  const [achievements, setAchievements] = useState<Achievement[]>([
    {
      id: "first-trade",
      title: "First Trade",
      description: "Execute your first trade",
      icon: <Target className="h-5 w-5" />,
      progress: 1,
      maxProgress: 1,
      unlocked: true,
      rarity: "common"
    },
    {
      id: "profit-streak",
      title: "Profit Streak",
      description: "5 consecutive profitable trades",
      icon: <TrendingUp className="h-5 w-5" />,
      progress: 3,
      maxProgress: 5,
      unlocked: false,
      rarity: "rare"
    },
    {
      id: "portfolio-growth",
      title: "Portfolio Growth",
      description: "Grow portfolio by 10%",
      icon: <Trophy className="h-5 w-5" />,
      progress: 7,
      maxProgress: 10,
      unlocked: false,
      rarity: "epic"
    }
  ])

  const getRarityColor = (rarity: Achievement['rarity']) => {
    switch (rarity) {
      case 'common': return 'bg-gray-500'
      case 'rare': return 'bg-blue-500'
      case 'epic': return 'bg-purple-500'
      case 'legendary': return 'bg-yellow-500'
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <Award className="h-5 w-5 mr-2" />
          Achievements
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {achievements.map((achievement) => (
            <motion.div
              key={achievement.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className={cn(
                "flex items-center space-x-4 p-3 rounded-lg border",
                achievement.unlocked ? "bg-accent/50" : "bg-muted/30"
              )}
            >
              <div className={cn(
                "p-2 rounded-full",
                achievement.unlocked ? getRarityColor(achievement.rarity) : "bg-muted"
              )}>
                {achievement.icon}
              </div>
              <div className="flex-1">
                <div className="flex items-center space-x-2">
                  <h4 className="font-semibold">{achievement.title}</h4>
                  <Badge variant="outline" className="text-xs">
                    {achievement.rarity}
                  </Badge>
                </div>
                <p className="text-sm text-muted-foreground">
                  {achievement.description}
                </p>
                <div className="mt-2">
                  <Progress
                    value={(achievement.progress / achievement.maxProgress) * 100}
                    className="h-2"
                  />
                  <span className="text-xs text-muted-foreground mt-1">
                    {achievement.progress}/{achievement.maxProgress}
                  </span>
                </div>
              </div>
              {achievement.unlocked && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="text-yellow-500"
                >
                  <Star className="h-5 w-5 fill-current" />
                </motion.div>
              )}
            </motion.div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
```

---

## 📊 3. Advanced Stock Screener

### Screener Interface

```tsx
// components/screener/stock-screener.tsx
"use client"

import { useState, useEffect } from "react"
import { Search, Filter, SortAsc, SortDesc, Download, Save } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

interface StockData {
  symbol: string
  name: string
  price: number
  change: number
  changePercent: number
  volume: number
  marketCap: number
  pe: number
  eps: number
  dividend: number
  sector: string
}

interface ScreenerFilter {
  id: string
  label: string
  type: 'range' | 'select' | 'boolean'
  value: any
  options?: string[]
}

export function StockScreener() {
  const [stocks, setStocks] = useState<StockData[]>([])
  const [filteredStocks, setFilteredStocks] = useState<StockData[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [sortBy, setSortBy] = useState("marketCap")
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc')
  const [selectedStocks, setSelectedStocks] = useState<Set<string>>(new Set())

  const filters: ScreenerFilter[] = [
    {
      id: "price",
      label: "Price",
      type: "range",
      value: { min: 0, max: 1000 }
    },
    {
      id: "marketCap",
      label: "Market Cap",
      type: "select",
      value: "any",
      options: ["any", "large", "mid", "small", "micro"]
    },
    {
      id: "pe",
      label: "P/E Ratio",
      type: "range",
      value: { min: 0, max: 50 }
    },
    {
      id: "dividend",
      label: "Dividend Yield",
      type: "range",
      value: { min: 0, max: 10 }
    },
    {
      id: "sector",
      label: "Sector",
      type: "select",
      value: "any",
      options: ["any", "technology", "healthcare", "finance", "energy", "consumer"]
    }
  ]

  // Simulate stock data
  useEffect(() => {
    const mockStocks: StockData[] = [
      {
        symbol: "AAPL",
        name: "Apple Inc.",
        price: 175.43,
        change: 2.15,
        changePercent: 1.24,
        volume: 52847392,
        marketCap: 2750000000000,
        pe: 28.5,
        eps: 6.15,
        dividend: 0.96,
        sector: "technology"
      },
      // Add more mock data...
    ]
    setStocks(mockStocks)
    setFilteredStocks(mockStocks)
  }, [])

  const handleFilter = () => {
    let filtered = [...stocks]

    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter(stock =>
        stock.symbol.toLowerCase().includes(searchTerm.toLowerCase()) ||
        stock.name.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    // Apply other filters
    // ... filter logic

    // Apply sorting
    filtered.sort((a, b) => {
      const aVal = a[sortBy as keyof StockData] as number
      const bVal = b[sortBy as keyof StockData] as number
      return sortOrder === 'asc' ? aVal - bVal : bVal - aVal
    })

    setFilteredStocks(filtered)
  }

  useEffect(() => {
    handleFilter()
  }, [searchTerm, sortBy, sortOrder])

  const toggleStockSelection = (symbol: string) => {
    setSelectedStocks(prev => {
      const newSet = new Set(prev)
      if (newSet.has(symbol)) {
        newSet.delete(symbol)
      } else {
        newSet.add(symbol)
      }
      return newSet
    })
  }

  return (
    <div className="space-y-6">
      {/* Search and Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Search className="h-5 w-5 mr-2" />
            Stock Screener
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-4 mb-4">
            <div className="flex-1 min-w-64">
              <Input
                placeholder="Search stocks..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full"
              />
            </div>
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-48">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="marketCap">Market Cap</SelectItem>
                <SelectItem value="price">Price</SelectItem>
                <SelectItem value="changePercent">Change %</SelectItem>
                <SelectItem value="volume">Volume</SelectItem>
                <SelectItem value="pe">P/E Ratio</SelectItem>
              </SelectContent>
            </Select>
            <Button
              variant="outline"
              onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
            >
              {sortOrder === 'asc' ? (
                <SortAsc className="h-4 w-4" />
              ) : (
                <SortDesc className="h-4 w-4" />
              )}
            </Button>
          </div>

          {/* Filter Controls */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {filters.map((filter) => (
              <div key={filter.id} className="space-y-2">
                <label className="text-sm font-medium">{filter.label}</label>
                {filter.type === 'range' && (
                  <div className="flex space-x-2">
                    <Input
                      type="number"
                      placeholder="Min"
                      className="w-20"
                    />
                    <Input
                      type="number"
                      placeholder="Max"
                      className="w-20"
                    />
                  </div>
                )}
                {filter.type === 'select' && (
                  <Select>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {filter.options?.map(option => (
                        <SelectItem key={option} value={option}>
                          {option.charAt(0).toUpperCase() + option.slice(1)}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Results Table */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Results ({filteredStocks.length})</CardTitle>
            <div className="flex space-x-2">
              <Button variant="outline" size="sm">
                <Save className="h-4 w-4 mr-2" />
                Save Screen
              </Button>
              <Button variant="outline" size="sm">
                <Download className="h-4 w-4 mr-2" />
                Export
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-12">
                  <Checkbox />
                </TableHead>
                <TableHead>Symbol</TableHead>
                <TableHead>Name</TableHead>
                <TableHead className="text-right">Price</TableHead>
                <TableHead className="text-right">Change</TableHead>
                <TableHead className="text-right">Volume</TableHead>
                <TableHead className="text-right">Market Cap</TableHead>
                <TableHead className="text-right">P/E</TableHead>
                <TableHead className="text-right">Dividend</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredStocks.map((stock) => (
                <TableRow key={stock.symbol}>
                  <TableCell>
                    <Checkbox
                      checked={selectedStocks.has(stock.symbol)}
                      onCheckedChange={() => toggleStockSelection(stock.symbol)}
                    />
                  </TableCell>
                  <TableCell className="font-semibold">{stock.symbol}</TableCell>
                  <TableCell>{stock.name}</TableCell>
                  <TableCell className="text-right">${stock.price.toFixed(2)}</TableCell>
                  <TableCell className={cn(
                    "text-right",
                    stock.change >= 0 ? "text-green-600" : "text-red-600"
                  )}>
                    {stock.change >= 0 ? "+" : ""}{stock.change.toFixed(2)}
                    ({stock.changePercent >= 0 ? "+" : ""}{stock.changePercent.toFixed(2)}%)
                  </TableCell>
                  <TableCell className="text-right">
                    {(stock.volume / 1000000).toFixed(1)}M
                  </TableCell>
                  <TableCell className="text-right">
                    ${(stock.marketCap / 1000000000).toFixed(1)}B
                  </TableCell>
                  <TableCell className="text-right">{stock.pe.toFixed(1)}</TableCell>
                  <TableCell className="text-right">{stock.dividend.toFixed(2)}%</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
```

---

## 🎨 4. Professional Layout Patterns

### Multi-Panel Dashboard

```tsx
// components/layout/multi-panel-dashboard.tsx
"use client"

import { useState, useRef } from "react"
import { motion, PanInfo } from "framer-motion"
import { GripVertical, X, Maximize2, Minimize2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

interface Panel {
  id: string
  title: string
  component: React.ReactNode
  width: number
  minWidth: number
  maxWidth: number
  visible: boolean
}

interface MultiPanelDashboardProps {
  panels: Panel[]
  onPanelResize: (panelId: string, newWidth: number) => void
  onPanelToggle: (panelId: string) => void
}

export function MultiPanelDashboard({
  panels,
  onPanelResize,
  onPanelToggle
}: MultiPanelDashboardProps) {
  const [dragging, setDragging] = useState<string | null>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  const handleDragStart = (panelId: string) => {
    setDragging(panelId)
  }

  const handleDragEnd = (event: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    if (dragging) {
      const container = containerRef.current
      if (container) {
        const containerRect = container.getBoundingClientRect()
        const newWidth = Math.max(
          panels.find(p => p.id === dragging)?.minWidth || 200,
          Math.min(
            panels.find(p => p.id === dragging)?.maxWidth || 800,
            (info.point.x - containerRect.left)
          )
        )
        onPanelResize(dragging, newWidth)
      }
      setDragging(null)
    }
  }

  const visiblePanels = panels.filter(panel => panel.visible)

  return (
    <div ref={containerRef} className="flex h-full bg-background">
      {visiblePanels.map((panel, index) => (
        <motion.div
          key={panel.id}
          className="flex"
          style={{ width: panel.width }}
          drag="x"
          dragConstraints={{ left: panel.minWidth, right: panel.maxWidth }}
          onDragStart={() => handleDragStart(panel.id)}
          onDragEnd={handleDragEnd}
        >
          <Card className="flex-1 m-2">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {panel.title}
              </CardTitle>
              <div className="flex items-center space-x-1">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onPanelToggle(panel.id)}
                  className="h-6 w-6 p-0"
                >
                  <Minimize2 className="h-3 w-3" />
                </Button>
              </div>
            </CardHeader>
            <CardContent className="pt-0">
              {panel.component}
            </CardContent>
          </Card>

          {index < visiblePanels.length - 1 && (
            <div className="flex items-center justify-center w-2 bg-border cursor-col-resize">
              <GripVertical className="h-4 w-4 text-muted-foreground" />
            </div>
          )}
        </motion.div>
      ))}
    </div>
  )
}
```

### Floating Panels System

```tsx
// components/layout/floating-panels.tsx
"use client"

import { useState, useRef, useEffect } from "react"
import { motion } from "framer-motion"
import { X, Minus, Square, GripHorizontal } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

interface FloatingPanel {
  id: string
  title: string
  component: React.ReactNode
  position: { x: number; y: number }
  size: { width: number; height: number }
  minimized: boolean
  zIndex: number
}

interface FloatingPanelsProps {
  panels: FloatingPanel[]
  onPanelUpdate: (panelId: string, updates: Partial<FloatingPanel>) => void
  onPanelClose: (panelId: string) => void
}

export function FloatingPanels({
  panels,
  onPanelUpdate,
  onPanelClose
}: FloatingPanelsProps) {
  const [dragging, setDragging] = useState<string | null>(null)
  const [resizing, setResizing] = useState<string | null>(null)
  const [highestZIndex, setHighestZIndex] = useState(1000)

  const bringToFront = (panelId: string) => {
    const newZIndex = highestZIndex + 1
    setHighestZIndex(newZIndex)
    onPanelUpdate(panelId, { zIndex: newZIndex })
  }

  const handleMinimize = (panelId: string) => {
    onPanelUpdate(panelId, { minimized: true })
  }

  return (
    <div className="fixed inset-0 pointer-events-none">
      {panels.map((panel) => (
        <motion.div
          key={panel.id}
          className="absolute pointer-events-auto"
          style={{
            left: panel.position.x,
            top: panel.position.y,
            width: panel.size.width,
            height: panel.minimized ? 40 : panel.size.height,
            zIndex: panel.zIndex
          }}
          drag={!panel.minimized}
          dragMomentum={false}
          onDragStart={() => bringToFront(panel.id)}
          onDragEnd={(event, info) => {
            onPanelUpdate(panel.id, {
              position: {
                x: panel.position.x + info.offset.x,
                y: panel.position.y + info.offset.y
              }
            })
          }}
        >
          <Card className="h-full shadow-lg border-2">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 cursor-move">
              <div className="flex items-center space-x-2">
                <GripHorizontal className="h-4 w-4 text-muted-foreground" />
                <CardTitle className="text-sm font-medium">
                  {panel.title}
                </CardTitle>
              </div>
              <div className="flex items-center space-x-1">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleMinimize(panel.id)}
                  className="h-6 w-6 p-0"
                >
                  <Minus className="h-3 w-3" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onPanelClose(panel.id)}
                  className="h-6 w-6 p-0"
                >
                  <X className="h-3 w-3" />
                </Button>
              </div>
            </CardHeader>
            {!panel.minimized && (
              <CardContent className="pt-0">
                {panel.component}
              </CardContent>
            )}
          </Card>
        </motion.div>
      ))}
    </div>
  )
}
```

---

## 🚀 5. Implementation Guide

### Step 1: Update Layout Structure

```tsx
// app/(dashboard)/layout.tsx
import { FileMenuNav } from "@/components/navigation/file-menu-nav"
import { TradingSidebar } from "@/components/navigation/trading-sidebar"
import { TradingNotifications } from "@/components/notifications/trading-notifications"
import { MultiPanelDashboard } from "@/components/layout/multi-panel-dashboard"

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="h-screen flex flex-col bg-background">
      {/* Top Menu Bar */}
      <div className="h-12 bg-card border-b flex items-center px-4">
        <FileMenuNav />
        <div className="ml-auto flex items-center space-x-4">
          {/* User menu, notifications, etc. */}
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex flex-1 overflow-hidden">
        <TradingSidebar />
        <div className="flex-1 flex flex-col">
          <MultiPanelDashboard>
            {children}
          </MultiPanelDashboard>
        </div>
      </div>

      {/* Floating Elements */}
      <TradingNotifications />
    </div>
  )
}
```

### Step 2: Add Keyboard Shortcuts

```tsx
// hooks/use-keyboard-shortcuts.ts
"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"

export function useKeyboardShortcuts() {
  const router = useRouter()

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      // File menu shortcuts
      if (event.ctrlKey || event.metaKey) {
        switch (event.key) {
          case 'n':
            event.preventDefault()
            // Open new workspace
            break
          case 'o':
            event.preventDefault()
            // Open workspace
            break
          case 's':
            event.preventDefault()
            // Save workspace
            break
          case 't':
            event.preventDefault()
            router.push('/orders/new')
            break
          case 'w':
            event.preventDefault()
            router.push('/watchlist')
            break
          case 'f':
            event.preventDefault()
            router.push('/screener')
            break
        }
      }

      // Other shortcuts
      if (event.key === 'F11') {
        event.preventDefault()
        // Toggle fullscreen
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [router])
}
```

### Step 3: Add Real-time Updates

```tsx
// hooks/use-realtime-data.ts
"use client"

import { useState, useEffect } from "react"

interface MarketData {
  symbol: string
  price: number
  change: number
  changePercent: number
  volume: number
  timestamp: Date
}

export function useRealtimeData(symbols: string[]) {
  const [data, setData] = useState<Record<string, MarketData>>({})
  const [isConnected, setIsConnected] = useState(false)

  useEffect(() => {
    // Simulate WebSocket connection
    const ws = new WebSocket('ws://localhost:8080/market-data')

    ws.onopen = () => {
      setIsConnected(true)
      ws.send(JSON.stringify({ type: 'subscribe', symbols }))
    }

    ws.onmessage = (event) => {
      const message = JSON.parse(event.data)
      if (message.type === 'price_update') {
        setData(prev => ({
          ...prev,
          [message.symbol]: {
            ...message.data,
            timestamp: new Date()
          }
        }))
      }
    }

    ws.onclose = () => {
      setIsConnected(false)
    }

    return () => {
      ws.close()
    }
  }, [symbols])

  return { data, isConnected }
}
```

---

## 🎯 6. Advanced Features to Add

### 1. **Workspace Management**
- Save/load custom layouts
- Multiple workspace tabs
- Workspace templates

### 2. **Advanced Charting**
- Interactive price charts
- Technical indicators
- Drawing tools
- Multi-timeframe analysis

### 3. **Portfolio Analytics**
- Risk metrics dashboard
- Performance attribution
- Scenario analysis
- Benchmark comparisons

### 4. **Social Trading Features**
- Trader profiles and ratings
- Copy trading signals
- Community discussions
- Strategy sharing

### 5. **AI-Powered Insights**
- Market sentiment analysis
- Predictive analytics
- Automated alerts
- Smart order routing

---

## 🚀 7. Deployment & Scaling

### Docker Configuration for Production

```dockerfile
# Dockerfile.production
FROM node:18-alpine AS base

# Install dependencies
FROM base AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app

COPY package.json pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile

# Build application
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

ENV NEXT_TELEMETRY_DISABLED 1
RUN pnpm build

# Production image
FROM base AS runner
WORKDIR /app

ENV NODE_ENV production
ENV NEXT_TELEMETRY_DISABLED 1

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs

EXPOSE 3000
ENV PORT 3000

CMD ["node", "server.js"]
```

### Performance Optimizations

```tsx
// components/performance/lazy-loaded-charts.tsx
"use client"

import dynamic from 'next/dynamic'
import { Suspense } from 'react'
import { Skeleton } from '@/components/ui/skeleton'

// Lazy load heavy components
const TradingChart = dynamic(() => import('./trading-chart'), {
  loading: () => <Skeleton className="h-96 w-full" />,
  ssr: false
})

const StockScreener = dynamic(() => import('./stock-screener'), {
  loading: () => <Skeleton className="h-96 w-full" />,
  ssr: false
})

export function LazyLoadedCharts() {
  return (
    <Suspense fallback={<Skeleton className="h-96 w-full" />}>
      <TradingChart />
    </Suspense>
  )
}
```

---

## 📚 8. Best Practices

### Code Organization
```
src/
├── components/
│   ├── layout/          # Layout components
│   ├── navigation/      # Navigation components
│   ├── charts/          # Chart components
│   ├── forms/           # Form components
│   └── ui/              # Base UI components
├── hooks/               # Custom hooks
├── lib/                 # Utilities
├── stores/              # State management
├── types/               # TypeScript types
└── constants/           # App constants
```

### Performance Guidelines
- Use React.memo for expensive components
- Implement virtual scrolling for large lists
- Optimize bundle size with code splitting
- Use Web Workers for heavy calculations
- Implement proper caching strategies

### Accessibility
- Keyboard navigation support
- Screen reader compatibility
- High contrast mode support
- Focus management
- Semantic HTML structure

This comprehensive layout system transforms your minimal theme into a professional, addictive trading platform with desktop-style navigation and advanced features typical of modern financial applications.
