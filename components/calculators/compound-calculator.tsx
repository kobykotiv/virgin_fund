"use client"

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Slider } from '@/components/ui/slider'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend
} from 'recharts'

export function CompoundCalculator() {
  // State for calculator inputs
  const [initialInvestment, setInitialInvestment] = useState(10000)
  const [monthlyContribution, setMonthlyContribution] = useState(500)
  const [annualReturnRate, setAnnualReturnRate] = useState(8)
  const [years, setYears] = useState(10)
  const [calculatorTab, setCalculatorTab] = useState('compound')
  
  // State for calculated results
  const [results, setResults] = useState<{
    finalBalance: number;
    totalInvested: number;
    interestEarned: number;
    growthData: any[];
  }>({
    finalBalance: 0,
    totalInvested: 0,
    interestEarned: 0,
    growthData: []
  })
  
  // Calculate financial projections when inputs change
  useEffect(() => {
    if (calculatorTab === 'compound') {
      calculateCompoundInterest()
    } else {
      calculateRetirement()
    }
  }, [initialInvestment, monthlyContribution, annualReturnRate, years, calculatorTab])
  
  const calculateCompoundInterest = () => {
    let balance = initialInvestment
    let totalInvested = initialInvestment
    const growthData = [
      {
        year: 0,
        balance,
        totalInvested,
        interestEarned: 0
      }
    ]
    
    for (let year = 1; year <= years; year++) {
      // Add monthly contributions throughout the year
      for (let month = 0; month < 12; month++) {
        // Add monthly contribution
        balance += monthlyContribution
        totalInvested += monthlyContribution
        
        // Apply monthly growth rate
        const monthlyRate = annualReturnRate / 12 / 100
        balance *= (1 + monthlyRate)
      }
      
      // Record data for this year
      growthData.push({
        year,
        balance,
        totalInvested,
        interestEarned: balance - totalInvested
      })
    }
    
    setResults({
      finalBalance: balance,
      totalInvested,
      interestEarned: balance - totalInvested,
      growthData
    })
  }
  
  const calculateRetirement = () => {
    // This would be similar to the compound interest calculator
    // but with retirement-specific assumptions and calculations
    // For this example, we'll reuse the compound interest calculation
    calculateCompoundInterest()
  }
  
  // Format currency for display
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0
    }).format(value)
  }
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>Financial Calculators</CardTitle>
        <CardDescription>Plan your financial future with these interactive tools</CardDescription>
      </CardHeader>
      
      <CardContent>
        <Tabs value={calculatorTab} onValueChange={setCalculatorTab}>
          <TabsList className="mb-4">
            <TabsTrigger value="compound">Compound Interest</TabsTrigger>
            <TabsTrigger value="retirement">Retirement</TabsTrigger>
          </TabsList>
          
          <TabsContent value="compound" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <Label htmlFor="initialInvestment">Initial Investment</Label>
                    <span className="text-sm font-medium">{formatCurrency(initialInvestment)}</span>
                  </div>
                  <Slider
                    id="initialInvestment"
                    min={1000}
                    max={100000}
                    step={1000}
                    value={[initialInvestment]}
                    onValueChange={(values) => setInitialInvestment(values[0])}
                  />
                </div>
                
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <Label htmlFor="monthlyContribution">Monthly Contribution</Label>
                    <span className="text-sm font-medium">{formatCurrency(monthlyContribution)}</span>
                  </div>
                  <Slider
                    id="monthlyContribution"
                    min={0}
                    max={5000}
                    step={50}
                    value={[monthlyContribution]}
                    onValueChange={(values) => setMonthlyContribution(values[0])}
                  />
                </div>
                
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <Label htmlFor="annualReturnRate">Annual Return Rate (%)</Label>
                    <span className="text-sm font-medium">{annualReturnRate}%</span>
                  </div>
                  <Slider
                    id="annualReturnRate"
                    min={1}
                    max={20}
                    step={0.5}
                    value={[annualReturnRate]}
                    onValueChange={(values) => setAnnualReturnRate(values[0])}
                  />
                </div>
                
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <Label htmlFor="years">Investment Timeframe (years)</Label>
                    <span className="text-sm font-medium">{years} years</span>
                  </div>
                  <Slider
                    id="years"
                    min={1}
                    max={40}
                    step={1}
                    value={[years]}
                    onValueChange={(values) => setYears(values[0])}
                  />
                </div>
              </div>
              
              <div className="space-y-6">
                <div className="grid grid-cols-3 gap-4">
                  <div className="space-y-1 text-center p-4 border rounded-lg">
                    <p className="text-sm text-muted-foreground">Final Balance</p>
                    <p className="text-2xl font-bold">{formatCurrency(results.finalBalance)}</p>
                  </div>
                  <div className="space-y-1 text-center p-4 border rounded-lg">
                    <p className="text-sm text-muted-foreground">Total Invested</p>
                    <p className="text-2xl font-bold">{formatCurrency(results.totalInvested)}</p>
                  </div>
                  <div className="space-y-1 text-center p-4 border rounded-lg">
                    <p className="text-sm text-muted-foreground">Interest Earned</p>
                    <p className="text-2xl font-bold">{formatCurrency(results.interestEarned)}</p>
                  </div>
                </div>
                
                <div className="h-[250px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={results.growthData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="year" />
                      <YAxis tickFormatter={(value) => formatCurrency(value)} />
                      <Tooltip formatter={(value) => [formatCurrency(value as number), ""]} />
                      <Legend />
                      <Line
                        type="monotone"
                        dataKey="balance"
                        name="Balance"
                        stroke="hsl(var(--primary))"
                        strokeWidth={2}
                        activeDot={{ r: 8 }}
                      />
                      <Line
                        type="monotone"
                        dataKey="totalInvested"
                        name="Invested"
                        stroke="hsl(var(--muted-foreground))"
                        strokeWidth={2}
                        activeDot={{ r: 8 }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="retirement" className="space-y-4">
            {/* Retirement calculator UI - similar to compound interest calculator */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="currentAge">Current Age</Label>
                  <Input
                    id="currentAge"
                    type="number"
                    value="35"
                    min="18"
                    max="70"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="retirementAge">Retirement Age</Label>
                  <Input
                    id="retirementAge"
                    type="number"
                    value="65"
                    min="40"
                    max="80"
                  />
                </div>
                
                {/* Other retirement-specific inputs would go here */}
              </div>
              
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1 text-center p-4 border rounded-lg">
                    <p className="text-sm text-muted-foreground">Retirement Savings</p>
                    <p className="text-2xl font-bold">{formatCurrency(results.finalBalance)}</p>
                  </div>
                  <div className="space-y-1 text-center p-4 border rounded-lg">
                    <p className="text-sm text-muted-foreground">Monthly Income</p>
                    <p className="text-2xl font-bold">{formatCurrency(results.finalBalance * 0.04 / 12)}</p>
                  </div>
                </div>
                
                {/* Retirement chart would go here */}
                <div className="h-[250px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={results.growthData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="year" />
                      <YAxis tickFormatter={(value) => formatCurrency(value)} />
                      <Tooltip formatter={(value) => [formatCurrency(value as number), ""]} />
                      <Legend />
                      <Line
                        type="monotone"
                        dataKey="balance"
                        name="Balance"
                        stroke="hsl(var(--primary))"
                        strokeWidth={2}
                        activeDot={{ r: 8 }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}
