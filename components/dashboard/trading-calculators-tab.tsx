"use client"

import { useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { LeverageCalculator } from "@/components/calculators/leverage-calculator"
import { FuturesCalculator } from "@/components/calculators/futures-calculator"
import { OptionsCalculator } from "@/components/calculators/options-calculator"
import { MarginCalculator } from "@/components/calculators/margin-calculator"
import { RiskRewardCalculator } from "@/components/calculators/risk-reward-calculator"
import { PositionSizeCalculator } from "@/components/calculators/position-size-calculator"

export function TradingCalculatorsTab() {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Trading Calculators</h2>
      </div>

      <Tabs defaultValue="leverage" className="space-y-4">
        <TabsList className="w-full justify-start">
          <TabsTrigger value="leverage">Leverage</TabsTrigger>
          <TabsTrigger value="futures">Futures</TabsTrigger>
          <TabsTrigger value="options">Options</TabsTrigger>
          <TabsTrigger value="margin">Margin</TabsTrigger>
          <TabsTrigger value="position">Position Size</TabsTrigger>
          <TabsTrigger value="risk">Risk/Reward</TabsTrigger>
        </TabsList>

        <TabsContent value="leverage" className="space-y-4">
          <LeverageCalculator />
        </TabsContent>

        <TabsContent value="futures" className="space-y-4">
          <FuturesCalculator />
        </TabsContent>

        <TabsContent value="options" className="space-y-4">
          <OptionsCalculator />
        </TabsContent>

        <TabsContent value="margin" className="space-y-4">
          <MarginCalculator />
        </TabsContent>

        <TabsContent value="position" className="space-y-4">
          <PositionSizeCalculator />
        </TabsContent>

        <TabsContent value="risk" className="space-y-4">
          <RiskRewardCalculator />
        </TabsContent>
      </Tabs>
    </div>
  )
}
