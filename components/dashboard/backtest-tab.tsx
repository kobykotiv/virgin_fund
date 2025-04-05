"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useRouter } from "next/navigation"
import { BarChart2, ArrowRight, Calendar, DollarSign, Clock } from "lucide-react"
import { Separator } from "@/components/ui/separator"

export default function BacktestTab() {
  const router = useRouter()
  const [selectedBot, setSelectedBot] = useState<string>("")
  const [startDate, setStartDate] = useState<string>("")
  const [endDate, setEndDate] = useState<string>("")
  const [initialCapital, setInitialCapital] = useState<string>("10000")

  // Sample bot data - in a real app, this would come from an API
  const sampleBots = [
    { id: "bot1", name: "Mean Reversion Bot" },
    { id: "bot2", name: "Momentum Strategy" },
    { id: "bot3", name: "Breakout Detector" },
    { id: "bot4", name: "RSI Strategy" },
  ]

  // Sample backtest results - in a real app, this would come from an API
  const recentBacktests = [
    {
      id: "bt1",
      botName: "Mean Reversion Bot",
      date: "2023-04-01",
      pnl: "+12.4%",
      trades: 24,
      sharpe: 1.8,
    },
    {
      id: "bt2",
      botName: "Momentum Strategy",
      date: "2023-03-28",
      pnl: "-3.2%",
      trades: 18,
      sharpe: 0.7,
    },
    {
      id: "bt3",
      botName: "Breakout Detector",
      date: "2023-03-25",
      pnl: "+8.7%",
      trades: 12,
      sharpe: 1.4,
    },
  ]

  const handleQuickBacktest = () => {
    // In a real app, this would prepare parameters and navigate to the backtest page
    router.push("/backtest")
  }

  const handleViewAllBacktests = () => {
    router.push("/backtest")
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">Backtesting</h2>
        <Button onClick={handleViewAllBacktests}>
          View Full Backtesting Suite
          <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Quick Backtest</CardTitle>
            <CardDescription>Test a strategy against historical data</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="bot-select">Select Bot/Strategy</Label>
              <Select value={selectedBot} onValueChange={setSelectedBot}>
                <SelectTrigger id="bot-select">
                  <SelectValue placeholder="Select a bot" />
                </SelectTrigger>
                <SelectContent>
                  {sampleBots.map((bot) => (
                    <SelectItem key={bot.id} value={bot.id}>
                      {bot.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="start-date">Start Date</Label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="start-date"
                    type="date"
                    className="pl-10"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="end-date">End Date</Label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="end-date"
                    type="date"
                    className="pl-10"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                  />
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="initial-capital">Initial Capital</Label>
              <div className="relative">
                <DollarSign className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  id="initial-capital"
                  type="number"
                  className="pl-10"
                  value={initialCapital}
                  onChange={(e) => setInitialCapital(e.target.value)}
                />
              </div>
            </div>

            <Button onClick={handleQuickBacktest} className="w-full">
              <BarChart2 className="mr-2 h-4 w-4" />
              Run Backtest
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Recent Backtests</CardTitle>
            <CardDescription>Your most recent strategy tests</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentBacktests.map((backtest) => (
                <div key={backtest.id} className="flex items-center justify-between border-b pb-3 last:border-0">
                  <div>
                    <h4 className="font-medium">{backtest.botName}</h4>
                    <div className="flex items-center text-sm text-muted-foreground">
                      <Clock className="mr-1 h-3 w-3" />
                      {backtest.date}
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <div className={backtest.pnl.startsWith("+") ? "text-green-500" : "text-red-500"}>
                        {backtest.pnl}
                      </div>
                      <div className="text-xs text-muted-foreground">Sharpe: {backtest.sharpe}</div>
                    </div>
                    <Button variant="outline" size="sm" onClick={() => router.push(`/backtest?id=${backtest.id}`)}>
                      View
                    </Button>
                  </div>
                </div>
              ))}
            </div>

            <Separator className="my-4" />

            <div className="flex justify-between items-center">
              <div className="text-sm text-muted-foreground">
                <span className="font-medium">Pro Tip:</span> Compare multiple strategies to find the best performer
              </div>
              <Button variant="outline" size="sm" onClick={handleViewAllBacktests}>
                View All
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

