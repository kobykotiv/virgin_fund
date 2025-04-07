import { sql } from "drizzle-orm"
import { 
  pgTable, 
  serial, 
  text, 
  timestamp, 
  jsonb, 
  decimal, 
  integer,
  boolean,
  uuid,
  foreignKey
} from "drizzle-orm/pg-core"

export const bots = pgTable('bots', {
  id: uuid('id').defaultRandom().primaryKey(),
  userId: text('user_id').notNull(),
  name: text('name').notNull(),
  type: text('type').notNull(), // 'indicator' | 'grid' | 'dca' | 'basket'
  status: text('status').notNull().default('paused'),
  assets: jsonb('assets').$type<string[]>().notNull(),
  config: jsonb('config').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
  performance: jsonb('performance').notNull().default({
    totalPnL: 0,
    pnlPercentage: 0,
    totalTrades: 0,
    winRate: 0,
    lastUpdated: new Date().toISOString()
  })
})

export const positions = pgTable('positions', {
  id: uuid('id').defaultRandom().primaryKey(),
  botId: uuid('bot_id').notNull().references(() => bots.id, { onDelete: 'cascade' }),
  symbol: text('symbol').notNull(),
  entryPrice: decimal('entry_price', { precision: 18, scale: 8 }).notNull(),
  currentPrice: decimal('current_price', { precision: 18, scale: 8 }).notNull(),
  quantity: decimal('quantity', { precision: 18, scale: 8 }).notNull(),
  side: text('side').notNull(), // 'long' | 'short'
  status: text('status').notNull(), // 'open' | 'closed'
  pnl: decimal('pnl', { precision: 18, scale: 8 }),
  pnlPercentage: decimal('pnl_percentage', { precision: 10, scale: 2 }),
  openedAt: timestamp('opened_at').defaultNow().notNull(),
  closedAt: timestamp('closed_at'),
  metadata: jsonb('metadata')
})

export const trades = pgTable('trades', {
  id: uuid('id').defaultRandom().primaryKey(),
  botId: uuid('bot_id').notNull().references(() => bots.id, { onDelete: 'cascade' }),
  positionId: uuid('position_id').references(() => positions.id, { onDelete: 'set null' }),
  type: text('type').notNull(), // 'entry' | 'exit' | 'adjust'
  side: text('side').notNull(), // 'buy' | 'sell'
  symbol: text('symbol').notNull(),
  price: decimal('price', { precision: 18, scale: 8 }).notNull(),
  quantity: decimal('quantity', { precision: 18, scale: 8 }).notNull(),
  timestamp: timestamp('timestamp').defaultNow().notNull(),
  fees: decimal('fees', { precision: 10, scale: 2 }),
  slippage: decimal('slippage', { precision: 10, scale: 4 }),
  metadata: jsonb('metadata')
})

export const backtestResults = pgTable('backtest_results', {
  id: uuid('id').defaultRandom().primaryKey(),
  botId: uuid('bot_id').notNull().references(() => bots.id, { onDelete: 'cascade' }),
  startDate: timestamp('start_date').notNull(),
  endDate: timestamp('end_date').notNull(),
  initialCapital: decimal('initial_capital', { precision: 18, scale: 2 }).notNull(),
  finalCapital: decimal('final_capital', { precision: 18, scale: 2 }).notNull(),
  totalPnL: decimal('total_pnl', { precision: 18, scale: 2 }).notNull(),
  pnlPercentage: decimal('pnl_percentage', { precision: 10, scale: 2 }).notNull(),
  sharpeRatio: decimal('sharpe_ratio', { precision: 10, scale: 4 }).notNull(),
  maxDrawdown: decimal('max_drawdown', { precision: 10, scale: 2 }).notNull(),
  trades: jsonb('trades').$type<any[]>().notNull(),
  equityCurve: jsonb('equity_curve').$type<any[]>().notNull(),
  metrics: jsonb('metrics').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull()
})
