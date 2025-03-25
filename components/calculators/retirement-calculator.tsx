"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Slider } from "@/components/ui/slider"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts"

interface RetirementData {
  age: number
  savings: number
}

export function RetirementCalculator() {
  const [currentAge, setCurrentAge] = useState<number>(30)
  const [retirementAge, setRetirementAge] = useState<number>(65)
  const [currentSavings, setCurrentSavings] = useState<number>(50000)
  const [annualContribution, setAnnualContribution] = useState<number>(6000)
  const [expectedReturn, setExpectedReturn] = useState<number>(7)
  const [data, setData] = useState<RetirementData[]>([])
  const [finalAmount, setFinalAmount] = useState<number | null>(null)

  const calculateRetirement = () => {
    if (!currentAge || !retirementAge || !currentSavings || !annualContribution || !expectedReturn) {
      return
    }

    if (currentAge >= retirementAge) {
      return
    }

    const newData: RetirementData[] = []
    let savings = currentSavings

    for (let age = currentAge; age <= retirementAge; age++) {
      newData.push({
        age,
        savings,
      })

      savings = savings * (1 + expectedReturn / 100) + annualContribution
    }

    setData(newData)
    setFinalAmount(newData[newData.length - 1]?.savings || null)
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Retirement Calculator</CardTitle>
        <CardDescription>Plan your retirement savings and see how your investments can grow over time.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="grid gap-2">
            <Label htmlFor="currentAge">Current Age</Label>
            <Input
              id="currentAge"
              type="number"
              min="18"
              max="80"
              value={currentAge || ""}
              onChange={(e) => setCurrentAge(Number(e.target.value))}
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="retirementAge">Retirement Age</Label>
            <Input
              id="retirementAge"
              type="number"
              min="40"
              max="90"
              value={retirementAge || ""}
              onChange={(e) => setRetirementAge(Number(e.target.value))}
            />
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div className="grid gap-2">
            <Label htmlFor="currentSavings">Current Savings ($)</Label>
            <Input
              id="currentSavings"
              type="number"
              min="0"
              value={currentSavings || ""}
              onChange={(e) => setCurrentSavings(Number(e.target.value))}
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="annualContribution">Annual Contribution ($)</Label>
            <Input
              id="annualContribution"
              type="number"
              min="0"
              value={annualContribution || ""}
              onChange={(e) => setAnnualContribution(Number(e.target.value))}
            />
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex justify-between">
            <Label htmlFor="expectedReturn">Expected Annual Return (%)</Label>
            <span>{expectedReturn}%</span>
          </div>
          <Slider
            id="expectedReturn"
            min={1}
            max={12}
            step={0.5}
            value={[expectedReturn]}
            onValueChange={(value) => setExpectedReturn(value[0])}
          />
        </div>

        <Button onClick={calculateRetirement} className="w-full">
          Calculate
        </Button>

        {finalAmount !== null && (
          <div className="mt-6 space-y-4">
            <div className="rounded-lg bg-muted p-4">
              <h3 className="font-medium">Results</h3>
              <p className="mt-2">
                At age {retirementAge}, your retirement savings could be worth approximately ${finalAmount.toFixed(2)}.
              </p>
              <p className="mt-2">
                That's {(finalAmount / (currentSavings + annualContribution * (retirementAge - currentAge))).toFixed(2)}
                x your total contributions.
              </p>
            </div>

            {data && data.length > 0 && (
              <div className="h-80 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="age" label={{ value: "Age", position: "insideBottomRight", offset: -10 }} />
                    <YAxis label={{ value: "Savings ($)", angle: -90, position: "insideLeft" }} />
                    <Tooltip
                      formatter={(value: number) => [`$${value.toFixed(2)}`, "Savings"]}
                      labelFormatter={(label) => `Age: ${label}`}
                    />
                    <Legend />
                    <Line
                      type="monotone"
                      dataKey="savings"
                      name="Retirement Savings"
                      stroke="#8884d8"
                      activeDot={{ r: 8 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            )}
          </div>
        )}
      </CardContent>
      <CardFooter className="text-sm text-muted-foreground">
        Note: This calculator assumes a constant rate of return and does not account for inflation or taxes.
      </CardFooter>
    </Card>
  )
}

