/*
  Warnings:

  - You are about to drop the column `closePrice` on the `Trade` table. All the data in the column will be lost.
  - You are about to drop the column `closedAt` on the `Trade` table. All the data in the column will be lost.
  - You are about to drop the column `pnl` on the `Trade` table. All the data in the column will be lost.
  - You are about to drop the column `status` on the `Trade` table. All the data in the column will be lost.
  - You are about to drop the column `timestamp` on the `Trade` table. All the data in the column will be lost.
  - You are about to drop the column `assets` on the `TradingBot` table. All the data in the column will be lost.
  - You are about to drop the column `lastUpdated` on the `TradingBot` table. All the data in the column will be lost.
  - You are about to drop the column `maxDrawdown` on the `TradingBot` table. All the data in the column will be lost.
  - You are about to drop the column `pnlPercentage` on the `TradingBot` table. All the data in the column will be lost.
  - You are about to drop the column `stopLoss` on the `TradingBot` table. All the data in the column will be lost.
  - You are about to drop the column `takeProfit` on the `TradingBot` table. All the data in the column will be lost.
  - You are about to drop the column `totalPnL` on the `TradingBot` table. All the data in the column will be lost.
  - You are about to drop the column `totalTrades` on the `TradingBot` table. All the data in the column will be lost.
  - You are about to drop the column `winRate` on the `TradingBot` table. All the data in the column will be lost.
  - You are about to drop the column `alpacaSecret` on the `User` table. All the data in the column will be lost.
  - You are about to drop the `Order` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `strategy` to the `TradingBot` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Order" DROP CONSTRAINT "Order_botId_fkey";

-- DropForeignKey
ALTER TABLE "Trade" DROP CONSTRAINT "Trade_botId_fkey";

-- AlterTable
ALTER TABLE "Trade" DROP COLUMN "closePrice",
DROP COLUMN "closedAt",
DROP COLUMN "pnl",
DROP COLUMN "status",
DROP COLUMN "timestamp",
ADD COLUMN     "executedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "fees" DOUBLE PRECISION,
ADD COLUMN     "orderId" TEXT,
ADD COLUMN     "positionId" TEXT;

-- AlterTable
ALTER TABLE "TradingBot" DROP COLUMN "assets",
DROP COLUMN "lastUpdated",
DROP COLUMN "maxDrawdown",
DROP COLUMN "pnlPercentage",
DROP COLUMN "stopLoss",
DROP COLUMN "takeProfit",
DROP COLUMN "totalPnL",
DROP COLUMN "totalTrades",
DROP COLUMN "winRate",
ADD COLUMN     "description" TEXT,
ADD COLUMN     "executionHistory" JSONB[] DEFAULT ARRAY[]::JSONB[],
ADD COLUMN     "lastRunAt" TIMESTAMP(3),
ADD COLUMN     "strategy" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "User" DROP COLUMN "alpacaSecret",
ADD COLUMN     "alpacaSecretKey" TEXT;

-- DropTable
DROP TABLE "Order";

-- CreateTable
CREATE TABLE "Position" (
    "id" TEXT NOT NULL,
    "symbol" TEXT NOT NULL,
    "quantity" DOUBLE PRECISION NOT NULL,
    "entryPrice" DOUBLE PRECISION NOT NULL,
    "currentPrice" DOUBLE PRECISION,
    "direction" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "openedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "closedAt" TIMESTAMP(3),
    "botId" TEXT NOT NULL,
    "pnl" DOUBLE PRECISION,

    CONSTRAINT "Position_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Position_botId_idx" ON "Position"("botId");

-- CreateIndex
CREATE INDEX "Position_symbol_idx" ON "Position"("symbol");

-- CreateIndex
CREATE INDEX "Position_status_idx" ON "Position"("status");

-- CreateIndex
CREATE INDEX "Trade_positionId_idx" ON "Trade"("positionId");

-- CreateIndex
CREATE INDEX "Trade_symbol_idx" ON "Trade"("symbol");

-- CreateIndex
CREATE INDEX "Trade_executedAt_idx" ON "Trade"("executedAt");

-- CreateIndex
CREATE INDEX "TradingBot_status_idx" ON "TradingBot"("status");

-- CreateIndex
CREATE INDEX "TradingBot_active_idx" ON "TradingBot"("active");

-- AddForeignKey
ALTER TABLE "Position" ADD CONSTRAINT "Position_botId_fkey" FOREIGN KEY ("botId") REFERENCES "TradingBot"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Trade" ADD CONSTRAINT "Trade_botId_fkey" FOREIGN KEY ("botId") REFERENCES "TradingBot"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Trade" ADD CONSTRAINT "Trade_positionId_fkey" FOREIGN KEY ("positionId") REFERENCES "Position"("id") ON DELETE SET NULL ON UPDATE CASCADE;
