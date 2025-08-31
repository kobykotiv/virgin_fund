"use client"

import React, { useState } from 'react'
import { useWindowManager } from './WindowManager'
import { Button } from './ui/button'
import { Card, CardContent } from './ui/card'
import {
  Bot,
  BarChart3,
  TrendingUp,
  Settings,
  Calculator,
  Zap,
  Target,
  PieChart,
  Activity,
  FileText,
  Users,
  Globe
} from 'lucide-react'
import BotsWindow from './windows/BotsWindow'
import StrategiesWindow from './windows/StrategiesWindow'
import BacktestWindow from './windows/BacktestWindow'
import PortfolioWindow from './windows/PortfolioWindow'
import AnalyticsWindow from './windows/AnalyticsWindow'
import SettingsWindow from './windows/SettingsWindow'
import { StrategyBuilderWindow } from './windows/StrategyBuilderWindow'

interface DesktopIcon {
  id: string
  title: string
  icon: React.ComponentType<{ className?: string }>
  component: React.ComponentType
  color: string
  shortcut?: string
}

const desktopIcons: DesktopIcon[] = [
  {
    id: 'bots',
    title: 'Trading Bots',
    icon: Bot,
    component: BotsWindow,
    color: 'text-blue-500',
    shortcut: 'Ctrl+1'
  },
  {
    id: 'strategies',
    title: 'Strategies',
    icon: Target,
    component: StrategiesWindow,
    color: 'text-green-500',
    shortcut: 'Ctrl+2'
  },
  {
    id: 'backtest',
    title: 'Backtesting',
    icon: BarChart3,
    component: BacktestWindow,
    color: 'text-purple-500',
    shortcut: 'Ctrl+3'
  },
  {
    id: 'portfolio',
    title: 'Portfolio',
    icon: PieChart,
    component: PortfolioWindow,
    color: 'text-orange-500',
    shortcut: 'Ctrl+4'
  },
  {
    id: 'analytics',
    title: 'Analytics',
    icon: TrendingUp,
    component: AnalyticsWindow,
    color: 'text-red-500',
    shortcut: 'Ctrl+5'
  },
  {
    id: 'strategy-builder',
    title: 'Strategy Builder',
    icon: Zap,
    component: StrategyBuilderWindow,
    color: 'text-yellow-500',
    shortcut: 'Ctrl+7'
  },
  {
    id: 'calculators',
    title: 'Calculators',
    icon: Calculator,
    component: () => <div className="p-4"><h2 className="text-xl font-bold">Calculators</h2><p>Coming soon...</p></div>,
    color: 'text-indigo-500'
  },
  {
    id: 'settings',
    title: 'Settings',
    icon: Settings,
    component: SettingsWindow,
    color: 'text-gray-500',
    shortcut: 'Ctrl+6'
  }
]

interface DesktopIconProps {
  icon: DesktopIcon
  onDoubleClick: (icon: DesktopIcon) => void
}

const DesktopIconComponent: React.FC<DesktopIconProps> = ({ icon, onDoubleClick }) => {
  const [isSelected, setIsSelected] = useState(false)

  const handleClick = () => {
    setIsSelected(!isSelected)
  }

  const handleDoubleClick = () => {
    onDoubleClick(icon)
    setIsSelected(false)
  }

  return (
    <Card
      className={`w-20 h-20 cursor-pointer transition-all duration-200 hover:scale-105 ${
        isSelected ? 'ring-2 ring-primary bg-primary/10' : 'hover:bg-muted/50'
      }`}
      onClick={handleClick}
      onDoubleClick={handleDoubleClick}
    >
      <CardContent className="flex flex-col items-center justify-center h-full p-2">
        <icon.icon className={`w-8 h-8 mb-1 ${icon.color}`} />
        <span className="text-xs text-center leading-tight font-medium">
          {icon.title}
        </span>
        {icon.shortcut && (
          <span className="text-xs text-muted-foreground mt-0.5">
            {icon.shortcut}
          </span>
        )}
      </CardContent>
    </Card>
  )
}

export const Desktop: React.FC = () => {
  const { openWindow } = useWindowManager()

  const handleIconDoubleClick = (icon: DesktopIcon) => {
    openWindow(icon.id, icon.title, icon.component)
  }

  return (
    <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 overflow-hidden">
      {/* Animated background pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(120,119,198,0.3),rgba(255,255,255,0))]" />
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4xIj48Y2lyY2xlIGN4PSIzMCIgY3k9IjMwIiByPSIxLjUiLz48L2c+PC9nPjwvc3ZnPg==')] opacity-20" />
      </div>

      {/* Desktop icons grid */}
      <div className="relative z-10 p-6">
        <div className="grid grid-cols-8 gap-4 max-w-4xl">
          {desktopIcons.map((icon) => (
            <DesktopIconComponent
              key={icon.id}
              icon={icon}
              onDoubleClick={handleIconDoubleClick}
            />
          ))}
        </div>
      </div>

      {/* Welcome message */}
      <div className="absolute bottom-20 left-6 text-white/80">
        <h1 className="text-2xl font-bold mb-2">Virgin Fund Trading Platform</h1>
        <p className="text-sm opacity-75">
          Double-click icons to open applications • Use Ctrl+1-7 for quick access
        </p>
      </div>

      {/* Version info */}
      <div className="absolute bottom-6 right-6 text-white/60 text-xs">
        v2.0.0 • Connected to Alpaca Markets
      </div>
    </div>
  )
}
