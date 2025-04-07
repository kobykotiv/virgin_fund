import mongoose, { Schema, Document } from 'mongoose'
import { NoSqlUser, DatabaseType } from './types'
import { IconUtils } from '../services/icon-utils'

export interface UserDocument extends NoSqlUser, Document {}

const userSchema = new Schema<UserDocument>({
  email: { type: String, required: true, unique: true },
  name: { type: String },
  image: { type: String },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
  preferences: { type: Schema.Types.Mixed },
  lastActive: { type: Date },
  databaseType: { type: String, default: 'nosql' }
}, {
  timestamps: true
})

// Add CRUD operations as static methods
userSchema.statics = {
  // Create
  async createUser(userData: Partial<NoSqlUser>) {
    return await this.create(userData)
  },

  // Read
  async getUsers(filter = {}) {
    return await this.find(filter)
  },

  async getUserById(id: string) {
    return await this.findById(id)
  },

  async getUserByEmail(email: string) {
    return await this.findOne({ email })
  },

  // Update
  async updateUser(id: string, updates: Partial<NoSqlUser>) {
    return await this.findByIdAndUpdate(id, updates, { new: true })
  },

  // Delete
  async deleteUser(id: string) {
    return await this.findByIdAndDelete(id)
  },

  // Advanced operations
  async findByCredentials(email: string, password: string) {
    const user = await this.findOne({ email })
    if (!user) throw new Error('Invalid login credentials')
    return user
  },

  async updateLastActive(userId: string) {
    return this.findByIdAndUpdate(userId, { lastActive: new Date() })
  },

  async bulkCreate(users: Partial<NoSqlUser>[]) {
    return await this.insertMany(users)
  }
}

// Portfolio Schema
const portfolioSchema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  name: { type: String, required: true },
  description: String,
  riskLevel: { type: String, enum: ['Low', 'Moderate', 'High', 'Very High'] },
  isDemo: { type: Boolean, default: false },
  holdings: [{
    assetId: { type: Schema.Types.ObjectId, ref: 'Asset' },
    quantity: { type: Number, required: true },
    costBasis: Number
  }]
}, { timestamps: true })

// Add advanced CRUD operations for Portfolio
portfolioSchema.statics = {
  // Basic CRUD
  async create(data: any) {
    return await this.create(data)
  },

  async findByUserId(userId: string) {
    return await this.find({ userId }).populate('holdings.assetId')
  },

  async updateHoldings(id: string, holdings: any[]) {
    return await this.findByIdAndUpdate(id, { $set: { holdings }}, { new: true })
  },

  async getPortfolioValue(id: string) {
    return this.aggregate([
      { $match: { _id: new mongoose.Types.ObjectId(id) }},
      { $unwind: '$holdings' },
      { $lookup: { from: 'assets', localField: 'holdings.assetId', foreignField: '_id', as: 'asset' }},
      { $group: { _id: '$_id', totalValue: { $sum: { $multiply: ['$holdings.quantity', { $first: '$asset.currentPrice' }]}}}}
    ])
  }
}

// Bot Schema
const botSchema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  name: { type: String, required: true },
  type: { type: String, required: true },
  status: { type: String, default: 'paused' },
  assets: [String],
  performance: {
    totalPnL: Number,
    pnlPercentage: Number,
    totalTrades: Number,
    winRate: Number,
    lastUpdated: Date
  },
  config: {
    stopLoss: Number,
    takeProfit: Number,
    maxDrawdown: Number,
    gridConfig: {
      gridSize: Number,
      upperLimit: Number,
      lowerLimit: Number,
      quantity: Number
    },
    dcaConfig: {
      interval: String,
      amount: Number
    }
  },
  strategyId: { type: Schema.Types.ObjectId, ref: 'Strategy' }
}, { timestamps: true })

