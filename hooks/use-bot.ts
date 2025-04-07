import { useState } from "react"
import { useToast } from "@/components/ui/use-toast"
import type { Bot, BotConfig } from "@/types/bot"

export function useBot() {
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()

  const createBot = async (config: BotConfig) => {
    setIsLoading(true)
    try {
      const response = await fetch('/api/bots', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(config)
      })

      if (!response.ok) throw new Error('Failed to create bot')
      
      const bot = await response.json()
      toast({
        title: "Success",
        description: "Bot created successfully"
      })
      return bot
    } catch (error) {
      console.error('Error creating bot:', error)
      toast({
        title: "Error",
        description: "Failed to create bot",
        variant: "destructive"
      })
      throw error
    } finally {
      setIsLoading(false)
    }
  }

  const updateBot = async (botId: string, updates: Partial<Bot>) => {
    setIsLoading(true)
    try {
      const response = await fetch(`/api/bots/${botId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates)
      })

      if (!response.ok) throw new Error('Failed to update bot')
      
      const bot = await response.json()
      toast({
        title: "Success",
        description: "Bot updated successfully"
      })
      return bot
    } catch (error) {
      console.error('Error updating bot:', error)
      toast({
        title: "Error",
        description: "Failed to update bot",
        variant: "destructive"
      })
      throw error
    } finally {
      setIsLoading(false)
    }
  }

  const deleteBot = async (botId: string) => {
    setIsLoading(true)
    try {
      const response = await fetch(`/api/bots/${botId}`, {
        method: 'DELETE'
      })

      if (!response.ok) throw new Error('Failed to delete bot')
      
      toast({
        title: "Success",
        description: "Bot deleted successfully"
      })
    } catch (error) {
      console.error('Error deleting bot:', error)
      toast({
        title: "Error",
        description: "Failed to delete bot",
        variant: "destructive"
      })
      throw error
    } finally {
      setIsLoading(false)
    }
  }

  return {
    isLoading,
    createBot,
    updateBot,
    deleteBot
  }
}
