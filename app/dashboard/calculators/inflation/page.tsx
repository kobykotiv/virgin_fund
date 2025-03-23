"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Chart } from "@/components/ui/chart"
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from "recharts"
import { Calculator, ArrowLeft, Download } from "lucide-react"

export default function InflationCalculatorPage() {
  const [amount, setAmount] = useState<string>("1000")
  const [rate, setRate] = useState<string>("3.5")
  const [years, setYears] = useState<string>("10")
  const [currency, setCurrency] = useState<string>("USD")

  // Calculate future value
  const initialAmount = Number.parseFloat(amount) || 0
  const inflationRate = Number.parseFloat(rate) || 0
  const period = Number.parseInt(years) || 0

  const futureValue = initialAmount * Math.pow(1 + inflationRate / 100, period)
  const lossValue = initialAmount - futureValue

  // Generate chart data
  const chartData = Array.from({ length: period + 1 }, (_, i) => {
    const yearValue = initialAmount * Math.pow(1 + inflationRate / 100, i)
    return {
      year: i,
      value: Number.parseFloat(yearValue.toFixed(2)),
      adjustedValue: Number.parseFloat((initialAmount / Math.pow(1 + inflationRate / 100, i)).toFixed(2)),
    }
  })

  const currencySymbol =
    {
      USD: "$",
      EUR: "€",
      GBP: "£",
      JPY: "¥",
    }[currency] || "$"

  return (
    <div className="container mx-auto py-6">
      <div className="flex items-center mb-6">
        <Button variant="ghost" className="mr-2" asChild>
          <a href="/dashboard">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Dashboard
          </a>
        </Button>
        <h1 className="text-3xl font-bold">Inflation Calculator</h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Calculator className="mr-2 h-5 w-5" />
              Inflation Calculator
            </CardTitle>
            <CardDescription>Calculate how inflation affects your money over time</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="amount">Initial Amount</Label>
              <div className="relative">
                <span className="absolute left-3 top-2.5">{currencySymbol}</span>
                <Input
                  id="amount"
                  type="number"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="pl-7"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="currency">Currency</Label>
              <Select value={currency} onValueChange={setCurrency}>
                <SelectTrigger>
                  <SelectValue placeholder="Select currency" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="USD">US Dollar (USD)</SelectItem>
                  <SelectItem value="EUR">Euro (EUR)</SelectItem>
                  <SelectItem value="GBP">British Pound (GBP)</SelectItem>
                  <SelectItem value="JPY">Japanese Yen (JPY)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="rate">Annual Inflation Rate (%)</Label>
              <Input id="rate" type="number" step="0.1" value={rate} onChange={(e) => setRate(e.target.value)} />
            </div>

            <div className="space-y-2">
              <Label htmlFor="years">Time Period (Years)</Label>
              <Input id="years" type="number" value={years} onChange={(e) => setYears(e.target.value)} />
            </div>

            <Button className="w-full">Calculate</Button>
          </CardContent>
        </Card>

        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Results</CardTitle>
            <CardDescription>The purchasing power of your money over time</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="bg-muted p-4 rounded-lg">
                <p className="text-sm text-muted-foreground">Future Value</p>
                <p className="text-2xl font-bold">
                  {currencySymbol}
                  {futureValue.toFixed(2)}
                </p>
                <p className="text-xs text-muted-foreground">After {period} years</p>
              </div>
              <div className="bg-muted p-4 rounded-lg">
                <p className="text-sm text-muted-foreground">Purchasing Power Loss</p>
                <p className="text-2xl font-bold text-red-500">
                  {currencySymbol}
                  {Math.abs(lossValue).toFixed(2)}
                </p>
                <p className="text-xs text-muted-foreground">
                  {((Math.abs(lossValue) / initialAmount) * 100).toFixed(2)}% decrease
                </p>
              </div>
            </div>

            <div className="h-[300px]">
              <Chart>
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="year" label={{ value: "Years", position: "insideBottomRight", offset: -5 }} />
                    <YAxis label={{ value: `Value (${currencySymbol})`, angle: -90, position: "insideLeft" }} />
                    <Tooltip formatter={(value) => [`${currencySymbol}${value}`, "Value"]} />
                    <Legend />
                    <Line type="monotone" dataKey="value" name="Nominal Value" stroke="#8884d8" activeDot={{ r: 8 }} />
                    <Line type="monotone" dataKey="adjustedValue" name="Purchasing Power" stroke="#82ca9d" />
                  </LineChart>
                </ResponsiveContainer>
              </Chart>
            </div>

            <div className="flex justify-end">
              <Button variant="outline">
                <Download className="mr-2 h-4 w-4" />
                Export Results
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

