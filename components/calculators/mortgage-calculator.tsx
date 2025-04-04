"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from "recharts"

export function MortgageCalculator() {
  const [price, setPrice] = useState<number>(300000)
  const [downPayment, setDownPayment] = useState<number>(60000)
  const [rate, setRate] = useState<number>(4.5)
  const [term, setTerm] = useState<number>(30)
  const [results, setResults] = useState<any>(null)

  const calculateMortgage = () => {
    const principal = price - downPayment
    const monthlyRate = rate / 100 / 12
    const payments = term * 12

    const monthlyPayment = 
      (principal * monthlyRate * Math.pow(1 + monthlyRate, payments)) /
      (Math.pow(1 + monthlyRate, payments) - 1)

    const totalPayment = monthlyPayment * payments
    const totalInterest = totalPayment - principal

    setResults({
      monthlyPayment,
      totalPayment,
      totalInterest,
      pieData: [
        { name: "Principal", value: principal },
        { name: "Interest", value: totalInterest },
      ],
    })
  }

  const COLORS = ["#0088FE", "#FF8042"]

  return (
    <Card>
      <CardHeader>
        <CardTitle>Mortgage Calculator</CardTitle>
        <CardDescription>Calculate your monthly mortgage payments and total costs</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <Label>Home Price ($)</Label>
          <Input 
            type="number" 
            value={price} 
            onChange={(e) => setPrice(Number(e.target.value))}
          />
        </div>
        <div className="space-y-2">
          <Label>Down Payment ($)</Label>
          <Input 
            type="number" 
            value={downPayment} 
            onChange={(e) => setDownPayment(Number(e.target.value))}
          />
        </div>
        <div className="space-y-2">
          <Label>Interest Rate (%)</Label>
          <Input 
            type="number" 
            step="0.1"
            value={rate} 
            onChange={(e) => setRate(Number(e.target.value))}
          />
        </div>
        <div className="space-y-2">
          <Label>Loan Term (Years)</Label>
          <Select value={term.toString()} onValueChange={(value) => setTerm(Number(value))}>
            <SelectTrigger>
              <SelectValue placeholder="Select term" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="15">15 years</SelectItem>
              <SelectItem value="20">20 years</SelectItem>
              <SelectItem value="30">30 years</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <Button className="w-full" onClick={calculateMortgage}>Calculate</Button>

        {results && (
          <div className="mt-6 space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 rounded-lg bg-muted">
                <p className="text-sm font-medium">Monthly Payment</p>
                <p className="text-2xl font-bold">${results.monthlyPayment.toFixed(2)}</p>
              </div>
              <div className="p-4 rounded-lg bg-muted">
                <p className="text-sm font-medium">Total Cost</p>
                <p className="text-2xl font-bold">${results.totalPayment.toFixed(2)}</p>
              </div>
            </div>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={results.pieData}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    label
                  >
                    {results.pieData.map((entry: any, index: number) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => `$${Number(value).toFixed(2)}`} />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}
      </CardContent>
      <CardFooter className="text-sm text-muted-foreground">
        Note: This is a simplified calculation that doesn't include taxes, insurance, or PMI.
      </CardFooter>
    </Card>
  )
}
