"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts"

interface InflationData {
  year: number
  value: number
  originalValue: number
}

export function InflationCalculator() {
  const [amount, setAmount] = useState<number>(1000)
  const [rate, setRate] = useState<number>(3)
  const [years, setYears] = useState<number>(10)
  const [data, setData] = useState<InflationData[]>([])
  const [futureValue, setFutureValue] = useState<number | null>(null)

  const calculateInflation = () => {
    if (!amount || !rate || !years || amount <= 0 || rate <= 0 || years <= 0) {
      return
    }

    const newData: InflationData[] = []
    let currentValue = amount

    for (let i = 0; i <= years; i++) {
      newData.push({
        year: new Date().getFullYear() + i,
        value: currentValue,
        originalValue: amount,
      })
      currentValue = currentValue * (1 + rate / 100)
    }

    setData(newData)
    setFutureValue(newData[newData.length - 1]?.value || null)
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Inflation Calculator</CardTitle>
        <CardDescription>See how inflation affects your purchasing power over time.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <div className="grid gap-2">
            <Label htmlFor="amount">Current Amount ($)</Label>
            <Input
              id="amount"
              type="number"
              min="1"
              value={amount || ""}
              onChange={(e) => setAmount(Number(e.target.value))}
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="rate">Inflation Rate (%)</Label>
            <Input
              id="rate"
              type="number"
              min="0.1"
              step="0.1"
              value={rate || ""}
              onChange={(e) => setRate(Number(e.target.value))}
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="years">Number of Years</Label>
            <Input
              id="years"
              type="number"
              min="1"
              max="50"
              value={years || ""}
              onChange={(e) => setYears(Number(e.target.value))}
            />
          </div>
        </div>

        <Button onClick={calculateInflation} className="w-full">
          Calculate
        </Button>

        {futureValue !== null && (
          <div className="mt-6 space-y-4">
            <div className="rounded-lg bg-muted p-4">
              <h3 className="font-medium">Results</h3>
              <p className="mt-2">
                ${amount.toFixed(2)} today will be worth approximately ${futureValue.toFixed(2)} in {years} years with
                an annual inflation rate of {rate}%.
              </p>
              <p className="mt-2">
                That's a {((futureValue / amount - 1) * 100).toFixed(2)}% decrease in purchasing power.
              </p>
            </div>

            {data && data.length > 0 && (
              <div className="h-80 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="year" label={{ value: "Year", position: "insideBottomRight", offset: -10 }} />
                    <YAxis label={{ value: "Value ($)", angle: -90, position: "insideLeft" }} />
                    <Tooltip
                      formatter={(value: number) => [`$${value.toFixed(2)}`, "Value"]}
                      labelFormatter={(label) => `Year: ${label}`}
                    />
                    <Legend />
                    <Line type="monotone" dataKey="value" name="Future Value" stroke="#8884d8" activeDot={{ r: 8 }} />
                    <Line type="monotone" dataKey="originalValue" name="Original Value" stroke="#82ca9d" />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            )}
          </div>
        )}
      </CardContent>
      <CardFooter className="text-sm text-muted-foreground">
        Note: This calculator assumes a constant inflation rate over the entire period.
      </CardFooter>
    </Card>
  )
}

