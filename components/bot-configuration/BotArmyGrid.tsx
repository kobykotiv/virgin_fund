"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { BotList } from "@/components/bot-list"
import { BotGrid } from "@/components/bot-management"
import { Bot } from "@/types/bot"
import { useAuth } from "@/providers/auth-provider"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"

// Emoji icons for actions
const ICONS = {
  add: "➕",
  edit: "✏️",
  delete: "🗑️",
  play: "▶️",
  pause: "⏸️",
  search: "🔍",
  filter: "🔽",
  grid: "📊",
  table: "📋",
  refresh: "🔄"
}

interface BotArmyGridProps {
  className?: string
}

export function BotArmyGrid({ className }: BotArmyGridProps) {
  const [viewMode, setViewMode] = useState<'table' | 'cards'>('table')
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [typeFilter, setTypeFilter] = useState<string>('all')
  const { user } = useAuth()
  const queryClient = useQueryClient()

  // Fetch bots
  const { data: bots = [], isLoading, error } = useQuery({
    queryKey: ['bots', user?.id],
    queryFn: async () => {
      const response = await fetch('/api/bots')
      if (!response.ok) throw new Error('Failed to fetch bots')
      return response.json()
    },
    enabled: !!user?.id
  })

  // Mutations for CRUD operations
  const createBotMutation = useMutation({
    mutationFn: async (botData: Partial<Bot>) => {
      const response = await fetch('/api/bots', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(botData)
      })
      if (!response.ok) throw new Error('Failed to create bot')
      return response.json()
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['bots'] })
      toast.success('Bot created successfully!')
    },
    onError: (error) => {
      toast.error(`Failed to create bot: ${error.message}`)
    }
  })

  const updateBotMutation = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: Partial<Bot> }) => {
      const response = await fetch(`/api/bots/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      })
      if (!response.ok) throw new Error('Failed to update bot')
      return response.json()
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['bots'] })
      toast.success('Bot updated successfully!')
    },
    onError: (error) => {
      toast.error(`Failed to update bot: ${error.message}`)
    }
  })

  const deleteBotMutation = useMutation({
    mutationFn: async (id: string) => {
      const response = await fetch(`/api/bots/${id}`, {
        method: 'DELETE'
      })
      if (!response.ok) throw new Error('Failed to delete bot')
      return response.json()
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['bots'] })
      toast.success('Bot deleted successfully!')
    },
    onError: (error) => {
      toast.error(`Failed to delete bot: ${error.message}`)
    }
  })

  const toggleStatusMutation = useMutation({
    mutationFn: async (id: string) => {
      const bot = bots.find(b => b.id === id)
      if (!bot) throw new Error('Bot not found')

      const newStatus = bot.status === 'active' ? 'paused' : 'active'
      const response = await fetch(`/api/bots/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus })
      })
      if (!response.ok) throw new Error('Failed to toggle bot status')
      return response.json()
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['bots'] })
      toast.success('Bot status updated!')
    },
    onError: (error) => {
      toast.error(`Failed to update bot status: ${error.message}`)
    }
  })

  // Filter bots based on search and filters
  const filteredBots = bots.filter((bot: Bot) => {
    const matchesSearch = bot.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         bot.description?.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === 'all' || bot.status === statusFilter
    const matchesType = typeFilter === 'all' || bot.type === typeFilter

    return matchesSearch && matchesStatus && matchesType
  })

  const handleCreateBot = () => {
    // For now, create a sample bot - in a real app, this would open a form
    const sampleBot: Partial<Bot> = {
      name: `New Bot ${Date.now()}`,
      type: 'dca',
      description: 'Sample DCA bot',
      status: 'paused',
      assets: ['BTC', 'ETH'],
      userId: user?.id
    }
    createBotMutation.mutate(sampleBot)
  }

  const handleEditBot = (bot: Bot) => {
    // In a real app, this would open an edit form
    console.log('Edit bot:', bot)
    toast.info('Edit functionality coming soon!')
  }

  const handleDeleteBot = (botId: string) => {
    deleteBotMutation.mutate(botId)
  }

  const handleToggleStatus = (botId: string) => {
    toggleStatusMutation.mutate(botId)
  }

  const handleBotAction = (botId: string, action: string) => {
    switch (action) {
      case 'start':
      case 'stop':
        handleToggleStatus(botId)
        break
      case 'delete':
        handleDeleteBot(botId)
        break
      case 'edit':
        const bot = bots.find(b => b.id === botId)
        if (bot) handleEditBot(bot)
        break
      default:
        console.log('Unknown action:', action)
    }
  }

  if (error) {
    return (
      <Card className={className}>
        <CardContent className="p-6">
          <div className="text-center text-red-500">
            Error loading bots: {error.message}
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Header with controls */}
      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <CardTitle className="flex items-center gap-2">
                🤖 Bot Army Management
              </CardTitle>
              <p className="text-sm text-muted-foreground">
                Manage your trading bots with full CRUD operations
              </p>
            </div>
            <div className="flex gap-2">
              <Button
                onClick={handleCreateBot}
                disabled={createBotMutation.isPending}
                className="flex items-center gap-2"
              >
                {ICONS.add} Create Bot
              </Button>
              <Button
                variant="outline"
                onClick={() => queryClient.invalidateQueries({ queryKey: ['bots'] })}
                className="flex items-center gap-2"
              >
                {ICONS.refresh} Refresh
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {/* Search and filters */}
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="flex-1">
              <div className="relative">
                <Input
                  placeholder="Search bots..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
                <span className="absolute left-3 top-1/2 transform -translate-y-1/2">
                  {ICONS.search}
                </span>
              </div>
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full sm:w-40">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="paused">Paused</SelectItem>
                <SelectItem value="error">Error</SelectItem>
              </SelectContent>
            </Select>
            <Select value={typeFilter} onValueChange={setTypeFilter}>
              <SelectTrigger className="w-full sm:w-40">
                <SelectValue placeholder="Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="dca">DCA</SelectItem>
                <SelectItem value="grid">Grid</SelectItem>
                <SelectItem value="basket">Basket</SelectItem>
                <SelectItem value="indicator">Indicator</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* View mode toggle */}
          <Tabs value={viewMode} onValueChange={(value) => setViewMode(value as 'table' | 'cards')}>
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="table" className="flex items-center gap-2">
                {ICONS.table} Table View
              </TabsTrigger>
              <TabsTrigger value="cards" className="flex items-center gap-2">
                {ICONS.grid} Cards View
              </TabsTrigger>
            </TabsList>

            <TabsContent value="table" className="mt-6">
              <BotList
                bots={filteredBots}
                onEdit={handleEditBot}
                onDelete={handleDeleteBot}
                onToggleStatus={handleToggleStatus}
                isLoading={isLoading}
              />
            </TabsContent>

            <TabsContent value="cards" className="mt-6">
              <BotGrid
                bots={filteredBots}
                onAction={handleBotAction}
              />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {/* Stats summary */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold">{bots.length}</div>
            <p className="text-sm text-muted-foreground">Total Bots</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-green-500">
              {bots.filter((b: Bot) => b.status === 'active').length}
            </div>
            <p className="text-sm text-muted-foreground">Active</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-yellow-500">
              {bots.filter((b: Bot) => b.status === 'paused').length}
            </div>
            <p className="text-sm text-muted-foreground">Paused</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-red-500">
              {bots.filter((b: Bot) => b.status === 'error').length}
            </div>
            <p className="text-sm text-muted-foreground">Errors</p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
