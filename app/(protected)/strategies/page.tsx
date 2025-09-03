"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { StrategyBuilder } from "@/components/strategy-builder"
import { ArrowLeft, Copy, Edit, Play, Plus, Trash2 } from "lucide-react"
import { useRouter } from "next/navigation"
import { createBot, updateBot, deleteBot, fetchBots } from "@/services/bot-service"
import type { Bot } from "@/types/bot"

export default function StrategiesPage() {
  const [bots, setBots] = useState<Bot[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [showCreateDialog, setShowCreateDialog] = useState(false)
  const [showEditDialog, setShowEditDialog] = useState(false)
  const [selectedBot, setSelectedBot] = useState<Bot | null>(null)
  const router = useRouter()

  // Available assets for strategy builder
  const availableAssets = [
    "AAPL",
    "MSFT",
    "GOOGL",
    "AMZN",
    "TSLA",
    "META",
    "NVDA",
    "BTC-USD",
    "ETH-USD",
    "SPY",
    "QQQ",
    "VTI",
    "NFLX",
    "DIS",
    "JPM",
    "V",
    "WMT",
    "PG",
    "JNJ",
    "KO",
  ]

  useEffect(() => {
    loadBots()
  }, [])

  const loadBots = async () => {
    setIsLoading(true)
    try {
      const botData = await fetchBots()
      setBots(botData)
    } catch (error) {
      console.error("Error loading bots:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleCreateStrategy = async (botData: Partial<Bot>) => {
    setIsLoading(true)
    try {
      await createBot(botData)
      setShowCreateDialog(false)
      await loadBots()
    } catch (error) {
      console.error("Error creating bot:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleUpdateStrategy = async (botData: Partial<Bot>) => {
    if (!selectedBot) return

    setIsLoading(true)
    try {
      const updatedBot = { ...selectedBot, ...botData }
      await updateBot(updatedBot as Bot)
      setShowEditDialog(false)
      setSelectedBot(null)
      await loadBots()
    } catch (error) {
      console.error("Error updating bot:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleDeleteStrategy = async (botId: string) => {
    if (!confirm("Are you sure you want to delete this strategy?")) return

    setIsLoading(true)
    try {
      await deleteBot(botId)
      await loadBots()
    } catch (error) {
      console.error("Error deleting bot:", error)
    } finally {
      setIsLoading(false)
    }
  }

      const handleDuplicateStrategy = async (bot: Bot) => {
    setIsLoading(true)
    try {
      const newBot = { ...bot }
      const { id, ...botData } = newBot
      const botToCreate: Partial<Bot> = {
        ...botData,
        name: `${bot.name} (Copy)`,
        status: "paused",
      }
      await createBot(botToCreate)
      await loadBots()
    } catch (error) {
      console.error("Error duplicating bot:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleBacktestStrategy = (botId: string) => {
    router.push(`/backtest?botId=${botId}`)
  }

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Button variant="outline" size="icon" onClick={() => router.push("/")}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <h1 className="text-2xl font-bold">Trading Strategies</h1>
        </div>
        <Button onClick={() => setShowCreateDialog(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Create Strategy
        </Button>
      </div>

      <Tabs defaultValue="all">
        <TabsList>
          <TabsTrigger value="all">All Strategies</TabsTrigger>
          <TabsTrigger value="indicator">Indicator</TabsTrigger>
          <TabsTrigger value="grid">Grid</TabsTrigger>
          <TabsTrigger value="dca">DCA</TabsTrigger>
          <TabsTrigger value="basket">Basket</TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="mt-6">
          <StrategiesTable
            bots={bots}
            onEdit={(bot) => {
              setSelectedBot(bot)
              setShowEditDialog(true)
            }}
            onDelete={handleDeleteStrategy}
            onDuplicate={handleDuplicateStrategy}
            onBacktest={handleBacktestStrategy}
          />
        </TabsContent>

        <TabsContent value="indicator" className="mt-6">
          <StrategiesTable
            bots={bots.filter((bot) => bot.type === "indicator")}
            onEdit={(bot) => {
              setSelectedBot(bot)
              setShowEditDialog(true)
            }}
            onDelete={handleDeleteStrategy}
            onDuplicate={handleDuplicateStrategy}
            onBacktest={handleBacktestStrategy}
          />
        </TabsContent>

        <TabsContent value="grid" className="mt-6">
          <StrategiesTable
            bots={bots.filter((bot) => bot.type === "grid")}
            onEdit={(bot) => {
              setSelectedBot(bot)
              setShowEditDialog(true)
            }}
            onDelete={handleDeleteStrategy}
            onDuplicate={handleDuplicateStrategy}
            onBacktest={handleBacktestStrategy}
          />
        </TabsContent>

        <TabsContent value="dca" className="mt-6">
          <StrategiesTable
            bots={bots.filter((bot) => bot.type === "dca")}
            onEdit={(bot) => {
              setSelectedBot(bot)
              setShowEditDialog(true)
            }}
            onDelete={handleDeleteStrategy}
            onDuplicate={handleDuplicateStrategy}
            onBacktest={handleBacktestStrategy}
          />
        </TabsContent>

        <TabsContent value="basket" className="mt-6">
          <StrategiesTable
            bots={bots.filter((bot) => bot.type === "basket")}
            onEdit={(bot) => {
              setSelectedBot(bot)
              setShowEditDialog(true)
            }}
            onDelete={handleDeleteStrategy}
            onDuplicate={handleDuplicateStrategy}
            onBacktest={handleBacktestStrategy}
          />
        </TabsContent>
      </Tabs>

      <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Create New Strategy</DialogTitle>
            <DialogDescription>Configure your trading strategy parameters</DialogDescription>
          </DialogHeader>
          <StrategyBuilder onSave={handleCreateStrategy} availableAssets={availableAssets} />
        </DialogContent>
      </Dialog>

      <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Strategy</DialogTitle>
            <DialogDescription>Update your trading strategy parameters</DialogDescription>
          </DialogHeader>
          {selectedBot && (
            <StrategyBuilder
              onSave={handleUpdateStrategy}
              existingBot={selectedBot}
              availableAssets={availableAssets}
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}

interface StrategiesTableProps {
  bots: Bot[]
  onEdit: (bot: Bot) => void
  onDelete: (botId: string) => void
  onDuplicate: (bot: Bot) => void
  onBacktest: (botId: string) => void
}

function StrategiesTable({ bots, onEdit, onDelete, onDuplicate, onBacktest }: StrategiesTableProps) {
  if (bots.length === 0) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center justify-center py-10">
          <p className="text-muted-foreground mb-4">No strategies found</p>
          <p className="text-sm text-muted-foreground">Create a new strategy to get started</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardContent className="p-0">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Strategy Name</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Assets</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Performance</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {bots.map((bot) => (
              <TableRow key={bot.id}>
                <TableCell className="font-medium">{bot.name}</TableCell>
                <TableCell>
                  <Badge variant="outline">
                    {bot.type === "indicator"
                      ? "Indicator"
                      : bot.type === "grid"
                        ? "Grid"
                        : bot.type === "dca"
                          ? "DCA"
                          : "Basket"}
                  </Badge>
                </TableCell>
                <TableCell>{bot.assets.join(", ")}</TableCell>
                <TableCell>
                  <Badge
                    variant={
                      bot.status === "active" ? "default" : bot.status === "paused" ? "secondary" : "destructive"
                    }
                  >
                    {bot.status.charAt(0).toUpperCase() + bot.status.slice(1)}
                  </Badge>
                </TableCell>
                <TableCell>
                  {bot.performance ? (
                    <span className={bot.performance.pnlPercentage >= 0 ? "text-green-500" : "text-red-500"}>
                      {bot.performance.pnlPercentage >= 0 ? "+" : ""}
                      {bot.performance.pnlPercentage.toFixed(2)}%
                    </span>
                  ) : (
                    <span className="text-muted-foreground">No data</span>
                  )}
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <Button variant="outline" size="icon" onClick={() => onBacktest(bot.id)}>
                      <Play className="h-4 w-4" />
                      <span className="sr-only">Backtest</span>
                    </Button>
                    <Button variant="outline" size="icon" onClick={() => onEdit(bot)}>
                      <Edit className="h-4 w-4" />
                      <span className="sr-only">Edit</span>
                    </Button>
                    <Button variant="outline" size="icon" onClick={() => onDuplicate(bot)}>
                      <Copy className="h-4 w-4" />
                      <span className="sr-only">Duplicate</span>
                    </Button>
                    <Button variant="outline" size="icon" onClick={() => onDelete(bot.id)}>
                      <Trash2 className="h-4 w-4" />
                      <span className="sr-only">Delete</span>
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}
