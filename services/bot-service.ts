import { Bot, BotType, BotStatus } from '@/types/bot';

export class BotService {
  // Store bot data in memory for MVP
  private static bots: Map<string, Bot> = new Map();

  static async createBot(botData: Partial<Bot>): Promise<Bot> {
    const bot: Bot = {
      id: crypto.randomUUID(),
      name: botData.name || 'Untitled Bot',
      type: botData.type || 'basket',
      status: 'paused',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      settings: botData.settings || {},
      ...botData
    };
    
    this.bots.set(bot.id, bot);
    return bot;
  }

  static async getBot(id: string): Promise<Bot | null> {
    return this.bots.get(id) || null;
  }

  static async listBots(): Promise<Bot[]> {
    return Array.from(this.bots.values());
  }

  static async updateBot(id: string, updates: Partial<Bot>): Promise<Bot | null> {
    const bot = this.bots.get(id);
    if (!bot) return null;

    const updatedBot = {
      ...bot,
      ...updates,
      updatedAt: new Date().toISOString()
    };
    
    this.bots.set(id, updatedBot);
    return updatedBot;
  }

  static async deleteBot(id: string): Promise<boolean> {
    return this.bots.delete(id);
  }

  static async toggleBotStatus(id: string, newStatus: BotStatus): Promise<Bot | null> {
    const bot = this.bots.get(id);
    if (!bot) return null;

    const updatedBot = {
      ...bot,
      status: newStatus,
      updatedAt: new Date().toISOString()
    };

    this.bots.set(id, updatedBot);
    return updatedBot;
  }
}

