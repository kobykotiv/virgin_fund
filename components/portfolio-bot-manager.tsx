"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { toast } from "@/components/ui/use-toast"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Skeleton } from "@/components/ui/skeleton"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Bot, Play, Pause, AlertTriangle, Settings, Trash2, Plus } from "lucide-react"
import type { Bot as BotType } from "@/types/bot"

interface PortfolioBotManagerProps {
  portfolioId: string
  readOnly?: boolean
}

export function PortfolioBotManager({ portfolioId, readOnly = false }: PortfolioBotManagerProps) {
  const [bots, setBots] = useState<any[]>([])
  const [availableBots, setAvailableBots] = useState<BotType[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [showAddBot, setShowAddBot] = useState(false)
  const [showConfigureBot, setShowConfigureBot] = useState(false)
  const [selectedBotId, setSelectedBotId] = useState<string>("")
  const [selectedBot, setSelectedBot] = useState<any>(null)
  
  // Bot configuration state
  const [botStatus, setBotStatus] = useState<"active" | "paused">("paused")
  const [canTrade, setCanTrade] = useState(true)
  const [canWithdraw, setCanWithdraw] = useState(false)
  
  useEffect(() => {
    fetchBots()
  }, [portfolioId])
  
  const fetchBots = async () => {
    if (!portfolioId) return
    
    setLoading(true)
    setError(null)
    
    try {
      const response = await fetch(`/api/db/portfolios/bots?portfolioId=${portfolioId}`)
      
      if (!response.ok) {
        throw new Error('Failed to fetch bots')
      }
      
      const data = await response.json()
      setBots(data)
    } catch (err: any) {
      console.error('Error fetching portfolio bots:', err)
      setError(err.message || 'Failed to load bots')
    } finally {
      setLoading(false)
    }
  }
  
  const fetchAvailableBots = async () => {
    try {
      const response = await fetch('/api/db/bots')
      
      if (!response.ok) {
        throw new Error('Failed to fetch available bots')
      }
      
      const data = await response.json()
      setAvailableBots(data)
    } catch (err: any) {
      console.error('Error fetching available bots:', err)
      toast({
        title: "Error",
        description: "Failed to load available bots",
        variant: "destructive"
      })
    }
  }
  
  const handleAddBot = async () => {
    if (!selectedBotId) {
      toast({
        title: "Error",
        description: "Please select a bot to add",
        variant: "destructive"
      })
      return
    }
    
    try {
      const response = await fetch(`/api/db/portfolios/bots`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          portfolioId,
          botId: selectedBotId,
          status: 'paused', // Always start paused for safety
          permissions: ['read', 'trade']
        })
      })
      
      if (!response.ok) {
        throw new Error('Failed to add bot to portfolio')
      }
      
      await fetchBots()
      setShowAddBot(false)
      setSelectedBotId("")
      
      toast({
        title: "Bot Added",
        description: "Successfully added bot to your portfolio"
      })
    } catch (err: any) {
      console.error('Error adding bot:', err)
      toast({
        title: "Error",
        description: err.message || 'Failed to add bot',
        variant: "destructive"
      })
    }
  }
  
  const handleConfigureBot = (bot: any) => {
    setSelectedBot(bot)
    setBotStatus(bot.portfolioConfig.status)
    
    // Set permissions
    const permissions = bot.portfolioConfig.permissions || []
    setCanTrade(permissions.includes('trade'))
    setCanWithdraw(permissions.includes('withdraw'))
    
    setShowConfigureBot(true)
  }
  
  const updateBotConfig = async () => {
    if (!selectedBot) return
    
    try {
      // Build permissions array
      const permissions = ['read']
      if (canTrade) permissions.push('trade')
      if (canWithdraw) permissions.push('withdraw')
      
      const response = await fetch(`/api/db/portfolios/${portfolioId}/bots/${selectedBot._id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          status: botStatus,
          permissions
        })
      })
      
      if (!response.ok) {
        throw new Error('Failed to update bot configuration')
      }
      
      await fetchBots()
      setShowConfigureBot(false)
      
      toast({
        title: "Configuration Updated",
        description: "Bot configuration has been updated"
      })
    } catch (err: any) {
      console.error('Error updating bot configuration:', err)
      toast({
        title: "Error",
        description: err.message || 'Failed to update configuration',
        variant: "destructive"
      })
    }
  }
  
  const removeBot = async (botId: string) => {
    if (!confirm("Are you sure you want to remove this bot from your portfolio?")) {
      return
    }
    
    try {
      const response = await fetch(`/api/db/portfolios/${portfolioId}/bots/${botId}`, {
        method: 'DELETE'
      })
      
      if (!response.ok) {
        throw new Error('Failed to remove bot')
      }
      
      await fetchBots()
      
      toast({
        title: "Bot Removed",
        description: "Successfully removed bot from your portfolio"
      })
    } catch (err: any) {
      console.error('Error removing bot:', err)
      toast({
        title: "Error",
        description: err.message || 'Failed to remove bot',
        variant: "destructive"
      })
    }
  }
  
  const handleShowAddBot = () => {
    fetchAvailableBots()
    setShowAddBot(true)
  }
  
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return <Badge variant="success">Active</Badge>
      case 'paused':
        return <Badge variant="secondary">Paused</Badge>
      case 'error':
        return <Badge variant="destructive">Error</Badge>
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }
  
  const getTypeBadge = (type: string) => {
    switch (type) {
      case 'indicator':
        return <Badge variant="outline" className="bg-blue-50 text-blue-800">Indicator</Badge>
      case 'grid':
        return <Badge variant="outline" className="bg-purple-50 text-purple-800">Grid</Badge>
      case 'dca':
        return <Badge variant="outline" className="bg-green-50 text-green-800">DCA</Badge>
      case 'basket':
        return <Badge variant="outline" className="bg-amber-50 text-amber-800">Basket</Badge>
      default:
        return <Badge variant="outline">{type}</Badge>
    }
  }
  
  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Trading Bots</CardTitle>
        </CardHeader>
        <CardContent>
          <Skeleton className="h-[300px] w-full" />
        </CardContent>
      </Card>
    )
  }
  
  if (error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Trading Bots</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center h-[100px]">
            <p className="text-destructive">{error}</p>
          </div>
        </CardContent>
      </Card>
    )
  }
  
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>Trading Bots</CardTitle>
          <CardDescription>Automated trading strategies linked to this portfolio</CardDescription>
        </div>
        {!readOnly && (
          <Button variant="outline" onClick={handleShowAddBot}>
            <Plus className="h-4 w-4 mr-2" />
            Add Bot
          </Button>
        )}
      </CardHeader>
      <CardContent>
        {bots.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-[100px]">
            <p className="text-muted-foreground mb-2">No trading bots connected</p>
            {!readOnly && (
              <Button variant="secondary" size="sm" onClick={handleShowAddBot}>Connect your first bot</Button>
            )}
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Assets</TableHead>
                <TableHead>P&L</TableHead>
                {!readOnly && <TableHead>Actions</TableHead>}
              </TableRow>
            </TableHeader>
            <TableBody>
              {bots.map((bot) => (
                <TableRow key={bot._id}>
                  <TableCell className="font-medium">{bot.name}</TableCell>
                  <TableCell>{getTypeBadge(bot.type)}</TableCell>
                  <TableCell>{getStatusBadge(bot.portfolioConfig.status)}</TableCell>
                  <TableCell>{bot.assets.join(", ")}</TableCell>
                  <TableCell>
                    {bot.performance ? (
                      <span className={bot.performance.totalPnL >= 0 ? "text-green-600" : "text-red-600"}>
                        {bot.performance.totalPnL >= 0 ? "+" : ""}
                        {bot.performance.totalPnL.toFixed(2)} ({bot.performance.pnlPercentage.toFixed(2)}%)
                      </span>
                    ) : (
                      <span className="text-muted-foreground">No data</span>
                    )}
                  </TableCell>
                  {!readOnly && (
                    <TableCell>
                      <div className="flex gap-2">
                        <Button 
                          variant="outline" 
                          size="sm" 
                          onClick={() => handleConfigureBot(bot)}
                        >
                          <Settings className="h-4 w-4 mr-2" />
                          Configure
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="sm"
                          className="text-destructive hover:text-destructive"
                          onClick={() => removeBot(bot._id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  )}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
        
        {/* Add Bot Dialog */}
        <Dialog open={showAddBot} onOpenChange={setShowAddBot}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add Trading Bot</DialogTitle>
              <DialogDescription>
                Select a trading bot to connect to this portfolio
              </DialogDescription>
            </DialogHeader>
            
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="botSelect">Select Bot</Label>
                <Select 
                  value={selectedBotId} 
                  onValueChange={setSelectedBotId}
                >
                  <SelectTrigger id="botSelect">
                    <SelectValue placeholder="Choose a trading bot" />
                  </SelectTrigger>
                  <SelectContent>
                    {availableBots.length === 0 ? (
                      <SelectItem value="none" disabled>No bots available</SelectItem>
                    ) : (
                      availableBots.map(bot => (
                        <SelectItem key={bot.id} value={bot.id}>
                          {bot.name} ({bot.type})
                        </SelectItem>
                      ))
                    )}
                  </SelectContent>
                </Select>
              </div>
              
              {selectedBotId && (
                <div className="bg-muted p-4 rounded-md">
                  <h4 className="font-medium mb-2">Important Note</h4>
                  <p className="text-sm text-muted-foreground mb-2">
                    Bots will start in paused mode. You can activate them after review.
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Trading bots can make real trades with your assets, make sure to review
                    permissions before activating.
                  </p>
                </div>
              )}
            </div>
            
            <DialogFooter>
              <Button variant="outline" onClick={() => setShowAddBot(false)}>Cancel</Button>
              <Button onClick={handleAddBot} disabled={!selectedBotId}>
                Add Bot
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
        
        {/* Configure Bot Dialog */}
        <Dialog open={showConfigureBot} onOpenChange={setShowConfigureBot}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Configure {selectedBot?.name}</DialogTitle>
              <DialogDescription>
                Set permissions and status for this trading bot
              </DialogDescription>
            </DialogHeader>
            
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="botStatus">Bot Status</Label>
                <Select 
                  value={botStatus} 
                  onValueChange={(value: "active" | "paused") => setBotStatus(value)}
                >
                  <SelectTrigger id="botStatus">
                    <SelectValue placeholder="Choose status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="active">
                      <div className="flex items-center gap-2">
                        <Play className="h-4 w-4 text-green-600" />
                        <span>Active (Bot will execute trades)</span>
                      </div>
                    </SelectItem>
                    <SelectItem value="paused">
                      <div className="flex items-center gap-2">
                        <Pause className="h-4 w-4 text-amber-600" />
                        <span>Paused (Bot will not execute trades)</span>
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-3 border p-3 rounded-md">
                <h4 className="font-medium">Bot Permissions</h4>
                
                <div className="flex items-center justify-between">
                  <Label htmlFor="canTrade" className="flex items-center gap-2">
                    <Bot className="h-4 w-4" />
                    <span>Can execute trades</span>
                  </Label>
                  <Switch
                    id="canTrade"
                    checked={canTrade}
                    onCheckedChange={setCanTrade}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <Label htmlFor="canWithdraw" className="flex items-center gap-2">
                    <AlertTriangle className="h-4 w-4 text-amber-600" />
                    <span>Can transfer/withdraw funds</span>
                  </Label>
                  <Switch
                    id="canWithdraw"
                    checked={canWithdraw}
                    onCheckedChange={setCanWithdraw}
                  />
                </div>
              </div>
              
              {botStatus === "active" && (
                <div className="bg-amber-50 p-4 rounded-md border border-amber-200">
                  <h4 className="font-medium text-amber-800 mb-1">Attention Required</h4>
                  <p className="text-sm text-amber-700">
                    By setting this bot to active, you authorize it to perform automated 
                    trading based on its configured strategy. Make sure you understand 
                    the bot's behavior before activating.
                  </p>
                </div>
              )}
            </div>
            
            <DialogFooter>
              <Button variant="outline" onClick={() => setShowConfigureBot(false)}>Cancel</Button>
              <Button onClick={updateBotConfig}>
                Save Configuration
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  )
}