// Add advanced CRUD operations for Bot
botSchema.statics = {
  // Basic CRUD
  async create(data: any) {
    return await this.create(data)
  },

  async findActiveByUserId(userId: string) {
    return await this.find({ userId, status: 'active' })
  },

  async updatePerformance(id: string, performance: any) {
    return await this.findByIdAndUpdate(id, { 
      $set: { performance, 'performance.lastUpdated': new Date() }
    }, { new: true })
  },

  async bulkUpdateStatus(ids: string[], status: string) {
    return await this.updateMany(
      { _id: { $in: ids }},
      { $set: { status }}
    )
  },

  async findByStrategy(strategyId: string) {
    return await this.find({ strategyId }).populate('strategy')
  },

  async executeStrategy(id: string) {
    const bot = await this.findById(id).populate('strategy')
    if (!bot) return null

    const positions = await PositionModel.findOpenPositions(id)
    const strategy = bot.strategy

    // Execute strategy rules based on config
    const orders = await Promise.all(strategy.config.rules.map(async rule => {
      if (await this.evaluateRule(rule, positions)) {
        return this.generateOrder(bot, rule.action)
      }
      return null
    }))

    return orders.filter(o => o)
  },

  async evaluateRule(rule: any, positions: any[]) {
    // Implement rule evaluation logic
    return true
  },

  async generateOrder(bot: any, action: string) {
    return {
      userId: bot.userId,
      botId: bot._id,
      symbol: bot.assets[0],
      side: action === 'buy' ? 'buy' : 'sell',
      type: 'market',
      quantity: 1,
      status: 'open'
    }
  },

  async validateRiskLimits(id: string) {
    const bot = await this.findById(id)
    const positions = await PositionModel.findOpenPositions(id)
    
    const totalRisk = positions.reduce((sum, pos) => sum + Math.abs(pos.pnl), 0)
    return totalRisk <= (bot.config.maxDrawdown || Infinity)
  }
}

// Order Schema
const orderSchema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  botId: { type: Schema.Types.ObjectId, ref: 'Bot' },
  symbol: { type: String, required: true },
  side: { type: String, enum: ['buy', 'sell'], required: true },
  type: { type: String, enum: ['market', 'limit'], required: true },
  quantity: { type: Number, required: true },
  price: Number,
  status: { type: String, enum: ['open', 'filled', 'canceled'], required: true },
  filledAt: Date,
  filledPrice: Number,
  filledQuantity: Number,
  alpacaOrderId: String,
  timeInForce: { type: String, enum: ['day', 'gtc', 'ioc', 'fok'], default: 'gtc' },
  extended: { type: Boolean, default: false },
  stopPrice: Number,
  stopLoss: Number,
  takeProfit: Number,
  commission: Number,
  leverage: { type: Number, default: 1 },
  exchange: String,
  class: { type: String, enum: ['stock', 'crypto', 'option'], default: 'stock' }
}, { timestamps: true })

