import { z } from "zod";
import { Frequency } from "@/lib/strategies/dcaStrategy";

export const AssetSchema = z.object({
  symbol: z.string(),
  name: z.string(),
  market: z.string().optional(),
  price: z.number().optional(),
  change24h: z.number().optional(),
});

export const TechnicalIndicatorSchema = z.object({
  type: z.enum(["SMA", "EMA", "RSI", "MACD", "BB"]),
  parameters: z.record(z.number()),
});

export const RiskManagementSchema = z.object({
  stopLoss: z.number().min(0).max(100),
  takeProfit: z.number().min(0),
  trailingStop: z.number().min(0).max(100).optional(),
  positionSize: z.number().min(0).max(100),
});

export const DCAConfigSchema = z.object({
  frequency: z.enum([
    "daily",
    "weekly",
    "monthly",
    "quarterly",
    "yearly",
  ] as const satisfies readonly Frequency[]),
  rebalanceFrequency: z.enum(["daily", "weekly", "monthly"]).optional(),
  rebalanceThreshold: z.number().min(0).max(100).optional(),
});

export const StrategySchema = z.object({
  // Step 1: Basic Info
  name: z.string().min(1, "Strategy name is required"),
  description: z.string(),
  selectedAssets: z
    .array(AssetSchema)
    .min(1, "Select at least one asset")
    .max(10, "Maximum 10 assets allowed"),
  tickers: z.array(z.string()), // Extracted from selectedAssets for easier handling

  // Step 2: Strategy Configuration
  strategyType: z.enum(["DCA", "TRADER", "GRID"]),
  frequency: DCAConfigSchema.shape.frequency.optional(),
  rebalanceFrequency: DCAConfigSchema.shape.rebalanceFrequency,
  rebalanceThreshold: DCAConfigSchema.shape.rebalanceThreshold,
  strategyConfig: z.record(z.any()),

  // Step 3: Technical Analysis
  technicalIndicators: z.array(TechnicalIndicatorSchema).max(3).optional(),

  // Step 4: Risk Management
  riskManagement: RiskManagementSchema,
});

export type Asset = z.infer<typeof AssetSchema>;
export type TechnicalIndicator = z.infer<typeof TechnicalIndicatorSchema>;
export type RiskManagement = z.infer<typeof RiskManagementSchema>;
export type DCAConfig = z.infer<typeof DCAConfigSchema>;
export type Strategy = z.infer<typeof StrategySchema>;
