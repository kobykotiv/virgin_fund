"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"

const tradingCalculators = [
  { label: 'Risk/Reward Calculator', route: '/calculators/risk-reward', description: 'Calculate risk-reward ratios for your trades' },
  { label: 'Position Size Calculator', route: '/calculators/position-size', description: 'Determine optimal position sizes based on risk' },
  { label: 'Leverage Calculator', route: '/calculators/leverage', description: 'Calculate leverage ratios and margin requirements' },
  { label: 'Pivot Points Calculator', route: '/calculators/pivot-points', description: 'Calculate support and resistance levels' },
  { label: 'Spread Calculator', route: '/calculators/spread', description: 'Calculate bid-ask spreads and costs' },
  { label: 'Options Greeks Calculator', route: '/calculators/options-greeks', description: 'Calculate delta, gamma, theta, vega, rho' },
  { label: 'Monte Carlo Simulator', route: '/calculators/monte-carlo', description: 'Run Monte Carlo simulations for portfolio analysis' },
]

export default function TradingCalculatorsHub() {
  return (
    <div className="container mx-auto py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-4">Trading Calculators</h1>
        <p className="text-muted-foreground">
          Advanced trading tools to help you make informed decisions
        </p>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {tradingCalculators.map((calc) => (
          <Card key={calc.route} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="text-lg">{calc.label}</CardTitle>
              <CardDescription>{calc.description}</CardDescription>
            </CardHeader>
            <CardContent>
              <Button asChild className="w-full">
                <Link href={calc.route}>
                  Open Calculator
                </Link>
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="mt-12 text-center">
        <div className="inline-flex items-center gap-4 p-6 bg-muted/10 rounded-lg">
          <div className="text-left">
            <h3 className="font-semibold mb-2">Need More Calculators?</h3>
            <p className="text-sm text-muted-foreground">
              We're constantly adding new calculators based on user feedback.
            </p>
          </div>
          <Button variant="outline">
            Request Calculator
          </Button>
        </div>
      </div>
    </div>
  )
}
