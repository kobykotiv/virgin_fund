"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Chart } from "@/components/ui/chart"
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from "recharts"
import { Calculator, TrendingUp, DollarSign } from "lucide-react"

export default function CalculatorsTab() {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Financial Calculators</h2>
      </div>

      <Tabs defaultValue="inflation" className="space-y-4">
        <TabsList>
          <TabsTrigger value="inflation">Inflation</TabsTrigger>
          <TabsTrigger value="savings">Savings</TabsTrigger>
          <TabsTrigger value="retirement">Retirement</TabsTrigger>
          <TabsTrigger value="mortgage">Mortgage</TabsTrigger>
          <TabsTrigger value="debt">Debt</TabsTrigger>
          <TabsTrigger value="fees">Investment Fees</TabsTrigger>
          <TabsTrigger value="dca">DCA</TabsTrigger>
          <TabsTrigger value="options">Options</TabsTrigger>
        </TabsList>

        <TabsContent value="inflation" className="space-y-4">
          <InflationCalculator />
        </TabsContent>

        <TabsContent value="savings" className="space-y-4">
          <SavingsCalculator />
        </TabsContent>

        <TabsContent value="retirement" className="space-y-4">
          <RetirementCalculator />
        </TabsContent>

        <TabsContent value="mortgage" className="space-y-4">
          <MortgageCalculator />
        </TabsContent>

        <TabsContent value="debt" className="space-y-4">
          <DebtCalculator />
        </TabsContent>

        <TabsContent value="fees" className="space-y-4">
          <FeeImpactCalculator />
        </TabsContent>

        <TabsContent value="dca" className="space-y-4">
          <DCACalculator />
        </TabsContent>

        <TabsContent value="options" className="space-y-4">
          <OptionPremiumCalculator />
        </TabsContent>
      </Tabs>
    </div>
  )
}

