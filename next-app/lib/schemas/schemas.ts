import { z } from 'zod';

/**
 * Comprehensive Zod schemas for Trading Agent application
 * These schemas validate API requests/responses and provide type safety
 */

// User and Authentication schemas
export const UserSchema = z.object({
  id: z.string(),
  email: z.string().email().optional(),
  tenantId: z.string(),
  role: z.string(),
  name: z.string(),
  preferences: z.object({
    currency: z.string().default('USD'),
    timezone: z.string().default('UTC'),
    notifications: z.boolean().default(true),
  }),
});

export const AuthTokenSchema = z.object({
  token: z.string(),
  expiresIn: z.string(),
  user: UserSchema,
});

// Portfolio schemas
export const PositionSchema = z.object({
  symbol: z.string(),
  shares: z.number(),
  avgPrice: z.number(),
  currentPrice: z.number(),
  marketValue: z.number(),
  unrealizedPnL: z.number(),
  unrealizedPnLPercent: z.number(),
  dayChange: z.number(),
  weight: z.number(),
});

export const PortfolioSchema = z.object({
  totalValue: z.number(),
  dayChange: z.number(),
  dayChangePercent: z.number(),
  cashBalance: z.number(),
  positions: z.array(PositionSchema),
  performance: z.object({
    totalReturn: z.number(),
    totalReturnPercent: z.number(),
    yearToDate: z.number(),
    yearToDatePercent: z.number(),
  }),
});

// Trading schemas
export const TradeRequestSchema = z.object({
  symbol: z.string().min(1, 'Symbol is required'),
  side: z.enum(['buy', 'sell']),
  quantity: z.number().positive('Quantity must be positive'),
  orderType: z.enum(['market', 'limit', 'stop']).default('market'),
  price: z.number().positive().optional(),
  stopPrice: z.number().positive().optional(),
});

export const TradeSchema = z.object({
  tradeId: z.string(),
  symbol: z.string(),
  side: z.enum(['buy', 'sell']),
  quantity: z.number(),
  orderType: z.enum(['market', 'limit', 'stop']),
  price: z.number().optional(),
  executedPrice: z.number(),
  timestamp: z.string(),
  status: z.enum(['pending', 'executed', 'cancelled', 'failed']),
});

// Analysis schemas
export const AnalysisRequestSchema = z.object({
  symbol: z.string().min(1, 'Symbol is required'),
  strategy: z.enum(['momentum', 'mean_reversion', 'trend_following', 'custom']).default('momentum'),
  timeframe: z.enum(['1m', '5m', '15m', '1h', '4h', '1d']).default('1h'),
  lookback: z.number().min(1).max(1000).default(100),
  parameters: z.record(z.any()).optional(),
});

export const AnalysisResultSchema = z.object({
  symbol: z.string(),
  strategy: z.string(),
  timeframe: z.string(),
  signal: z.enum(['BUY', 'SELL', 'HOLD']),
  confidence: z.number().min(0).max(1),
  indicators: z.record(z.number()),
  risk_metrics: z.object({
    volatility: z.number(),
    sharpe_ratio: z.number(),
    max_drawdown: z.number(),
    beta: z.number(),
  }),
  recommendations: z.array(z.string()),
});

// Technical Indicators schema
export const IndicatorsSchema = z.object({
  symbol: z.string(),
  timeframe: z.string(),
  timestamp: z.string(),
  data: z.object({
    rsi: z.number(),
    sma_20: z.number(),
    sma_50: z.number(),
    ema_12: z.number(),
    ema_26: z.number(),
    macd: z.number(),
    macd_signal: z.number(),
    bollinger_upper: z.number(),
    bollinger_lower: z.number(),
    volume_sma: z.number(),
    atr: z.number(),
  }),
});

// News schema
export const NewsItemSchema = z.object({
  id: z.string(),
  headline: z.string(),
  summary: z.string(),
  source: z.string(),
  timestamp: z.string(),
  url: z.string(),
  sentiment: z.enum(['positive', 'negative', 'neutral']),
});

// Scheduler schemas
export const ScheduledJobSchema = z.object({
  id: z.string(),
  name: z.string(),
  schedule: z.string(), // Cron expression
  enabled: z.boolean(),
  nextRun: z.string().optional(),
  lastRun: z.string().optional(),
  status: z.enum(['success', 'failed', 'running']).optional(),
  created: z.string().optional(),
});

export const CreateJobSchema = z.object({
  name: z.string().min(1, 'Job name is required'),
  schedule: z.string().min(1, 'Schedule is required'),
  type: z.enum(['rebalance', 'analysis', 'report']).default('analysis'),
  parameters: z.record(z.any()).optional(),
});

