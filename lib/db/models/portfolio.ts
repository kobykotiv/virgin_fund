import mongoose from 'mongoose'
import { Portfolio } from '@/types/portfolio'

// MongoDB Schema
const portfolioSchema = new mongoose.Schema({
  id: String,
  name: String,
  focus: String,
  risk: String,
  tags: [String],
  value: Number,
  return: Number,
  returnClass: String,
  chartVariant: String,
  allocation: [{
    name: String,
    value: Number,
    color: String
  }],
  positions: [{
    id: String,
    assetType: String,
    ticker: String,
    quantity: Number,
    avgPrice: Number,
    currentPrice: Number,
    basket: mongoose.Schema.Types.Mixed,
    trades: [{
      tradeId: String,
      action: String,
      side: String,
      quantity: Number,
      price: Number,
      datetime: Date
    }]
  }]
})

// Supabase types
export type SupabasePortfolio = {
  id: string
  user_id: string
  name: string
  focus: string
  risk: string
  tags: string[]
  value: number
  return: number
  return_class: string
  chart_variant: string
  allocation: {
    name: string
    value: number
    color: string
  }[]
  positions: any[]
  created_at: string
  updated_at: string
}

export const PortfolioModel = mongoose.models.Portfolio || mongoose.model('Portfolio', portfolioSchema)
