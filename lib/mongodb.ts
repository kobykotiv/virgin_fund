import { MongoClient, Db, ObjectId, Collection } from 'mongodb';

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/virgin_fund';
const MONGODB_DB = process.env.MONGODB_DB || 'virgin_fund';

if (!MONGODB_URI) {
  throw new Error("Please define the MONGODB_URI environment variable")
}

if (!MONGODB_DB) {
  throw new Error("Please define the MONGODB_DB environment variable")
}

let cachedClient: MongoClient | null = null;
let cachedDb: Db | null = null;

export async function connectToDatabase(): Promise<{ client: MongoClient; db: Db }> {
  // If we have cached values, use them
  if (cachedClient && cachedDb) {
    return { client: cachedClient, db: cachedDb };
  }

  // Connect to the MongoDB instance
  const client = await MongoClient.connect(MONGODB_URI);
  const db = client.db(MONGODB_DB);

  // Cache the client and db for reuse
  cachedClient = client;
  cachedDb = db;

  return { client, db };
}

// Define collection names as constants to avoid typos
export const COLLECTIONS = {
  PORTFOLIOS: 'portfolios',
  POSITIONS: 'positions',
  TRANSACTIONS: 'transactions',
  TRADES: 'trades', 
  REBALANCES: 'rebalances',
  SETTINGS: 'settings',
  USERS: 'users',
  BOTS: 'bots',
  BOT_SIGNALS: 'botSignals',
  BOT_EXECUTIONS: 'botExecutions',
  STRATEGIES: 'strategies',
  PORTFOLIO_TEMPLATES: 'portfolioTemplates',
  RISK_PROFILES: 'riskProfiles',
  MARKET_DATA: 'marketData',
  WEBHOOKS: 'webhooks',
  INDICATORS: 'indicators',
  BOT_POSITIONS: 'botPositions',
  BACKTEST_RESULTS: 'backtestResults',
  HISTORICAL_DATA: 'historicalData',
  SHARED_BACKTESTS: 'sharedBacktests',
  SHARED_RESOURCES: 'sharedResources'
}

