"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts"

interface FeeImpactData {
  year: number;
  withFees: number;
  withoutFees: number;
  feesLost: number;
}

export function FeeImpactCalculator() {
  const [initialAmount, setInitialAmount] = useState<number>(100000)
  const [annualReturn, setAnnualReturn] = useState<number>(8)
  const [annualFees, setAnnualFees] = useState<number>(1)
  const [years, setYears] = useState<number>(30)
  const [data, setData] = useState<FeeImpactData[]>([])

  const calculateImpact = () => {
    let withFees = initialAmount
    let withoutFees = initialAmount
    const newData: FeeImpactData[] = []

    for (let year = 0; year <= years; year++) {
      withoutFees = withoutFees * (1 + annualReturn / 100)
      withFees = withFees * (1 + (annualReturn - annualFees) / 100)
      
      newData.push({
        year,
        withFees: Math.round(withFees),
        withoutFees: Math.round(withoutFees),
        feesLost: Math.round(withoutFees - withFees)
      })
    }

    setData(newData)
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Investment Fee Impact Calculator</CardTitle>
        <CardDescription>
          See how investment fees affect your long-term returns
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>Initial Investment ($)</Label>
            <Input 
              type="number" 
              value={initialAmount}
              onChange={(e) => setInitialAmount(Number(e.target.value))}
            />
          </div>
          <div className="space-y-2">
            <Label>Expected Annual Return (%)</Label>
            <Input 
              type="number" 
              value={annualReturn}
              onChange={(e) => setAnnualReturn(Number(e.target.value))}
            />
          </div>
          <div className="space-y-2">
            <Label>Annual Fees (%)</Label>
            <Input 
              type="number" 
              step="0.01"
              value={annualFees}
              onChange={(e) => setAnnualFees(Number(e.target.value))}
            />
          </div>
          <div className="space-y-2">
            <Label>Investment Period (Years)</Label>
            <Input 
              type="number"
              value={years}
              onChange={(e) => setYears(Number(e.target.value))}
            />
          </div>
        </div>

        <Button className="w-full" onClick={calculateImpact}>Calculate Impact</Button>

        {data.length > 0 && (
          <div className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 rounded-lg bg-muted">
                <p className="text-sm font-medium">Total Fees Paid</p>
                <p className="text-2xl font-bold text-red-500">
                  ${data[data.length - 1].feesLost.toLocaleString()}
                </p>
              </div>
              <div className="p-4 rounded-lg bg-muted">
                <p className="text-sm font-medium">Impact on Final Value</p>
                <p className="text-2xl font-bold">
                  -{((data[data.length - 1].feesLost / data[data.length - 1].withoutFees) * 100).toFixed(1)}%
                </p>
              </div>
            </div>

            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={data}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="year" />
                  <YAxis />
                  <Tooltip 
                    formatter={(value: number) => [`$${value.toLocaleString()}`, "Amount"]}
                  />
                  <Legend />
                  <Bar dataKey="feesLost" fill="#ef4444" name="Fees Lost" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}
      </CardContent>
      <CardFooter className="text-sm text-muted-foreground">
        Note: This calculation compounds fees annually and assumes constant returns.
      </CardFooter>
    </Card>
  )
}
