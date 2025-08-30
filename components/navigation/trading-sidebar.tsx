"use client"

import { useState } from "react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
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
  ChevronRight,
  Calculator,
  Target,
  BookOpen,
  Users
} from "lucide-react"
import { useRouter, usePathname } from "next/navigation"

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
      { id: "watchlist", label: "Watchlist", icon: <Star className="h-4 w-4" />, badge: 12, href: "/watchlist" },
      { id: "screener", label: "Stock Screener", icon: <Search className="h-4 w-4" />, href: "/screener" },
      { id: "heatmap", label: "Market Heatmap", icon: <Activity className="h-4 w-4" />, href: "/heatmap" },
      { id: "gainers", label: "Top Gainers", icon: <TrendingUp className="h-4 w-4" />, href: "/gainers" },
      { id: "losers", label: "Top Losers", icon: <TrendingDown className="h-4 w-4" />, href: "/losers" }
    ]
  },
  {
    id: "portfolio",
    title: "Portfolio",
    icon: <PieChart className="h-4 w-4" />,
    items: [
      { id: "overview", label: "Overview", icon: <BarChart3 className="h-4 w-4" />, href: "/portfolio" },
      { id: "positions", label: "Positions", icon: <DollarSign className="h-4 w-4" />, badge: 8, href: "/positions" },
      { id: "orders", label: "Orders", icon: <Clock className="h-4 w-4" />, badge: 3, href: "/orders" },
      { id: "performance", label: "Performance", icon: <TrendingUp className="h-4 w-4" />, href: "/performance" },
      { id: "holdings", label: "Holdings", icon: <PieChart className="h-4 w-4" />, href: "/holdings" }
    ]
  },
  {
    id: "trading",
    title: "Trading",
    icon: <Target className="h-4 w-4" />,
    items: [
      { id: "new-order", label: "New Order", icon: <Target className="h-4 w-4" />, href: "/orders/new" },
      { id: "order-history", label: "Order History", icon: <Clock className="h-4 w-4" />, href: "/orders/history" },
      { id: "trade-ideas", label: "Trade Ideas", icon: <TrendingUp className="h-4 w-4" />, href: "/trade-ideas" },
      { id: "copy-trading", label: "Copy Trading", icon: <Users className="h-4 w-4" />, href: "/copy-trading" }
    ]
  },
  {
    id: "analysis",
    title: "Analysis",
    icon: <Activity className="h-4 w-4" />,
    items: [
      { id: "technical", label: "Technical Analysis", icon: <BarChart3 className="h-4 w-4" />, href: "/analysis/technical" },
      { id: "fundamental", label: "Fundamental Analysis", icon: <PieChart className="h-4 w-4" />, href: "/analysis/fundamental" },
      { id: "backtest", label: "Backtesting", icon: <Activity className="h-4 w-4" />, href: "/backtest" },
      { id: "calculators", label: "Calculators", icon: <Calculator className="h-4 w-4" />, href: "/calculators" },
      { id: "research", label: "Research", icon: <BookOpen className="h-4 w-4" />, href: "/research" }
    ]
  }
]

export function TradingSidebar() {
  const [collapsed, setCollapsed] = useState(false)
  const router = useRouter()
  const pathname = usePathname()

  const handleItemClick = (href: string) => {
    router.push(href)
  }

  const isActive = (href: string) => {
    return pathname === href || pathname.startsWith(href + '/')
  }

  return (
    <div className={cn(
      "flex flex-col bg-card border-r transition-all duration-300 ease-in-out",
      collapsed ? "w-16" : "w-64"
    )}>
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b">
        {!collapsed && (
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <BarChart3 className="h-5 w-5 text-primary-foreground" />
            </div>
            <div>
              <h2 className="font-bold text-lg leading-tight">Virgin Fund</h2>
              <p className="text-xs text-muted-foreground">Trading Hub</p>
            </div>
          </div>
        )}
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setCollapsed(!collapsed)}
          className="h-8 w-8 p-0 hover:bg-accent"
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
                <div className="flex items-center px-2 py-1 text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">
                  {section.icon}
                  <span className="ml-2">{section.title}</span>
                </div>
              )}
              <div className="space-y-1">
                {section.items.map((item) => (
                  <Button
                    key={item.id}
                    variant={isActive(item.href || '') ? "secondary" : "ghost"}
                    className={cn(
                      "w-full justify-start h-10 transition-all duration-200",
                      collapsed ? "px-2" : "px-3",
                      isActive(item.href || '') && "bg-accent shadow-sm"
                    )}
                    onClick={() => item.href && handleItemClick(item.href)}
                  >
                    <div className="flex items-center space-x-3 flex-1">
                      {item.icon}
                      {!collapsed && (
                        <>
                          <span className="flex-1 text-left text-sm">{item.label}</span>
                          {item.badge && (
                            <Badge
                              variant="secondary"
                              className="ml-auto h-5 px-2 text-xs bg-primary/10 text-primary hover:bg-primary/20"
                            >
                              {item.badge}
                            </Badge>
                          )}
                        </>
                      )}
                    </div>
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
          className={cn(
            "w-full justify-start hover:bg-accent transition-colors",
            collapsed ? "px-2" : "px-3"
          )}
        >
          <Settings className="h-4 w-4" />
          {!collapsed && <span className="ml-2">Settings</span>}
        </Button>
      </div>
    </div>
  )
}
