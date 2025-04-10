-- AlterTable
ALTER TABLE "MarketData" ADD COLUMN     "historicalVolatility" DOUBLE PRECISION,
ADD COLUMN     "impliedVolatility" DOUBLE PRECISION,
ADD COLUMN     "volatilityUpdatedAt" TIMESTAMP(3);

-- AlterTable
ALTER TABLE "Position" ADD COLUMN     "currentVolatility" DOUBLE PRECISION,
ADD COLUMN     "entryVolatility" DOUBLE PRECISION;

-- AlterTable
ALTER TABLE "Trade" ADD COLUMN     "volatility" DOUBLE PRECISION,
ADD COLUMN     "volatilityAdjustment" DOUBLE PRECISION;

-- AlterTable
ALTER TABLE "TradingBot" ADD COLUMN     "executionHistory" JSONB[],
ADD COLUMN     "lastVolatilityCheck" TIMESTAMP(3),
ADD COLUMN     "volatilityMetrics" JSONB;
