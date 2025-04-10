import { PrismaClient, Prisma } from '@prisma/client';
import { AlpacaClient, AlpacaConfig } from '@/lib/alpaca-client';
import { decrypt, decryptWithSalt } from '@/lib/utils/crypto';
import { 
  ExecutionHistoryRecord, 
  ensureJsonSafe, 
  isExecutionHistoryArray, 
  validateExecutionRecord 
} from '@/lib/utils/json-validation';

type DCABotSettings = {
  [key: string]: any;
  symbol: string;
  amount: number;
  interval: string;
  startDate?: string | Date;
  endDate?: string | Date;
  stopLossPercentage?: number;
  takeProfitPercentage?: number;
}

export class DCABotService {
  private prisma: PrismaClient;

  constructor() {
    this.prisma = new PrismaClient();
  }

  async createDCABot(userId: string, config: {
    name: string;
  } & DCABotSettings): Promise<{
    id: string;
    name: string;
    type: string;
    status: string;
    strategy: string;
    active: boolean;
    settings: DCABotSettings;
    userId: string;
  }> {
    const dcaConfig: Prisma.JsonObject = {
      symbol: config.symbol,
      amount: config.amount,
      interval: config.interval,
      startDate: (config.startDate || new Date()).toString(),
      endDate: config.endDate ? new Date(config.endDate).toISOString() : undefined,
      stopLossPercentage: config.stopLossPercentage,
      takeProfitPercentage: config.takeProfitPercentage
    };

    const bot = await this.prisma.tradingBot.create({
      data: {
        name: config.name,
        type: 'dca',
        status: 'paused',
        strategy: 'dca',
        active: false,
        settings: dcaConfig as Prisma.InputJsonValue,
        user: { connect: { id: userId } }
      }
    });

    return {
      id: bot.id,
      name: bot.name,
      type: bot.type,
      status: bot.status,
      strategy: bot.strategy,
      active: bot.active,
      settings: bot.settings as unknown as DCABotSettings,
      userId: bot.userId
    };
  }

  async executeDCA(botId: string): Promise<void> {
    const bot = await this.prisma.tradingBot.findUnique({
      where: { id: botId },
      include: { user: true }
    });

    if (!bot || bot.status !== 'active' || !bot.user.alpacaApiKey || !bot.user.alpacaSecretKey) {
      console.log(`Bot ${botId} not found, inactive, or missing credentials.`);
      return;
    }

    const settings = bot.settings as unknown as DCABotSettings;

    // Check if the bot should run based on start/end dates
    const now = new Date();
    if (settings.startDate && now < new Date(settings.startDate)) {
      console.log(`Bot ${botId} start date is in the future.`);
      return;
    }
    if (settings.endDate && now > new Date(settings.endDate)) {
      console.log(`Bot ${botId} has passed its end date.`);
      // Optionally update bot status to paused or completed
      await this.prisma.tradingBot.update({
        where: { id: bot.id },
        data: { status: 'paused', active: false }
      });
      return;
    }

    // Create Alpaca client with decrypted credentials
    let alpaca: AlpacaClient;
    try {
      const config: AlpacaConfig = {
        apiKey: decrypt(bot.user.alpacaApiKey),
        secretKey: decrypt(bot.user.alpacaSecretKey),
        isPaper: bot.user.alpacaIsPaper
      };
      alpaca = new AlpacaClient(config);
    } catch (error) {
      console.error(`Failed to create Alpaca client for bot ${botId}:`, error);
      await this.recordExecutionFailure(bot.id, settings.amount, error);
      return;
    }

    try {
      // Place market order using notional value
      const order = await alpaca.createOrder({
        symbol: settings.symbol,
        notional: settings.amount, // Dollar amount as number
        side: 'buy',
        type: 'market',
        time_in_force: 'day'
      });

      console.log(`DCA order placed for bot ${botId}:`, order);

      // Record trade in database
      await this.prisma.trade.create({
        data: {
          symbol: settings.symbol,
          quantity: order.qty || 0,
          price: order.filled_avg_price || 0,
          direction: 'BUY',
          botId: bot.id,
          executedAt: new Date(order.filled_at || order.submitted_at || Date.now()) // Use fill time if available
        }
      });

      // Update bot execution history
      await this.appendExecutionHistory(bot.id, {
        timestamp: new Date().toISOString(),
        action: 'BUY',
        amount: settings.amount,
        status: 'success',
        orderId: order.id,
        filledQty: order.qty || 0,
        filledPrice: order.filled_avg_price || 0
      });
    } catch (error) {
      console.error(`DCA execution failed for bot ${botId}:`, error);
      await this.recordExecutionFailure(bot.id, settings.amount, error);
    }
  }

  private async appendExecutionHistory(
    botId: string, 
    record: ExecutionHistoryRecord
  ): Promise<void> {
    // First get the current history
    const bot = await this.prisma.tradingBot.findUnique({
      where: { id: botId },
      select: { executionHistory: true }
    });

    // Parse and validate the history data
    const jsonData = bot?.executionHistory ? 
      ensureJsonSafe(bot.executionHistory) : 
      [];
    
    // Validate and type cast the history array
    // Validate the history array and new record
    if (!validateExecutionRecord(record as unknown)) {
      throw new Error('Invalid execution record format');
    }
    
    const history = isExecutionHistoryArray(jsonData) ? jsonData : [];
    // Convert to input format and filter out undefined values
    const records = [...history, record].map(r => {
      const record: Record<string, string | number | boolean | null> = {
        timestamp: r.timestamp,
        action: r.action,
        amount: r.amount,
        status: r.status
      };
      
      if (r.orderId !== undefined) record.orderId = r.orderId;
      if (r.filledQty !== undefined) record.filledQty = r.filledQty;
      if (r.filledPrice !== undefined) record.filledPrice = r.filledPrice;
      if (r.error !== undefined) record.error = r.error;
      
      return record;
    });

    // Update with new record and ensure valid JSON data
    await this.prisma.tradingBot.update({
      where: { id: botId },
      data: {
        executionHistory: {
          set: records as unknown[] as Prisma.InputJsonValue[]
        }
      }
    });
  }

  private async recordExecutionFailure(botId: string, amount: number, error: any) {
    await this.appendExecutionHistory(botId, {
      timestamp: new Date().toISOString(),
      action: 'BUY',
      amount: amount,
      status: 'failed',
      error: error instanceof Error ? error.message : String(error)
    });
  }
}
