import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Grid2X2, Pulse, Repeat, ChevronDown, ArrowsUpDown } from "lucide-react"
import { useState } from "react"

const PARAMETER_SCHEMAS = {
  grid: {
    name: "Grid Trading",
    icon: Grid2X2,
    params: [
      { name: "gridLevels", label: "Grid Levels", type: "number", default: 10 },
      { name: "upperPrice", label: "Upper Price", type: "number" },
      { name: "lowerPrice", label: "Lower Price", type: "number" },
      { name: "investmentAmount", label: "Investment Amount", type: "number" },
      { name: "profitTarget", label: "Profit Target %", type: "number", default: 1 }
    ]
  },
  dca: {
    name: "Dollar Cost Averaging",
    icon: Repeat,
    params: [
      { name: "interval", label: "Buy Interval (hours)", type: "number", default: 24 },
      { name: "amount", label: "Buy Amount", type: "number" },
      { name: "maxBuys", label: "Maximum Buys", type: "number", default: 10 }
    ]
  },
  indicator: {
    name: "Indicator Based",
    icon: Pulse,
    params: [
      { name: "strategy", label: "Strategy Type", type: "select", options: [
        { value: "sma", label: "Simple Moving Average" },
        { value: "macd", label: "MACD" },
        { value: "rsi", label: "RSI" }
      ]},
      { name: "period", label: "Period", type: "number", default: 14 },
      { name: "positionSize", label: "Position Size %", type: "number", default: 10 },
      { 
        name: "exitStrategy", 
        label: "Exit Strategy", 
        type: "select", 
        options: [
          { value: "trailing", label: "Trailing Stop" },
          { value: "fixed", label: "Fixed Take Profit" },
          { value: "indicator", label: "Counter Indicator" }
        ]
      },
      { name: "stopLoss", label: "Stop Loss %", type: "number", default: 2 },
      { name: "leverage", label: "Leverage", type: "number", default: 1, max: 10 }
    ]
  },
  arbitrage: {
    name: "Arbitrage Trading",
    icon: ArrowsUpDown,
    params: [
      { name: "exchanges", label: "Exchanges", type: "multiselect", options: [
        { value: "binance", label: "Binance" },
        { value: "coinbase", label: "Coinbase" },
        { value: "kraken", label: "Kraken" }
      ]},
      { name: "minSpread", label: "Minimum Spread %", type: "number", default: 0.5 },
      { name: "maxSlippage", label: "Max Slippage %", type: "number", default: 0.1 }
    ]
  }
}

export function BotParameters({ type, onChange }: { 
  type: keyof typeof PARAMETER_SCHEMAS
  onChange: (params: any) => void 
}) {
  const [values, setValues] = useState<Record<string, any>>({})
  const schema = PARAMETER_SCHEMAS[type]
  
  const handleChange = (name: string, value: any) => {
    const newValues = { ...values, [name]: value }
    setValues(newValues)
    onChange(newValues)
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center space-x-2">
          <schema.icon className="h-5 w-5" />
          <CardTitle>{schema.name} Parameters</CardTitle>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {schema.params.map(param => (
          <div key={param.name} className="grid grid-cols-2 gap-4">
            <Label htmlFor={param.name} className="self-center">
              {param.label}
            </Label>
            {param.type === 'select' ? (
              <Select 
                value={values[param.name] || ''} 
                onValueChange={value => handleChange(param.name, value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select..." />
                </SelectTrigger>
                <SelectContent>
                  {param.options?.map(opt => (
                    <SelectItem key={opt.value} value={opt.value}>
                      {opt.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            ) : (
              <Input
                id={param.name}
                type={param.type}
                value={values[param.name] || param.default || ''}
                onChange={e => handleChange(param.name, e.target.value)}
              />
            )}
          </div>
        ))}
      </CardContent>
    </Card>
  )
}
