import type { Bot, BotStatus } from "@/types/bot";

export type BotType = 'dca' | 'grid' | 'indicator' | 'basket';

// API functions
export async function fetchBots(): Promise<Bot[]> {
  try {
    const response = await fetch('/api/bots');
    if (!response.ok) {
      throw new Error(`Failed to fetch bots: ${response.status}`);
    }
    const data: Bot[] = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching bots:", error);
    throw new Error("Failed to fetch bots");
  }
}

export async function createBot(botData: Partial<Bot>): Promise<Bot> {
  try {
    const response = await fetch('/api/bots', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(botData),
    });
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(`Failed to create bot: ${errorData.error || response.statusText}`);
    }
    const data: Bot = await response.json();
    return data;
  } catch (error) {
    console.error("Error creating bot:", error);
    throw new Error("Failed to create bot");
  }
}

export async function updateBot(bot: Bot): Promise<Bot> {
  try {
    const response = await fetch(`/api/bots/${bot.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(bot),
    });
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(`Failed to update bot: ${errorData.error || response.statusText}`);
    }
    const data: Bot = await response.json();
    return data;
  } catch (error) {
    console.error(`Error updating bot ${bot.id}:`, error);
    throw new Error("Failed to update bot");
  }
}

export async function deleteBot(botId: string): Promise<void> {
  try {
    const response = await fetch(`/api/bots/${botId}`, { method: 'DELETE' });
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(`Failed to delete bot: ${errorData.error || response.statusText}`);
    }
  } catch (error) {
    console.error(`Error deleting bot ${botId}:`, error);
    throw new Error("Failed to delete bot");
  }
}

export async function toggleBotStatus(botId: string, active: boolean): Promise<Bot> {
  try {
    const response = await fetch(`/api/bots/${botId}/status`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ active }),
    });
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(`Failed to toggle bot status: ${errorData.error || response.statusText}`);
    }
    const data: Bot = await response.json();
    return data;
  } catch (error) {
    console.error(`Error toggling bot status ${botId}:`, error);
    throw new Error("Failed to toggle bot status");
  }
}

export async function fetchMarketData(symbol: string): Promise<any> {
  try {
    const response = await fetch(`/api/alpaca/market?symbol=${symbol}`);
    if (!response.ok) {
      throw new Error(`Failed to fetch market data for ${symbol}: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error("Error fetching market data:", error);
    throw new Error("Failed to fetch market data");
  }
}

export async function fetchAccountBalance(): Promise<any> {
  try {
    const response = await fetch('/api/alpaca/account');
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(`Failed to fetch account balance: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error("Error fetching account balance:", error);
    throw new Error("Failed to fetch account balance");
  }
}

export async function fetchDemoOrders(): Promise<any[]> {
  try {
    const response = await fetch('/api/alpaca/orders');
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(`Failed to fetch orders: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error("Error fetching orders:", error);
    throw new Error("Failed to fetch orders");
  }
}

export async function fetchDemoPositions(): Promise<any[]> {
  try {
    const response = await fetch('/api/alpaca/positions');
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(`Failed to fetch positions: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error("Error fetching positions:", error);
    throw new Error("Failed to fetch positions");
  }
}