// Initialize database collections with advanced schemas
export async function initializeCollections() {
  const { db } = await connectToDatabase()
  
  // Create collections if they don't exist
  for (const collection of Object.values(COLLECTIONS)) {
    const collections = await db.listCollections({name: collection}).toArray()
    if (collections.length === 0) {
      await db.createCollection(collection)
      console.log(`Created collection: ${collection}`)
    }
  }
  
  // Create indexes with advanced schema validation
  await db.collection(COLLECTIONS.USERS).createIndex({ email: 1 }, { unique: true })
  await db.collection(COLLECTIONS.PORTFOLIOS).createIndex({ userId: 1 })
  await db.collection(COLLECTIONS.POSITIONS).createIndex({ portfolioId: 1, symbol: 1 })
  await db.collection(COLLECTIONS.TRANSACTIONS).createIndex({ portfolioId: 1, timestamp: -1 })
  await db.collection(COLLECTIONS.TRADES).createIndex({ portfolioId: 1, botId: 1, timestamp: -1 })
  await db.collection(COLLECTIONS.REBALANCES).createIndex({ portfolioId: 1, timestamp: -1 })
  await db.collection(COLLECTIONS.BOTS).createIndex({ userId: 1, portfolioId: 1 })
  await db.collection(COLLECTIONS.BOT_SIGNALS).createIndex({ botId: 1, timestamp: -1 })
  await db.collection(COLLECTIONS.BOT_EXECUTIONS).createIndex({ botId: 1, timestamp: -1 })
  await db.collection(COLLECTIONS.STRATEGIES).createIndex({ userId: 1 })
  await db.collection(COLLECTIONS.MARKET_DATA).createIndex({ symbol: 1, timestamp: -1 })
  await db.collection(COLLECTIONS.WEBHOOKS).createIndex({ botId: 1, timestamp: -1 })
  await db.collection(COLLECTIONS.INDICATORS).createIndex({ name: 1 })
  await db.collection(COLLECTIONS.BOT_POSITIONS).createIndex({ botId: 1, symbol: 1, status: 1 })
  await db.collection(COLLECTIONS.BACKTEST_RESULTS).createIndex({ userId: 1, botId: 1, createdAt: -1 })
  await db.collection(COLLECTIONS.HISTORICAL_DATA).createIndex({ symbol: 1, timeframe: 1, date: 1 }, { unique: true })
  await db.collection(COLLECTIONS.SHARED_BACKTESTS).createIndex({ shareId: 1 }, { unique: true })
  
  // Create TTL index for automatic expiration
  await db.collection(COLLECTIONS.SHARED_BACKTESTS).createIndex(
    { expiresAt: 1 },
    { expireAfterSeconds: 0 } // This tells MongoDB to remove documents after they expire
  )

  // Create indexes for shared resources
  await db.collection(COLLECTIONS.SHARED_RESOURCES).createIndex({ shareId: 1 }, { unique: true })
  await db.collection(COLLECTIONS.SHARED_RESOURCES).createIndex({ resourceType: 1, resourceId: 1 })
  await db.collection(COLLECTIONS.SHARED_RESOURCES).createIndex({ visibility: 1 }) // For finding public resources
  
  // Create TTL index for automatic expiration
  await db.collection(COLLECTIONS.SHARED_RESOURCES).createIndex(
    { expiresAt: 1 },
    { expireAfterSeconds: 0 } // This tells MongoDB to remove documents after they expire
  )

  // Add schema validation for portfolios
  await db.command({
    collMod: COLLECTIONS.PORTFOLIOS,
    validator: {
      $jsonSchema: {
        bsonType: "object",
        required: ["userId", "name", "type", "riskProfile", "strategy"],
        properties: {
          userId: { bsonType: "objectId" },
          name: { bsonType: "string" },
          type: { 
            enum: ["standard", "margin", "retirement", "managed", "taxAdvantaged", 
                  "crypto", "esg", "thematic", "custom"] 
          },
          riskProfile: {
            enum: ["conservative", "moderate", "aggressive", "speculative", 
                  "income", "growth", "value", "diversified", "sectorSpecific",
                  "thematic", "tactical", "strategic", "quantitative", "fundamental",
                  "technical", "eventDriven", "macro", "micro", "arbitrage", "hedged"]
          },
          strategy: { bsonType: "objectId" },
          description: { bsonType: "string" },
          settings: { bsonType: "object" },
          created: { bsonType: "date" },
          updated: { bsonType: "date" }
        }
      }
    }
  })

  // Add schema validation for bots
  await db.command({
    collMod: COLLECTIONS.BOTS,
    validator: {
      $jsonSchema: {
        bsonType: "object",
        required: ["userId", "name", "type", "config", "status"],
        properties: {
          userId: { bsonType: "objectId" },
          portfolioId: { bsonType: "objectId" },
          name: { bsonType: "string" },
          type: { 
            enum: ["indicator", "grid", "dca", "basket", "momentum", "meanReversion",
                  "arbitrage", "sentiment", "ml", "custom"] 
          },
          config: {
            bsonType: "object",
            required: ["signals", "conditions", "actions"],
            properties: {
              signals: { bsonType: "array" },
              conditions: { bsonType: "array" },
              actions: { bsonType: "array" },
              riskManagement: { bsonType: "object" },
              timeframes: { bsonType: "array" },
              assets: { bsonType: "array" },
              indicators: { bsonType: "array" },
              webhooks: {
                bsonType: "object",
                properties: {
                  enabled: { bsonType: "bool" },
                  incomingUrl: { bsonType: "string" },
                  outgoingUrls: { bsonType: "array" },
                  secretKey: { bsonType: "string" },
                  events: { bsonType: "array" }
                }
              },
              positionSettings: {
                bsonType: "object",
                properties: {
                  maxPositions: { bsonType: "int" },
                  maxPositionSize: { bsonType: "double" },
                  stopLoss: { bsonType: "double" },
                  takeProfit: { bsonType: "double" },
                  trailingStop: { bsonType: "bool" },
                  trailingStopPercent: { bsonType: "double" }
                }
              }
            }
          },
          status: { 
            enum: ["active", "paused", "error", "backtest", "pending"] 
          },
          performance: {
            bsonType: "object",
            properties: {
              totalPnL: { bsonType: "double" },
              totalTrades: { bsonType: "int" },
              winRate: { bsonType: "double" },
              sharpeRatio: { bsonType: "double" },
              openPositions: { bsonType: "int" },
              closedPositions: { bsonType: "int" }
            }
          },
          created: { bsonType: "date" },
          updated: { bsonType: "date" },
          lastExecuted: { bsonType: "date" }
        }
      }
    }
  })

  // Add schema validation for strategies
  await db.command({
    collMod: COLLECTIONS.STRATEGIES,
    validator: {
      $jsonSchema: {
        bsonType: "object",
        required: ["userId", "name", "type", "config"],
        properties: {
          userId: { bsonType: "objectId" },
          name: { bsonType: "string" },
          type: { 
            enum: ["momentum", "meanReversion", "trend", "scalping", "swing",
                  "dayTrading", "position", "arbitrage", "market_making", "custom"] 
          },
          config: {
            bsonType: "object",
            required: ["entryRules", "exitRules", "riskManagement"],
            properties: {
              entryRules: { bsonType: "array" },
              exitRules: { bsonType: "array" },
              riskManagement: { bsonType: "object" },
              timeframes: { bsonType: "array" },
              indicators: { bsonType: "array" }
            }
          },
          performance: {
            bsonType: "object",
            properties: {
              sharpeRatio: { bsonType: "double" },
              maxDrawdown: { bsonType: "double" },
              winRate: { bsonType: "double" }
            }
          },
          created: { bsonType: "date" },
          updated: { bsonType: "date" }
        }
      }
    }
  })

  // Add schema validation for webhooks
  await db.command({
    collMod: COLLECTIONS.WEBHOOKS,
    validator: {
      $jsonSchema: {
        bsonType: "object",
        required: ["botId", "event", "timestamp", "status"],
        properties: {
          botId: { bsonType: "objectId" },
          event: { 
            enum: ["BUY", "SELL", "SIGNAL", "ERROR", "INFO", "POSITION_OPENED", "POSITION_CLOSED"] 
          },
          direction: { enum: ["incoming", "outgoing"] },
          payload: { bsonType: "object" },
          status: { enum: ["pending", "processed", "failed", "sent", "received"] },
          timestamp: { bsonType: "date" },
          processedAt: { bsonType: "date" },
          url: { bsonType: "string" },
          errorMessage: { bsonType: "string" }
        }
      }
    }
  })

  // Add schema validation for technical indicators
  await db.command({
    collMod: COLLECTIONS.INDICATORS,
    validator: {
      $jsonSchema: {
        bsonType: "object",
        required: ["name", "type", "parameters"],
        properties: {
          name: { bsonType: "string" },
          type: { 
            enum: ["SMA", "EMA", "RSI", "MACD", "Bollinger", "Stochastic", "ATR", 
                  "ADX", "Ichimoku", "OBV", "Custom"] 
          },
          parameters: { bsonType: "object" },
          description: { bsonType: "string" },
          formula: { bsonType: "string" },
          created: { bsonType: "date" },
          updated: { bsonType: "date" }
        }
      }
    }
  })

  // Add schema validation for bot positions
  await db.command({
    collMod: COLLECTIONS.BOT_POSITIONS,
    validator: {
      $jsonSchema: {
        bsonType: "object",
        required: ["botId", "portfolioId", "symbol", "status", "entryPrice", "quantity"],
        properties: {
          botId: { bsonType: "objectId" },
          portfolioId: { bsonType: "objectId" },
          symbol: { bsonType: "string" },
          status: { enum: ["open", "closed", "pending"] },
          side: { enum: ["long", "short"] },
          entryPrice: { bsonType: "double" },
          currentPrice: { bsonType: "double" },
          exitPrice: { bsonType: "double" },
          quantity: { bsonType: "double" },
          entryDate: { bsonType: "date" },
          exitDate: { bsonType: "date" },
          stopLoss: { bsonType: "double" },
          takeProfit: { bsonType: "double" },
          pnl: { bsonType: "double" },
          pnlPercent: { bsonType: "double" },
          tags: { bsonType: "array" },
          notes: { bsonType: "string" },
          indicators: { bsonType: "object" }
        }
      }
    }
  })

  // Add schema validation for backtest results
  await db.command({
    collMod: COLLECTIONS.BACKTEST_RESULTS,
    validator: {
      $jsonSchema: {
        bsonType: "object",
        required: ["userId", "name", "startDate", "endDate", "status", "createdAt"],
        properties: {
          userId: { bsonType: "objectId" },
          botId: { bsonType: "objectId" }, // Optional - for existing bots
          name: { bsonType: "string" },
          description: { bsonType: "string" },
          strategy: { bsonType: "object" }, // For hypothetical strategies
          config: { bsonType: "object" },
          startDate: { bsonType: "date" },
          endDate: { bsonType: "date" },
          initialCapital: { bsonType: "double" },
          status: { 
            enum: ["pending", "running", "completed", "failed", "cancelled"] 
          },
          progress: { bsonType: "double" }, // 0-100
          results: {
            bsonType: "object",
            properties: {
              finalCapital: { bsonType: "double" },
              totalReturn: { bsonType: "double" },
              totalTrades: { bsonType: "int" },
              winningTrades: { bsonType: "int" },
              losingTrades: { bsonType: "int" },
              winRate: { bsonType: "double" },
              maxDrawdown: { bsonType: "double" },
              sharpeRatio: { bsonType: "double" },
              annualizedReturn: { bsonType: "double" },
              volatility: { bsonType: "double" },
              profitFactor: { bsonType: "double" },
              avgWinSize: { bsonType: "double" },
              avgLossSize: { bsonType: "double" },
              trades: { bsonType: "array" },
              equityCurve: { bsonType: "array" },
              monthlyReturns: { bsonType: "object" },
              drawdowns: { bsonType: "array" }
            }
          },
          settings: {
            bsonType: "object",
            properties: {
              slippage: { bsonType: "double" },
              commission: { bsonType: "double" },
              dataSource: { bsonType: "string" },
              symbols: { bsonType: "array" },
              timeframe: { bsonType: "string" },
              includeDividends: { bsonType: "bool" },
              includeFees: { bsonType: "bool" },
              rebalanceFrequency: { bsonType: "string" }
            }
          },
          createdAt: { bsonType: "date" },
          completedAt: { bsonType: "date" },
          errorMessage: { bsonType: "string" }
        }
      }
    }
  })

  // Add schema validation for historical data cache
  await db.command({
    collMod: COLLECTIONS.HISTORICAL_DATA,
    validator: {
      $jsonSchema: {
        bsonType: "object",
        required: ["symbol", "timeframe", "date", "data"],
        properties: {
          symbol: { bsonType: "string" },
          timeframe: { bsonType: "string" },
          date: { bsonType: "date" },
          data: { bsonType: "object" },
          source: { bsonType: "string" },
          fetchedAt: { bsonType: "date" },
          expiresAt: { bsonType: "date" }
        }
      }
    }
  })

  // Add schema validation for shared backtest links
  await db.command({
    collMod: COLLECTIONS.SHARED_BACKTESTS,
    validator: {
      $jsonSchema: {
        bsonType: "object",
        required: ["backtestId", "userId", "shareId", "createdAt", "expiresAt"],
        properties: {
          backtestId: { bsonType: "objectId" },
          userId: { bsonType: "objectId" },
          shareId: { bsonType: "string" },
          createdAt: { bsonType: "date" },
          expiresAt: { bsonType: "date" },
          accessCount: { bsonType: "int" },
          lastAccessedAt: { bsonType: "date" },
          accessRestrictions: {
            bsonType: "object",
            properties: {
              requirePassword: { bsonType: "bool" },
              passwordHash: { bsonType: "string" },
              allowedEmails: { bsonType: "array" },
              maxAccesses: { bsonType: "int" }
            }
          }
        }
      }
    }
  })

  // Add schema validation for shared resources
  await db.command({
    collMod: COLLECTIONS.SHARED_RESOURCES,
    validator: {
      $jsonSchema: {
        bsonType: "object",
        required: ["resourceType", "resourceId", "userId", "shareId", "visibility", "createdAt", "expiresAt"],
        properties: {
          resourceType: { 
            enum: ["backtest", "portfolio", "bot", "strategy"] 
          },
          resourceId: { bsonType: "objectId" },
          userId: { bsonType: "objectId" },
          shareId: { bsonType: "string" },
          visibility: { 
            enum: ["public", "unlisted"] 
          },
          title: { bsonType: "string" },
          description: { bsonType: "string" },
          thumbnail: { bsonType: "string" },
          createdAt: { bsonType: "date" },
          expiresAt: { bsonType: "date" },
          accessCount: { bsonType: "int" },
          lastAccessedAt: { bsonType: "date" },
          accessRestrictions: {
            bsonType: "object",
            properties: {
              requirePassword: { bsonType: "bool" },
              passwordHash: { bsonType: "string" },
              allowedEmails: { bsonType: "array" },
              maxAccesses: { bsonType: "int" }
            }
          },
          metadata: { bsonType: "object" }
        }
      }
    }
  })

  console.log('Database collections and schemas initialized')
}

