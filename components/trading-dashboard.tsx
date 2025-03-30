"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { toast } from "@/components/ui/use-toast"
import { Skeleton } from "@/components/ui/skeleton"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import {
  BarChart4,
  Plus,
  Workflow,
  CircleDollarSign,
  Activity,
  Trash2,
  RotateCw,
  Bot,
  PieChart,
  CandlestickChart,
  ZapIcon,
  Settings,
  Play,
  Pause
} from "lucide-react"
import type { Bot as BotType } from "@/types/bot"

export function TradingDashboard() {
  const router = useRouter()
  const [bots, setBots] = useState<BotType[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState<"all" | "indicator" | "grid" | "dca" | "basket">("all")
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null)
  
  useEffect(() => {
    fetchBots()
  }, [])
  
  const fetchBots = async () => {
    setLoading(true)
    setError(null)
    
    try {
      const response = await fetch('/api/db/bots')
      
      if (!response.ok) {
        throw new Error('Failed to fetch bots')
      }
      
      const data = await response.json()
      setBots(data)
    } catch (err: any) {
      console.error('Error fetching bots:', err)
      setError(err.message || 'Failed to load bots')
    } finally {
      setLoading(false)
    }
  }
  
  const handleCreateBot = () => {
    router.push('/bots/new')
  }
  
  const handleEditBot = (botId: string) => {
    router.push(`/bots/${botId}/edit`)
  }
  
  const updateBotStatus = async (botId: string, newStatus: "active" | "paused") => {
    try {
      const response = await fetch(`/api/db/bots/${botId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          status: newStatus,
          statusReason: `Manual update by user`
        })
      })
      
      if (!response.ok) {
        throw new Error('Failed to update bot status')
      }
      
      fetchBots()
      
      toast({
        title: `Bot ${newStatus === 'active' ? 'Activated' : 'Paused'}`,
        description: newStatus === 'active' 
          ? "Bot is now active and will execute trades" 
          : "Bot is now paused and will not execute trades"
      })
    } catch (err: any) {
      console.error('Error updating bot status:', err)
      toast({
        title: "Error",
        description: err.message || 'Failed to update bot status',
        variant: "destructive"
      })
    }
  }
  
  const deleteBot = async (botId: string) => {
    try {
      const response = await fetch(`/api/db/bots/${botId}`, {
        method: 'DELETE'
      })
      
      if (!response.ok) {
        const errorData = await response.json()
        
        // Special handling for bots used in portfolios
        if (errorData.portfoliosCount > 0) {
          throw new Error(`Cannot delete bot that is used in ${errorData.portfoliosCount} portfolio(s). Remove the bot from portfolios first.`)
        }
        
        throw new Error('Failed to delete bot')
      }
      
      fetchBots()
      setConfirmDelete(null)
      
      toast({
        title: "Bot Deleted",
        description: "Bot has been successfully deleted"
      })
    } catch (err: any) {
      console.error('Error deleting bot:', err)
      toast({
        title: "Error",
        description: err.message || 'Failed to delete bot',
        variant: "destructive"
      })
    }
  }
  
  const getBotTypeIcon = (type: string) => {
    switch (type) {
      case 'indicator':
        return <Activity className="h-4 w-4" />
      case 'grid':
        return <CandlestickChart className="h-4 w-4" />
      case 'dca':
        return <CircleDollarSign className="h-4 w-4" />
      case 'basket':
        return <PieChart className="h-4 w-4" />
      default:
        return <Bot className="h-4 w-4" />
    }
  }
  
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return <Badge className="bg-green-500">Active</Badge>
      case 'paused':
        return <Badge variant="outline" className="text-amber-600 border-amber-600">Paused</Badge>
      case 'error':
        return <Badge variant="destructive">Error</Badge>
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }
  
  const filteredBots = activeTab === "all" 
    ? bots 
    : bots.filter(bot => bot.type === activeTab)
  
  if (loading) {
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold">Trading Bots</h1>
          <Skeleton className="h-10 w-28" />
        </div>
        <Skeleton className="h-[500px] w-full" />
      </div>
    )
  }
  
  if (error) {
    return (
      <div className="space-y-4">
        <h1 className="text-2xl font-bold">Trading Bots</h1>
        <Card>
          <CardContent className="flex flex-col items-center justify-center h-[300px]">
            <p className="text-destructive mb-4">{error}</p>
            <Button onClick={fetchBots}>Try Again</Button>
          </CardContent>
        </Card>
      </div>
    )
  }
  
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Trading Bots</h1>
        <Button onClick={handleCreateBot}>
          <Plus className="h-4 w-4 mr-2" />
          Create Bot
        </Button>
      </div>
      
      <Tabs defaultValue="all" value={activeTab} onValueChange={(value) => setActiveTab(value as any)}>
        <div className="flex justify-between items-center">
          <TabsList>
            <TabsTrigger value="all">All Bots</TabsTrigger>
            <TabsTrigger value="indicator">Indicator</TabsTrigger>
            <TabsTrigger value="grid">Grid</TabsTrigger>
            <TabsTrigger value="dca">DCA</TabsTrigger>
            <TabsTrigger value="basket">Basket</TabsTrigger>
          </TabsList>
          
          <Button variant="outline" size="sm" onClick={fetchBots}>
            <RotateCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
        </div>
        
        <TabsContent value="all" className="mt-4">
          {renderBotsList(filteredBots)}
        </TabsContent>
        <TabsContent value="indicator" className="mt-4">
          {renderBotsList(filteredBots)}
        </TabsContent>
        <TabsContent value="grid" className="mt-4">
          {renderBotsList(filteredBots)}
        </TabsContent>
        <TabsContent value="dca" className="mt-4">
          {renderBotsList(filteredBots)}
        </TabsContent>
        <TabsContent value="basket" className="mt-4">
          {renderBotsList(filteredBots)}
        </TabsContent>
      </Tabs>
      
      <Dialog open={!!confirmDelete} onOpenChange={() => setConfirmDelete(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Delete</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this bot? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setConfirmDelete(null)}>Cancel</Button>
            <Button variant="destructive" onClick={() => confirmDelete && deleteBot(confirmDelete)}>
              Delete Bot
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
  
  function renderBotsList(botsList: BotType[]) {
    if (botsList.length === 0) {
      return (
        <Card>
          <CardContent className="flex flex-col items-center justify-center h-[200px]">
            <p className="text-muted-foreground mb-4">No bots found</p>
            <Button onClick={handleCreateBot}>Create your first bot</Button>
          </CardContent>
        </Card>
      )
    }
    
    return (
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {botsList.map(bot => (
          <Card key={bot.id} className="overflow-hidden transition-all hover:shadow-md">
            <CardHeader className="pb-2">
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    {getBotTypeIcon(bot.type)}
                    {bot.name}
                  </CardTitle>
                  <CardDescription className="flex items-center gap-1 mt-1">
                    {getStatusBadge(bot.status)}
                    <span className="ml-2">{bot.assets.join(', ')}</span>
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="pb-2">
              {bot.performance && (
                <div className="grid grid-cols-2 gap-2 mb-3">
                  <div className="bg-muted rounded p-2">
                    <p className="text-xs text-muted-foreground">P&L</p>
                    <p className={bot.performance.totalPnL >= 0 ? "text-green-500" : "text-red-500"}>
                      {bot.performance.totalPnL >= 0 ? "+" : ""}
                      {bot.performance.totalPnL.toFixed(2)} ({bot.performance.pnlPercentage.toFixed(2)}%)
                    </p>
                  </div>
                  <div className="bg-muted rounded p-2">
                    <p className="text-xs text-muted-foreground">Trades</p>
                    <p>{bot.performance.totalTrades} ({bot.performance.winRate.toFixed(0)}% Win)</p>
                  </div>
                </div>
              )}
              
              <div className="text-sm text-muted-foreground">
                {bot.type === 'indicator' && bot.indicatorConfig && (
                  <p>{bot.indicatorConfig.type.toUpperCase()} on {bot.indicatorConfig.timeframe} timeframe</p>
                )}
                {bot.type === 'grid' && bot.gridConfig && (
                  <p>Grid from ${bot.gridConfig.lowerLimit} to ${bot.gridConfig.upperLimit} ({bot.gridConfig.gridSize}%)</p>
                )}
                {bot.type === 'dca' && bot.dcaConfig && (
                  <p>${bot.dcaConfig.amount} on {bot.dcaConfig.interval}</p>
                )}
                {bot.type === 'basket' && bot.basketConfig && (
                  <p>{Object.keys(bot.basketConfig.targetAllocation).length} assets in basket</p>
                )}
              </div>
            </CardContent>
            <CardFooter className="flex justify-between pt-2">
              <div className="flex gap-1">
                <Button variant="outline" size="sm" onClick={() => handleEditBot(bot.id)}>
                  <Settings className="h-4 w-4 mr-1" />
                  Edit
                </Button>
                <Button 
                  variant="outline" 
                  size="sm"
                  className="text-destructive"
                  onClick={() => setConfirmDelete(bot.id)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
              
              {bot.status === 'active' ? (
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => updateBotStatus(bot.id, 'paused')}
                >
                  <Pause className="h-4 w-4 mr-1" />
                  Pause
                </Button>
              ) : (
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => updateBotStatus(bot.id, 'active')}
                >
                  <Play className="h-4 w-4 mr-1" />
                  Activate
                </Button>
              )}
            </CardFooter>
          </Card>
        ))}
      </div>
    )
  }
}