// Add advanced CRUD operations for Order
orderSchema.statics = {
  // Basic CRUD
  async create(data: any) {
    return await this.create(data)
  },

  async findByBotId(botId: string) {
    return await this.find({ botId }).sort({ createdAt: -1 })
  },

  async findOpenOrders(userId: string) {
    return await this.find({ userId, status: 'open' })
  },

  async updateOrderStatus(id: string, status: string, fillData?: any) {
    const update: any = { status }
    if (fillData) {
      update.filledAt = new Date()
      update.filledPrice = fillData.price
      update.filledQuantity = fillData.quantity
    }
    return await this.findByIdAndUpdate(id, update, { new: true })
  },

  async executeOrder(id: string, executionPrice: number) {
    const order = await this.findById(id)
    if (!order || order.status !== 'open') return null

    // Update order status
    const updatedOrder = await this.updateOrderStatus(id, 'filled', {
      price: executionPrice,
      quantity: order.quantity
    })

    // Create or update position
    const position = await PositionModel.findOne({
      botId: order.botId,
      symbol: order.symbol,
      status: 'open'
    })

    if (position) {
      // Update existing position
      const avgPrice = (position.entryPrice * position.quantity + executionPrice * order.quantity) / 
                      (position.quantity + order.quantity)
      
      await PositionModel.findByIdAndUpdate(position._id, {
        quantity: position.quantity + order.quantity,
        entryPrice: avgPrice,
        currentPrice: executionPrice
      })
    } else {
      // Create new position
      await PositionModel.create({
        botId: order.botId,
        symbol: order.symbol,
        side: order.side === 'buy' ? 'long' : 'short',
        entryPrice: executionPrice,
        currentPrice: executionPrice,
        quantity: order.quantity
      })
    }

    return updatedOrder
  },

  async cancelStaleOrders(maxAge: number) {
    const cutoff = new Date(Date.now() - maxAge)
    return await this.updateMany(
      { 
        status: 'open',
        createdAt: { $lt: cutoff }
      },
      { $set: { status: 'canceled' }}
    )
  },

  async submitToAlpaca(id: string) {
    const order = await this.findById(id)
    if (!order) return null

    const alpacaOrder = {
      symbol: order.symbol,
      qty: order.quantity,
      side: order.side,
      type: order.type,
      time_in_force: order.timeInForce,
      extended_hours: order.extended,
      stop_price: order.stopPrice,
      stop_loss: order.stopLoss,
      take_profit: order.takeProfit,
      client_order_id: order._id.toString()
    }

    // Submit to Alpaca API
    const response = await fetch('https://paper-api.alpaca.markets/v2/orders', {
      method: 'POST',
      headers: {
        'APCA-API-KEY-ID': process.env.ALPACA_API_KEY!,
        'APCA-API-SECRET-KEY': process.env.ALPACA_API_SECRET!,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(alpacaOrder)
    })

    if (!response.ok) throw new Error('Failed to submit order to Alpaca')
    
    const alpacaResponse = await response.json()
    return this.findByIdAndUpdate(id, { 
      alpacaOrderId: alpacaResponse.id,
      status: alpacaResponse.status
    }, { new: true })
  },

  async syncAlpacaOrders() {
    const response = await fetch('https://paper-api.alpaca.markets/v2/orders', {
      headers: {
        'APCA-API-KEY-ID': process.env.ALPACA_API_KEY!,
        'APCA-API-SECRET-KEY': process.env.ALPACA_API_SECRET!
      }
    })

    if (!response.ok) throw new Error('Failed to fetch Alpaca orders')
    
    const alpacaOrders = await response.json()
    return Promise.all(alpacaOrders.map(async (alpacaOrder: any) => {
      const order = await this.findOne({ alpacaOrderId: alpacaOrder.id })
      if (!order) return null

      return this.findByIdAndUpdate(order._id, {
        status: alpacaOrder.status,
        filledQuantity: alpacaOrder.filled_qty,
        filledPrice: alpacaOrder.filled_avg_price,
        filledAt: alpacaOrder.filled_at
      }, { new: true })
    }))
  },

  async cancelOrder(id: string) {
    const order = await this.findById(id)
    if (!order?.alpacaOrderId) return null

    const response = await fetch(
      `https://paper-api.alpaca.markets/v2/orders/${order.alpacaOrderId}`,
      {
        method: 'DELETE',
        headers: {
          'APCA-API-KEY-ID': process.env.ALPACA_API_KEY!,
          'APCA-API-SECRET-KEY': process.env.ALPACA_API_SECRET!
        }
      }
    )

    if (response.ok) {
      return this.findByIdAndUpdate(id, { status: 'canceled' }, { new: true })
    }
    throw new Error('Failed to cancel Alpaca order')
  },

  async replaceOrder(id: string, updates: any) {
    const order = await this.findById(id)
    if (!order?.alpacaOrderId) return null

    const response = await fetch(
      `https://paper-api.alpaca.markets/v2/orders/${order.alpacaOrderId}`,
      {
        method: 'PATCH',
        headers: {
          'APCA-API-KEY-ID': process.env.ALPACA_API_KEY!,
          'APCA-API-SECRET-KEY': process.env.ALPACA_API_SECRET!,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(updates)
      }
    )

    if (response.ok) {
      const alpacaOrder = await response.json()
      return this.findByIdAndUpdate(id, {
        quantity: alpacaOrder.qty,
        price: alpacaOrder.limit_price,
        stopPrice: alpacaOrder.stop_price
      }, { new: true })
    }
    throw new Error('Failed to replace Alpaca order')
  }
}

// Asset Schema
const assetSchema = new Schema({
  symbol: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  type: { type: String, required: true },
  currentPrice: Number,
  lastUpdated: Date,
  // Add new fields
  marketCap: Number,
  volume24h: Number,
  change24h: Number,
  high24h: Number,
  low24h: Number,
  tradeable: { type: Boolean, default: true },
  shortable: { type: Boolean, default: false },
  marginRequired: { type: Number, default: 1 },
  tags: [String],
  sector: String,
  exchange: String
}, { timestamps: true })

assetSchema.methods.getIcon = async function(): Promise<string> {
  if (this.icon) return this.icon
  return IconUtils.generateFallbackIcon(this.symbol, this.type)
}

// Add advanced CRUD operations for Asset
assetSchema.statics = {
  // Basic CRUD
  async create(data: any) {
    return await this.create(data)
  },

  async findBySymbols(symbols: string[]) {
    return await this.find({ symbol: { $in: symbols }})
  },

  async updatePrices(updates: { symbol: string, price: number }[]) {
    const bulkOps = updates.map(({ symbol, price }) => ({
      updateOne: {
        filter: { symbol },
        update: { $set: { currentPrice: price, lastUpdated: new Date() }}
      }
    }))
    return await this.bulkWrite(bulkOps)
  },

  async findOutdatedPrices(maxAge: number) {
    const cutoff = new Date(Date.now() - maxAge)
    return await this.find({
      $or: [
        { lastUpdated: { $lt: cutoff }},
        { lastUpdated: { $exists: false }}
      ]
    })
  },

  async updateAssetIcon(id: string, icon?: string): Promise<any> {
    const asset = await this.findById(id)
    if (!asset) return null

    const iconUrl = icon || await IconUtils.getAssetIcon(asset.symbol, asset.type)
    return this.findByIdAndUpdate(id, { icon: iconUrl }, { new: true })
  },

  async getMarketStats(symbol: string) {
    const asset = await this.findOne({ symbol })
    if (!asset) return null

    return {
      price: asset.currentPrice,
      marketCap: asset.marketCap,
      volume: asset.volume24h,
      change: asset.change24h,
      high: asset.high24h,
      low: asset.low24h
    }
  },

  async updateMarketData(symbol: string, data: any) {
    return await this.findOneAndUpdate(
      { symbol },
      {
        $set: {
          currentPrice: data.price,
          marketCap: data.marketCap,
          volume24h: data.volume,
          change24h: data.change,
          high: data.high,
          low: data.low,
          lastUpdated: new Date()
        }
      },
      { new: true }
    )
  },

  async findByFilters(filters: {
    type?: string,
    exchange?: string,
    sector?: string,
    tradeable?: boolean,
    shortable?: boolean,
    tags?: string[]
  }) {
    return await this.find({
      ...(filters.type && { type: filters.type }),
      ...(filters.exchange && { exchange: filters.exchange }),
      ...(filters.sector && { sector: filters.sector }),
      ...(filters.tradeable !== undefined && { tradeable: filters.tradeable }),
      ...(filters.shortable !== undefined && { shortable: filters.shortable }),
      ...(filters.tags && { tags: { $in: filters.tags } })
    })
  },

  async getSectorPerformance() {
    return await this.aggregate([
      { $match: { sector: { $exists: true } } },
      { $group: {
        _id: '$sector',
        averageChange: { $avg: '$change24h' },
        totalVolume: { $sum: '$volume24h' },
        assetCount: { $sum: 1 }
      }},
      { $sort: { averageChange: -1 }}
    ])
  }
}

// Watchlist Schema 
const watchlistSchema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  name: { type: String, required: true },
  symbols: [{ type: String }],
  alpacaId: String
}, { timestamps: true })

