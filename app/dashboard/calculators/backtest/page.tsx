"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { DatePickerWithRange } from "@/components/ui/date-range-picker"
import { Chart } from "@/components/ui/chart"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from "recharts"

export default function BacktestCalculatorPage() {
  const [startDate, setStartDate] = useState<Date>()
  const [endDate, setEndDate] = useState<Date>()
  const [selectedStrategy, setSelectedStrategy] = useState("")
  const [backtestResults, setBacktestResults] = useState(null)
  
  const runBacktest = async () => {
    try {
      const response = await fetch("/api/backtest", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          strategyId: selectedStrategy,
          startDate,
          endDate,
        }),
      })
      
      const results = await response.json()
      setBacktestResults(results)
    } catch (error) {
      console.error("Backtest failed:", error)
    }
  }

  return (
    <div className="container mx-auto py-6">
      <Card>
        <CardHeader>
          <CardTitle>Strategy Backtesting</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Strategy</Label>
              <Select value={selectedStrategy} onValueChange={setSelectedStrategy}>
                <SelectTrigger>
                  <SelectValue placeholder="Select strategy" />
                </SelectTrigger>
                <SelectContent>
                  {/* Strategy options will be populated dynamically */}
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label>Date Range</Label>
              <DatePickerWithRange 
                onChange={({ from, to }) => {
                  setStartDate(from)
                  setEndDate(to)
                }}
              />
            </div>
          </div>

          <Button onClick={runBacktest} className="w-full">
            Run Backtest
          </Button>

          {backtestResults && (
            <div className="space-y-4">
              <div className="grid grid-cols-3 gap-4">
                <Card>
                  <CardContent className="pt-6">
                    <div className="text-2xl font-bold">Total Return</div>
                    <div className="text-muted-foreground">
                      {backtestResults.totalReturn}%
                    </div>
                  </CardContent>
                </Card>
                {/* Add more metrics cards */}
              </div>

              <div className="h-[400px]">
                <Chart>
                  {/* Backtest results chart */}
                </Chart>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
