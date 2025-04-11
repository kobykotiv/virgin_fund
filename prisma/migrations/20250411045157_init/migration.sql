/*
  Warnings:

  - You are about to drop the column `alpacaSecretKey` on the `User` table. All the data in the column will be lost.
  - You are about to drop the `MarketData` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Position` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Trade` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `TradingBot` table. If the table is not empty, all the data it contains will be lost.
  - Made the column `email` on table `User` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "Position" DROP CONSTRAINT "Position_botId_fkey";

-- DropForeignKey
ALTER TABLE "Trade" DROP CONSTRAINT "Trade_botId_fkey";

-- DropForeignKey
ALTER TABLE "Trade" DROP CONSTRAINT "Trade_positionId_fkey";

-- DropForeignKey
ALTER TABLE "TradingBot" DROP CONSTRAINT "TradingBot_userId_fkey";

-- AlterTable
ALTER TABLE "User" DROP COLUMN "alpacaSecretKey",
ADD COLUMN     "alpacaSecret" TEXT,
ALTER COLUMN "email" SET NOT NULL;

-- DropTable
DROP TABLE "MarketData";

-- DropTable
DROP TABLE "Position";

-- DropTable
DROP TABLE "Trade";

-- DropTable
DROP TABLE "TradingBot";
