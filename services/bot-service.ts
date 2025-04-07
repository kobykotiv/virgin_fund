// Bot service to handle bot operations with demo mode support
import type { Bot, BotStatus, BotType, Position, Trade } from "@/types/bot"
import { isDemoMode, DEMO_BOTS_KEY } from "./demo-service"
import {
  fetchBots as fetchRealBots,
  createBot as createRealBot,
  updateBot as updateRealBot,
  deleteBot as deleteRealBot,
  toggleBotStatus as toggleRealBotStatus,
} from "@/lib/bot-api"

// Fetch bots
export async function fetchBots(): Promise<Bot[]> {
  if (isDemoMode()) {
    return fetchDemoBots()
  } else {
    return fetchRealBots()
  }
}

// Create a new bot
export async function createBot(botData: Partial<Bot>): Promise<Bot> {
  if (isDemoMode()) {
    return createDemoBot(botData)
  } else {
    const response = await fetch('/api/bots', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(botData)
    });

    if (!response.ok) {
      throw new Error('Failed to create bot');
    }

    return response.json();
  }
}

// Update an existing bot
export async function updateBot(bot: Bot): Promise<Bot> {
  if (isDemoMode()) {
    return updateDemoBot(bot)
  } else {
    const response = await fetch(`/api/bots/${bot.id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(bot)
    });

    if (!response.ok) {
      throw new Error('Failed to update bot');
    }

    return response.json();
  }
}

// Delete a bot
export async function deleteBot(botId: string): Promise<void> {
  if (isDemoMode()) {
    return deleteDemoBot(botId)
  } else {
    const response = await fetch(`/api/bots/${botId}`, {
      method: 'DELETE'
    });

    if (!response.ok) {
      throw new Error('Failed to delete bot');
    }
  }
}

// Toggle bot status
export async function toggleBotStatus(botId: string, newStatus: BotStatus): Promise<Bot> {
  if (isDemoMode()) {
    return toggleDemoBotStatus(botId, newStatus)
  } else {
    return toggleRealBotStatus(botId, newStatus)
  }
}

// Open a position
export async function openPosition(
  botId: string, 
  positionData: Partial<Position>
): Promise<Position> {
  const response = await fetch(`/api/bots/${botId}/positions`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(positionData)
  });

  if (!response.ok) {
    throw new Error('Failed to open position');
  }

  return response.json();
}

// Close a position
export async function closePosition(
  botId: string,
  positionId: string,
  closePrice: number
): Promise<Position> {
  const response = await fetch(`/api/bots/${botId}/positions/${positionId}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ 
      status: 'closed',
      closedAt: new Date().toISOString(),
      closePrice
    })
  });

  if (!response.ok) {
    throw new Error('Failed to close position');
  }

  return response.json();
}

// Record a trade
export async function recordTrade(
  botId: string,
  tradeData: Partial<Trade>
): Promise<Trade> {
  const response = await fetch(`/api/bots/${botId}/trades`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(tradeData)
  });

  if (!response.ok) {
    throw new Error('Failed to record trade');
  }

  return response.json();
}

// Demo mode implementations
function fetchDemoBots(): Promise<Bot[]> {
  return new Promise((resolve) => {
    setTimeout(() => {
      const bots = JSON.parse(localStorage.getItem(DEMO_BOTS_KEY) || "[]")
      resolve(bots)
    }, 500)
  })
}

function createDemoBot(botData: Partial<Bot>): Promise<Bot> {
  return new Promise((resolve) => {
    setTimeout(() => {
      const bots = JSON.parse(localStorage.getItem(DEMO_BOTS_KEY) || "[]")
      const now = new Date().toISOString()

      const newBot: Bot = {
        id: `demo-bot-${Date.now()}`,
        name: botData.name || "New Bot",
        type: botData.type || ("indicator" as BotType),
        status: "paused" as BotStatus,
        assets: botData.assets || ["AAPL"],
        createdAt: now,
        updatedAt: now,
        performance: {
          totalPnL: 0,
          pnlPercentage: 0,
          totalTrades: 0,
          winRate: 0,
          lastUpdated: now,
        },
        stopLoss: botData.stopLoss,
        takeProfit: botData.takeProfit,
        maxDrawdown: botData.maxDrawdown,
        indicatorConfig: botData.indicatorConfig,
        gridConfig: botData.gridConfig,
        dcaConfig: botData.dcaConfig,
        basketConfig: botData.basketConfig,
      }

      bots.push(newBot)
      localStorage.setItem(DEMO_BOTS_KEY, JSON.stringify(bots))

      resolve(newBot)
    }, 500)
  })
}

function updateDemoBot(bot: Bot): Promise<Bot> {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const bots = JSON.parse(localStorage.getItem(DEMO_BOTS_KEY) || "[]")
      const index = bots.findIndex((b: Bot) => b.id === bot.id)

      if (index === -1) {
        reject(new Error(`Bot with ID ${bot.id} not found`))
        return
      }

      const updatedBot = {
        ...bot,
        updatedAt: new Date().toISOString(),
      }

      bots[index] = updatedBot
      localStorage.setItem(DEMO_BOTS_KEY, JSON.stringify(bots))

      resolve(updatedBot)
    }, 500)
  })
}

function deleteDemoBot(botId: string): Promise<void> {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const bots = JSON.parse(localStorage.getItem(DEMO_BOTS_KEY) || "[]")
      const index = bots.findIndex((b: Bot) => b.id === botId)

      if (index === -1) {
        reject(new Error(`Bot with ID ${botId} not found`))
        return
      }

      bots.splice(index, 1)
      localStorage.setItem(DEMO_BOTS_KEY, JSON.stringify(bots))

      resolve()
    }, 500)
  })
}

function toggleDemoBotStatus(botId: string, newStatus: BotStatus): Promise<Bot> {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const bots = JSON.parse(localStorage.getItem(DEMO_BOTS_KEY) || "[]")
      const index = bots.findIndex((b: Bot) => b.id === botId)

      if (index === -1) {
        reject(new Error(`Bot with ID ${botId} not found`))
        return
      }

      const updatedBot = {
        ...bots[index],
        status: newStatus,
        updatedAt: new Date().toISOString(),
      }

      bots[index] = updatedBot
      localStorage.setItem(DEMO_BOTS_KEY, JSON.stringify(bots))

      resolve(updatedBot)
    }, 500)
  })
}

