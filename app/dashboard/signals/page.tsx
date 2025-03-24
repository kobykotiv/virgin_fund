"use client"

import { CustomSignalsTab } from "@/components/dashboard/custom-signals-tab"
import { MarketSignalsTab } from "@/components/dashboard/market-signals-tab"
import { PriceAlertsTab } from "@/components/dashboard/price-alerts-tab"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useState } from "react"
import { BotConfig } from "@/types/bot"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

export default function SignalsPage() {
  const [selectedStrategy, setSelectedStrategy] = useState<Partial<BotConfig["strategy"]> | null>(null)

  const handleSelectSignal = (signal: Partial<BotConfig["strategy"]>) => {
    setSelectedStrategy(signal)
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Trading Signals</h2>
          <p className="text-muted-foreground">
            Manage and monitor your trading signals
          </p>
        </div>
      </div>

      <Tabs defaultValue="custom" className="space-y-4">
        <TabsList>
          <TabsTrigger value="custom">Custom Signals</TabsTrigger>
          <TabsTrigger value="market">Market Signals</TabsTrigger>
          <TabsTrigger value="alerts">Price Alerts</TabsTrigger>
        </TabsList>

        <TabsContent value="custom">
          <CustomSignalsTab onSelectSignal={handleSelectSignal} />
        </TabsContent>

        <TabsContent value="market">
          <MarketSignalsTab onSelectSignal={handleSelectSignal} />
        </TabsContent>

        <TabsContent value="alerts">
          <PriceAlertsTab onSelectSignal={handleSelectSignal} />
        </TabsContent>
      </Tabs>

      {selectedStrategy && (
        <Card>
          <CardHeader>
            <CardTitle>Selected Strategy</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <strong>Type:</strong> {selectedStrategy.type}
            </div>
            <div>
              <strong>Indicators:</strong>
              <ul className="list-disc pl-5">
                {selectedStrategy.indicators?.map((indicator, index) => (
                  <li key={index}>
                    {indicator.name} (Period: {indicator.period})
                  </li>
                ))}
              </ul>
            </div>
            <div className="flex gap-4">
              <Button variant="outline">Edit</Button>
              <Button variant="destructive">Delete</Button>
              <Button>Enable</Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
