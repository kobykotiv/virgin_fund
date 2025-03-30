"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { Skeleton } from "@/components/ui/skeleton"
import { toast } from "@/components/ui/use-toast"
import { PlayCircle, PauseCircle, AlertTriangle, Settings, RefreshCw } from "lucide-react"
import type { Bot } from "@/types/bot"

interface BotStatusManagerProps {
  botId: string
}

export function BotStatusManager({ botId }: BotStatusManagerProps) {
  const [bot, setBot] = useState<Bot | null>(null)
  const [loading, setLoading] = useState(true)
  const [updating, setUpdating] = useState(false)
  const [error, setError] = useState<string | null>(null)
  
  useEffect(() => {
    fetchBotStatus()
  }, [botId])
  
  const fetchBotStatus = async () => {
    if (!botId) return
    
    setLoading(true)
    setError(null)
    
    try {
      const response = await fetch(`/api/db/bots/${botId}`)
      
      if (!response.ok) {
        throw new Error('Failed to fetch bot status')
      }
      
      const data = await response.json()
      setBot(data)
    } catch (error: any) {
      console.error('Error fetching bot status:', error)
      setError(error.message || 'Failed to load bot status')
    } finally {
      setLoading(false)
    }
  }
  
  const updateBotStatus = async (newStatus: "active" | "paused") => {
    setUpdating(true)
    
    try {
      const response = await fetch(`/api/db/bots/${botId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          status: newStatus,
          statusReason: 'Manual update via status manager'
        })
      })
      
      if (!response.ok) {
        throw new Error('Failed to update bot status')
      }
      
      // Refresh bot data
      await fetchBotStatus()
      
      toast({
        title: `Bot ${newStatus === 'active' ? 'Activated' : 'Paused'}`,
        description: newStatus === 'active' 
          ? "Bot will now execute trades based on its strategy" 
          : "Bot has been paused and will not execute trades"
      })
    } catch (error: any) {
      console.error('Error updating bot status:', error)
      toast({
        title: "Error",
        description: error.message || 'Failed to update bot status',
        variant: "destructive"
      })
    } finally {
      setUpdating(false)
    }
  }
  
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'text-green-500'
      case 'paused':
        return 'text-amber-500'
      case 'error':
        return 'text-red-500'
      default:
        return ''
    }
  }
  
  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active':
        return <PlayCircle className="h-5 w-5 text-green-500" />
      case 'paused':
        return <PauseCircle className="h-5 w-5 text-amber-500" />
      case 'error':
        return <AlertTriangle className="h-5 w-5 text-red-500" />
      default:
        return <Settings className="h-5 w-5" />
    }
  }
  
  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Bot Status</CardTitle>
          <CardDescription>Manage the execution status of this bot</CardDescription>
        </CardHeader>
        <CardContent>
          <Skeleton className="h-[100px] w-full" />
        </CardContent>
      </Card>
    )
  }
  
  if (error || !bot) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Bot Status</CardTitle>
          <CardDescription>Manage the execution status of this bot</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center justify-center h-[100px]">
            <AlertTriangle className="h-8 w-8 text-amber-500 mb-2" />
            <p className="text-muted-foreground">{error || 'Failed to load bot data'}</p>
            <Button variant="outline" size="sm" onClick={fetchBotStatus} className="mt-2">
              <RefreshCw className="h-4 w-4 mr-2" />
              Retry
            </Button>
          </div>
        </CardContent>
      </Card>
    )
  }
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>Bot Status</CardTitle>
        <CardDescription>Manage the execution status of this bot</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              {getStatusIcon(bot.status)}
              <div>
                <p className="font-medium">
                  Status: <span className={getStatusColor(bot.status)}>{bot.status}</span>
                </p>
                <p className="text-sm text-muted-foreground">
                  {bot.status === 'active' 
                    ? 'Bot is running and executing trades' 
                    : bot.status === 'paused'
                    ? 'Bot is paused and not executing trades'
                    : 'Bot encountered an error and stopped'}
                </p>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">
                {bot.status === 'active' ? 'Active' : 'Paused'}
              </span>
              <Switch
                checked={bot.status === 'active'}
                onCheckedChange={(checked) => updateBotStatus(checked ? 'active' : 'paused')}
                disabled={updating || bot.status === 'error'}
              />
            </div>
          </div>
          
          {bot.status === 'error' && (
            <div className="bg-red-50 border border-red-200 rounded-md p-3 text-sm text-red-800">
              <p className="font-medium mb-1">Error Details</p>
              <p>The bot encountered an error and has been automatically paused.</p>
              <Button 
                variant="outline" 
                size="sm" 
                className="mt-2"
                onClick={() => updateBotStatus('paused')}
              >
                Reset Status
              </Button>
            </div>
          )}
          
          {bot.status === 'active' && (
            <div className="bg-amber-50 border border-amber-200 rounded-md p-3 text-sm text-amber-800">
              <p className="font-medium mb-1">Active Bot Notice</p>
              <p>
                This bot is currently active and may execute trades based on its strategy.
                Pause it if you want to prevent any further trading activity.
              </p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
