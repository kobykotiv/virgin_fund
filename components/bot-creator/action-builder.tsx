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
import { Switch } from "@/components/ui/switch"
import { ExitStrategy } from "./bot-prototype"

const ACTION_TYPES = {
  MARKET_BUY: {
    label: "Market Buy",
    description: "Place a market buy order",
    params: [
      {
        name: "symbol",
        type: "symbol",
        label: "Symbol"
      },
      {
        name: "amount",
        type: "number",
        label: "Amount"
      },
      {
        name: "unit",
        type: "select",
        label: "Unit",
        options: [
          { value: "percentage", label: "Portfolio %" },
          { value: "fixed", label: "Fixed Amount" },
          { value: "shares", label: "Number of Shares" }
        ]
      }
    ]
  },
  MARKET_SELL: {
    label: "Market Sell",
    description: "Place a market sell order",
    params: [
      {
        name: "symbol",
        type: "symbol",
        label: "Symbol"
      },
      {
        name: "amount",
        type: "number",
        label: "Amount"
      },
      {
        name: "unit",
        type: "select",
        label: "Unit",
        options: [
          { value: "percentage", label: "Position %" },
          { value: "fixed", label: "Fixed Amount" },
          { value: "shares", label: "Number of Shares" }
        ]
      }
    ]
  },
  LIMIT_BUY: {
    label: "Limit Buy",
    description: "Place a limit buy order",
    params: [
      {
        name: "symbol",
        type: "symbol",
        label: "Symbol"
      },
      {
        name: "amount",
        type: "number",
        label: "Amount"
      },
      {
        name: "unit",
        type: "select",
        label: "Unit",
        options: [
          { value: "percentage", label: "Portfolio %" },
          { value: "fixed", label: "Fixed Amount" },
          { value: "shares", label: "Number of Shares" }
        ]
      },
      {
        name: "price",
        type: "number",
        label: "Limit Price"
      }
    ]
  },
  LIMIT_SELL: {
    label: "Limit Sell",
    description: "Place a limit sell order",
    params: [
      {
        name: "symbol",
        type: "symbol",
        label: "Symbol"
      },
      {
        name: "amount",
        type: "number",
        label: "Amount"
      },
      {
        name: "unit",
        type: "select",
        label: "Unit",
        options: [
          { value: "percentage", label: "Position %" },
          { value: "fixed", label: "Fixed Amount" },
          { value: "shares", label: "Number of Shares" }
        ]
      },
      {
        name: "price",
        type: "number",
        label: "Limit Price"
      }
    ]
  },
  ALERT: {
    label: "Alert",
    description: "Send an alert notification",
    params: [
      {
        name: "message",
        type: "text",
        label: "Message"
      },
      {
        name: "severity",
        type: "select",
        label: "Severity",
        options: [
          { value: "info", label: "Info" },
          { value: "warning", label: "Warning" },
          { value: "error", label: "Error" }
        ]
      }
    ]
  },
  WEBHOOK: {
    label: "Webhook",
    description: "Call a webhook URL",
    params: [
      {
        name: "url",
        type: "text",
        label: "Webhook URL"
      },
      {
        name: "method",
        type: "select",
        label: "HTTP Method",
        options: [
          { value: "GET", label: "GET" },
          { value: "POST", label: "POST" },
          { value: "PUT", label: "PUT" }
        ]
      }
    ]
  }
}

const SYMBOLS = [
  { value: "BTC-USD", label: "Bitcoin" },
  { value: "ETH-USD", label: "Ethereum" },
  { value: "SOL-USD", label: "Solana" },
  { value: "AAPL", label: "Apple" },
  { value: "GOOGL", label: "Google" },
  { value: "MSFT", label: "Microsoft" },
  { value: "AMZN", label: "Amazon" }
]

interface ActionParams {
  [key: string]: any
}

interface Action {
  type: string
  params: ActionParams
}

interface ExitStrategyConfig {
  type: ExitStrategy["type"]
  parameters: ExitStrategy["parameters"]
}

interface ActionBuilderProps {
  actions: Action[]
  exitStrategies: ExitStrategyConfig[]
  onChange: (actions: Action[], exitStrategies: ExitStrategyConfig[]) => void
}

