"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

export default function AltmanZScoreCalculator() {
  return (
    <div className="container mx-auto py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-4">Altman Z-Score Calculator</h1>
        <p className="text-muted-foreground">
          Calculate bankruptcy risk using Altman's Z-Score model
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        <Card>
          <CardHeader>
            <CardTitle>Financial Ratios Input</CardTitle>
            <CardDescription>
              Enter company financial ratios for Z-Score calculation
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="working-capital">Working Capital / Total Assets</Label>
              <Input id="working-capital" type="number" placeholder="0.15" />
            </div>

            <div className="space-y-2">
              <Label htmlFor="retained-earnings">Retained Earnings / Total Assets</Label>
              <Input id="retained-earnings" type="number" placeholder="0.35" />
            </div>

            <div className="space-y-2">
              <Label htmlFor="ebit">EBIT / Total Assets</Label>
              <Input id="ebit" type="number" placeholder="0.12" />
            </div>

            <div className="space-y-2">
              <Label htmlFor="market-value">Market Value of Equity / Book Value of Debt</Label>
              <Input id="market-value" type="number" placeholder="1.8" />
            </div>

            <div className="space-y-2">
              <Label htmlFor="sales">Sales / Total Assets</Label>
              <Input id="sales" type="number" placeholder="1.2" />
            </div>

            <div className="space-y-2">
              <Label htmlFor="company-name">Company Name</Label>
              <Input id="company-name" placeholder="Apple Inc." />
            </div>

            <Button className="w-full">
              Calculate Z-Score
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Z-Score Analysis</CardTitle>
            <CardDescription>
              Bankruptcy risk assessment
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="text-center p-6 bg-green-50 dark:bg-green-950/20 rounded-lg">
                <div className="text-2xl font-bold text-green-600">3.25</div>
                <div className="text-sm text-muted-foreground">Altman Z-Score</div>
                <div className="text-xs text-green-600 mt-1">Safe Zone</div>
              </div>

              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Ratio</TableHead>
                    <TableHead>Weight</TableHead>
                    <TableHead>Score</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow>
                    <TableCell className="font-semibold">Working Capital / TA</TableCell>
                    <TableCell>1.2 ×</TableCell>
                    <TableCell>0.18</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-semibold">Retained Earnings / TA</TableCell>
                    <TableCell>1.4 ×</TableCell>
                    <TableCell>0.49</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-semibold">EBIT / TA</TableCell>
                    <TableCell>3.3 ×</TableCell>
                    <TableCell>0.40</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-semibold">Market Value / Book Debt</TableCell>
                    <TableCell>0.6 ×</TableCell>
                    <TableCell>1.08</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-semibold">Sales / TA</TableCell>
                    <TableCell>1.0 ×</TableCell>
                    <TableCell>1.20</TableCell>
                  </TableRow>
                  <TableRow className="bg-green-50 dark:bg-green-950/20">
                    <TableCell className="font-semibold">Total Z-Score</TableCell>
                    <TableCell>-</TableCell>
                    <TableCell><Badge className="bg-green-500">3.25</Badge></TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="mt-8">
        <CardHeader>
          <CardTitle>Z-Score Interpretation & Applications</CardTitle>
        </CardContent>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-semibold mb-3">📊 Z-Score Ranges</h4>
              <ul className="text-sm space-y-2 text-muted-foreground">
                <li><strong>Z > 3.0:</strong> Safe zone (low bankruptcy risk)</li>
                <li><strong>1.8 < Z < 3.0:</strong> Grey zone (moderate risk)</li>
                <li><strong>Z < 1.8:</strong> Distress zone (high bankruptcy risk)</li>
                <li><strong>Z < 1.1:</strong> Very high bankruptcy probability</li>
                <li><strong>Accuracy:</strong> ~95% for public companies</li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-3">🎯 Z-Score Applications</h4>
              <ul className="text-sm space-y-2 text-muted-foreground">
                <li><strong>Credit Analysis:</strong> Assess borrower risk</li>
                <li><strong>Investment Screening:</strong> Avoid distressed companies</li>
                <li><strong>M&A Due Diligence:</strong> Target health assessment</li>
                <li><strong>Risk Management:</strong> Portfolio stress testing</li>
                <li><strong>Financial Distress:</strong> Early warning system</li>
              </ul>
            </div>
          </div>

          <div className="mt-6 p-4 bg-muted/10 rounded-lg">
            <h4 className="font-semibold mb-2">💡 Z-Score Limitations & Best Practices</h4>
            <ul className="text-sm space-y-1 text-muted-foreground">
              <li>• Developed for manufacturing firms, may not apply to all industries</li>
              <li>• Based on historical data, may not predict future bankruptcies</li>
              <li>• Use as one tool among many in comprehensive analysis</li>
              <li>• Monitor Z-Score trends over time for early warning signals</li>
              <li>• Consider industry-specific factors and economic conditions</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
