"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"

// Define types for our signal configuration
interface SignalCondition {
  type: string
  value: string
  operator: string
}

interface SignalConfig {
  name: string
  description: string
  conditions: SignalCondition[]
}

export function SignalBuilder() {
  // Initialize with safe default values
  const [signalConfig, setSignalConfig] = useState<SignalConfig>({
    name: "",
    description: "",
    conditions: [{ type: "price", operator: "above", value: "" }],
  })

  const handleAddCondition = () => {
    setSignalConfig({
      ...signalConfig,
      conditions: [...signalConfig.conditions, { type: "price", operator: "above", value: "" }],
    })
  }

  const handleRemoveCondition = (index: number) => {
    const newConditions = [...signalConfig.conditions]
    newConditions.splice(index, 1)
    setSignalConfig({
      ...signalConfig,
      conditions: newConditions,
    })
  }

  const updateCondition = (index: number, field: keyof SignalCondition, value: string) => {
    const newConditions = [...signalConfig.conditions]
    newConditions[index] = {
      ...newConditions[index],
      [field]: value,
    }
    setSignalConfig({
      ...signalConfig,
      conditions: newConditions,
    })
  }

  const handleSave = () => {
    // Ensure we're not passing null or undefined to Object.entries
    if (!signalConfig) {
      console.error("Signal configuration is undefined or null")
      return
    }

    // Here you would typically save the configuration
    console.log("Saving signal configuration:", signalConfig)
    // API call would go here
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Create Custom Signal</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="name">Signal Name</Label>
          <Input
            id="name"
            value={signalConfig.name}
            onChange={(e) => setSignalConfig({ ...signalConfig, name: e.target.value })}
            placeholder="Enter signal name"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="description">Description</Label>
          <Textarea
            id="description"
            value={signalConfig.description}
            onChange={(e) => setSignalConfig({ ...signalConfig, description: e.target.value })}
            placeholder="Describe what this signal detects"
          />
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <Label>Conditions</Label>
            <Button variant="outline" size="sm" onClick={handleAddCondition}>
              Add Condition
            </Button>
          </div>

          {signalConfig.conditions &&
            signalConfig.conditions.map((condition, index) => (
              <Card key={index}>
                <CardContent className="pt-6">
                  <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                    <div>
                      <Label htmlFor={`condition-type-${index}`}>Type</Label>
                      <Select value={condition.type} onValueChange={(value) => updateCondition(index, "type", value)}>
                        <SelectTrigger id={`condition-type-${index}`}>
                          <SelectValue placeholder="Select type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="price">Price</SelectItem>
                          <SelectItem value="volume">Volume</SelectItem>
                          <SelectItem value="market_cap">Market Cap</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label htmlFor={`condition-operator-${index}`}>Operator</Label>
                      <Select
                        value={condition.operator}
                        onValueChange={(value) => updateCondition(index, "operator", value)}
                      >
                        <SelectTrigger id={`condition-operator-${index}`}>
                          <SelectValue placeholder="Select operator" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="above">Above</SelectItem>
                          <SelectItem value="below">Below</SelectItem>
                          <SelectItem value="equals">Equals</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label htmlFor={`condition-value-${index}`}>Value</Label>
                      <Input
                        id={`condition-value-${index}`}
                        value={condition.value}
                        onChange={(e) => updateCondition(index, "value", e.target.value)}
                        placeholder="Enter value"
                      />
                    </div>
                  </div>

                  <Button
                    variant="ghost"
                    size="sm"
                    className="mt-2 text-destructive"
                    onClick={() => handleRemoveCondition(index)}
                    disabled={signalConfig.conditions.length <= 1}
                  >
                    Remove
                  </Button>
                </CardContent>
              </Card>
            ))}
        </div>
      </CardContent>
      <CardFooter>
        <Button onClick={handleSave}>Save Signal</Button>
      </CardFooter>
    </Card>
  )
}

