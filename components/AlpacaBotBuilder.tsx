"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Plus, Edit, Trash2, Play, Pause, BarChart3, TrendingUp, DollarSign } from "lucide-react"
import { useAlpacaConnect } from "@/lib/client/useAlpacaConnect"
import { Bot, BotType } from "@/types/bot"

export function AlpacaBotBuilder() {
  const [bots, setBots] = useState<Bot[]>([])
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [editingBot, setEditingBot] = useState<Bot | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const { isConnected, connect } = useAlpacaConnect()

  // Fetch bots from API
  useEffect(() => {
    if (isConnected) {
      fetchBots()
    }
  }, [isConnected])

  const fetchBots = async () => {
    try {
      const response = await fetch('/api/alpaca/bots')
      if (response.ok) {
        const data = await response.json()
        setBots(data)
      }
    } catch (error) {
      console.error('Error fetching bots:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleCreateBot = async (botData: any) => {
    try {
      const response = await fetch('/api/alpaca/bots', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(botData)
      })

      if (response.ok) {
        const newBot = await response.json()
        setBots([...bots, newBot])
        setIsCreateDialogOpen(false)
      }
    } catch (error) {
      console.error('Error creating bot:', error)
    }
  }

  const handleUpdateBot = (botData: AlpacaBot) => {
    setBots(bots.map(bot => bot.id === botData.id ? botData : bot))
    setEditingBot(null)
  }

  const handleDeleteBot = (botId: string) => {
    setBots(bots.filter(bot => bot.id !== botId))
  }

  const toggleBotStatus = (botId: string) => {
    setBots(bots.map(bot =>
      bot.id === botId ? { ...bot, status: bot.status === 'active' ? 'paused' : 'active' } : bot
    ))
  }

  if (!isConnected) {
    return (
      <Card className="w-full max-w-4xl mx-auto">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl">Alpaca Trading Bots</CardTitle>
          <CardDescription>
            Connect your Alpaca account to start building automated trading strategies
          </CardDescription>
        </CardHeader>
        <CardContent className="text-center py-8">
          <Button onClick={connect} size="lg">
            Connect Alpaca Account
          </Button>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="w-full max-w-6xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Alpaca Trading Bots</h1>
          <p className="text-muted-foreground">Build and manage automated trading strategies</p>
        </div>
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Create Bot
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <BotForm
              onSubmit={handleCreateBot}
              onCancel={() => setIsCreateDialogOpen(false)}
            />
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {bots.map((bot) => (
          <Card key={bot.id} className="relative">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">{bot.name}</CardTitle>
                <Badge variant={bot.status === 'active' ? "default" : "secondary"}>
                  {bot.status === 'active' ? "Active" : bot.status === 'paused' ? "Paused" : "Error"}
                </Badge>
              </div>
              <CardDescription>{bot.description}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Type:</span>
                  <Badge variant="outline">{bot.type}</Badge>
                </div>

                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Symbols:</span>
                  <span>{bot.assets.join(', ')}</span>
                </div>

                <div className="grid grid-cols-3 gap-4 pt-4 border-t">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-600">
                      {bot.performance?.pnlPercentage ? `${bot.performance.pnlPercentage > 0 ? '+' : ''}${bot.performance.pnlPercentage}%` : '0%'}
                    </div>
                    <div className="text-xs text-muted-foreground">Return</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold">{bot.performance?.winRate ? `${(bot.performance.winRate * 100).toFixed(0)}%` : '0%'}</div>
                    <div className="text-xs text-muted-foreground">Win Rate</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold">{bot.performance?.totalTrades || 0}</div>
                    <div className="text-xs text-muted-foreground">Trades</div>
                  </div>
                </div>

                <div className="flex gap-2 pt-4">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => toggleBotStatus(bot.id)}
                    className="flex-1"
                  >
                    {bot.status === 'active' ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                  </Button>
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setEditingBot(bot)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-2xl">
                      <BotForm
                        initialBot={editingBot}
                        onSubmit={handleUpdateBot}
                        onCancel={() => setEditingBot(null)}
                      />
                    </DialogContent>
                  </Dialog>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleDeleteBot(bot.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {bots.length === 0 && (
        <Card className="text-center py-12">
          <CardContent>
            <BarChart3 className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium mb-2">No trading bots yet</h3>
            <p className="text-muted-foreground mb-4">
              Create your first automated trading strategy to get started
            </p>
            <Button onClick={() => setIsCreateDialogOpen(true)}>
              <Plus className="mr-2 h-4 w-4" />
              Create Your First Bot
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  )
}

interface BotFormProps {
  initialBot?: Bot | null
  onSubmit: (bot: any) => void
  onCancel: () => void
}

function BotForm({ initialBot, onSubmit, onCancel }: BotFormProps) {
  const [formData, setFormData] = useState({
    name: initialBot?.name || '',
    type: (initialBot?.type as BotType) || 'indicator',
    assets: initialBot?.assets || [''],
    stopLoss: initialBot?.stopLoss || 5,
    takeProfit: initialBot?.takeProfit || 10,
    maxDrawdown: initialBot?.maxDrawdown || 15,
    indicatorConfig: initialBot?.indicatorConfig || {
      type: 'rsi' as const,
      timeframe: '1day' as const,
      entryThreshold: 30,
      exitThreshold: 70,
    }
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit({
      ...formData,
      assets: formData.assets.filter(s => s.trim() !== '')
    })
  }

  const addSymbol = () => {
    setFormData(prev => ({
      ...prev,
      assets: [...prev.assets, '']
    }))
  }

  const updateSymbol = (index: number, value: string) => {
    setFormData(prev => ({
      ...prev,
      assets: prev.assets.map((s, i) => i === index ? value : s)
    }))
  }

  const removeSymbol = (index: number) => {
    setFormData(prev => ({
      ...prev,
      assets: prev.assets.filter((_, i) => i !== index)
    }))
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <DialogHeader>
        <DialogTitle>{initialBot ? 'Edit Bot' : 'Create New Bot'}</DialogTitle>
        <DialogDescription>
          Configure your automated trading strategy
        </DialogDescription>
      </DialogHeader>

      <div className="space-y-4">
        <div>
          <Label htmlFor="name">Bot Name</Label>
          <Input
            id="name"
            value={formData.name}
            onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
            placeholder="e.g., Tech Momentum Bot"
            required
          />
        </div>

        <div>
          <Label htmlFor="type">Bot Type</Label>
          <Select
            value={formData.type}
            onValueChange={(value) => setFormData(prev => ({ ...prev, type: value as BotType }))}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="indicator">Indicator Based</SelectItem>
              <SelectItem value="grid">Grid Trading</SelectItem>
              <SelectItem value="dca">Dollar Cost Average</SelectItem>
              <SelectItem value="basket">Basket Trading</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label>Trading Symbols</Label>
          <div className="space-y-2">
            {formData.assets.map((symbol, index) => (
              <div key={index} className="flex gap-2">
                <Input
                  value={symbol}
                  onChange={(e) => updateSymbol(index, e.target.value)}
                  placeholder="e.g., AAPL"
                  className="uppercase"
                />
                {formData.assets.length > 1 && (
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => removeSymbol(index)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                )}
              </div>
            ))}
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={addSymbol}
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Symbol
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-4">
          <div>
            <Label htmlFor="stopLoss">Stop Loss (%)</Label>
            <Input
              id="stopLoss"
              type="number"
              value={formData.stopLoss}
              onChange={(e) => setFormData(prev => ({ ...prev, stopLoss: Number(e.target.value) }))}
              min="0"
              step="0.1"
            />
          </div>
          <div>
            <Label htmlFor="takeProfit">Take Profit (%)</Label>
            <Input
              id="takeProfit"
              type="number"
              value={formData.takeProfit}
              onChange={(e) => setFormData(prev => ({ ...prev, takeProfit: Number(e.target.value) }))}
              min="0"
              step="0.1"
            />
          </div>
          <div>
            <Label htmlFor="maxDrawdown">Max Drawdown (%)</Label>
            <Input
              id="maxDrawdown"
              type="number"
              value={formData.maxDrawdown}
              onChange={(e) => setFormData(prev => ({ ...prev, maxDrawdown: Number(e.target.value) }))}
              min="0"
              step="0.1"
            />
          </div>
        </div>
      </div>

      <div className="flex justify-end gap-3">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit">
          {initialBot ? 'Update Bot' : 'Create Bot'}
        </Button>
      </div>
    </form>
  )
}
