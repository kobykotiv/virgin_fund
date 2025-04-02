"use client"

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

const OPERATORS = [
  { value: "CROSSES_ABOVE", label: "Crosses Above" },
  { value: "CROSSES_BELOW", label: "Crosses Below" },
  { value: "GREATER_THAN", label: "Greater Than" },
  { value: "LESS_THAN", label: "Less Than" },
  { value: "EQUALS", label: "Equals" },
  { value: "NOT_EQUALS", label: "Not Equals" },
  { value: "BETWEEN", label: "Between" }
]

interface Condition {
  signal: number
  operator: string
  comparison: {
    type: "value" | "signal"
    value?: number
    signalIndex?: number
    upperBound?: number
    lowerBound?: number
  }
}

interface ConditionBuilderProps {
  conditions: Condition[]
  signals: any[]
  onChange: (conditions: Condition[]) => void
}

export function ConditionBuilder({ conditions, signals, onChange }: ConditionBuilderProps) {
  const [selectedSignal, setSelectedSignal] = useState<number>(0)
  const [selectedOperator, setSelectedOperator] = useState<string>("")
  const [comparisonType, setComparisonType] = useState<"value" | "signal">("value")
  const [comparisonValue, setComparisonValue] = useState<number>()
  const [comparisonSignal, setComparisonSignal] = useState<number>()
  const [upperBound, setUpperBound] = useState<number>()
  const [lowerBound, setLowerBound] = useState<number>()

  const handleAddCondition = () => {
    const newCondition: Condition = {
      signal: selectedSignal,
      operator: selectedOperator,
      comparison: {
        type: comparisonType,
        ...(comparisonType === "value" ? { value: comparisonValue } : { signalIndex: comparisonSignal }),
        ...(selectedOperator === "BETWEEN" ? { upperBound, lowerBound } : {})
      }
    }

    onChange([...conditions, newCondition])

    // Reset form
    setSelectedOperator("")
    setComparisonType("value")
    setComparisonValue(undefined)
    setComparisonSignal(undefined)
    setUpperBound(undefined)
    setLowerBound(undefined)
  }

  const handleRemoveCondition = (index: number) => {
    const newConditions = conditions.filter((_, i) => i !== index)
    onChange(newConditions)
  }

  const isValidCondition = () => {
    if (!selectedSignal || !selectedOperator) return false
    
    if (selectedOperator === "BETWEEN") {
      return lowerBound !== undefined && upperBound !== undefined
    }

    if (comparisonType === "value") {
      return comparisonValue !== undefined
    }

    return comparisonSignal !== undefined
  }

  const renderComparisonInput = () => {
    if (selectedOperator === "BETWEEN") {
      return (
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>Lower Bound</Label>
            <Input
              type="number"
              value={lowerBound || ""}
              onChange={(e) => setLowerBound(parseFloat(e.target.value))}
            />
          </div>
          <div className="space-y-2">
            <Label>Upper Bound</Label>
            <Input
              type="number"
              value={upperBound || ""}
              onChange={(e) => setUpperBound(parseFloat(e.target.value))}
            />
          </div>
        </div>
      )
    }

    return (
      <div className="space-y-4">
        <div className="space-y-2">
          <Label>Compare With</Label>
          <Select
            value={comparisonType}
            onValueChange={(value: "value" | "signal") => setComparisonType(value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select comparison type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="value">Fixed Value</SelectItem>
              <SelectItem value="signal">Another Signal</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {comparisonType === "value" ? (
          <div className="space-y-2">
            <Label>Value</Label>
            <Input
              type="number"
              value={comparisonValue || ""}
              onChange={(e) => setComparisonValue(parseFloat(e.target.value))}
            />
          </div>
        ) : (
          <div className="space-y-2">
            <Label>Signal</Label>
            <Select
              value={comparisonSignal?.toString()}
              onValueChange={(value) => setComparisonSignal(parseInt(value))}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select signal" />
              </SelectTrigger>
              <SelectContent>
                {signals.map((signal, index) => (
                  <SelectItem key={index} value={index.toString()}>
                    Signal {index + 1}: {signal.type}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )}
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <Label>Trading Conditions</Label>
        <Tooltip>
          <TooltipTrigger asChild>
            <Info className="h-4 w-4 text-muted-foreground" />
          </TooltipTrigger>
          <TooltipContent>
            <p>Define conditions