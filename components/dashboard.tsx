"use client"
import { EnhancedDashboard } from "@/components/enhanced-dashboard"
import type { Bot } from "@/types/bot"

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

