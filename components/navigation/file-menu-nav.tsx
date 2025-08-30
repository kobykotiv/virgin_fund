"use client"

import { useState, useEffect } from "react"
import { ChevronDown, FileText, Settings, HelpCircle, BarChart3, Search, TrendingUp, DollarSign } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useRouter } from "next/navigation"

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
      { id: "new-order", label: "New Order", shortcut: "Ctrl+T", action: () => console.log("New order") },
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
  const router = useRouter()

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
    } else {
      // Handle navigation based on item id
      switch (item.id) {
        case 'screener':
          router.push('/screener')
          break
        case 'watchlist':
          router.push('/watchlist')
          break
        case 'new-order':
          router.push('/orders/new')
          break
        case 'calculator':
          router.push('/calculators')
          break
        case 'backtest':
          router.push('/backtest')
          break
        default:
          console.log(`Navigate to ${item.id}`)
      }
    }
    setActiveMenus(new Set())
  }

  // Handle keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.ctrlKey || event.metaKey) {
        switch (event.key) {
          case 'n':
            event.preventDefault()
            console.log('New workspace')
            break
          case 'o':
            event.preventDefault()
            console.log('Open workspace')
            break
          case 's':
            event.preventDefault()
            console.log('Save workspace')
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
          case 'l':
            event.preventDefault()
            router.push('/calculators')
            break
          case 'k':
            event.preventDefault()
            router.push('/backtest')
            break
        }
      }

      if (event.key === 'F11') {
        event.preventDefault()
        if (document.fullscreenElement) {
          document.exitFullscreen()
        } else {
          document.documentElement.requestFullscreen()
        }
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [router])

  return (
    <div className="flex items-center space-x-1 bg-muted/30 px-2 py-1 rounded-md border">
      {fileMenuItems.map((menu) => (
        <DropdownMenu key={menu.id}>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="sm"
              className={cn(
                "h-8 px-3 text-sm font-medium hover:bg-accent",
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
                  className="flex items-center justify-between cursor-pointer"
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