// Add CRUD operations for Watchlist
watchlistSchema.statics = {
  async create(data: any) {
    return await this.create(data)  
  },

  async findByUserId(userId: string) {
    return await this.find({ userId })
  },

  async updateSymbols(id: string, symbols: string[]) {
    return await this.findByIdAndUpdate(id, 
      { $set: { symbols }},
      { new: true }
    )
  },

  async syncWithAlpaca(id: string, alpacaId: string) {
    return await this.findByIdAndUpdate(id,
      { $set: { alpacaId }},
      { new: true }
    )
  }
}

// MarketData Schema
const marketDataSchema = new Schema({
  symbol: { type: String, required: true },
  timeframe: { type: String, required: true },
  startDate: { type: Date, required: true },
  endDate: { type: Date, required: true },
  bars: [{
    t: Number,
    o: Number,
    h: Number, 
    l: Number,
    c: Number,
    v: Number
  }],
  fetchedAt: { type: Date, default: Date.now },
  expiresAt: { type: Date, required: true }
})

// Add CRUD operations for MarketData 
marketDataSchema.statics = {
  async create(data: any) {
    return await this.create(data)
  },

  async findLatestBars(symbol: string, timeframe: string, limit: number) {
    return await this.findOne({ 
      symbol,
      timeframe,
      expiresAt: { $gt: new Date() }
    }).sort({ endDate: -1 }).limit(limit)
  },

  async updateBars(id: string, newBars: any[]) {
    return await this.findByIdAndUpdate(id,
      { 
        $push: { bars: { $each: newBars }},
        $set: { fetchedAt: new Date() }
      },
      { new: true }
    )
  },

  async removeExpired() {
    return await this.deleteMany({
      expiresAt: { $lte: new Date() }
    })
  },

  async fetchFromAlpaca(symbol: string, timeframe: string, start: Date, end: Date) {
    const response = await fetch(
      `https://data.alpaca.markets/v2/stocks/${symbol}/bars?` + 
      `timeframe=${timeframe}&start=${start.toISOString()}&end=${end.toISOString()}`, {
        headers: {
          'APCA-API-KEY-ID': process.env.ALPACA_API_KEY!,
          'APCA-API-SECRET-KEY': process.env.ALPACA_API_SECRET!
        }
    })

    if (!response.ok) throw new Error('Failed to fetch market data from Alpaca')
    
    const data = await response.json()
    return this.create({
      symbol,
      timeframe,
      startDate: start,
      endDate: end,
      bars: data.bars.map((bar: any) => ({
        t: new Date(bar.t).getTime(),
        o: bar.o,
        h: bar.h,
        l: bar.l,
        c: bar.c,
        v: bar.v
      })),
      expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000) // 24h expiry
    })
  },

  async streamFromAlpaca(symbols: string[]) {
    const ws = new WebSocket('wss://stream.data.alpaca.markets/v2/iex')
    
    ws.on('open', () => {
      ws.send(JSON.stringify({
        action: 'auth',
        key: process.env.ALPACA_API_KEY!,
        secret: process.env.ALPACA_API_SECRET!
      }))

      ws.send(JSON.stringify({
        action: 'subscribe',
        trades: symbols,
        quotes: symbols,
        bars: symbols
      }))
    })

    ws.on('message', async (data) => {
      const message = JSON.parse(data.toString())
      if (message[0].T === 'b') {
        const bar = message[0]
        await this.updateBars(bar.S, [{
          t: new Date(bar.t).getTime(),
          o: bar.o,
          h: bar.h,
          l: bar.l,
          c: bar.c,
          v: bar.v
        }])
      }
    })

    return ws
  }
}

