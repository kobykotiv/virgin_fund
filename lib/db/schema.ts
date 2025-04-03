import { Schema, model, models, Model } from 'mongoose'
import type { TradingBot, Strategy, User } from '@/types'

const tradingBotSchema = new Schema<TradingBot>({
  name: { type: String, required: true },
  description: { type: String },
  createdBy: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  visibility: { type: String, enum: ['public', 'private'], default: 'private' },
  strategy: { type: Schema.Types.ObjectId, ref: 'Strategy' },
  performance: {
    winRate: Number,
    profitFactor: Number,
    sharpeRatio: Number,
  },
  metadata: Schema.Types.Mixed,
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
})

const strategySchema = new Schema<Strategy>({
  name: { type: String, required: true },
  description: { type: String },
  createdBy: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  visibility: { type: String, enum: ['public', 'private'], default: 'private' },
  rules: [{
    condition: String,
    action: String,
    parameters: Schema.Types.Mixed
  }],
  backtestResults: Schema.Types.Mixed,
  metadata: Schema.Types.Mixed,
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
})

const userSchema = new Schema<User>({
  email: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  role: { type: String, enum: ['user', 'admin', 'demo'], default: 'user' },
  hashedPassword: { type: String },
  authProvider: { type: String, enum: ['email', 'google', 'github'], required: true },
  profile: {
    avatar: String,
    timezone: { type: String, default: 'UTC' },
    language: { type: String, default: 'en' },
    preferences: {
      theme: { type: String, enum: ['light', 'dark', 'system'], default: 'system' },
      notifications: { type: Boolean, default: true },
      emailFrequency: { type: String, enum: ['daily', 'weekly', 'never'], default: 'weekly' }
    }
  },
  trading: {
    defaultStrategy: { type: Schema.Types.ObjectId, ref: 'Strategy' },
    riskLevel: { type: String, enum: ['conservative', 'moderate', 'aggressive'] },
    maxDrawdown: Number,
    tradingEnabled: { type: Boolean, default: true },
    automationEnabled: { type: Boolean, default: false }
  },
  subscription: {
    plan: { type: String, enum: ['free', 'pro', 'enterprise'], default: 'free' },
    status: { type: String, enum: ['active', 'expired', 'cancelled'], default: 'active' },
    features: [String],
    validUntil: Date,
    billingCycle: { type: String, enum: ['monthly', 'annual'] },
    price: Number,
    currency: { type: String, default: 'USD' }
  },
  usage: {
    lastLogin: Date,
    loginCount: { type: Number, default: 0 },
    totalTrades: { type: Number, default: 0 },
    tradingVolume: { type: Number, default: 0 },
    apiCallCount: { type: Number, default: 0 }
  },
  metadata: Schema.Types.Mixed
}, {
  timestamps: true
})

// Add indexes
userSchema.index({ email: 1 }, { unique: true })
userSchema.index({ 'subscription.status': 1 })
userSchema.index({ 'usage.lastLogin': 1 })

export const User = models.User || model('User', userSchema)

export const TradingBot = models.TradingBot || model('TradingBot', tradingBotSchema)
export const Strategy = models.Strategy || model('Strategy', strategySchema)