// Specific collection helpers
export async function getCollection(collectionName: string) {
  const { db } = await connectToDatabase()
  return db.collection(collectionName)
}

// Collection-specific helper functions
export async function getPortfoliosCollection() {
  return getCollection(COLLECTIONS.PORTFOLIOS)
}

export async function getPositionsCollection() {
  return getCollection(COLLECTIONS.POSITIONS)
}

export async function getTransactionsCollection() {
  return getCollection(COLLECTIONS.TRANSACTIONS)
}

export async function getTradesCollection() {
  return getCollection(COLLECTIONS.TRADES)
}

export async function getRebalancesCollection() {
  return getCollection(COLLECTIONS.REBALANCES)
}

export async function getSettingsCollection() {
  return getCollection(COLLECTIONS.SETTINGS)
}

export async function getUsersCollection() {
  return getCollection(COLLECTIONS.USERS)
}

export async function getBotsCollection() {
  return getCollection(COLLECTIONS.BOTS)
}

export async function getBotSignalsCollection() {
  return getCollection(COLLECTIONS.BOT_SIGNALS)
}

export async function getBotExecutionsCollection() {
  return getCollection(COLLECTIONS.BOT_EXECUTIONS)
}

export async function getStrategiesCollection() {
  return getCollection(COLLECTIONS.STRATEGIES)
}

export async function getMarketDataCollection() {
  return getCollection(COLLECTIONS.MARKET_DATA)
}

export async function getWebhooksCollection() {
  return getCollection(COLLECTIONS.WEBHOOKS)
}

export async function getIndicatorsCollection() {
  return getCollection(COLLECTIONS.INDICATORS)
}

export async function getBotPositionsCollection() {
  return getCollection(COLLECTIONS.BOT_POSITIONS)
}

export async function getBacktestResultsCollection() {
  return getCollection(COLLECTIONS.BACKTEST_RESULTS)
}

export async function getHistoricalDataCollection() {
  return getCollection(COLLECTIONS.HISTORICAL_DATA)
}

export async function getSharedBacktestsCollection() {
  return getCollection(COLLECTIONS.SHARED_BACKTESTS)
}

export async function getSharedResourcesCollection() {
  return getCollection(COLLECTIONS.SHARED_RESOURCES)
}

// Bot CRUD Operations
export async function createBot(botData: any) {
  const botsCollection = await getBotsCollection()
  const now = new Date()
  
  const bot = {
    ...botData,
    created: now,
    updated: now,
    performance: {
      totalPnL: 0,
      totalTrades: 0,
      winRate: 0,
      sharpeRatio: 0,
      openPositions: 0,
      closedPositions: 0
    }
  }
  
  const result = await botsCollection.insertOne(bot)
  return { ...bot, _id: result.insertedId }
}

export async function getBotById(botId: string) {
  const botsCollection = await getBotsCollection()
  return botsCollection.findOne({ _id: new ObjectId(botId) })
}

export async function getBotsByUserId(userId: string) {
  const botsCollection = await getBotsCollection()
  return botsCollection.find({ userId: new ObjectId(userId) }).toArray()
}

export async function updateBot(botId: string, updateData: any) {
  const botsCollection = await getBotsCollection()
  const result = await botsCollection.updateOne(
    { _id: new ObjectId(botId) },
    { 
      $set: { 
        ...updateData, 
        updated: new Date() 
      } 
    }
  )
  return result
}

export async function deleteBot(botId: string) {
  const botsCollection = await getBotsCollection()
  return botsCollection.deleteOne({ _id: new ObjectId(botId) })
}

export async function changeBotStatus(botId: string, status: 'active' | 'paused' | 'error' | 'backtest' | 'pending') {
  const botsCollection = await getBotsCollection()
  return botsCollection.updateOne(
    { _id: new ObjectId(botId) },
    { 
      $set: { 
        status,
        updated: new Date()
      } 
    }
  )
}

// Position Management Functions
export async function openPosition(botId: string, portfolioId: string, positionData: any) {
  const botPositionsCollection = await getBotPositionsCollection()
  const botsCollection = await getBotsCollection()
  
  const now = new Date()
  const position = {
    botId: new ObjectId(botId),
    portfolioId: new ObjectId(portfolioId),
    status: 'open',
    entryDate: now,
    ...positionData,
    pnl: 0,
    pnlPercent: 0
  }
  
  const result = await botPositionsCollection.insertOne(position)
  
  // Update bot performance
  await botsCollection.updateOne(
    { _id: new ObjectId(botId) },
    { 
      $inc: { 'performance.openPositions': 1 },
      $set: { updated: now, lastExecuted: now }
    }
  )
  
  // Log to bot executions
  const botExecutionsCollection = await getBotExecutionsCollection()
  await botExecutionsCollection.insertOne({
    botId: new ObjectId(botId),
    action: 'POSITION_OPENED',
    details: {
      symbol: positionData.symbol,
      entryPrice: positionData.entryPrice,
      quantity: positionData.quantity,
      side: positionData.side
    },
    timestamp: now
  })
  
  return { ...position, _id: result.insertedId }
}

export async function closePosition(positionId: string, exitData: any) {
  const botPositionsCollection = await getBotPositionsCollection()
  const position = await botPositionsCollection.findOne({ _id: new ObjectId(positionId) })
  
  if (!position) {
    throw new Error('Position not found')
  }
  
  const now = new Date()
  const exitPrice = exitData.exitPrice
  const pnl = position.side === 'long' 
    ? (exitPrice - position.entryPrice) * position.quantity
    : (position.entryPrice - exitPrice) * position.quantity
    
  const pnlPercent = position.side === 'long'
    ? ((exitPrice - position.entryPrice) / position.entryPrice) * 100
    : ((position.entryPrice - exitPrice) / position.entryPrice) * 100
  
  const result = await botPositionsCollection.updateOne(
    { _id: new ObjectId(positionId) },
    {
      $set: {
        status: 'closed',
        exitDate: now,
        exitPrice,
        pnl,
        pnlPercent,
        ...exitData
      }
    }
  )
  
  // Update bot performance
  const botsCollection = await getBotsCollection()
  await botsCollection.updateOne(
    { _id: position.botId },
    { 
      $inc: { 
        'performance.openPositions': -1,
        'performance.closedPositions': 1,
        'performance.totalPnL': pnl,
        'performance.totalTrades': 1
      },
      $set: { 
        updated: now,
        lastExecuted: now
      }
    }
  )
  
  // Update win rate
  const bot = await botsCollection.findOne({ _id: position.botId })
  if (bot) {
    const closedPositions = bot.performance.closedPositions
    const botPositions = await botPositionsCollection.find({ 
      botId: position.botId, 
      status: 'closed',
      pnl: { $gt: 0 }
    }).count()
    
    const winRate = closedPositions > 0 ? (botPositions / closedPositions) * 100 : 0
    
    await botsCollection.updateOne(
      { _id: position.botId },
      { $set: { 'performance.winRate': winRate } }
    )
  }
  
  // Log to bot executions
  const botExecutionsCollection = await getBotExecutionsCollection()
  await botExecutionsCollection.insertOne({
    botId: position.botId,
    action: 'POSITION_CLOSED',
    details: {
      symbol: position.symbol,
      entryPrice: position.entryPrice,
      exitPrice,
      quantity: position.quantity,
      pnl,
      pnlPercent,
      side: position.side
    },
    timestamp: now
  })
  
  return result
}