// Transaction Schema
const transactionSchema = new Schema({
  portfolioId: { type: Schema.Types.ObjectId, ref: 'Portfolio', required: true },
  assetId: { type: Schema.Types.ObjectId, ref: 'Asset', required: true },
  type: { type: String, enum: ['buy', 'sell'], required: true },
  quantity: { type: Number, required: true },
  price: { type: Number, required: true },
  timestamp: { type: Date, default: Date.now }
}, { timestamps: true })

// Add CRUD operations for Transaction
transactionSchema.statics = {
  async create(data: any) {
    return await this.create(data)
  },

  async findByPortfolio(portfolioId: string) {
    return await this.find({ portfolioId })
      .populate('assetId')
      .sort({ timestamp: -1 })
  },

  async getTradeHistory(portfolioId: string, startDate: Date, endDate: Date) {
    return await this.find({
      portfolioId,
      timestamp: { 
        $gte: startDate,
        $lte: endDate
      }
    }).sort({ timestamp: 1 })
  }
}

// Account Schema 
const accountSchema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  exchangeName: { type: String, required: true },
  accountName: { type: String, required: true },
  baseCurrency: { type: String, default: 'USD' },
  availableBalance: { type: Number, default: 0 },
  alpacaAccountId: String,
  paperTrading: { type: Boolean, default: true },
  margin: { type: Boolean, default: false },
  marginMultiplier: { type: Number, default: 1 },
  dayTradeCount: { type: Number, default: 0 },
  lastResetDate: Date,
  restrictions: [String],
  fees: {
    maker: Number,
    taker: Number,
    monthly: Number
  }
}, { timestamps: true })

