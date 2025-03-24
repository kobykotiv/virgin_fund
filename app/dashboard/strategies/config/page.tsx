"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { PlusCircle, Save, ArrowLeft } from "lucide-react"

export default function StrategyConfigPage() {
  const [config, setConfig] = useState({
    strategyName: "",
    version: "1.0.0",
    indicators: {
      rsi: { period: 14, overbought: 70, oversold: 30 },
      macd: { fastPeriod: 12, slowPeriod: 26, signalPeriod: 9 },
      movingAverages: []
    },
    entryRules: [],
    exitRules: [],
    positionSizing: {
      type: "percentageEquity",
      size: 1,
      maxPositionSize: 5
    },
    riskManagement: {
      maxDrawdown: 10,
      dailyLossLimit: 1000,
      positionRiskPercent: 1
    }
  })

  const handleSubmit = async () => {
    try {
      const response = await fetch("/api/strategies/config", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(config)
      })
      
      if (!response.ok) throw new Error("Failed to save configuration")
      
      // Handle success
    } catch (error) {
      // Handle error
      console.error(error)
    }
  }

  return (
    <div className="container mx-auto py-6">
      <div className="flex items-center mb-6">
        <Button variant="ghost" className="mr-2" asChild>
          <a href="/dashboard/strategies">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Strategies
          </a>
        </Button>
        <h1 className="text-3xl font-bold">Strategy Configuration</h1>
      </div>

      <Tabs defaultValue="basic" className="space-y-4">
        <TabsList>
          <TabsTrigger value="basic">Basic Info</TabsTrigger>
          <TabsTrigger value="indicators">Indicators</TabsTrigger>
          <TabsTrigger value="rules">Trading Rules</TabsTrigger>
          <TabsTrigger value="risk">Risk Management</TabsTrigger>
        </TabsList>

        <TabsContent value="basic">
          <Card>
            <CardHeader>
              <CardTitle>Basic Information</CardTitle>
              <CardDescription>Configure the basic strategy details</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="strategyName">Strategy Name</Label>
                  <Input
                    id="strategyName"
                    value={config.strategyName}
                    onChange={(e) => setConfig({ ...config, strategyName: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="version">Version</Label>
                  <Input
                    id="version"
                    value={config.version}
                    onChange={(e) => setConfig({ ...config, version: e.target.value })}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Additional tab contents will be implemented similarly */}
      </Tabs>

      <div className="flex justify-end mt-6 space-x-2">
        <Button variant="outline">Cancel</Button>
        <Button onClick={handleSubmit}>
          <Save className="h-4 w-4 mr-2" />
          Save Configuration
        </Button>
      </div>
    </div>
  )
}
