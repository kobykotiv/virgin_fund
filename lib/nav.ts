import { Home, Zap, Repeat, Bot, Users, BarChart2, Globe, Wallet, List, Key, Settings, BookOpen } from 'lucide-react'
import React from 'react'

export type NavItem = {
  id: string
  label: string
  href?: string
  icon?: React.ElementType
  children?: NavItem[]
  requiresAuth?: boolean
  exact?: boolean
}

export const NAV: NavItem[] = [
  { id: 'dashboard', label: 'Dashboard', href: '/dashboard', icon: Home, requiresAuth: true },
  { id: 'signals', label: 'Signals', href: '/signals', icon: Zap, requiresAuth: true },
  { id: 'pipelines', label: 'Pipelines', href: '/bots/pipeline', icon: Repeat, requiresAuth: true },
  { id: 'bots', label: 'Bots', href: '/bots', icon: Bot, requiresAuth: true },
  {
    id: 'analysis',
    label: 'Analysis',
    children: [
      { id: 'strategies', label: 'Strategies', href: '/strategies', icon: Users, requiresAuth: false },
      { id: 'backtests', label: 'Backtests', href: '/backtests', icon: BarChart2, requiresAuth: true },
      { id: 'markets', label: 'Markets', href: '/market', icon: Globe, requiresAuth: false },
    ],
  },
  { id: 'portfolio', label: 'Portfolio', href: '/market/portfolio', icon: Wallet, requiresAuth: true },
  { id: 'watchlists', label: 'Watchlists', href: '/watchlists', icon: List, requiresAuth: true },
  { id: 'keys', label: 'API Keys', href: '/settings/keys', icon: Key, requiresAuth: true },
  { id: 'settings', label: 'Settings', href: '/settings/profile', icon: Settings, requiresAuth: true },
  { id: 'docs', label: 'Docs', href: '/docs', icon: BookOpen, requiresAuth: false },
]

export default NAV