// Add CRUD operations for Account
accountSchema.statics = {
  async create(data: any) {
    return await this.create(data)
  },

  async findByUserId(userId: string) {
    return await this.find({ userId })
  },

  async updateBalance(id: string, amount: number) {
    return await this.findByIdAndUpdate(id,
      { $inc: { availableBalance: amount }},
      { new: true }
    )
  },

  async getExchangeAccounts(userId: string, exchangeName: string) {
    return await this.find({ userId, exchangeName })
  },

  async syncWithAlpaca(id: string) {
    const account = await this.findById(id)
    if (!account) return null

    const response = await fetch('https://paper-api.alpaca.markets/v2/account', {
      headers: {
        'APCA-API-KEY-ID': process.env.ALPACA_API_KEY!,
        'APCA-API-SECRET-KEY': process.env.ALPACA_API_SECRET!
      }
    })

    if (!response.ok) throw new Error('Failed to fetch Alpaca account')
    
    const alpacaAccount = await response.json()
    return this.findByIdAndUpdate(id, {
      alpacaAccountId: alpacaAccount.id,
      availableBalance: alpacaAccount.cash,
      dayTradeCount: alpacaAccount.daytrade_count,
      margin: alpacaAccount.margin_enabled,
      marginMultiplier: alpacaAccount.multiplier,
      restrictions: alpacaAccount.trade_suspended_by
    }, { new: true })
  }
}

// Analytics Schema
const analyticsSchema = new Schema({
  botId: { type: Schema.Types.ObjectId, ref: 'Bot' },
  date: { type: Date, required: true },
  metrics: {
    profitLoss: Number,
    winRate: Number,
    sharpeRatio: Number,
    maxDrawdown: Number,
    volatility: Number,
    totalTrades: Number,
    successfulTrades: Number,
    failedTrades: Number,
  },
  hourlyBreakdown: [{
    hour: Number,
    trades: Number,
    winRate: Number,
    volume: Number
  }]
}, { timestamps: true })

analyticsSchema.statics = {
  async create(data: any) {
    return await this.create(data)
  },

  async findByBotId(botId: string, startDate: Date, endDate: Date) {
    return await this.find({
      botId,
      date: { $gte: startDate, $lte: endDate }
    }).sort({ date: -1 })
  },

  async getPerformanceMetrics(botId: string) {
    return await this.aggregate([
      { $match: { botId: new mongoose.Types.ObjectId(botId) }},
      { $group: {
        _id: null,
        avgProfitLoss: { $avg: '$metrics.profitLoss' },
        avgWinRate: { $avg: '$metrics.winRate' },
        totalTrades: { $sum: '$metrics.totalTrades' }
      }}
    ])
  }
}