function InflationCalculator() {
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
                  <Line type="monotone" dataKey="value" stroke="#8884d8" activeDot={{ r: 8 }} />
                </LineChart>
              </ResponsiveContainer>
            </Chart>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

function SavingsCalculator() {
  const [step, setStep] = useState<number>(1)
  const [initialInvestment, setInitialInvestment] = useState<string>("10000")
  const [monthlyContribution, setMonthlyContribution] = useState<string>("500")
  const [returnRate, setReturnRate] = useState<string>("7")
  const [inflationRate, setInflationRate] = useState<string>("2.5")
  const [taxRate, setTaxRate] = useState<string>("20")
  const [years, setYears] = useState<string>("30")

  // Calculate future value
  const initial = Number.parseFloat(initialInvestment) || 0
  const monthly = Number.parseFloat(monthlyContribution) || 0
  const annualReturn = Number.parseFloat(returnRate) || 0
  const inflation = Number.parseFloat(inflationRate) || 0
  const tax = Number.parseFloat(taxRate) || 0
  const period = Number.parseInt(years) || 0

  const monthlyRate = annualReturn / 100 / 12
  const months = period * 12

  // Calculate future value with compound interest
  let futureValue = initial
  for (let i = 0; i < months; i++) {
    futureValue = futureValue * (1 + monthlyRate) + monthly
  }

  // Calculate inflation-adjusted value
  const inflationAdjustedValue = futureValue / Math.pow(1 + inflation / 100, period)

  // Calculate total contributions
  const totalContributions = initial + monthly * months

  // Calculate investment gains
  const investmentGains = futureValue - totalContributions

  // Calculate after-tax gains
  const afterTaxGains = investmentGains * (1 - tax / 100)
  const afterTaxFutureValue = totalContributions + afterTaxGains

  // Generate chart data
  const chartData = Array.from({ length: period + 1 }, (_, i) => {
    let yearValue = initial
    for (let j = 0; j < i * 12; j++) {
      yearValue = yearValue * (1 + monthlyRate) + monthly
    }

    const yearContributions = initial + monthly * i * 12
    const yearInflationAdjusted = yearValue / Math.pow(1 + inflation / 100, i)

    return {
      year: i,
      value: Number.parseFloat(yearValue.toFixed(2)),
      contributions: Number.parseFloat(yearContributions.toFixed(2)),
      inflationAdjusted: Number.parseFloat(yearInflationAdjusted.toFixed(2)),
    }
  })

  const nextStep = () => {
    if (step < 4) setStep(step + 1)
  }

  const prevStep = () => {
    if (step > 1) setStep(step - 1)
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <Card className="lg:col-span-1">
        <CardHeader>
          <CardTitle className="flex items-center">
            <TrendingUp className="mr-2 h-5 w-5" />
            Long-Term Savings Calculator
          </CardTitle>
          <CardDescription>Plan your financial future with our multi-step calculator</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex justify-between mb-4">
            {Array.from({ length: 4 }, (_, i) => (
              <div
                key={i}
                className={`w-8 h-8 rounded-full flex items-center justify-center ${
                  i + 1 === step
                    ? "bg-primary text-primary-foreground"
                    : i + 1 < step
                      ? "bg-primary/20 text-primary"
                      : "bg-muted text-muted-foreground"
                }`}
              >
                {i + 1}
              </div>
            ))}
          </div>

          {step === 1 && (
            <div className="space-y-4">
              <h3 className="font-medium">Initial Investment & Contributions</h3>

              <div className="space-y-2">
                <Label htmlFor="initialInvestment">Initial Investment ($)</Label>
                <Input
                  id="initialInvestment"
                  type="number"
                  value={initialInvestment}
                  onChange={(e) => setInitialInvestment(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="monthlyContribution">Monthly Contribution ($)</Label>
                <Input
                  id="monthlyContribution"
                  type="number"
                  value={monthlyContribution}
                  onChange={(e) => setMonthlyContribution(e.target.value)}
                />
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-4">
              <h3 className="font-medium">Investment Growth</h3>

              <div className="space-y-2">
                <Label htmlFor="returnRate">Expected Annual Return (%)</Label>
                <Input
                  id="returnRate"
                  type="number"
                  step="0.1"
                  value={returnRate}
                  onChange={(e) => setReturnRate(e.target.value)}
                />
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-4">
              <h3 className="font-medium">Inflation & Taxes</h3>

              <div className="space-y-2">
                <Label htmlFor="inflationRate">Annual Inflation Rate (%)</Label>
                <Input
                  id="inflationRate"
                  type="number"
                  step="0.1"
                  value={inflationRate}
                  onChange={(e) => setInflationRate(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="taxRate">Tax Rate on Gains (%)</Label>
                <Input id="taxRate" type="number" value={taxRate} onChange={(e) => setTaxRate(e.target.value)} />
              </div>
            </div>
          )}

          {step === 4 && (
            <div className="space-y-4">
              <h3 className="font-medium">Time Horizon</h3>

              <div className="space-y-2">
                <Label htmlFor="years">Investment Period (Years)</Label>
                <Input id="years" type="number" value={years} onChange={(e) => setYears(e.target.value)} />
              </div>
            </div>
          )}

          <div className="flex justify-between pt-4">
            <Button variant="outline" onClick={prevStep} disabled={step === 1}>
              Previous
            </Button>

            {step < 4 ? <Button onClick={nextStep}>Next</Button> : <Button>Calculate</Button>}
          </div>
        </CardContent>
      </Card>

      <Card className="lg:col-span-2">
        <CardHeader>
          <CardTitle>Savings Projection</CardTitle>
          <CardDescription>Your estimated savings growth over time</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-4">
              <div className="bg-muted p-4 rounded-lg">
                <p className="text-sm text-muted-foreground">Future Value</p>
                <p className="text-2xl font-bold">${futureValue.toFixed(2)}</p>
              </div>

              <div className="bg-muted p-4 rounded-lg">
                <p className="text-sm text-muted-foreground">Total Contributions</p>
                <p className="text-2xl font-bold">${totalContributions.toFixed(2)}</p>
              </div>
            </div>

            <div className="space-y-4">
              <div className="bg-muted p-4 rounded-lg">
                <p className="text-sm text-muted-foreground">Inflation-Adjusted Value</p>
                <p className="text-2xl font-bold">${inflationAdjustedValue.toFixed(2)}</p>
              </div>

              <div className="bg-muted p-4 rounded-lg">
                <p className="text-sm text-muted-foreground">After-Tax Future Value</p>
                <p className="text-2xl font-bold">${afterTaxFutureValue.toFixed(2)}</p>
              </div>
            </div>
          </div>

          <div className="h-[300px]">
            <Chart>
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="year" label={{ value: "Years", position: "insideBottomRight", offset: -5 }} />
                  <YAxis label={{ value: "Value ($)", angle: -90, position: "insideLeft" }} />
                  <Tooltip formatter={(value) => [`$${value}`, "Value"]} />
                  <Legend />
                  <Line type="monotone" dataKey="value" name="Future Value" stroke="#8884d8" activeDot={{ r: 8 }} />
                  <Line type="monotone" dataKey="contributions" name="Contributions" stroke="#82ca9d" />
                  <Line type="monotone" dataKey="inflationAdjusted" name="Inflation-Adjusted" stroke="#ff7300" />
                </LineChart>
              </ResponsiveContainer>
            </Chart>
          </div>

          <div className="flex justify-end space-x-2">
            <Button variant="outline">
              <DollarSign className="mr-2 h-4 w-4" />
              Export Data
            </Button>
            <Button>Save Calculation</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