export async function updatePosition(positionId: string, updateData: any) {
  const botPositionsCollection = await getBotPositionsCollection()
  return botPositionsCollection.updateOne(
    { _id: new ObjectId(positionId) },
    { $set: updateData }
  )
}

export async function getPositionsByBotId(botId: string) {
  const botPositionsCollection = await getBotPositionsCollection()
  return botPositionsCollection.find({ botId: new ObjectId(botId) }).toArray()
}

// Webhook Functions
export async function createWebhook(webhookData: any) {
  const webhooksCollection = await getWebhooksCollection()
  const now = new Date()
  
  const webhook = {
    ...webhookData,
    timestamp: now
  }
  
  const result = await webhooksCollection.insertOne(webhook)
  return { ...webhook, _id: result.insertedId }
}

export async function processIncomingWebhook(botId: string, payload: any) {
  const botsCollection = await getBotsCollection()
  const bot = await botsCollection.findOne({ _id: new ObjectId(botId) })
  
  if (!bot || !bot.config.webhooks?.enabled) {
    throw new Error('Bot not found or webhooks not enabled')
  }
  
  const now = new Date()
  const webhooksCollection = await getWebhooksCollection()
  
  // Log the incoming webhook
  const webhook = await webhooksCollection.insertOne({
    botId: new ObjectId(botId),
    direction: 'incoming',
    payload,
    status: 'received',
    timestamp: now,
    processedAt: now
  })
  
  // Process the webhook action based on payload
  if (payload.event === 'BUY' || payload.event === 'SELL') {
    // For this example, we'll assume the payload contains symbol and quantity
    const side = payload.event === 'BUY' ? 'long' : 'short'
    
    // Get current price (in a real system, this would come from market data service)
    const price = payload.price || 100 // Placeholder
    
    // Open a position based on the webhook
    await openPosition(botId, bot.portfolioId.toString(), {
      symbol: payload.symbol,
      side,
      entryPrice: price,
      quantity: payload.quantity,
      stopLoss: payload.stopLoss,
      takeProfit: payload.takeProfit,
      tags: ['webhook']
    })
    
    // Update webhook status
    await webhooksCollection.updateOne(
      { _id: webhook.insertedId },
      { $set: { status: 'processed', processedAt: new Date() } }
    )
  }
  
  return { success: true }
}

export async function sendOutgoingWebhook(botId: string, event: string, data: any) {
  const botsCollection = await getBotsCollection()
  const bot = await botsCollection.findOne({ _id: new ObjectId(botId) })
  
  if (!bot || !bot.config.webhooks?.enabled || !bot.config.webhooks?.outgoingUrls?.length) {
    throw new Error('Bot not found, webhooks not enabled, or no outgoing URLs configured')
  }
  
  const webhooksCollection = await getWebhooksCollection()
  const now = new Date()
  
  // In a real implementation, you would actually send HTTP requests to the URLs
  // This is a placeholder for the database logging part
  for (const url of bot.config.webhooks.outgoingUrls) {
    await webhooksCollection.insertOne({
      botId: new ObjectId(botId),
      event,
      direction: 'outgoing',
      payload: data,
      status: 'sent', // In real implementation, this would be 'pending' until confirmed
      timestamp: now,
      url,
      processedAt: now
    })
  }
  
  return { success: true }
}

// Technical Indicators
export async function createIndicator(indicatorData: any) {
  const indicatorsCollection = await getIndicatorsCollection()
  const now = new Date()
  
  const indicator = {
    ...indicatorData,
    created: now,
    updated: now
  }
  
  const result = await indicatorsCollection.insertOne(indicator)
  return { ...indicator, _id: result.insertedId }
}

export async function getIndicators() {
  const indicatorsCollection = await getIndicatorsCollection()
  return indicatorsCollection.find({}).toArray()
}

export async function getIndicatorById(indicatorId: string) {
  const indicatorsCollection = await getIndicatorsCollection()
  return indicatorsCollection.findOne({ _id: new ObjectId(indicatorId) })
}

export async function updateIndicator(indicatorId: string, updateData: any) {
  const indicatorsCollection = await getIndicatorsCollection()
  return indicatorsCollection.updateOne(
    { _id: new ObjectId(indicatorId) },
    { 
      $set: { 
        ...updateData,
        updated: new Date()
      } 
    }
  )
}

export async function deleteIndicator(indicatorId: string) {
  const indicatorsCollection = await getIndicatorsCollection()
  return indicatorsCollection.deleteOne({ _id: new ObjectId(indicatorId) })
}

// Bot monitoring functions
export async function logBotSignal(botId: string, signal: any) {
  const botSignalsCollection = await getBotSignalsCollection()
  const now = new Date()
  
  return botSignalsCollection.insertOne({
    botId: new ObjectId(botId),
    ...signal,
    timestamp: now
  })
}

export async function logBotExecution(botId: string, execution: any) {
  const botExecutionsCollection = await getBotExecutionsCollection()
  const now = new Date()
  
  return botExecutionsCollection.insertOne({
    botId: new ObjectId(botId),
    ...execution,
    timestamp: now
  })
}

export async function getBotSignals(botId: string, limit = 100) {
  const botSignalsCollection = await getBotSignalsCollection()
  return botSignalsCollection
    .find({ botId: new ObjectId(botId) })
    .sort({ timestamp: -1 })
    .limit(limit)
    .toArray()
}

export async function getBotExecutions(botId: string, limit = 100) {
  const botExecutionsCollection = await getBotExecutionsCollection()
  return botExecutionsCollection
    .find({ botId: new ObjectId(botId) })
    .sort({ timestamp: -1 })
    .limit(limit)
    .toArray()
}

// Index creation for collections
export async function createIndexes() {
  const { db } = await connectToDatabase()

  // Bots collection indexes
  await db.collection("bots").createIndexes([
    { key: { userId: 1 } },
    { key: { userId: 1, name: 1 }, unique: true },
    { key: { status: 1 } },
    { key: { createdAt: -1 } }
  ])

  // Portfolios collection indexes
  await db.collection("portfolios").createIndexes([
    { key: { userId: 1 } },
    { key: { userId: 1, name: 1 }, unique: true }
  ])

  // Transactions collection indexes
  await db.collection("transactions").createIndexes([
    { key: { userId: 1 } },
    { key: { portfolioId: 1 } },
    { key: { symbol: 1 } },
    { key: { createdAt: -1 } }
  ])

  // Positions collection indexes
  await db.collection("positions").createIndexes([
    { key: { userId: 1 } },
    { key: { portfolioId: 1 } },
    { key: { symbol: 1 } },
    { key: { portfolioId: 1, symbol: 1 }, unique: true }
  ])
}

// Bot backtesting functions

/**
 * Create a new backtest configuration
 */
