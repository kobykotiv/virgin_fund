"use client"

import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft } from "lucide-react"

interface BotReviewProps {
  data: any
  onEdit: (step: number) => void
}

export function BotReview({ data, onEdit }: BotReviewProps) {
  return (
    <div className="space-y-8">
      <h3 className="text-lg font-medium">Review Bot Configuration</h3>

      <Card className="p-6 space-y-6">
        <div className="space-y-4">
          <div className="flex justify-between items-start">
            <div>
              <h4 className="font-medium">Basic Information</h4>
              <p className="text-sm text-muted-foreground mt-1">{data.description || "No description provided"}</p>
            </div>
            <Button variant="ghost" size="sm" onClick={() => onEdit(0)}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Edit
            </Button>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <span className="text-sm text-muted-foreground">Name:</span>
              <p className="font-medium">{data.name}</p>
            </div>
            <div>
              <span className="text-sm text-muted-foreground">Type:</span>
              <p className="font-medium">{data.type}</p>
            </div>
          </div>
        </div>

        <div className="border-t pt-6 space-y-4">
          <div className="flex justify-between items-start">
            <h4 className="font-medium">Signals</h4>
            <Button variant="ghost" size="sm" onClick={() => onEdit(1)}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Edit
            </Button>
          </div>
          <div className="grid gap-4">
            {data.config.signals.map((signal: any, index: number) => (
              <div key={index} className="p-3 bg-muted rounded-lg">
                <div className="flex justify-between items-start">
                  <div>
                    <Badge>{signal.type}</Badge>
                    <p className="text-sm mt-2">
                      {Object.entries(signal.parameters || {}).map(([key, value]) => (
                        <span key={key} className="block">
                          {key}: {value as string}
                        </span>
                      ))}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="border-t pt-6 space-y-4">
          <div className="flex justify-between items-start">
            <h4 className="font-medium">Conditions</h4>
            <Button variant="ghost" size="sm" onClick={() => onEdit(2)}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Edit
            </Button>
          </div>
          <div className="grid gap-4">
            {data.config.conditions.map((condition: any, index: number) => (
              <div key={index} className="p-3 bg-muted rounded-lg">
                <p className="text-sm">
                  Signal {condition.signal + 1} {condition.operator.toLowerCase().replace(/_/g, " ")}
                  {condition.comparison.type === "value" 
                    ? ` ${condition.comparison.value}`
                    : ` Signal ${condition.comparison.signalIndex! + 1}`}
                  {condition.operator === "BETWEEN" &&
                    ` (${condition.comparison.lowerBound} - ${condition.comparison.upperBound})`}
                </p>
              </div>
            ))}
          </div>
        </div>

        <div className="border-t pt-6 space-y-4">
          <div className="flex justify-between items-start">
            <h4 className="font-medium">Actions & Exit Strategies</h4>
            <Button variant="ghost" size="sm" onClick={() => onEdit(3)}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Edit
            </Button>
          </div>
          <div className="grid gap-4">
            <div className="space-y-4">
              <h5 className="text-sm font-medium">Trading Actions</h5>
              {data.config.actions.map((action: any, index: number) => (
                <div key={index} className="p-3 bg-muted rounded-lg">
                  <Badge>{action.type}</Badge>
                  <p className="text-sm mt-2">
                    {Object.entries(action.params || {}).map(([key, value]) => (
                      <span key={key} className="block">
                        {key}: {value as string}
                      </span>
                    ))}
                  </p>
                </div>
              ))}
            </div>
            <div className="space-y-4">
              <h5 className="text-sm font-medium">Exit Strategies</h5>
              {data.config.exitStrategies.map((strategy: any, index: number) => (
                <div key={index} className="p-3 bg-muted rounded-lg">
                  <Badge>
                    {strategy.type === "take_profit" && "Take Profit"}
                    {strategy.type === "stop_loss" && "Stop Loss"}
                    {strategy.type === "trailing_stop" && "Trailing Stop"}
                    {strategy.type === "time_based" && "Time-Based Exit"}
                  </Badge>
                  <p className="text-sm mt-2">
                    {strategy.parameters.value} {strategy.parameters.unit}
                    {strategy.type === "trailing_stop" && 
                      ` (${strategy.parameters.trailingDistance}% distance)`}
                    {strategy.type === "time_based" && 
                      ` after ${strategy.parameters.timeFrame}`}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="border-t pt-6 space-y-4">
          <div className="flex justify-between items-start">
            <h4 className="font-medium">Risk Management</h4>
            <Button variant="ghost" size="sm" onClick={() => onEdit(4)}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Edit
            </Button>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <span className="text-sm text-muted-foreground">Position Size:</span>
              <p className="font-medium">{data.config.riskManagement.maxPositionSize}%</p>
            </div>
            {data.config.riskManagement.stopLoss && (
              <div>
                <span className="text-sm text-muted-foreground">Stop Loss:</span>
                <p className="font-medium">{data.config.riskManagement.stopLoss}%</p>
              </div>
            )}
            {data.config.riskManagement.takeProfit && (
              <div>
                <span className="text-sm text-muted-foreground">Take Profit:</span>
                <p className="font-medium">{data.config.riskManagement.takeProfit}%</p>
              </div>
            )}
            {data.config.riskManagement.maxDrawdown && (
              <div>
                <span className="text-sm text-muted-foreground">Max Drawdown:</span>
                <p className="font-medium">{data.config.riskManagement.maxDrawdown}%</p>
              </div>
            )}
            {data.config.riskManagement.trailingStop && (
              <div>
                <span className="text-sm text-muted-foreground">Trailing Stop:</span>
                <p className="font-medium">{data.config.riskManagement.trailingStopDistance}%</p>
              </div>
            )}
            {data.config.riskManagement.maxOpenTrades && (
              <div>
                <span className="text-sm text-muted-foreground">Max Open Trades:</span>
                <p className="font-medium">{data.config.riskManagement.maxOpenTrades}</p>
              </div>
            )}
            {data.config.riskManagement.leverageEnabled && (
              <>
                <div>
                  <span className="text-sm text-muted-foreground">Max Leverage:</span>
                  <p className="font-medium">{data.config.riskManagement.maxLeverage}x</p>
                </div>
                <div>
                  <span className="text-sm text-muted-foreground">Margin Call Level:</span>
                  <p className="font-medium">{data.config.riskManagement.marginCallLevel}%</p>
                </div>
              </>
            )}
            {data.config.riskManagement.rebalanceThreshold && (
              <div>
                <span className="text-sm text-muted-foreground">Rebalance Threshold:</span>
                <p className="font-medium">{data.config.riskManagement.rebalanceThreshold}%</p>
              </div>
            )}
          </div>
        </div>
      </Card>
    </div>
  )
}