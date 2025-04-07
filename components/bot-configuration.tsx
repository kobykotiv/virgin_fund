import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Grid, Signal, ArrowDownUp, LineChart, Timer } from "lucide-react"

const BOT_TEMPLATES = [
  {
    id: 'dca',
    name: 'Dollar Cost Averaging',
    description: 'Automated periodic buying of assets',
    icon: Timer,
    fields: ['symbol', 'amount', 'interval']
  },
  {
    id: 'grid',
    name: 'Grid Trading',
    description: 'Buy low, sell high with price grids',
    icon: Grid,
    fields: ['symbol', 'gridSize', 'upperPrice', 'lowerPrice']
  }
]

export function SimpleBotConfig({ onSubmit }: { onSubmit: (data: any) => void }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Quick Bot Setup</CardTitle>
        <CardDescription>Create a bot with basic settings</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <Select>
          <SelectTrigger>
            <SelectValue placeholder="Select a template" />
          </SelectTrigger>
          <SelectContent>
            {BOT_TEMPLATES.map(template => (
              <SelectItem key={template.id} value={template.id}>
                <div className="flex items-center gap-2">
                  <template.icon className="h-4 w-4" />
                  <span>{template.name}</span>
                </div>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Input placeholder="Symbol (e.g. BTC/USD)" />
        <Input type="number" placeholder="Investment amount" />
        
        <div className="grid grid-cols-2 gap-4">
          <Button variant="outline">Test Strategy</Button>
          <Button>Create Bot</Button>
        </div>
      </CardContent>
    </Card>
  )
}

export function ComplexBotConfig({ onSubmit }: { onSubmit: (data: any) => void }) {
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Advanced Bot Configuration</CardTitle>
        <CardDescription>Multi-step bot setup with detailed options</CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="strategy" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="strategy">Strategy</TabsTrigger>
            <TabsTrigger value="parameters">Parameters</TabsTrigger>
            <TabsTrigger value="risk">Risk Management</TabsTrigger>
            <TabsTrigger value="backtest">Backtest</TabsTrigger>
          </TabsList>

          <TabsContent value="strategy" className="space-y-4">
            {/* Strategy Selection */}
            <div className="grid grid-cols-2 gap-4">
              {[
                {
                  id: 'indicator',
                  name: 'Indicator Based',
                  description: 'Trade using technical indicators',
                  icon: Signal
                },
                {
                  id: 'mean-reversion',
                  name: 'Mean Reversion',
                  description: 'Trade price deviations',
                  icon: ArrowDownUp
                },
                {
                  id: 'trend',
                  name: 'Trend Following',
                  description: 'Follow market trends',
                  icon: LineChart
                }
              ].map(strategy => (
                <Card key={strategy.id} className="cursor-pointer hover:border-primary">
                  <CardHeader>
                    <strategy.icon className="h-6 w-6 mb-2" />
                    <CardTitle className="text-lg">{strategy.name}</CardTitle>
                    <CardDescription>{strategy.description}</CardDescription>
                  </CardHeader>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Add other tab contents */}
        </Tabs>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button variant="outline">Back</Button>
        <Button>Continue</Button>
      </CardFooter>
    </Card>
  )
}