export async function createBacktest(backtestData: {
  userId: string,
  name: string,
  description?: string,
  botId?: string,
  strategy?: any,
  config?: any,
  startDate: Date,
  endDate: Date,
  initialCapital: number,
  settings: {
    slippage?: number,
    commission?: number,
    dataSource?: string,
    symbols: string[],
    timeframe: string,
    includeDividends?: boolean,
    includeFees?: boolean,
    rebalanceFrequency?: string
  }
}) {
  const backtestCollection = await getBacktestResultsCollection();
  const now = new Date();

  // Validate date range (max 5 years)
  const fiveYearsMs = 5 * 365 * 24 * 60 * 60 * 1000;
  const dateRangeMs = backtestData.endDate.getTime() - backtestData.startDate.getTime();
  if (dateRangeMs > fiveYearsMs) {
    throw new Error('Backtest period cannot exceed 5 years');
  }

  // Create the backtest document
  const backtest = {
    userId: new ObjectId(backtestData.userId),
    name: backtestData.name,
    description: backtestData.description || '',
    startDate: backtestData.startDate,
    endDate: backtestData.endDate,
    initialCapital: backtestData.initialCapital,
    status: 'pending',
    progress: 0,
    settings: {
      slippage: backtestData.settings.slippage || 0.001, // 0.1% default slippage
      commission: backtestData.settings.commission || 0.0005, // 0.05% default commission
      dataSource: backtestData.settings.dataSource || 'alpaca',
      symbols: backtestData.settings.symbols,
      timeframe: backtestData.settings.timeframe,
      includeDividends: backtestData.settings.includeDividends || false,
      includeFees: backtestData.settings.includeFees || true,
      rebalanceFrequency: backtestData.settings.rebalanceFrequency || 'daily'
    },
    createdAt: now
  };

  // Add bot or strategy data
  if (backtestData.botId) {
    backtest.botId = new ObjectId(backtestData.botId);
    
    // Get the bot configuration to use in the backtest
    const botsCollection = await getBotsCollection();
    const bot = await botsCollection.findOne({ _id: new ObjectId(backtestData.botId) });
    if (!bot) {
      throw new Error('Bot not found');
    }
    
    backtest.config = bot.config;
  } else if (backtestData.strategy) {
    backtest.strategy = backtestData.strategy;
    backtest.config = backtestData.config || {};
  } else {
    throw new Error('Either botId or strategy must be provided');
  }

  const result = await backtestCollection.insertOne(backtest);
  return { ...backtest, _id: result.insertedId };
}

/**
 * Get backtest by ID
 */
export async function getBacktestById(backtestId: string) {
  const backtestCollection = await getBacktestResultsCollection();
  return backtestCollection.findOne({ _id: new ObjectId(backtestId) });
}

/**
 * Get all backtests for a user
 */
export async function getBacktestsByUserId(userId: string, limit = 20, skip = 0) {
  const backtestCollection = await getBacktestResultsCollection();
  return backtestCollection.find({ 
    userId: new ObjectId(userId) 
  })
  .sort({ createdAt: -1 })
  .skip(skip)
  .limit(limit)
  .toArray();
}

/**
 * Get backtests for a specific bot
 */
export async function getBacktestsByBotId(botId: string) {
  const backtestCollection = await getBacktestResultsCollection();
  return backtestCollection.find({ 
    botId: new ObjectId(botId) 
  })
  .sort({ createdAt: -1 })
  .toArray();
}

/**
 * Update backtest status and progress
 */
export async function updateBacktestStatus(
  backtestId: string, 
  status: 'pending' | 'running' | 'completed' | 'failed' | 'cancelled',
  progress?: number,
  errorMessage?: string
) {
  const backtestCollection = await getBacktestResultsCollection();
  
  const updateData: any = { status };
  
  if (progress !== undefined) {
    updateData.progress = progress;
  }
  
  if (errorMessage) {
    updateData.errorMessage = errorMessage;
  }
  
  if (status === 'completed' || status === 'failed' || status === 'cancelled') {
    updateData.completedAt = new Date();
  }
  
  return backtestCollection.updateOne(
    { _id: new ObjectId(backtestId) },
    { $set: updateData }
  );
}

/**
 * Store backtest results
 */
export async function saveBacktestResults(backtestId: string, results: any) {
  const backtestCollection = await getBacktestResultsCollection();
  
  return backtestCollection.updateOne(
    { _id: new ObjectId(backtestId) },
    { 
      $set: { 
        results,
        status: 'completed',
        progress: 100,
        completedAt: new Date()
      } 
    }
  );
}

/**
 * Delete a backtest
 */
export async function deleteBacktest(backtestId: string) {
  const backtestCollection = await getBacktestResultsCollection();
  return backtestCollection.deleteOne({ _id: new ObjectId(backtestId) });
}

/**
 * Fetch historical data from Alpaca Markets API and cache it
 * Note: This assumes an Alpaca API client is implemented elsewhere
 */
export async function fetchAndCacheHistoricalData(
  symbols: string[],
  timeframe: string,
  startDate: Date,
  endDate: Date
) {
  const historicalDataCollection = await getHistoricalDataCollection();
  const now = new Date();
  const results = [];

  // This would connect to the actual Alpaca API
  // This is a placeholder - implement actual API calls in a real application
  async function fetchAlpacaData(symbol: string, timeframe: string, start: Date, end: Date) {
    // In a real implementation, this would make API calls to Alpaca
    // For example: 
    // const alpaca = new Alpaca({...}); 
    // return alpaca.getBars(timeframe, symbol, {start, end});
    
    console.log(`Fetching data for ${symbol} from ${start.toISOString()} to ${end.toISOString()}`);
    return { 
      symbol, 
      timeframe,
      // Simulate some historical data
      bars: []
    };
  }

  // For each symbol, fetch and cache data
  for (const symbol of symbols) {
    // Check if we already have this data cached
    const existingData = await historicalDataCollection.findOne({
      symbol,
      timeframe,
      date: {
        $gte: startDate,
        $lte: endDate
      }
    });

    if (existingData && existingData.expiresAt > now) {
      // Use cached data if it exists and hasn't expired
      results.push(existingData.data);
    } else {
      // Fetch fresh data from Alpaca
      const alpacaData = await fetchAlpacaData(symbol, timeframe, startDate, endDate);
      
      // Cache the data with a 24-hour expiration
      const expirationDate = new Date();
      expirationDate.setHours(expirationDate.getHours() + 24);
      
      await historicalDataCollection.updateOne(
        { 
          symbol,
          timeframe,
          date: startDate // We're using start date as the cache key
        },
        {
          $set: {
            symbol,
            timeframe,
            date: startDate,
            data: alpacaData,
            source: 'alpaca',
            fetchedAt: now,
            expiresAt: expirationDate
          }
        },
        { upsert: true }
      );
      
      results.push(alpacaData);
    }
  }

  return results;
}

/**
 * Start the backtest process
 * This would typically trigger a background job/worker
 */
export async function startBacktest(backtestId: string) {
  // Get the backtest configuration
  const backtest = await getBacktestById(backtestId);
  if (!backtest) {
    throw new Error('Backtest not found');
  }

  // Update status to running
  await updateBacktestStatus(backtestId, 'running', 0);

  try {
    // Fetch historical data for the backtest period
    const historicalData = await fetchAndCacheHistoricalData(
      backtest.settings.symbols,
      backtest.settings.timeframe,
      backtest.startDate,
      backtest.endDate
    );

    // In a real implementation, this would start a background job
    // For now, we'll simulate the process with a placeholder
    
    // PLACEHOLDER: Start the backtest simulation
    // This would typically be handled by a separate worker process
    console.log(`Starting backtest ${backtestId} for period ${backtest.startDate} to ${backtest.endDate}`);

    // Run the backtest (simulated)
    const results = await simulateBacktest(backtest, historicalData);

    // Save the results
    await saveBacktestResults(backtestId, results);

    return { success: true, backtestId };
  } catch (error) {
    // Handle errors
    await updateBacktestStatus(
      backtestId, 
      'failed', 
      0, 
      error.message || 'An unknown error occurred'
    );
    throw error;
  }
}

