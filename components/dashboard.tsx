"use client"

import { useState, useEffect } from "react"
import { EnhancedDashboard } from "@/components/enhanced-dashboard"
import { BasicDashboard } from "@/components/basic-dashboard"
import { DashboardSwitcher } from "@/components/dashboard-switcher"
import { Button } from "@/components/ui/button"
import { useToast } from "@/components/ui/use-toast"
import type { Bot } from "@/types/bot"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { fetchPortfolio } from "@/lib/api"
import type { Portfolio } from "@/types/portfolio"

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
  const { toast } = useToast()
  const [loading, setLoading] = useState<string[]>([])
  const [dashboardMode, setDashboardMode] = useState<'basic' | 'enhanced'>('enhanced')
  const [portfolio, setPortfolio] = useState<Portfolio | null>(null)

  useEffect(() => {
    const loadPortfolio = async () => {
      try {
        const data = await fetchPortfolio()
        setPortfolio(data)
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to load portfolio data",
          variant: "destructive",
        })
      }
    }

    loadPortfolio()
  }, [toast])

  const handleBotAction = async (botId: string, action: 'start' | 'stop' | 'delete') => {
    setLoading(prev => [...prev, botId])
    try {
      const response = await fetch(`/api/bots/${botId}/${action}`, {
        method: 'POST'
      })
      
      if (!response.ok) throw new Error('Failed to perform action')
      
      toast({
        title: 'Success',
        description: `Bot ${action} successful`,
      })
    } catch (error) {
      toast({
        title: 'Error',
        description: `Failed to ${action} bot`,
        variant: 'destructive',
      })
    } finally {
      setLoading(prev => prev.filter(id => id !== botId))
    }
  }

  return (
    <div className="space-y-4">
      <Card className="mb-4">
        <CardContent className="py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <span className="text-sm font-medium">Dashboard Mode:</span>
              <Badge variant="outline">
                {dashboardMode === 'enhanced' ? 'Enhanced' : 'Basic'}
              </Badge>
            </div>
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => setDashboardMode(mode => mode === 'enhanced' ? 'basic' : 'enhanced')}
            >
              Switch View
            </Button>
          </div>
        </CardContent>
      </Card>

      {dashboardMode === 'enhanced' ? (
        <EnhancedDashboard 
          apiConfig={apiConfig}
          onBotAction={handleBotAction}
          isLoading={loading.length > 0}
          portfolio={portfolio}
        />
      ) : (
        <BasicDashboard 
          apiConfig={apiConfig}
          onBotAction={handleBotAction}
          isLoading={loading.length > 0}
          portfolio={portfolio}
        />
      )}
    </div>
  )
}

