-- Create enum for bot state
CREATE TYPE "BotState" AS ENUM ('idle', 'running', 'error', 'paused');

-- Enhance the Bot model
ALTER TABLE "Bot" 
  ADD COLUMN "status" JSONB DEFAULT '{"state": "idle", "lastUpdate": null}'::jsonb,
  ADD COLUMN "lastExecuted" TIMESTAMP(3);

-- Create Trade model
CREATE TABLE "Trade" (
  "id" TEXT NOT NULL,
  "botId" TEXT NOT NULL,
  "symbol" TEXT NOT NULL,
  "side" TEXT NOT NULL,
  "quantity" DOUBLE PRECISION NOT NULL,
  "price" DOUBLE PRECISION NOT NULL,
  "timestamp" TIMESTAMP(3) NOT NULL,
  "status" TEXT NOT NULL,
  "profitLoss" DOUBLE PRECISION,
  "commission" DOUBLE PRECISION,
  "orderId" TEXT,
  "notes" TEXT,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,

  CONSTRAINT "Trade_pkey" PRIMARY KEY ("id")
);

-- Create Order model
CREATE TABLE "Order" (
  "id" TEXT NOT NULL,
  "botId" TEXT NOT NULL,
  "externalId" TEXT,
  "symbol" TEXT NOT NULL,
  "side" TEXT NOT NULL,
  "type" TEXT NOT NULL,
  "quantity" DOUBLE PRECISION NOT NULL,
  "price" DOUBLE PRECISION,
  "status" TEXT NOT NULL,
  "filledQty" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "avgPrice" DOUBLE PRECISION,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  "expiresAt" TIMESTAMP(3),

  CONSTRAINT "Order_pkey" PRIMARY KEY ("id")
);

-- Create TradingAccount model
CREATE TABLE "TradingAccount" (
  "id" TEXT NOT NULL,
  "userId" TEXT NOT NULL,
  "provider" TEXT NOT NULL,
  "accountId" TEXT NOT NULL,
  "name" TEXT,
  "status" TEXT NOT NULL DEFAULT 'active',
  "balance" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "currency" TEXT NOT NULL DEFAULT 'USD',
  "lastSynced" TIMESTAMP(3),
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,

  CONSTRAINT "TradingAccount_pkey" PRIMARY KEY ("id"),
  CONSTRAINT "TradingAccount_userId_provider_accountId_key" UNIQUE ("userId", "provider", "accountId")
);

-- Create ApiKey model
CREATE TABLE "ApiKey" (
  "id" TEXT NOT NULL,
  "userId" TEXT NOT NULL,
  "provider" TEXT NOT NULL,
  "label" TEXT,
  "keyId" TEXT NOT NULL,
  "secretKey" TEXT NOT NULL,
  "status" TEXT NOT NULL DEFAULT 'active',
  "permissions" TEXT[] DEFAULT ARRAY[]::TEXT[],
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  "lastUsed" TIMESTAMP(3),

  CONSTRAINT "ApiKey_pkey" PRIMARY KEY ("id")
);

-- Add foreign key constraints
ALTER TABLE "Trade" ADD CONSTRAINT "Trade_botId_fkey" FOREIGN KEY ("botId") REFERENCES "Bot"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "Trade" ADD CONSTRAINT "Trade_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "Order"("id") ON DELETE SET NULL ON UPDATE CASCADE;

ALTER TABLE "Order" ADD CONSTRAINT "Order_botId_fkey" FOREIGN KEY ("botId") REFERENCES "Bot"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "TradingAccount" ADD CONSTRAINT "TradingAccount_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "ApiKey" ADD CONSTRAINT "ApiKey_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- Add indexes for better query performance
CREATE INDEX "Trade_botId_idx" ON "Trade"("botId");
CREATE INDEX "Trade_symbol_idx" ON "Trade"("symbol");
CREATE INDEX "Trade_timestamp_idx" ON "Trade"("timestamp");

CREATE INDEX "Order_botId_idx" ON "Order"("botId");
CREATE INDEX "Order_symbol_idx" ON "Order"("symbol");
CREATE INDEX "Order_status_idx" ON "Order"("status");

CREATE INDEX "TradingAccount_userId_idx" ON "TradingAccount"("userId");
CREATE INDEX "ApiKey_userId_idx" ON "ApiKey"("userId");
CREATE INDEX "ApiKey_provider_idx" ON "ApiKey"("provider");