// Reports schemas
export const PnLReportSchema = z.object({
  period: z.string(),
  totalPnL: z.number(),
  realizedPnL: z.number(),
  unrealizedPnL: z.number(),
  transactions: z.number(),
  winRate: z.number(),
  avgWin: z.number(),
  avgLoss: z.number(),
  maxDrawdown: z.number(),
  sharpeRatio: z.number(),
});

export const MetricsReportSchema = z.object({
  performance: z.object({
    totalReturn: z.number(),
    annualizedReturn: z.number(),
    volatility: z.number(),
    sharpeRatio: z.number(),
    maxDrawdown: z.number(),
    beta: z.number(),
  }),
  risk: z.object({
    varDaily: z.number(),
    varWeekly: z.number(),
    expectedShortfall: z.number(),
    correlation: z.number(),
  }),
  allocation: z.object({
    equity: z.number(),
    bonds: z.number(),
    cash: z.number(),
    alternatives: z.number(),
  }),
});

// Settings schemas
export const ProfileUpdateSchema = z.object({
  name: z.string().optional(),
  email: z.string().email().optional(),
  preferences: z.object({
    currency: z.string().optional(),
    timezone: z.string().optional(),
    notifications: z.boolean().optional(),
  }).optional(),
});

// Integration schemas
export const IntegrationSchema = z.object({
  id: z.string(),
  name: z.string(),
  type: z.enum(['broker', 'data', 'analysis']),
  status: z.enum(['connected', 'disconnected', 'error']),
  connectedAt: z.string().optional(),
});

export const ConnectIntegrationSchema = z.object({
  provider: z.string().min(1, 'Provider is required'),
  name: z.string().min(1, 'Name is required'),
  type: z.enum(['broker', 'data', 'analysis']),
  credentials: z.record(z.string()).optional(),
});

// Heatmap schemas
export const HeatmapSectorSchema = z.object({
  name: z.string(),
  value: z.number(),
  change: z.number(),
  color: z.string(),
});

export const HeatmapAssetSchema = z.object({
  symbol: z.string(),
  name: z.string(),
  value: z.number(),
  change: z.number(),
  size: z.enum(['small', 'medium', 'large']),
});

export const HeatmapDataSchema = z.object({
  sectors: z.array(HeatmapSectorSchema),
  assets: z.array(HeatmapAssetSchema),
});

// WebSocket message schemas
export const WSMessageSchema = z.object({
  type: z.string(),
  data: z.any().optional(),
  timestamp: z.string(),
});

export const PortfolioUpdateSchema = z.object({
  type: z.literal('portfolio_update'),
  data: PortfolioSchema,
  timestamp: z.string(),
});

export const QuoteUpdateSchema = z.object({
  type: z.literal('quote_update'),
  data: z.object({
    symbol: z.string(),
    price: z.number(),
    change: z.number(),
    changePercent: z.number(),
    volume: z.number(),
    timestamp: z.string(),
  }),
  timestamp: z.string(),
});

// Export type definitions
export type User = z.infer<typeof UserSchema>;
export type AuthToken = z.infer<typeof AuthTokenSchema>;
export type Position = z.infer<typeof PositionSchema>;
export type Portfolio = z.infer<typeof PortfolioSchema>;
export type TradeRequest = z.infer<typeof TradeRequestSchema>;
export type Trade = z.infer<typeof TradeSchema>;
export type AnalysisRequest = z.infer<typeof AnalysisRequestSchema>;
export type AnalysisResult = z.infer<typeof AnalysisResultSchema>;
export type Indicators = z.infer<typeof IndicatorsSchema>;
export type NewsItem = z.infer<typeof NewsItemSchema>;
export type ScheduledJob = z.infer<typeof ScheduledJobSchema>;
export type CreateJob = z.infer<typeof CreateJobSchema>;
export type PnLReport = z.infer<typeof PnLReportSchema>;
export type MetricsReport = z.infer<typeof MetricsReportSchema>;
export type ProfileUpdate = z.infer<typeof ProfileUpdateSchema>;
export type Integration = z.infer<typeof IntegrationSchema>;
export type ConnectIntegration = z.infer<typeof ConnectIntegrationSchema>;
export type HeatmapData = z.infer<typeof HeatmapDataSchema>;
export type WSMessage = z.infer<typeof WSMessageSchema>;
export type PortfolioUpdate = z.infer<typeof PortfolioUpdateSchema>;
export type QuoteUpdate = z.infer<typeof QuoteUpdateSchema>;