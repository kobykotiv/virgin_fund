import { useState } from "react"
import { Plus, X, Info } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip"

const SIGNAL_TYPES = {
  PRICE: {
    label: "Price",
    description: "Basic price-based signals",
    params: [
      { name: "symbol", type: "symbol", label: "Symbol" },
      { name: "timeframe", type: "timeframe", label: "Timeframe" },
      { name: "type", type: "select", label: "Price Type", options: [
        { value: "close", label: "Close" },
        { value: "open", label: "Open" },
        { value: "high", label: "High" },
        { value: "low", label: "Low" },
        { value: "volume", label: "Volume" }
      ]}
    ]
  },
  SMA: {
    label: "Simple Moving Average",
    description: "Simple moving average indicator",
    params: [
      { name: "symbol", type: "symbol", label: "Symbol" },
      { name: "period", type: "number", label: "Period" },
      { name: "source", type: "select", label: "Source", options: [
        { value: "close", label: "Close" },
        { value: "open", label: "Open" },
        { value: "high", label: "High" },
        { value: "low", label: "Low" }
      ]}
    ]
  },
  EMA: {
    label: "Exponential Moving Average",
    description: "Exponential moving average indicator",
    params: [
      { name: "symbol", type: "symbol", label: "Symbol" },
      { name: "period", type: "number", label: "Period" },
      { name: "source", type: "select", label: "Source", options: [
        { value: "close", label: "Close" },
        { value: "open", label: "Open" },
        { value: "high", label: "High" },
        { value: "low", label: "Low" }
      ]}
    ]
  },
  RSI: {
    label: "Relative Strength Index",
    description: "Momentum indicator measuring speed and magnitude of recent price changes",
    params: [
      { name: "symbol", type: "symbol", label: "Symbol" },
      { name: "period", type: "number", label: "Period" },
      { name: "overbought", type: "number", label: "Overbought Level" },
      { name: "oversold", type: "number", label: "Oversold Level" }
    ]
  },
  MACD: {
    label: "MACD",
    description: "Moving Average Convergence Divergence",
    params: [
      { name: "symbol", type: "symbol", label: "Symbol" },
      { name: "fastPeriod", type: "number", label: "Fast Period" },
      { name: "slowPeriod", type: "number", label: "Slow Period" },
      { name: "signalPeriod", type: "number", label: "Signal Period" }
    ]
  },
  BB: {
    label: "Bollinger Bands",
    description: "Dynamic support and resistance levels based on volatility",
    params: [
      { name: "symbol", type: "symbol", label: "Symbol" },
      { name: "period", type: "number", label: "Period" },
      { name: "stdDev", type: "number", label: "Standard Deviations" }
    ]
  }
}

const TIMEFRAMES = [
  { value: "1m", label: "1 Minute" },
  { value: "5m", label: "5 Minutes" },
  { value: "15m", label: "15 Minutes" },
  { value: "30m", label: "30 Minutes" },
  { value: "1h", label: "1 Hour" },
  { value: "4h", label: "4 Hours" },
  { value: "1d", label: "1 Day" }
]

const SYMBOLS = [
  { value: "BTC-USD", label: "Bitcoin" },
  { value: "ETH-USD", label: "Ethereum" },
  { value: "SOL-USD", label: "Solana" },
  { value: "AAPL", label: "Apple" },
  { value: "GOOGL", label: "Google" },
  { value: "MSFT", label: "Microsoft" },
  { value: "AMZN", label: "Amazon" }
]

interface SignalParams {
  [key: string]: any
}

interface Signal {
  type: string
  params: SignalParams
}

interface SignalBuilderProps {
  signals: Signal[]
  onChange: (signals: Signal[]) => void
}

export function SignalBuilder({ signals, onChange }: SignalBuilderProps) {
  const [selectedType, setSelectedType] = useState<string>("")
  const [params, setParams] = useState<SignalParams>({})

  const handleAddSignal = () => {
    if (!selectedType) return

    const newSignal = {
      type: selectedType,
      params: { ...params }
    }

    onChange([...signals, newSignal])
    setSelectedType("")
    setParams({})
  }

  const handleRemoveSignal = (index: number) => {
    const newSignals = signals.filter((_, i) => i !== index)
    onChange(newSignals)
  }

  const handleParamChange = (param: string, value: any) => {
    setParams((prev) => ({
      ...prev,
      [param]: value
    }))
  }

  const renderParamInput = (param: any) => {
    switch (param.type) {
      case "symbol":
        return (
          <Select
            value={params[param.name] || ""}
            onValueChange={(value) => handleParamChange(param.name, value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select symbol" />
            </SelectTrigger>
            <SelectContent>
              {SYMBOLS.map((symbol) => (
                <SelectItem key={symbol.value} value={symbol.value}>
                  {symbol.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )
      case "timeframe":
        return (
          <Select
            value={params[param.name] || ""}
            onValueChange={(value) => handleParamChange(param.name, value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select timeframe" />
            </SelectTrigger>
            <SelectContent>
              {TIMEFRAMES.map((timeframe) => (
                <SelectItem key={timeframe.value} value={timeframe.value}>
                  {timeframe.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )
      case "select":
        return (
          <Select
            value={params[param.name] || ""}
            onValueChange={(value) => handleParamChange(param.name, value)}
          >
            <SelectTrigger>
              <SelectValue placeholder={`Select ${param.label.toLowerCase()}`} />
            </SelectTrigger>
            <SelectContent>
              {param.options.map((option: any) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )
      case "number":
        return (
          <Input
            type="number"
            value={params[param.name] || ""}
            onChange={(e) => handleParamChange(param.name, parseFloat(e.target.value))}
            placeholder={`Enter ${param.label.toLowerCase()}`}
          />
        )
      default:
        return null
    }
  }

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <Label>Trading Signals</Label>
          <Tooltip>
            <TooltipTrigger asChild>
              <Info className="h-4 w-4 text-muted-foreground" />
            </TooltipTrigger>
            <TooltipContent>
              <p>Configure the signals that will trigger your trading bot</p>
            </TooltipContent>
          </Tooltip>
        </div>

        {signals.map((signal, index) => (
          <Card key={index} className="p-4">
            <div className="flex items-start justify-between">
              <div className="space-y-1">
                <div className="font-medium">{SIGNAL_TYPES[signal.type].label}</div>
                <div className="text-sm text-muted-foreground">
                  {Object.entries(signal.params).map(([key, value]) => (
                    <span key={key} className="mr-4">
                      {key}: {value}
                    </span>
                  ))}
                </div>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => handleRemoveSignal(index)}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </Card>
        ))}

        <div className="space-y-4 pt-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Signal Type</Label>
              <Select value={selectedType} onValueChange={setSelectedType}>
                <SelectTrigger>
                  <SelectValue placeholder="Select signal type" />
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(SIGNAL_TYPES).map(([key, value]) => (
                    <SelectItem key={key} value={key}>
                      <div className="space-y-1">
                        <div>{value.label}</div>
                        <div className="text-xs text-muted-foreground">
                          {value.description}
                        </div>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {selectedType && SIGNAL_TYPES[selectedType].params.map((param) => (
              <div key={param.name} className="space-y-2">
                <Label>{param.label}</Label>
                {renderParamInput(param)}
              </div>
            ))}
          </div>

          <Button
            onClick={handleAddSignal}
            disabled={!selectedType || Object.keys(params).length === 0}
            className="w-full"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Signal
          </Button>
        </div>
      </div>
    </div>
  )
}