import { PrismaClient, Prisma } from '@prisma/client';
import { AlpacaClient, AlpacaConfig } from '@/lib/alpaca-client';
import { decrypt } from '@/lib/utils/crypto';
import { BotSettings, BotType, BotStatus } from '@/types/bot-types';

export class BotService {
  private prisma: PrismaClient;

  constructor() {
    this.prisma = new PrismaClient();
  }

  async createBot(userId: string, config: {
    name: string;
    type: BotType;
    settings: BotSettings;
  }) {
    return this.prisma.tradingBot.create({
      data: {
        name: config.name,
        type: config.type,
        status: 'PAUSED',
        strategy: config.type.toLowerCase(),
        active: false,
        settings: config.settings as Prisma.JsonObject,
        user: { connect: { id: userId } }
      }
    });
  }

  async getBot(botId: string, userId: string) {
    return this.prisma.tradingBot.findFirst({
      where: {
        id: botId,
        userId: userId
      }
    });
  }

  async updateBot(botId: string, userId: string, updates: {
    name?: string;
    status?: BotStatus;
    active?: boolean;
    settings?: Partial<BotSettings>;
  }) {
    return this.prisma.tradingBot.update({
      where: {
        id: botId,
        userId: userId
      },
      data: {
        ...(updates.name && { name: updates.name }),
        ...(updates.status && { status: updates.status }),
        ...(typeof updates.active === 'boolean' && { active: updates.active }),
        ...(updates.settings && { 
          settings: {
            ...updates.settings
          } as Prisma.JsonObject 
        })
      }
    });
  }

  async deleteBot(botId: string, userId: string) {
    return this.prisma.tradingBot.delete({
      where: {
        id: botId,
        userId: userId
      }
    });
  }

  async listBots(userId: string, type?: BotType) {
    return this.prisma.tradingBot.findMany({
      where: {
        userId,
        ...(type && { type })
      },
      orderBy: {
        createdAt: 'desc'
      }
    });
  }
}