/**
 * PLACEHOLDER: Simulate a backtest
 * This would be a complex function in a real implementation
 */
async function simulateBacktest(backtest: any, historicalData: any[]) {
  // This is a placeholder function
  // In a real implementation, this would run the trading strategy
  // on the historical data and track performance

  // Simulate processing time
  await new Promise(resolve => setTimeout(resolve, 1000));

  // Example results (simplified)
  return {
    finalCapital: backtest.initialCapital * 1.25, // 25% gain
    totalReturn: 25.0,
    totalTrades: 42,
    winningTrades: 25,
    losingTrades: 17,
    winRate: 59.52,
    maxDrawdown: 12.3,
    sharpeRatio: 1.8,
    annualizedReturn: 12.5,
    volatility: 15.2,
    profitFactor: 1.75,
    avgWinSize: 3.2,
    avgLossSize: 1.8,
    trades: [], // Would contain detailed trade data
    equityCurve: [], // Would contain equity values over time
    monthlyReturns: {}, // Would contain monthly performance data
    drawdowns: [] // Would contain drawdown periods
  };
}

/**
 * Compare multiple backtests
 */
export async function compareBacktests(backtestIds: string[]) {
  const backtestCollection = await getBacktestResultsCollection();
  const backtests = await backtestCollection.find({
    _id: { $in: backtestIds.map(id => new ObjectId(id)) },
    status: 'completed'
  }).toArray();

  // Extract key metrics for comparison
  return backtests.map(backtest => ({
    _id: backtest._id,
    name: backtest.name,
    period: `${backtest.startDate.toISOString().split('T')[0]} to ${backtest.endDate.toISOString().split('T')[0]}`,
    initialCapital: backtest.initialCapital,
    finalCapital: backtest.results?.finalCapital || 0,
    totalReturn: backtest.results?.totalReturn || 0,
    sharpeRatio: backtest.results?.sharpeRatio || 0,
    maxDrawdown: backtest.results?.maxDrawdown || 0,
    winRate: backtest.results?.winRate || 0,
    totalTrades: backtest.results?.totalTrades || 0
  }));
}

/**
 * Create a shareable link for any resource type
 * @param resourceType - Type of resource (backtest, portfolio, bot, strategy)
 * @param userId - User ID of the resource owner
 * @param resourceId - ID of the resource to share
 * @param visibility - Whether the resource is public or unlisted
 * @param ttlDays - Time to live in days (defaults to 30)
 * @param metadata - Additional metadata about the resource
 * @param accessRestrictions - Optional access restrictions (only for unlisted resources)
 * @returns The created share document
 */
export async function createShareableLink(
  resourceType: 'backtest' | 'portfolio' | 'bot' | 'strategy',
  userId: string, 
  resourceId: string,
  visibility: 'public' | 'unlisted',
  options: {
    title?: string,
    description?: string,
    thumbnail?: string,
    ttlDays?: number,
    metadata?: any,
    accessRestrictions?: {
      requirePassword?: boolean,
      password?: string,
      allowedEmails?: string[],
      maxAccesses?: number
    }
  } = {}
) {
  // Set default TTL to 30 days
  const ttlDays = options.ttlDays || 30;
  
  // Verify the resource exists and belongs to the user
  const collection = await getResourceCollection(resourceType);
  const resource = await collection.findOne({
    _id: new ObjectId(resourceId),
    userId: new ObjectId(userId)
  });
  
  if (!resource) {
    throw new Error(`${resourceType} not found or does not belong to this user`);
  }
  
  // Create a unique share ID
  const shareId = generateUniqueShareId();
  
  const now = new Date();
  const expiresAt = new Date();
  expiresAt.setDate(expiresAt.getDate() + ttlDays);
  
  const shareData: any = {
    resourceType,
    resourceId: new ObjectId(resourceId),
    userId: new ObjectId(userId),
    shareId,
    visibility,
    title: options.title || resource.name || `Shared ${resourceType}`,
    description: options.description || resource.description || '',
    thumbnail: options.thumbnail || '',
    createdAt: now,
    expiresAt,
    accessCount: 0,
    metadata: options.metadata || {}
  };
  
  // Add access restrictions if provided (but only for unlisted resources)
  if (visibility === 'unlisted' && options.accessRestrictions) {
    shareData.accessRestrictions = {};
    
    if (options.accessRestrictions.requirePassword && options.accessRestrictions.password) {
      // In a real implementation, you'd hash the password
      // This is simplified for example purposes
      shareData.accessRestrictions.requirePassword = true;
      shareData.accessRestrictions.passwordHash = options.accessRestrictions.password; // Should be hashed
    }
    
    if (options.accessRestrictions.allowedEmails && options.accessRestrictions.allowedEmails.length > 0) {
      shareData.accessRestrictions.allowedEmails = options.accessRestrictions.allowedEmails;
    }
    
    if (options.accessRestrictions.maxAccesses && options.accessRestrictions.maxAccesses > 0) {
      shareData.accessRestrictions.maxAccesses = options.accessRestrictions.maxAccesses;
    }
  }
  
  const sharedResourcesCollection = await getSharedResourcesCollection();
  
  // Check if this resource is already shared
  const existingShare = await sharedResourcesCollection.findOne({
    resourceType,
    resourceId: new ObjectId(resourceId),
    userId: new ObjectId(userId)
  });
  
  if (existingShare) {
    // Update the existing share
    await sharedResourcesCollection.updateOne(
      { _id: existingShare._id },
      { 
        $set: {
          ...shareData,
          shareId: existingShare.shareId, // Keep the original shareId
          createdAt: existingShare.createdAt, // Keep the original creation date
          accessCount: existingShare.accessCount // Keep the access count
        }
      }
    );
    
    return {
      ...shareData,
      shareId: existingShare.shareId,
      createdAt: existingShare.createdAt,
      accessCount: existingShare.accessCount,
      shareUrl: generateShareUrl(resourceType, existingShare.shareId, visibility)
    };
  }
  
  // Create a new share
  await sharedResourcesCollection.insertOne(shareData);
  
  return {
    ...shareData,
    shareUrl: generateShareUrl(resourceType, shareId, visibility)
  };
}

/**
 * Generate a share URL based on resource type and visibility
 */
function generateShareUrl(resourceType: string, shareId: string, visibility: string): string {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
  
  if (visibility === 'public') {
    return `${baseUrl}/public/${resourceType}s/${shareId}`;
  } else {
    return `${baseUrl}/shared/${resourceType}s/${shareId}`;
  }
}

/**
 * Get the appropriate collection for a resource type
 */
async function getResourceCollection(resourceType: string): Promise<Collection> {
  switch (resourceType) {
    case 'backtest':
      return getBacktestResultsCollection();
    case 'portfolio':
      return getPortfoliosCollection();
    case 'bot':
      return getBotsCollection();
    case 'strategy':
      return getStrategiesCollection();
    default:
      throw new Error(`Unknown resource type: ${resourceType}`);
  }
}

/**
 * Generate a unique share ID
 */
function generateUniqueShareId(): string {
  const timestamp = Date.now().toString(36);
  const randomStr = Math.random().toString(36).substring(2, 8);
  return `${timestamp}-${randomStr}`;
}

/**
 * Get a shared resource by its share ID
 * Also handles updating access count and checking validity
 */