export function ActionBuilder({ actions, exitStrategies, onChange }: ActionBuilderProps) {
  const [selectedType, setSelectedType] = useState<string>("")
  const [params, setParams] = useState<ActionParams>({})
  const [exitStrategy, setExitStrategy] = useState<ExitStrategyConfig>({
    type: "take_profit",
    parameters: {
      value: 0,
      unit: "percentage"
    }
  })

  const handleAddAction = () => {
    if (!selectedType) return

    const newAction = {
      type: selectedType,
      params: { ...params }
    }

    onChange([...actions, newAction], exitStrategies)
    setSelectedType("")
    setParams({})
  }

  const handleRemoveAction = (index: number) => {
    const newActions = actions.filter((_, i) => i !== index)
    onChange(newActions, exitStrategies)
  }

  const handleParamChange = (param: string, value: any) => {
    setParams(prev => ({
      ...prev,
      [param]: value
    }))
  }

  const handleAddExitStrategy = () => {
    onChange(actions, [...exitStrategies, exitStrategy])
    setExitStrategy({
      type: "take_profit",
      parameters: {
        value: 0,
        unit: "percentage"
      }
    })
  }

  const handleRemoveExitStrategy = (index: number) => {
    const newExitStrategies = exitStrategies.filter((_, i) => i !== index)
    onChange(actions, newExitStrategies)
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
      case "text":
        return (
          <Input
            type="text"
            value={params[param.name] || ""}
            onChange={(e) => handleParamChange(param.name, e.target.value)}
            placeholder={`Enter ${param.label.toLowerCase()}`}
          />
        )
      default:
        return null
    }
  }

  const isValidParams = () => {
    if (!selectedType) return false
    const requiredParams = ACTION_TYPES[selectedType].params
    return requiredParams.every(param => params[param.name] !== undefined && params[param.name] !== "")
  }

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <Label>Trading Actions</Label>
          <Tooltip>
            <TooltipTrigger asChild>
              <Info className="h-4 w-4 text-muted-foreground" />
            </TooltipTrigger>
            <TooltipContent>
              <p>Configure actions to execute when trading conditions are met</p>
            </TooltipContent>
          </Tooltip>
        </div>

        {actions.map((action, index) => (
          <Card key={index} className="p-4">
            <div className="flex items-start justify-between">
              <div className="space-y-1">
                <div className="font-medium">{ACTION_TYPES[action.type].label}</div>
                <div className="text-sm text-muted-foreground">
                  {Object.entries(action.params).map(([key, value]) => (
                    <span key={key} className="mr-4">
                      {key}: {value}
                    </span>
                  ))}
                </div>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => handleRemoveAction(index)}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </Card>
        ))}

        <div className="space-y-4 pt-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Action Type</Label>
              <Select
                value={selectedType}
                onValueChange={setSelectedType}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select action type" />
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(ACTION_TYPES).map(([key, value]) => (
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

            {selectedType && ACTION_TYPES[selectedType].params.map((param) => (
              <div key={param.name} className="space-y-2">
                <Label>{param.label}</Label>
                {renderParamInput(param)}
              </div>
            ))}
          </div>

          <Button
            onClick={handleAddAction}
            disabled={!isValidParams()}
            className="w-full"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Action
          </Button>
        </div>
      </div>

      {/* Exit Strategies Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <Label>Exit Strategies</Label>
          <Tooltip>
            <TooltipTrigger asChild>
              <Info className="h-4 w-4 text-muted-foreground" />
            </TooltipTrigger>
            <TooltipContent>
              <p>Configure when to exit positions</p>
            </TooltipContent>
          </Tooltip>
        </div>

        {exitStrategies.map((strategy, index) => (
          <Card key={index} className="p-4">
            <div className="flex items-start justify-between">
              <div className="space-y-1">
                <div className="font-medium">
                  {strategy.type === "take_profit" && "Take Profit"}
                  {strategy.type === "stop_loss" && "Stop Loss"}
                  {strategy.type === "trailing_stop" && "Trailing Stop"}
                  {strategy.type === "time_based" && "Time-Based Exit"}
                </div>
                <div className="text-sm text-muted-foreground">
                  {strategy.parameters.value} {strategy.parameters.unit}
                  {strategy.type === "trailing_stop" && 
                    ` (${strategy.parameters.trailingDistance}% distance)`}
                  {strategy.type === "time_based" && 
                    ` after ${strategy.parameters.timeFrame}`}
                </div>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => handleRemoveExitStrategy(index)}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </Card>
        ))}

        <div className="space-y-4 pt-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Exit Strategy Type</Label>
              <Select
                value={exitStrategy.type}
                onValueChange={(value: ExitStrategy["type"]) => 
                  setExitStrategy(prev => ({ ...prev, type: value }))
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select exit strategy" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="take_profit">Take Profit</SelectItem>
                  <SelectItem value="stop_loss">Stop Loss</SelectItem>
                  <SelectItem value="trailing_stop">Trailing Stop</SelectItem>
                  <SelectItem value="time_based">Time-Based Exit</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Value</Label>
              <Input
                type="number"
                value={exitStrategy.parameters.value}
                onChange={(e) => 
                  setExitStrategy(prev => ({
                    ...prev,
                    parameters: {
                      ...prev.parameters,
                      value: parseFloat(e.target.value)
                    }
                  }))
                }
              />
            </div>

            <div className="space-y-2">
              <Label>Unit</Label>
              <Select
                value={exitStrategy.parameters.unit}
                onValueChange={(value: "percentage" | "fixed" | "pips") => 
                  setExitStrategy(prev => ({
                    ...prev,
                    parameters: {
                      ...prev.parameters,
                      unit: value
                    }
                  }))
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select unit" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="percentage">Percentage</SelectItem>
                  <SelectItem value="fixed">Fixed Amount</SelectItem>
                  <SelectItem value="pips">Pips</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {exitStrategy.type === "trailing_stop" && (
              <div className="space-y-2">
                <Label>Trailing Distance (%)</Label>
                <Input
                  type="number"
                  value={exitStrategy.parameters.trailingDistance || ""}
                  onChange={(e) => 
                    setExitStrategy(prev => ({
                      ...prev,
                      parameters: {
                        ...prev.parameters,
                        trailingDistance: parseFloat(e.target.value)
                      }
                    }))
                  }
                />
              </div>
            )}

            {exitStrategy.type === "time_based" && (
              <div className="space-y-2">
                <Label>Time Frame</Label>
                <Select
                  value={exitStrategy.parameters.timeFrame || ""}
                  onValueChange={(value) => 
                    setExitStrategy(prev => ({
                      ...prev,
                      parameters: {
                        ...prev.parameters,
                        timeFrame: value
                      }
                    }))
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select time frame" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1h">1 Hour</SelectItem>
                    <SelectItem value="4h">4 Hours</SelectItem>
                    <SelectItem value="1d">1 Day</SelectItem>
                    <SelectItem value="1w">1 Week</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            )}
          </div>

          <Button
            onClick={handleAddExitStrategy}
            className="w-full"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Exit Strategy
          </Button>
        </div>
      </div>
    </div>
  )
}