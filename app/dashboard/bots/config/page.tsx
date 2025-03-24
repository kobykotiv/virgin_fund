"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { PlusCircle, Save, Trash } from "lucide-react"
import type { BotCondition, BotConfig, BotRule } from "@/types/bot"
import { v4 as uuidv4 } from "uuid"
import { RiskManagementForm } from "@/components/bot/risk-management-form"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@radix-ui/react-tabs"

export default function BotConfigPage() {
  const router = useRouter()
  const [config, setConfig] = useState<BotConfig>({
    name: "",
    rules: [],
    riskSettings: {
      stopLoss: {
        type: "fixed",
        value: 2,
      },
      takeProfit: {
        type: "fixed",
        targets: [{ price: 0, quantity: 100 }]
      },
      positionSizing: {
        type: "risk_based",
        value: 1,
        maxPositionSize: 5,
        maxAllocation: 20
      },
      riskPerTrade: 1,
      maxDrawdown: 10,
      maxOpenPositions: 3,
      maxDailyLoss: 5
    }
  })
  const [availableStrategies, setAvailableStrategies] = useState<Array<{ id: string; name: string }>>([])

  useEffect(() => {
    // Load available strategies
    const fetchStrategies = async () => {
      const response = await fetch("/api/strategies")
      const data = await response.json()
      setAvailableStrategies(data)
    }
    fetchStrategies()
  }, [])

  const addRule = () => {
    const newRule: BotRule = {
      id: uuidv4(),
      name: `Rule ${config.rules.length + 1}`,
      condition: {
        id: uuidv4(),
        type: "price",
        operator: "above",
        value: 0
      },
      action: {
        id: uuidv4(),
        type: "strategy"
      },
      priority: config.rules.length + 1,
      enabled: true
    }
    setConfig({ ...config, rules: [...config.rules, newRule] })
  }

  const updateRule = (id: string, updates: Partial<BotRule>) => {
    setConfig({
      ...config,
      rules: config.rules.map((rule) => (rule.id === id ? { ...rule, ...updates } : rule))
    })
  }

  const deleteRule = (id: string) => {
    setConfig({
      ...config,
      rules: config.rules.filter((rule) => rule.id !== id)
    })
  }

  const handleSubmit = async () => {
    try {
      const response = await fetch("/api/bots", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(config)
      })
      
      if (!response.ok) throw new Error("Failed to save bot configuration")
      
      router.push("/dashboard/bots")
    } catch (error) {
      console.error("Error saving bot:", error)
    }
  }

  return (
    <div className="container mx-auto py-6">
      <Tabs defaultValue="basic" className="space-y-4">
        <TabsList>
          <TabsTrigger value="basic">Basic</TabsTrigger>
          <TabsTrigger value="rules">Rules</TabsTrigger>
          <TabsTrigger value="risk">Risk Management</TabsTrigger>
        </TabsList>

        <TabsContent value="basic">
          <Card>
            <CardHeader>
              <CardTitle>Bot Configuration</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div>
                  <Label htmlFor="name">Bot Name</Label>
                  <Input
                    id="name"
                    value={config.name}
                    onChange={(e) => setConfig({ ...config, name: e.target.value })}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="rules">
          <Card>
            <CardHeader>
              <CardTitle>Trading Rules</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-medium">Trading Rules</h3>
                  <Button onClick={addRule}>
                    <PlusCircle className="h-4 w-4 mr-2" />
                    Add Rule
                  </Button>
                </div>

                {config.rules.map((rule) => (
                  <Card key={rule.id}>
                    <CardContent className="pt-6">
                      <div className="grid grid-cols-3 gap-4">
                        <div>
                          <Label>Condition</Label>
                          <Select
                            value={rule.condition.type}
                            onValueChange={(value) =>
                              updateRule(rule.id, {
                                condition: { ...rule.condition, type: value as BotCondition["type"] }
                              })
                            }
                          >
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="price">Price</SelectItem>
                              <SelectItem value="indicator">Indicator</SelectItem>
                              <SelectItem value="volume">Volume</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>

                        <div>
                          <Label>Strategy</Label>
                          <Select
                            value={rule.action.strategyId}
                            onValueChange={(value) =>
                              updateRule(rule.id, {
                                action: { ...rule.action, strategyId: value }
                              })
                            }
                          >
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              {availableStrategies.map((strategy) => (
                                <SelectItem key={strategy.id} value={strategy.id}>
                                  {strategy.name}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>

                        <div className="flex items-end">
                          <Button variant="destructive" onClick={() => deleteRule(rule.id)}>
                            <Trash className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="risk">
          <RiskManagementForm 
            value={config.riskSettings}
            onChange={(riskSettings) => setConfig({ ...config, riskSettings })}
          />
        </TabsContent>
      </Tabs>

      <div className="flex justify-end space-x-2">
        <Button variant="outline" onClick={() => router.back()}>
          Cancel
        </Button>
        <Button onClick={handleSubmit}>
          <Save className="h-4 w-4 mr-2" />
          Save Bot
        </Button>
      </div>
    </div>
  )
}
