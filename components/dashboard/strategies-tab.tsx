"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ArrowRight, Plus, Trash } from "lucide-react"
import Link from "next/link"

// Sample strategy data
const predefinedStrategies = [
  {
    id: "strategy-1",
    name: "Moving Average Crossover",
    description:
      "A trend-following strategy that uses the crossover of two moving averages to generate buy and sell signals.",
    complexity: "Beginner",
    performance: "+12.5%",
    timeframe: "Daily",
    category: "Trend Following",
  },
  {
    id: "strategy-2",
    name: "RSI Divergence",
    description: "Identifies potential reversals by comparing price action with RSI indicator movements.",
    complexity: "Intermediate",
    performance: "+8.7%",
    timeframe: "4H",
    category: "Mean Reversion",
  },
  {
    id: "strategy-3",
    name: "MACD Histogram",
    description: "Uses the MACD histogram to identify momentum shifts in the market.",
    complexity: "Beginner",
    performance: "+10.2%",
    timeframe: "Daily",
    category: "Momentum",
  },
]

const customStrategies = [
  {
    id: "custom-1",
    name: "Bollinger Band Breakout",
    description: "Custom strategy that trades breakouts from Bollinger Bands with volume confirmation.",
    complexity: "Advanced",
    performance: "+15.3%",
    timeframe: "1H",
    category: "Breakout",
  },
]

export default function StrategiesTab() {
  const [activeTab, setActiveTab] = useState("predefined")

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">Trading Strategies</h2>
        <Button>
          <Plus className="mr-2 h-4 w-4" /> Create Strategy
        </Button>
      </div>

      <Tabs defaultValue="predefined" className="space-y-4" onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="predefined">Predefined Strategies</TabsTrigger>
          <TabsTrigger value="custom">My Strategies</TabsTrigger>
          <TabsTrigger value="backtest">Backtest Results</TabsTrigger>
        </TabsList>

        <TabsContent value="predefined" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {predefinedStrategies.map((strategy) => (
              <Card key={strategy.id}>
                <CardHeader>
                  <CardTitle>{strategy.name}</CardTitle>
                  <CardDescription>{strategy.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Complexity:</span>
                      <span>{strategy.complexity}</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Performance:</span>
                      <span className="text-green-600 font-medium">{strategy.performance}</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Timeframe:</span>
                      <span>{strategy.timeframe}</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Category:</span>
                      <Badge className="outline">{strategy.category}</Badge>
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="flex justify-between">
                  <Button variant="outline">Details</Button>
                  <Button>
                    Deploy <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="custom" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {customStrategies.map((strategy) => (
              <Card key={strategy.id}>
                <CardHeader>
                  <CardTitle>{strategy.name}</CardTitle>
                  <CardDescription>{strategy.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Complexity:</span>
                      <span>{strategy.complexity}</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Performance:</span>
                      <span className="text-green-600 font-medium">{strategy.performance}</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Timeframe:</span>
                      <span>{strategy.timeframe}</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Category:</span>
                      <Badge className="outline">{strategy.category}</Badge>
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="flex justify-between">
                  <Button variant="outline">Edit</Button>
                  <Button variant="destructive" size="icon">
                    <Trash className="h-4 w-4" />
                  </Button>
                </CardFooter>
              </Card>
            ))}

            {/* Create new strategy card */}
            <Card className="flex flex-col items-center justify-center p-6 border-dashed">
              <Plus className="h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium mb-2">Create New Strategy</h3>
              <p className="text-sm text-muted-foreground text-center mb-4">
                Build a custom trading strategy with our strategy builder
              </p>
              <Button asChild>
                <Link href="/strategies/builder">Get Started</Link>
              </Button>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="backtest" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Backtest Results</CardTitle>
              <CardDescription>View the performance of your strategies in historical market conditions</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground text-center py-8">
                No backtest results available. Run a backtest to see results here.
              </p>
            </CardContent>
            <CardFooter>
              <Button className="w-full" asChild>
                <Link href="/backtest">Run New Backtest</Link>
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

