import { useState } from "react"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { LineChart } from "lucide-react"
import { BotConfig } from "@/types/bot"

const marketSignals = [
  {
    id: 1,
    name: "Golden Cross",
    description: "Moving average crossover strategy (50 EMA crosses above 200 EMA)",
    type: "momentum",
    reliability: "High",
    timeframe: "Daily",
    successRate: "78%",
  },
  {
    id: 2,
    name: "Bollinger Band Squeeze",
    description: "Detects potential breakout moves when volatility is low",
    type: "volatility",
    reliability: "Medium",
    timeframe: "4H",
    successRate: "65%",
  },
  {
    id: 3,
    name: "RSI Divergence Pro",
    description: "Advanced divergence detection with multi-timeframe confirmation",
    type: "momentum",
    reliability: "High",
    timeframe: "Any",
    successRate: "72%",
  },
]

interface MarketSignalsTabProps {
  onSelectSignal: (signal: Partial<BotConfig["strategy"]>) => void
}

export function MarketSignalsTab({ onSelectSignal }: MarketSignalsTabProps) {
  const [selectedSignalId, setSelectedSignalId] = useState<number | null>(null)

  const handleSelectSignal = (signal: typeof marketSignals[0]) => {
    setSelectedSignalId(signal.id)
    onSelectSignal({
      type: signal.type,
      indicators: [
        {
          name: signal.name,
          period: signal.timeframe === "Daily" ? 1 : 4, // Example mapping
          parameters: {},
        },
      ],
    })
  }

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {marketSignals.map((signal) => (
          <Card key={signal.id} className="flex flex-col">
            <CardHeader>
              <div className="flex items-start justify-between">
                <CardTitle className="text-lg font-semibold">{signal.name}</CardTitle>
                <Badge variant={signal.reliability === "High" ? "default" : "secondary"}>
                  {signal.reliability}
                </Badge>
              </div>
              <p className="text-sm text-muted-foreground mt-2">{signal.description}</p>
            </CardHeader>
            <CardContent className="flex-1">
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div className="flex items-center gap-2">
                  <LineChart className="h-4 w-4" />
                  <span className="text-muted-foreground">Type:</span>
                  <span>{signal.type}</span>
                </div>
                <div>
                  <span className="text-muted-foreground">Timeframe:</span>
                  <span className="ml-2">{signal.timeframe}</span>
                </div>
                <div>
                  <span className="text-muted-foreground">Success Rate:</span>
                  <span className="ml-2 text-green-600">{signal.successRate}</span>
                </div>
              </div>
            </CardContent>
            <CardFooter className="border-t pt-4">
              <Button
                variant={selectedSignalId === signal.id ? "default" : "outline"}
                className="w-full"
                onClick={() => handleSelectSignal(signal)}
              >
                {selectedSignalId === signal.id ? "Selected" : "Select Signal"}
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  )
}
