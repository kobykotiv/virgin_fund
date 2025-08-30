"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

export default function MarginCalculator() {
  return (
    <div className="container mx-auto py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-4">Margin Calculator</h1>
        <p className="text-muted-foreground">
          Calculate margin requirements and leverage for trading positions
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        <Card>
          <CardHeader>
            <CardTitle>Position Details</CardTitle>
            <CardDescription>
              Enter trade details to calculate margin requirements
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="account-balance">Account Balance ($)</Label>
              <Input id="account-balance" type="number" placeholder="50000" />
            </div>

            <div className="space-y-2">
              <Label htmlFor="position-size">Position Size ($)</Label>
              <Input id="position-size" type="number" placeholder="100000" />
            </div>

            <div className="space-y-2">
              <Label htmlFor="leverage">Leverage Ratio</Label>
              <select className="w-full p-2 border rounded-md" id="leverage">
                <option value="1">1:1 (No Leverage)</option>
                <option value="5">5:1</option>
                <option value="10">10:1</option>
                <option value="20">20:1</option>
                <option value="50">50:1</option>
                <option value="100">100:1</option>
              </select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="margin-requirement">Margin Requirement (%)</Label>
              <Input id="margin-requirement" type="number" placeholder="5.0" />
            </div>

            <div className="space-y-2">
              <Label htmlFor="asset-type">Asset Type</Label>
              <select className="w-full p-2 border rounded-md" id="asset-type">
                <option value="stocks">Stocks</option>
                <option value="forex">Forex</option>
                <option value="futures">Futures</option>
                <option value="options">Options</option>
                <option value="crypto">Cryptocurrency</option>
              </select>
            </div>

            <Button className="w-full">
              Calculate Margin
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Margin Analysis</CardTitle>
            <CardDescription>
              Calculated margin requirements and risk metrics
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Metric</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableRow>
                  <TableCell className="font-semibold">Required Margin</TableCell>
                  <TableCell>$5,000</TableCell>
                  <TableCell><Badge className="bg-green-500">Available</Badge></TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-semibold">Used Margin</TableCell>
                  <TableCell>$5,000</TableCell>
                  <TableCell><Badge variant="outline">10% of Balance</Badge></TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-semibold">Free Margin</TableCell>
                  <TableCell>$45,000</TableCell>
                  <TableCell><Badge className="bg-blue-500">Available</Badge></TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-semibold">Margin Level</TableCell>
                  <TableCell>1000%</TableCell>
                  <TableCell><Badge className="bg-green-500">Safe</Badge></TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-semibold">Liquidation Price</TableCell>
                  <TableCell>$98.50</TableCell>
                  <TableCell><Badge className="bg-yellow-500">Monitor</Badge></TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>

      <Card className="mt-8">
        <CardHeader>
          <CardTitle>Margin Trading Guide</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-semibold mb-3">📊 Margin Levels</h4>
              <ul className="text-sm space-y-2 text-muted-foreground">
                <li><strong>1000%+:</strong> Very safe margin level</li>
                <li><strong>500-1000%:</strong> Good margin level</li>
                <li><strong>200-500%:</strong> Moderate risk</li>
                <li><strong>100-200%:</strong> High risk zone</li>
                <li><strong>&lt;100%:</strong> Margin call risk</li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-3">🎯 Risk Management</h4>
              <ul className="text-sm space-y-2 text-muted-foreground">
                <li><strong>Position Sizing:</strong> Never risk more than 2-5% per trade</li>
                <li><strong>Stop Losses:</strong> Always use stop-loss orders</li>
                <li><strong>Diversification:</strong> Spread risk across multiple positions</li>
                <li><strong>Monitoring:</strong> Regularly check margin levels</li>
                <li><strong>Emergency Fund:</strong> Keep cash reserves for margin calls</li>
              </ul>
            </div>
          </div>

          <div className="mt-6 p-4 bg-muted/10 rounded-lg">
            <h4 className="font-semibold mb-2">💡 Margin Trading Tips</h4>
            <ul className="text-sm space-y-1 text-muted-foreground">
              <li>• Leverage amplifies both gains and losses</li>
              <li>• Higher leverage increases liquidation risk</li>
              <li>• Use leverage conservatively, especially when learning</li>
              <li>• Understand margin call procedures before trading</li>
              <li>• Consider borrowing costs when using margin</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
