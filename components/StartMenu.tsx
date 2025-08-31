"use client"

import React, { useState } from 'react'
import { useWindowManager } from './WindowManager'
import { Button } from './ui/button'
import { Card, CardContent, CardHeader, CardTitle } from './ui/card'
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
  Globe,
  Power,
  User,
  HelpCircle
} from 'lucide-react'
import BotsWindow from './windows/BotsWindow'
import StrategiesWindow from './windows/StrategiesWindow'
import BacktestWindow from './windows/BacktestWindow'
import PortfolioWindow from './windows/PortfolioWindow'
import AnalyticsWindow from './windows/AnalyticsWindow'
import SettingsWindow from './windows/SettingsWindow'
import { StrategyBuilderWindow } from './windows/StrategyBuilderWindow'

interface StartMenuItem {
  id: string
  title: string
  icon: React.ComponentType<{ className?: string }>
  component: React.ComponentType
  category: 'trading' | 'analysis' | 'tools' | 'system'
}

const startMenuItems: StartMenuItem[] = [
  // Trading
  {
    id: 'bots',
    title: 'Trading Bots',
    icon: Bot,
    component: BotsWindow,
    category: 'trading'
  },
  {
    id: 'strategies',
    title: 'Strategies',
    icon: Target,
    component: StrategiesWindow,
    category: 'trading'
  },
  {
    id: 'portfolio',
    title: 'Portfolio',
    icon: PieChart,
    component: PortfolioWindow,
    category: 'trading'
  },
  // Analysis
  {
    id: 'backtest',
    title: 'Backtesting',
    icon: BarChart3,
    component: BacktestWindow,
    category: 'analysis'
  },
  {
    id: 'analytics',
    title: 'Analytics',
    icon: TrendingUp,
    component: AnalyticsWindow,
    category: 'analysis'
  },
  {
    id: 'strategy-builder',
    title: 'Strategy Builder',
    icon: Zap,
    component: StrategyBuilderWindow,
    category: 'analysis'
  },
  // Tools
  {
    id: 'calculators',
    title: 'Calculators',
    icon: Calculator,
    component: () => <div className="p-4"><h2 className="text-xl font-bold">Calculators</h2><p>Coming soon...</p></div>,
    category: 'tools'
  },
  // System
  {
    id: 'settings',
    title: 'Settings',
    icon: Settings,
    component: SettingsWindow,
    category: 'system'
  }
]

interface StartMenuProps {
  isOpen: boolean
  onClose: () => void
}

export const StartMenu: React.FC<StartMenuProps> = ({ isOpen, onClose }) => {
  const { openWindow } = useWindowManager()

  const handleItemClick = (item: StartMenuItem) => {
    openWindow(item.id, item.title, item.component)
    onClose()
  }

  const categories = {
    trading: startMenuItems.filter(item => item.category === 'trading'),
    analysis: startMenuItems.filter(item => item.category === 'analysis'),
    tools: startMenuItems.filter(item => item.category === 'tools'),
    system: startMenuItems.filter(item => item.category === 'system')
  }

  if (!isOpen) return null

  return (
    <div className="fixed bottom-12 left-0 z-50">
      <Card className="w-80 max-h-96 overflow-y-auto shadow-2xl border-2">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg flex items-center gap-2">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <span className="text-primary-foreground font-bold text-sm">VF</span>
            </div>
            Virgin Fund
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          {/* Trading */}
          <div className="p-3 border-b">
            <h3 className="text-sm font-semibold text-muted-foreground mb-2 uppercase tracking-wide">Trading</h3>
            <div className="space-y-1">
              {categories.trading.map((item) => (
                <Button
                  key={item.id}
                  variant="ghost"
                  className="w-full justify-start h-8 px-2"
                  onClick={() => handleItemClick(item)}
                >
                  <item.icon className="w-4 h-4 mr-3" />
                  {item.title}
                </Button>
              ))}
            </div>
          </div>

          {/* Analysis */}
          <div className="p-3 border-b">
            <h3 className="text-sm font-semibold text-muted-foreground mb-2 uppercase tracking-wide">Analysis</h3>
            <div className="space-y-1">
              {categories.analysis.map((item) => (
                <Button
                  key={item.id}
                  variant="ghost"
                  className="w-full justify-start h-8 px-2"
                  onClick={() => handleItemClick(item)}
                >
                  <item.icon className="w-4 h-4 mr-3" />
                  {item.title}
                </Button>
              ))}
            </div>
          </div>

          {/* Tools */}
          <div className="p-3 border-b">
            <h3 className="text-sm font-semibold text-muted-foreground mb-2 uppercase tracking-wide">Tools</h3>
            <div className="space-y-1">
              {categories.tools.map((item) => (
                <Button
                  key={item.id}
                  variant="ghost"
                  className="w-full justify-start h-8 px-2"
                  onClick={() => handleItemClick(item)}
                >
                  <item.icon className="w-4 h-4 mr-3" />
                  {item.title}
                </Button>
              ))}
            </div>
          </div>

          {/* System */}
          <div className="p-3">
            <h3 className="text-sm font-semibold text-muted-foreground mb-2 uppercase tracking-wide">System</h3>
            <div className="space-y-1">
              {categories.system.map((item) => (
                <Button
                  key={item.id}
                  variant="ghost"
                  className="w-full justify-start h-8 px-2"
                  onClick={() => handleItemClick(item)}
                >
                  <item.icon className="w-4 h-4 mr-3" />
                  {item.title}
                </Button>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
