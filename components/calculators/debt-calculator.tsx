"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts"

interface DebtCalculation {
  month: number
  balance: number
  interest: number
  principal: number
}

export function DebtCalculator() {
  const [balance, setBalance] = useState<number>(10000)
  const [rate, setRate] = useState<number>(18.9)
  const [payment, setPayment] = useState<number>(300)
  const [data, setData] = useState<DebtCalculation[]>([])

  const calculatePayoff = () => {
    if (!balance || !rate || !payment) return

    const monthlyRate = rate / 100 / 12
    let currentBalance = balance
    const calculations: DebtCalculation[] = []
    let month = 0

    while (currentBalance > 0 && month < 360) {
      const interestPayment = currentBalance * monthlyRate
      const principalPayment = Math.min(payment - interestPayment, currentBalance)
      currentBalance = currentBalance - principalPayment

      calculations.push({
        month,
        balance: currentBalance,
        interest: interestPayment,
        principal: principalPayment,
      })
      
      month++
    }

    setData(calculations)
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Debt Payoff Calculator</CardTitle>
        <CardDescription>Calculate how long it will take to pay off your debt</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <Label>Current Balance ($)</Label>
          <Input 
            type="number" 
            value={balance} 
            onChange={(e) => setBalance(Number(e.target.value))}
          />
        </div>
        <div className="space-y-2">
          <Label>Annual Interest Rate (%)</Label>
          <Input 
            type="number" 
            value={rate} 
            onChange={(e) => setRate(Number(e.target.value))}
          />
        </div>
        <div className="space-y-2">
          <Label>Monthly Payment ($)</Label>
          <Input 
            type="number" 
            value={payment} 
            onChange={(e) => setPayment(Number(e.target.value))}
          />
        </div>
        <Button className="w-full" onClick={calculatePayoff}>Calculate</Button>

        {data.length > 0 && (
          <div className="mt-6 space-y-4">
            <div className="rounded-lg bg-muted p-4">
              <p>Months to pay off: {data.length}</p>
              <p>Total interest paid: ${data.reduce((sum, month) => sum + month.interest, 0).toFixed(2)}</p>
            </div>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={data}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="balance" stroke="#8884d8" name="Balance" />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}
      </CardContent>
      <CardFooter className="text-sm text-muted-foreground">
        Note: This calculation assumes a fixed interest rate and consistent monthly payments.
      </CardFooter>
    </Card>
  )
}
