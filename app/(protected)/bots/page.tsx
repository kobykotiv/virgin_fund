"use client"

import { useState, useEffect } from "react"
import { BotList } from "@/components/bot-list"
import { BotForm } from "@/components/bot-form"
import type { Bot, BotStatus } from "@/types/bot"
import { fetchBots, createBot, updateBot, deleteBot, toggleBotStatus } from "@/lib/bot-api"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"

export default function BotsPage() {
  const [bots, setBots] = useState<Bot[]>([])
  const [selectedBot, setSelectedBot] = useState<Bot | null>(null)
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const { toast } = useToast()

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
      toast({
        title: "Error",
        description: "Failed to load trading bots",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleCreateBot = async (botData: Partial<Bot>) => {
    try {
      const newBot = await createBot(botData)
      setBots([...bots, newBot])
      setIsFormOpen(false)
      toast({
        title: "Success",
        description: "Trading bot created successfully",
      })
    } catch (error) {
      console.error("Error creating bot:", error)
      toast({
        title: "Error",
        description: "Failed to create trading bot",
        variant: "destructive",
      })
    }
  }

  const handleUpdateBot = async (bot: Bot) => {
    try {
      const updatedBot = await updateBot(bot)
      setBots(bots.map((b) => (b.id === bot.id ? updatedBot : b)))
      setSelectedBot(null)
      setIsFormOpen(false)
      toast({
        title: "Success",
        description: "Trading bot updated successfully",
      })
    } catch (error) {
      console.error("Error updating bot:", error)
      toast({
        title: "Error",
        description: "Failed to update trading bot",
        variant: "destructive",
      })
    }
  }

  const handleDeleteBot = async (botId: string) => {
    try {
      await deleteBot(botId)
      setBots(bots.filter((bot) => bot.id !== botId))
      toast({
        title: "Success",
        description: "Trading bot deleted successfully",
      })
    } catch (error) {
      console.error("Error deleting bot:", error)
      toast({
        title: "Error",
        description: "Failed to delete trading bot",
        variant: "destructive",
      })
    }
  }

  const handleToggleBotStatus = async (botId: string) => {
    try {
      const bot = bots.find((b) => b.id === botId)
      if (!bot) {
        console.error(`Bot with ID ${botId} not found in current state`)
        return
      }

      const newStatus: BotStatus = bot.status === "active" ? "paused" : "active"
      const updatedBot = await toggleBotStatus(botId, newStatus)
      setBots(bots.map((b) => (b.id === botId ? updatedBot : b)))

      toast({
        title: "Status Updated",
        description: `Bot ${updatedBot.name} is now ${updatedBot.status}`,
      })
    } catch (error) {
      console.error("Error toggling bot status:", error)
      toast({
        title: "Error",
        description: `Failed to update bot status: ${error instanceof Error ? error.message : "Unknown error"}`,
        variant: "destructive",
      })
    }
  }

  const handleEditBot = (bot: Bot) => {
    setSelectedBot(bot)
    setIsFormOpen(true)
  }

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Trading Bots</h1>
        <Button
          onClick={() => {
            setSelectedBot(null)
            setIsFormOpen(true)
          }}
          className="bg-green-600 hover:bg-green-700 text-white"
        >
          <Plus className="h-4 w-4 mr-2" /> New Bot
        </Button>
      </div>

      <BotList
        bots={bots}
        onEdit={handleEditBot}
        onDelete={handleDeleteBot}
        onToggleStatus={handleToggleBotStatus}
        isLoading={isLoading}
      />

      {isFormOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-card p-6 rounded-lg w-full max-w-3xl max-h-[90vh] overflow-y-auto">
            <BotForm
              initialBot={selectedBot}
              onSubmit={selectedBot ? handleUpdateBot : handleCreateBot}
              onCancel={() => setIsFormOpen(false)}
            />
          </div>
        </div>
      )}
    </div>
  )
}

