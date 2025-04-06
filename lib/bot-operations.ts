import { toast } from "@/components/ui/use-toast"
import type { Bot, BotConfig, Position, Trade } from "@/types/bot"

interface OperationResult<T> {
  success: boolean
  data?: T
  error?: string
}

export const botOperations = {
  async createBot(config: BotConfig): Promise<OperationResult<Bot>> {
    try {
      const response = await fetch('/api/bots', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(config)
      })

      if (!response.ok) throw new Error('Failed to create bot')
      
      const bot = await response.json()
      toast({ title: "Bot Created", description: "Successfully created new bot" })
      return { success: true, data: bot }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create bot",
        variant: "destructive"
      })
      return { success: false, error: error instanceof Error ? error.message : 'Unknown error' }
    }
  },

  async updateBot(botId: string, updates: Partial<Bot>): Promise<OperationResult<Bot>> {
    try {
      const response = await fetch(`/api/bots/${botId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates)
      })

      if (!response.ok) throw new Error('Failed to update bot')
      
      const bot = await response.json()
      toast({ title: "Bot Updated", description: "Successfully updated bot" })
      return { success: true, data: bot }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update bot",
        variant: "destructive"
      })
      return { success: false, error: error instanceof Error ? error.message : 'Unknown error' }
    }
  },

  async deleteBot(botId: string): Promise<OperationResult<void>> {
    try {
      const response = await fetch(`/api/bots/${botId}`, {
        method: 'DELETE'
      })

      if (!response.ok) throw new Error('Failed to delete bot')
      
      toast({ title: "Bot Deleted", description: "Successfully deleted bot" })
      return { success: true }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete bot",
        variant: "destructive"
      })
      return { success: false, error: error instanceof Error ? error.message : 'Unknown error' }
    }
  },

  async manageBotStatus(botId: string, action: 'start' | 'stop'): Promise<OperationResult<Bot>> {
    try {
      const response = await fetch(`/api/bots/${botId}/${action}`, {
        method: 'POST'
      })

      if (!response.ok) throw new Error(`Failed to ${action} bot`)
      
      const bot = await response.json()
      toast({ 
        title: `Bot ${action === 'start' ? 'Started' : 'Stopped'}`,
        description: `Successfully ${action}ed bot`
      })
      return { success: true, data: bot }
    } catch (error) {
      toast({
        title: "Error",
        description: `Failed to ${action} bot`,
        variant: "destructive"
      })
      return { success: false, error: error instanceof Error ? error.message : 'Unknown error' }
    }
  },

  async managePositions(botId: string, updates: Partial<Position>[]): Promise<OperationResult<Position[]>> {
    try {
      const response = await fetch(`/api/bots/${botId}/positions`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates)
      })

      if (!response.ok) throw new Error('Failed to update positions')
      
      const positions = await response.json()
      toast({ title: "Positions Updated", description: "Successfully updated positions" })
      return { success: true, data: positions }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update positions",
        variant: "destructive"
      })
      return { success: false, error: error instanceof Error ? error.message : 'Unknown error' }
    }
  }
}

// Optimistic updates helper
export function optimisticUpdate<T>(
  items: T[],
  updatedItem: T,
  identifier: keyof T
): T[] {
  return items.map(item => 
    item[identifier] === updatedItem[identifier] ? updatedItem : item
  )
}