export async function getSharedResourceByShareId(
  shareId: string,
  password?: string,
  userEmail?: string
): Promise<any> {
  const sharedResourcesCollection = await getSharedResourcesCollection();
  
  const share = await sharedResourcesCollection.findOne({ shareId });
  
  if (!share) {
    throw new Error('Shared resource not found');
  }
  
  // Check if the share has expired
  const now = new Date();
  if (share.expiresAt < now) {
    throw new Error('This shared link has expired');
  }
  
  // Check access restrictions for unlisted resources
  if (share.visibility === 'unlisted' && share.accessRestrictions) {
    // Check password if required
    if (share.accessRestrictions.requirePassword) {
      if (!password || password !== share.accessRestrictions.passwordHash) {
        throw new Error('Invalid password for this shared resource');
      }
    }
    
    // Check email restriction if present
    if (share.accessRestrictions.allowedEmails && share.accessRestrictions.allowedEmails.length > 0) {
      if (!userEmail || !share.accessRestrictions.allowedEmails.includes(userEmail)) {
        throw new Error('You do not have permission to view this shared resource');
      }
    }
    
    // Check max accesses
    if (share.accessRestrictions.maxAccesses && share.accessCount >= share.accessRestrictions.maxAccesses) {
      throw new Error('This shared resource has reached its maximum number of views');
    }
  }
  
  // Update access count and last accessed time
  await sharedResourcesCollection.updateOne(
    { _id: share._id },
    { 
      $inc: { accessCount: 1 },
      $set: { lastAccessedAt: now }
    }
  );
  
  // Get the actual resource data
  const resourceCollection = await getResourceCollection(share.resourceType);
  const resource = await resourceCollection.findOne({ _id: share.resourceId });
  
  if (!resource) {
    throw new Error('The referenced resource no longer exists');
  }
  
  return {
    resource,
    resourceType: share.resourceType,
    share: {
      ...share,
      accessCount: share.accessCount + 1,
      lastAccessedAt: now
    }
  };
}

/**
 * Check if a shared resource is still valid
 */
export async function isSharedResourceValid(shareId: string): Promise<boolean> {
  try {
    const sharedResourcesCollection = await getSharedResourcesCollection();
    const share = await sharedResourcesCollection.findOne({ shareId });
    
    if (!share) {
      return false;
    }
    
    // Check expiration
    const now = new Date();
    if (share.expiresAt < now) {
      return false;
    }
    
    // Check max accesses for unlisted resources
    if (share.visibility === 'unlisted' && 
        share.accessRestrictions?.maxAccesses && 
        share.accessCount >= share.accessRestrictions.maxAccesses) {
      return false;
    }
    
    return true;
  } catch (error) {
    console.error('Error checking shared resource validity:', error);
    return false;
  }
}

/**
 * Get all shared resources for a user
 */
export async function getSharedResourcesByUserId(userId: string) {
  const sharedResourcesCollection = await getSharedResourcesCollection();
  return sharedResourcesCollection.find({
    userId: new ObjectId(userId)
  }).sort({ createdAt: -1 }).toArray();
}

/**
 * Get shared resources by type for a user
 */
export async function getSharedResourcesByType(userId: string, resourceType: string) {
  const sharedResourcesCollection = await getSharedResourcesCollection();
  return sharedResourcesCollection.find({
    userId: new ObjectId(userId),
    resourceType
  }).sort({ createdAt: -1 }).toArray();
}

/**
 * Delete a shared resource link
 */
export async function deleteSharedResource(userId: string, shareId: string) {
  const sharedResourcesCollection = await getSharedResourcesCollection();
  return sharedResourcesCollection.deleteOne({
    userId: new ObjectId(userId),
    shareId
  });
}

/**
 * Update the expiration date of a shared resource
 */
export async function extendSharedResourceExpiration(
  userId: string, 
  shareId: string, 
  additionalDays: number
) {
  const sharedResourcesCollection = await getSharedResourcesCollection();
  
  // First check if the share exists and belongs to this user
  const share = await sharedResourcesCollection.findOne({
    userId: new ObjectId(userId),
    shareId
  });
  
  if (!share) {
    throw new Error('Shared resource not found or does not belong to this user');
  }
  
  // Calculate new expiration date
  const newExpiresAt = new Date(share.expiresAt);
  newExpiresAt.setDate(newExpiresAt.getDate() + additionalDays);
  
  // Update the expiration date
  return sharedResourcesCollection.updateOne(
    { _id: share._id },
    { $set: { expiresAt: newExpiresAt } }
  );
}

/**
 * Get public resources
 * @param resourceType - The type of resource to fetch
 * @param limit - Number of results to return
 * @param skip - Number of results to skip (for pagination)
 * @param sortBy - Field to sort by (default: accessCount)
 * @param sortOrder - Sort order (1 for ascending, -1 for descending)
 */
export async function getPublicResources(
  resourceType?: string,
  limit: number = 20,
  skip: number = 0,
  sortBy: string = 'accessCount',
  sortOrder: number = -1
) {
  const sharedResourcesCollection = await getSharedResourcesCollection();
  
  const query: any = {
    visibility: 'public',
    expiresAt: { $gt: new Date() }
  };
  
  if (resourceType) {
    query.resourceType = resourceType;
  }
  
  const sort: any = {};
  sort[sortBy] = sortOrder;
  
  return sharedResourcesCollection.find(query)
    .sort(sort)
    .skip(skip)
    .limit(limit)
    .toArray();
}

/**
 * Search public resources
 */
export async function searchPublicResources(
  searchQuery: string,
  resourceType?: string,
  limit: number = 20,
  skip: number = 0
) {
  const sharedResourcesCollection = await getSharedResourcesCollection();
  
  const query: any = {
    visibility: 'public',
    expiresAt: { $gt: new Date() },
    $or: [
      { title: { $regex: searchQuery, $options: 'i' } },
      { description: { $regex: searchQuery, $options: 'i' } }
    ]
  };
  
  if (resourceType) {
    query.resourceType = resourceType;
  }
  
  return sharedResourcesCollection.find(query)
    .sort({ accessCount: -1 })
    .skip(skip)
    .limit(limit)
    .toArray();
}

/**
 * Update a shared resource properties (title, description, visibility, etc.)
 */
export async function updateSharedResource(
  userId: string,
  shareId: string,
  updateData: {
    title?: string,
    description?: string,
    thumbnail?: string,
    visibility?: 'public' | 'unlisted',
    ttlDays?: number,
    metadata?: any,
    accessRestrictions?: {
      requirePassword?: boolean,
      password?: string,
      allowedEmails?: string[],
      maxAccesses?: number
    }
  }
) {
  const sharedResourcesCollection = await getSharedResourcesCollection();
  
  // First check if the share exists and belongs to this user
  const share = await sharedResourcesCollection.findOne({
    userId: new ObjectId(userId),
    shareId
  });
  
  if (!share) {
    throw new Error('Shared resource not found or does not belong to this user');
  }
  
  const updateFields: any = {};
  
  // Update basic fields if provided
  if (updateData.title) updateFields.title = updateData.title;
  if (updateData.description) updateFields.description = updateData.description;
  if (updateData.thumbnail) updateFields.thumbnail = updateData.thumbnail;
  if (updateData.visibility) updateFields.visibility = updateData.visibility;
  if (updateData.metadata) updateFields.metadata = updateData.metadata;
  
  // Update expiration if ttlDays is provided
  if (updateData.ttlDays) {
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + updateData.ttlDays);
    updateFields.expiresAt = expiresAt;
  }
  
  // Update access restrictions
  if (updateData.accessRestrictions) {
    updateFields.accessRestrictions = {};
    
    if (updateData.accessRestrictions.requirePassword !== undefined) {
      updateFields.accessRestrictions.requirePassword = updateData.accessRestrictions.requirePassword;
    }
    
    if (updateData.accessRestrictions.password) {
      // In a real implementation, you'd hash the password
      updateFields.accessRestrictions.passwordHash = updateData.accessRestrictions.password;
    }
    
    if (updateData.accessRestrictions.allowedEmails) {
      updateFields.accessRestrictions.allowedEmails = updateData.accessRestrictions.allowedEmails;
    }
    
    if (updateData.accessRestrictions.maxAccesses !== undefined) {
      updateFields.accessRestrictions.maxAccesses = updateData.accessRestrictions.maxAccesses;
    }
  }
  
  return sharedResourcesCollection.updateOne(
    { _id: share._id },
    { $set: updateFields }
  );
}