// Position Schema
const positionSchema = new Schema({
  botId: { type: Schema.Types.ObjectId, ref: 'Bot', required: true },
  symbol: { type: String, required: true },
  side: { type: String, enum: ['long', 'short'], required: true },
  entryPrice: { type: Number, required: true },
  currentPrice: { type: Number, required: true },
  quantity: { type: Number, required: true },
  pnl: { type: Number, default: 0 },
  pnlPercentage: { type: Number, default: 0 },
  margin: { type: Number },
  status: { type: String, enum: ['open', 'closed'], default: 'open' },
  openedAt: { type: Date, default: Date.now },
  closedAt: { type: Date }
}, { timestamps: true })

positionSchema.statics = {
  async create(data: any) {
    return await this.create(data)
  },

  async findOpenPositions(botId: string) {
    return await this.find({ botId, status: 'open' })
  },

  async updatePrice(id: string, currentPrice: number) {
    const position = await this.findById(id)
    if (!position) return null

    const pnl = (currentPrice - position.entryPrice) * position.quantity
    const pnlPercentage = ((currentPrice - position.entryPrice) / position.entryPrice) * 100

    return await this.findByIdAndUpdate(id, {
      currentPrice,
      pnl,
      pnlPercentage
    }, { new: true })
  },

  async closePosition(id: string, closePrice: number) {
    const position = await this.findById(id);
    if (!position) return null;
    
    return await this.findByIdAndUpdate(id, {
      status: 'closed',
      currentPrice: closePrice,
      closedAt: new Date(),
      pnl: (closePrice - position.entryPrice) * position.quantity,
      pnlPercentage: ((closePrice - position.entryPrice) / position.entryPrice) * 100
    }, { new: true })
  }
}

// BacktestResult Schema
const backtestResultSchema = new Schema({
  botId: { type: Schema.Types.ObjectId, ref: 'Bot', required: true },
  startDate: { type: Date, required: true },
  endDate: { type: Date, required: true },
  params: Schema.Types.Mixed,
  results: {
    totalPnL: Number,
    pnlPercentage: Number,
    trades: Number,
    winRate: Number,
    sharpeRatio: Number,
    maxDrawdown: Number,
    profitFactor: Number,
    recoveryFactor: Number
  },
  trades: [{
    symbol: String,
    side: String,
    entryPrice: Number,
    exitPrice: Number,
    quantity: Number,
    pnl: Number,
    timestamp: Date
  }],
  equityCurve: [{
    timestamp: Date,
    equity: Number
  }]
}, { timestamps: true })

backtestResultSchema.statics = {
  async create(data: any) {
    return await this.create(data)
  },

  async findByBot(botId: string) {
    return await this.find({ botId }).sort({ createdAt: -1 })
  },

  async getBestResults(botId: string, metric: string = 'pnlPercentage', limit: number = 10) {
    const sortField = `results.${metric}`
    return await this.find({ botId })
      .sort({ [sortField]: -1 })
      .limit(limit)
  },

  async compareResults(botIds: string[]) {
    return await this.aggregate([
      { $match: { botId: { $in: botIds.map(id => new mongoose.Types.ObjectId(id)) }}},
      { $group: {
        _id: '$botId',
        avgPnL: { $avg: '$results.totalPnL' },
        avgWinRate: { $avg: '$results.winRate' },
        avgSharpe: { $avg: '$results.sharpeRatio' }
      }}
    ])
  }
}

