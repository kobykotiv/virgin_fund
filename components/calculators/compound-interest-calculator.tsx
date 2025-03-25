"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Slider } from "@/components/ui/slider"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts"

interface CompoundData {
  year: number
  amount: number
}

export function CompoundInterestCalculator() {
  // Initialize with safe default values
  const [principal, setPrincipal] = useState<number>(1000)
  const [rate, setRate] = useState<number>(5)
  const [time, setTime] = useState<number>(10)
  const [compoundFrequency, setCompoundFrequency] = useState<string>("annually")
  const [data, setData] = useState<CompoundData[]>([])

  const calculateCompoundInterest = () => {
    // Ensure all values are valid numbers
    const p = isNaN(principal) ? 0 : principal
    const r = isNaN(rate) ? 0 : rate / 100
    const t = isNaN(time) ? 0 : time

    // Determine compounding periods per year
    let n = 1 // default: annually
    switch (compoundFrequency) {
      case "monthly":
        n = 12
        break
      case "quarterly":
        n = 4
        break
      case "semi-annually":
        n = 2
        break
      case "daily":
        n = 365
        break
    }

    const newData: CompoundData[] = []

    for (let year = 0; year <= t; year++) {
      // A = P(1 + r/n)^(nt)
      const amount = p * Math.pow(1 + r / n, n * year)
      newData.push({
        year,
        amount: Math.round(amount),
      })
    }

    setData(newData)
  }

  // Safe rendering of chart data
  const renderChart = () => {
    // Only render chart if we have data
    if (!data || data.length === 0) {
      return <div className="text-center p-4">Calculate to see results</div>
    }

    return (
      <ResponsiveContainer width="100%" height={300}>
        <LineChart
          data={data}
          margin={{
            top: 5,
            right: 30,
            left: 20,
            bottom: 5,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="year" label={{ value: "Years", position: "insideBottomRight", offset: -10 }} />
          <YAxis
            label={{ value: "Amount ($)", angle: -90, position: "insideLeft" }}
            tickFormatter={(value) => `$${value.toLocaleString()}`}
          />
          <Tooltip formatter={(value) => [`$${Number(value).toLocaleString()}`, "Amount"]} />
          <Legend />
          <Line type="monotone" dataKey="amount" stroke="#82ca9d" activeDot={{ r: 8 }} />
        </LineChart>
      </ResponsiveContainer>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Compound Interest Calculator</CardTitle>
        <CardDescription>Calculate how your investment will grow over time with compound interest.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="principal">Principal Amount ($)</Label>
          <Input
            id="principal"
            type="number"
            value={principal}
            onChange={(e) => setPrincipal(Number(e.target.value))}
          />
        </div>

        <div className="space-y-2">
          <div className="flex justify-between">
            <Label htmlFor="rate">Annual Interest Rate (%)</Label>
            <span>{rate}%</span>
          </div>
          <Slider id="rate" min={0} max={20} step={0.1} value={[rate]} onValueChange={(value) => setRate(value[0])} />
        </div>

        <div className="space-y-2">
          <div className="flex justify-between">
            <Label htmlFor="time">Time Period (Years)</Label>
            <span>{time} years</span>
          </div>
          <Slider id="time" min={1} max={50} step={1} value={[time]} onValueChange={(value) => setTime(value[0])} />
        </div>

        <div className="space-y-2">
          <Label htmlFor="compoundFrequency">Compound Frequency</Label>
          <Select value={compoundFrequency} onValueChange={setCompoundFrequency}>
            <SelectTrigger id="compoundFrequency">
              <SelectValue placeholder="Select frequency" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="annually">Annually</SelectItem>
              <SelectItem value="semi-annually">Semi-annually</SelectItem>
              <SelectItem value="quarterly">Quarterly</SelectItem>
              <SelectItem value="monthly">Monthly</SelectItem>
              <SelectItem value="daily">Daily</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <Button onClick={calculateCompoundInterest} className="w-full">
          Calculate
        </Button>

        <div className="pt-4">{renderChart()}</div>
      </CardContent>
      <CardFooter className="text-sm text-muted-foreground">
        Note: This calculator uses the compound interest formula A = P(1 + r/n)^(nt) where P is principal, r is rate, n
        is compound frequency, and t is time in years.
      </CardFooter>
    </Card>
  )
}