// Helper functions for specific resource types
export async function shareBacktest(
  userId: string,
  backtestId: string,
  visibility: 'public' | 'unlisted',
  options: any = {}
) {
  return createShareableLink('backtest', userId, backtestId, visibility, options);
}

export async function sharePortfolio(
  userId: string,
  portfolioId: string,
  visibility: 'public' | 'unlisted',
  options: any = {}
) {
  return createShareableLink('portfolio', userId, portfolioId, visibility, options);
}

export async function shareBot(
  userId: string,
  botId: string,
  visibility: 'public' | 'unlisted',
  options: any = {}
) {
  return createShareableLink('bot', userId, botId, visibility, options);
}

export async function shareStrategy(
  userId: string,
  strategyId: string,
  visibility: 'public' | 'unlisted',
  options: any = {}
) {
  return createShareableLink('strategy', userId, strategyId, visibility, options);
}

/**
 * Create a shareable link for a backtest result
 * @param userId - User ID of the backtest owner
 * @param backtestId - ID of the backtest to share
 * @param ttlDays - Time to live in days (defaults to 30)
 * @param accessRestrictions - Optional access restrictions
 * @returns The created share document
 */
export async function createBacktestShareableLink(
  userId: string, 
  backtestId: string, 
  ttlDays: number = 30,
  accessRestrictions?: {
    requirePassword?: boolean,
    password?: string,
    allowedEmails?: string[],
    maxAccesses?: number
  }
) {
  // Verify the backtest exists and belongs to the user
  const backtestCollection = await getBacktestResultsCollection();
  const backtest = await backtestCollection.findOne({
    _id: new ObjectId(backtestId),
    userId: new ObjectId(userId)
  });
  
  if (!backtest) {
    throw new Error('Backtest not found or does not belong to this user');
  }
  
  // Create a unique share ID
  const shareId = generateUniqueShareId();
  
  const now = new Date();
  const expiresAt = new Date();
  expiresAt.setDate(expiresAt.getDate() + ttlDays);
  
  const shareData: any = {
    backtestId: new ObjectId(backtestId),
    userId: new ObjectId(userId),
    shareId,
    createdAt: now,
    expiresAt,
    accessCount: 0
  };
  
  // Add access restrictions if provided
  if (accessRestrictions) {
    shareData.accessRestrictions = {};
    
    if (accessRestrictions.requirePassword && accessRestrictions.password) {
      // In a real implementation, you'd hash the password
      // This is simplified for example purposes
      shareData.accessRestrictions.requirePassword = true;
      shareData.accessRestrictions.passwordHash = accessRestrictions.password; // Should be hashed
    }
    
    if (accessRestrictions.allowedEmails && accessRestrictions.allowedEmails.length > 0) {
      shareData.accessRestrictions.allowedEmails = accessRestrictions.allowedEmails;
    }
    
    if (accessRestrictions.maxAccesses && accessRestrictions.maxAccesses > 0) {
      shareData.accessRestrictions.maxAccesses = accessRestrictions.maxAccesses;
    }
  }
  
  const sharedBacktestsCollection = await getSharedBacktestsCollection();
  await sharedBacktestsCollection.insertOne(shareData);
  
  return {
    ...shareData,
    shareUrl: `${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/shared/backtests/${shareId}`
  };
}

/**
 * Generate a unique share ID for a backtest
 * In a real implementation, you'd use a more robust method
 */
function generateUniqueShareId(): string {
  const timestamp = Date.now().toString(36);
  const randomStr = Math.random().toString(36).substring(2, 8);
  return `${timestamp}-${randomStr}`;
}

/**
 * Get a shared backtest by its share ID
 * Also handles updating access count and checking validity
 */
export async function getSharedBacktestByShareId(
  shareId: string,
  password?: string,
  userEmail?: string
): Promise<any> {
  const sharedBacktestsCollection = await getSharedBacktestsCollection();
  
  const share = await sharedBacktestsCollection.findOne({ shareId });
  
  if (!share) {
    throw new Error('Shared backtest not found');
  }
  
  // Check if the share has expired
  const now = new Date();
  if (share.expiresAt < now) {
    throw new Error('This shared backtest has expired');
  }
  
  // Check access restrictions
  if (share.accessRestrictions) {
    // Check password if required
    if (share.accessRestrictions.requirePassword) {
      if (!password || password !== share.accessRestrictions.passwordHash) {
        throw new Error('Invalid password for this shared backtest');
      }
    }
    
    // Check email restriction if present
    if (share.accessRestrictions.allowedEmails && share.accessRestrictions.allowedEmails.length > 0) {
      if (!userEmail || !share.accessRestrictions.allowedEmails.includes(userEmail)) {
        throw new Error('You do not have permission to view this shared backtest');
      }
    }
    
    // Check max accesses
    if (share.accessRestrictions.maxAccesses && share.accessCount >= share.accessRestrictions.maxAccesses) {
      throw new Error('This shared backtest has reached its maximum number of views');
    }
  }
  
  // Update access count and last accessed time
  await sharedBacktestsCollection.updateOne(
    { _id: share._id },
    { 
      $inc: { accessCount: 1 },
      $set: { lastAccessedAt: now }
    }
  );
  
  // Get the actual backtest data
  const backtestCollection = await getBacktestResultsCollection();
  const backtest = await backtestCollection.findOne({ _id: share.backtestId });
  
  if (!backtest) {
    throw new Error('The referenced backtest no longer exists');
  }
  
  return {
    backtest,
    share: {
      ...share,
      accessCount: share.accessCount + 1,
      lastAccessedAt: now
    }
  };
}

/**
 * Check if a shared backtest is still valid
 */
export async function isSharedBacktestValid(shareId: string): Promise<boolean> {
  try {
    const sharedBacktestsCollection = await getSharedBacktestsCollection();
    const share = await sharedBacktestsCollection.findOne({ shareId });
    
    if (!share) {
      return false;
    }
    
    // Check expiration
    const now = new Date();
    if (share.expiresAt < now) {
      return false;
    }
    
    // Check max accesses
    if (share.accessRestrictions?.maxAccesses && 
        share.accessCount >= share.accessRestrictions.maxAccesses) {
      return false;
    }
    
    return true;
  } catch (error) {
    console.error('Error checking shared backtest validity:', error);
    return false;
  }
}

/**
 * Get all shared backtests for a user
 */
export async function getSharedBacktestsByUserId(userId: string) {
  const sharedBacktestsCollection = await getSharedBacktestsCollection();
  return sharedBacktestsCollection.find({
    userId: new ObjectId(userId)
  }).sort({ createdAt: -1 }).toArray();
}

/**
 * Delete a shared backtest link
 */
export async function deleteSharedBacktest(userId: string, shareId: string) {
  const sharedBacktestsCollection = await getSharedBacktestsCollection();
  return sharedBacktestsCollection.deleteOne({
    userId: new ObjectId(userId),
    shareId
  });
}

/**
 * Update the expiration date of a shared backtest
 */
export async function extendSharedBacktestExpiration(
  userId: string, 
  shareId: string, 
  additionalDays: number
) {
  const sharedBacktestsCollection = await getSharedBacktestsCollection();
  
  // First check if the share exists and belongs to this user
  const share = await sharedBacktestsCollection.findOne({
    userId: new ObjectId(userId),
    shareId
  });
  
  if (!share) {
    throw new Error('Shared backtest not found or does not belong to this user');
  }
  
  // Calculate new expiration date
  const newExpiresAt = new Date(share.expiresAt);
  newExpiresAt.setDate(newExpiresAt.getDate() + additionalDays);
  
  // Update the expiration date
  return sharedBacktestsCollection.updateOne(
    { _id: share._id },
    { $set: { expiresAt: newExpiresAt } }
  );
}