// Strategy Schema
const strategySchema = new Schema({
  name: { type: String, required: true },
  type: { type: String, enum: ['indicator', 'grid', 'dca', 'basket'], required: true },
  description: String,
  config: {
    indicators: [{
      name: String,
      timeframe: String,
      params: Schema.Types.Mixed
    }],
    rules: [{
      condition: String,
      action: String,
      params: Schema.Types.Mixed
    }],
    riskManagement: {
      maxPositions: Number,
      maxDrawdown: Number,
      positionSizing: {
        type: String,
        value: Number
      }
    }
  },
  performance: {
    winRate: Number,
    profitFactor: Number,
    sharpeRatio: Number,
    maxDrawdown: Number,
    lastUpdated: Date
  }
}, { timestamps: true })

strategySchema.statics = {
  async create(data: any) {
    return await this.create(data)
  },

  async findByType(type: string) {
    return await this.find({ type })
  },

  async updateConfig(id: string, config: any) {
    return await this.findByIdAndUpdate(id, 
      { $set: { config }},
      { new: true }
    )
  },

  async getPerformanceStats(id: string) {
    const bots = await BotModel.find({ strategyId: id })
    const botIds = bots.map(bot => bot._id)

    return await BacktestResultModel.aggregate([
      { $match: { botId: { $in: botIds }}},
      { $group: {
        _id: null,
        avgPnL: { $avg: '$results.totalPnL' },
        avgWinRate: { $avg: '$results.winRate' },
        avgSharpeRatio: { $avg: '$results.sharpeRatio' },
        totalTrades: { $sum: '$results.trades' }
      }}
    ])
  },

  async optimizeParameters(id: string, paramRanges: any) {
    // Implement parameter optimization logic
    return null
  }
}

// Add CRUD operations for each model
const models = ['Portfolio', 'Bot', 'Order', 'Asset'].reduce((acc: Record<'Portfolio' | 'Bot' | 'Order' | 'Asset', mongoose.Model<any>>, modelName) => {
  const schema = {
    Portfolio: portfolioSchema,
    Bot: botSchema,
    Order: orderSchema,
    Asset: assetSchema
  }[modelName] as Schema

  schema.statics = {
    async create(data: any) {
      return await this.create(data)
    },

    async getAll(filter = {}) {
      return await this.find(filter)
    },

    async getById(id: string) {
      return await this.findById(id)
    },

    async update(id: string, updates: any) {
      return await this.findByIdAndUpdate(id, updates, { new: true })
    },

    async delete(id: string) {
      return await this.findByIdAndDelete(id)
    }
  }

  acc[modelName as 'Portfolio' | 'Bot' | 'Order' | 'Asset'] = mongoose.models[modelName] || mongoose.model(modelName, schema)
  return acc
}, {} as Record<'Portfolio' | 'Bot' | 'Order' | 'Asset', mongoose.Model<any>>)

export const {
  User: UserModel,
  Portfolio: PortfolioModel,
  Bot: BotModel,
  Order: OrderModel,
  Asset: AssetModel,
  Watchlist: WatchlistModel,
  MarketData: MarketDataModel,
  Transaction: TransactionModel,
  Account: AccountModel,
  Analytics: AnalyticsModel,
  Position: PositionModel,
  BacktestResult: BacktestResultModel,
  Strategy: StrategyModel
} = {
  User: mongoose.models.User || mongoose.model<UserDocument>('User', userSchema),
  ...models,
  Watchlist: mongoose.models.Watchlist || mongoose.model('Watchlist', watchlistSchema),
  MarketData: mongoose.models.MarketData || mongoose.model('MarketData', marketDataSchema),
  Transaction: mongoose.models.Transaction || mongoose.model('Transaction', transactionSchema),
  Account: mongoose.models.Account || mongoose.model('Account', accountSchema),
  Analytics: mongoose.models.Analytics || mongoose.model('Analytics', analyticsSchema),
  Position: mongoose.models.Position || mongoose.model('Position', positionSchema),
  BacktestResult: mongoose.models.BacktestResult || mongoose.model('BacktestResult', backtestResultSchema),
  Strategy: mongoose.models.Strategy || mongoose.model('Strategy', strategySchema)
}
