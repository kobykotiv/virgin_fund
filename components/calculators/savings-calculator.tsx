"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Slider } from "@/components/ui/slider"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts"

interface SavingsData {
  year: number
  savings: number
}

export function SavingsCalculator() {
  // Initialize with safe default values
  const [initialAmount, setInitialAmount] = useState<number>(1000)
  const [monthlyContribution, setMonthlyContribution] = useState<number>(100)
  const [interestRate, setInterestRate] = useState<number>(5)
  const [years, setYears] = useState<number>(10)
  const [data, setData] = useState<SavingsData[]>([])

  const calculateSavings = () => {
    // Ensure all values are valid numbers
    const initial = isNaN(initialAmount) ? 0 : initialAmount
    const monthly = isNaN(monthlyContribution) ? 0 : monthlyContribution
    const rate = isNaN(interestRate) ? 0 : interestRate / 100
    const period = isNaN(years) ? 0 : years

    const newData: SavingsData[] = []

    let currentSavings = initial

    for (let year = 0; year <= period; year++) {
      newData.push({
        year,
        savings: Math.round(currentSavings),
      })

      // Calculate next year's savings
      currentSavings = currentSavings * (1 + rate) + monthly * 12
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
            label={{ value: "Savings ($)", angle: -90, position: "insideLeft" }}
            tickFormatter={(value) => `$${value.toLocaleString()}`}
          />
          <Tooltip formatter={(value) => [`$${Number(value).toLocaleString()}`, "Savings"]} />
          <Legend />
          <Line type="monotone" dataKey="savings" stroke="#8884d8" activeDot={{ r: 8 }} />
        </LineChart>
      </ResponsiveContainer>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Savings Calculator</CardTitle>
        <CardDescription>
          Calculate how your savings will grow over time with regular contributions and compound interest.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="initialAmount">Initial Amount ($)</Label>
          <Input
            id="initialAmount"
            type="number"
            value={initialAmount}
            onChange={(e) => setInitialAmount(Number(e.target.value))}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="monthlyContribution">Monthly Contribution ($)</Label>
          <Input
            id="monthlyContribution"
            type="number"
            value={monthlyContribution}
            onChange={(e) => setMonthlyContribution(Number(e.target.value))}
          />
        </div>

        <div className="space-y-2">
          <div className="flex justify-between">
            <Label htmlFor="interestRate">Annual Interest Rate (%)</Label>
            <span>{interestRate}%</span>
          </div>
          <Slider
            id="interestRate"
            min={0}
            max={20}
            step={0.1}
            value={[interestRate]}
            onValueChange={(value) => setInterestRate(value[0])}
          />
        </div>

        <div className="space-y-2">
          <div className="flex justify-between">
            <Label htmlFor="years">Time Period (Years)</Label>
            <span>{years} years</span>
          </div>
          <Slider id="years" min={1} max={50} step={1} value={[years]} onValueChange={(value) => setYears(value[0])} />
        </div>

        <Button onClick={calculateSavings} className="w-full">
          Calculate
        </Button>

        <div className="pt-4">{renderChart()}</div>
      </CardContent>
      <CardFooter className="text-sm text-muted-foreground">
        Note: This calculator assumes that interest is compounded annually and contributions are made monthly.
      </CardFooter>
    </Card>
  )
}

