"use client"
import { EnhancedDashboard } from "@/components/enhanced-dashboard"
import type { Bot } from "@/types/bot"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { fetchPortfolio } from "@/lib/api"
import type { Portfolio } from "@/types/portfolio"
import { PORTFOLIO_SCENARIOS, ScenarioKey } from "@/lib/portfolio-scenarios"

interface DashboardProps {
  bots: Bot[]
  apiConfig?: {
    keyId: string
    secretKey: string
    baseUrl: string
    isPaper: boolean
  } | null
}

export function Dashboard({ bots, apiConfig }: DashboardProps) {
  return <EnhancedDashboard apiConfig={apiConfig} />
}

