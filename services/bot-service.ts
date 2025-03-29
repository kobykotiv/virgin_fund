import { DatabaseService } from './database-service'
import type { Bot, BotType, BotStatus } from '@/types/bot'
import type { Strategy } from '@/types/strategy'
import type { Signal } from '@/types/signal'
import type { Index } from '@/types/index'
import { Collection } from 'mongodb'

export class BotService extends DatabaseService {
  private botsCollection: Promise<Collection<Bot>>
  private signalsCollection: Promise<Collection<Signal>>
  private indexesCollection: Promise<Collection<Index>>
  private strategiesCollection: Promise<Collection<Strategy>>

  constructor() {
    super()
    this.botsCollection = this.getCollection<Bot>('bots')
    this.signalsCollection = this.getCollection<Signal>('signals')
    this.indexesCollection = this.getCollection<Index>('indexes')
    this.strategiesCollection = this.getCollection<Strategy>('strategies')
  }

  // Bot CRUD operations
  async createBot(botData: Omit<Bot, '_id' | 'createdAt' | 'updatedAt'>): Promise<Bot> {
    const now = new Date()
    const bot = {
      ...botData,
      createdAt: now,
      updatedAt: now,
    }
    
    const col = await this.botsCollection
    const result = await col.insertOne(bot)
    return { ...bot, _id: result.insertedId.toString() }
  }

  async getBots(filter: Partial<Bot> = {}): Promise<Bot[]> {
    const col = await this.botsCollection
    return col.find(filter).sort({ createdAt: -1 }).toArray()
  }

  async getBotById(botId: string): Promise<Bot | null> {
    const col = await this.botsCollection
    return col.findOne({ _id: botId })
  }

  async updateBot(botId: string, update: Partial<Bot>): Promise<Bot | null> {
    const col = await this.botsCollection
    const result = await col.findOneAndUpdate(
      { _id: botId },
      { 
        $set: { 
          ...update,
          updatedAt: new Date()
        }
      },
      { returnDocument: 'after' }
    )
    return result.value
  }

  async deleteBot(botId: string): Promise<boolean> {
    const col = await this.botsCollection
    const result = await col.deleteOne({ _id: botId })
    return result.deletedCount === 1
  }

  // Signal CRUD operations
  async createSignal(signalData: Omit<Signal, '_id' | 'timestamp'>): Promise<Signal> {
    const signal = {
      ...signalData,
      timestamp: new Date()
    }
    
    const col = await this.signalsCollection
    const result = await col.insertOne(signal)
    return { ...signal, _id: result.insertedId.toString() }
  }

  async getSignals(filter: Partial<Signal> = {}): Promise<Signal[]> {
    const col = await this.signalsCollection
    return col.find(filter).sort({ timestamp: -1 }).toArray()
  }

  async getSignalById(signalId: string): Promise<Signal | null> {
    const col = await this.signalsCollection
    return col.findOne({ _id: signalId })
  }

  async deleteSignal(signalId: string): Promise<boolean> {
    const col = await this.signalsCollection
    const result = await col.deleteOne({ _id: signalId })
    return result.deletedCount === 1
  }

  // Strategy CRUD operations
  async createStrategy(strategyData: Omit<Strategy, '_id' | 'createdAt' | 'updatedAt'>): Promise<Strategy> {
    const now = new Date()
    const strategy = {
      ...strategyData,
      createdAt: now,
      updatedAt: now,
    }
    
    const col = await this.strategiesCollection
    const result = await col.insertOne(strategy)
    return { ...strategy, _id: result.insertedId.toString() }
  }

  async getStrategies(filter: Partial<Strategy> = {}): Promise<Strategy[]> {
    const col = await this.strategiesCollection
    return col.find(filter).sort({ createdAt: -1 }).toArray()
  }

  async getStrategyById(strategyId: string): Promise<Strategy | null> {
    const col = await this.strategiesCollection
    return col.findOne({ _id: strategyId })
  }

  async updateStrategy(strategyId: string, update: Partial<Strategy>): Promise<Strategy | null> {
    const col = await this.strategiesCollection
    const result = await col.findOneAndUpdate(
      { _id: strategyId },
      { 
        $set: { 
          ...update,
          updatedAt: new Date()
        }
      },
      { returnDocument: 'after' }
    )
    return result.value
  }

  async deleteStrategy(strategyId: string): Promise<boolean> {
    const col = await this.strategiesCollection
    const result = await col.deleteOne({ _id: strategyId })
    return result.deletedCount === 1
  }

  // Index CRUD operations
  async createIndex(indexData: Omit<Index, '_id' | 'createdAt' | 'updatedAt'>): Promise<Index> {
    const now = new Date()
    const index = {
      ...indexData,
      createdAt: now,
      updatedAt: now,
    }
    
    const col = await this.indexesCollection
    const result = await col.insertOne(index)
    return { ...index, _id: result.insertedId.toString() }
  }

  async getIndexes(filter: Partial<Index> = {}): Promise<Index[]> {
    const col = await this.indexesCollection
    return col.find(filter).sort({ createdAt: -1 }).toArray()
  }

  async getIndexById(indexId: string): Promise<Index | null> {
    const col = await this.indexesCollection
    return col.findOne({ _id: indexId })
  }

  async updateIndex(indexId: string, update: Partial<Index>): Promise<Index | null> {
    const col = await this.indexesCollection
    const result = await col.findOneAndUpdate(
      { _id: indexId },
      { 
        $set: { 
          ...update,
          updatedAt: new Date()
        }
      },
      { returnDocument: 'after' }
    )
    return result.value
  }

  async deleteIndex(indexId: string): Promise<boolean> {
    const col = await this.indexesCollection
    const result = await col.deleteOne({ _id: indexId })
    return result.deletedCount === 1
  }
}

