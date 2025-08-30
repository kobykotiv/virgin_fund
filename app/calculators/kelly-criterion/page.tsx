"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

export default function KellyCriterionCalculator() {
  return (
    <div className="container mx-auto py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-4">Kelly Criterion Calculator</h1>
        <p className="text-muted-foreground">
          Optimize position sizing using the Kelly Criterion formula
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        <Card>
          <CardHeader>
            <CardTitle>Trading Parameters</CardTitle>
            <CardDescription>
              Enter your trading edge and risk parameters
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="win-probability">Probability of Winning (%)</Label>
              <Input id="win-probability" type="number" placeholder="55" />
            </div>

            <div className="space-y-2">
              <Label htmlFor="win-loss-ratio">Win/Loss Ratio</Label>
              <Input id="win-loss-ratio" type="number" placeholder="1.5" />
            </div>

            <div className="space-y-2">
              <Label htmlFor="bankroll">Total Bankroll ($)</Label>
              <Input id="bankroll" type="number" placeholder="10000" />
            </div>

            <div className="space-y-2">
              <Label htmlFor="fractional-kelly">Fractional Kelly (%)</Label>
              <Input id="fractional-kelly" type="number" placeholder="50" />
            </div>

            <div className="space-y-2">
              <Label htmlFor="strategy-name">Strategy Name</Label>
              <Input id="strategy-name" placeholder="Momentum Trading" />
            </div>

            <Button className="w-full">
              Calculate Kelly Bet Size
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Kelly Criterion Results</CardTitle>
            <CardDescription>
              Optimal position sizing recommendations
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="text-center p-6 bg-blue-50 dark:bg-blue-950/20 rounded-lg">
                <div className="text-2xl font-bold text-blue-600">$1,250</div>
                <div className="text-sm text-muted-foreground">Optimal Bet Size</div>
                <div className="text-xs text-blue-600 mt-1">12.5% of Bankroll</div>
              </div>

              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Position Size</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Risk Level</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow>
                    <TableCell className="font-semibold">Full Kelly</TableCell>
                    <TableCell>$2,500</TableCell>
                    <TableCell><Badge className="bg-red-500">High Risk</Badge></TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-semibold">Half Kelly</TableCell>
                    <TableCell>$1,250</TableCell>
                    <TableCell><Badge className="bg-yellow-500">Moderate</Badge></TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-semibold">Quarter Kelly</TableCell>
                    <TableCell>$625</TableCell>
                    <TableCell><Badge className="bg-green-500">Conservative</Badge></TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-semibold">Expected Value</TableCell>
                    <TableCell>$275</TableCell>
                    <TableCell><Badge className="bg-blue-500">Positive</Badge></TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="mt-8">
        <CardHeader>
          <CardTitle>Kelly Criterion Explained</CardTitle>
        </CardContent>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-semibold mb-3">📊 Kelly Formula</h4>
              <div className="text-sm space-y-2 text-muted-foreground">
                <div><strong>Full Kelly:</strong> K = (bp - q) / b</div>
                <div><strong>Where:</strong></div>
                <div>• K = Kelly percentage</div>
                <div>• b = Odds received (win/loss ratio)</div>
                <div>• p = Probability of winning</div>
                <div>• q = Probability of losing (1-p)</div>
              </div>
            </div>

            <div>
              <h4 className="font-semibold mb-3">🎯 Kelly Applications</h4>
              <ul className="text-sm space-y-2 text-muted-foreground">
                <li><strong>Position Sizing:</strong> Optimal bet allocation</li>
                <li><strong>Risk Management:</strong> Mathematical risk control</li>
                <li><strong>Portfolio Allocation:</strong> Asset weight optimization</li>
                <li><strong>Trading Systems:</strong> Strategy sizing framework</li>
                <li><strong>Bankroll Management:</strong> Long-term capital preservation</li>
              </ul>
            </div>
          </div>

          <div className="mt-6 p-4 bg-muted/10 rounded-lg">
            <h4 className="font-semibold mb-2">💡 Kelly Criterion Best Practices</h4>
            <ul className="text-sm space-y-1 text-muted-foreground">
              <li>• Use fractional Kelly (25-50%) for conservative sizing</li>
              <li>• Only apply to strategies with positive expected value</li>
              <li>• Reassess probabilities and odds regularly</li>
              <li>• Consider transaction costs and slippage</li>
              <li>• Combine with stop-loss and position limits</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
