"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { useCreateStrategy } from "@/hooks/useStrategies"
import { useToast } from "@/hooks/use-toast"

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
  const router = useRouter()
  const { toast } = useToast()
  const createStrategy = useCreateStrategy()

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

  const handleSave = async () => {
    if (!signalConfig || !signalConfig.name.trim()) {
      toast({ title: "Invalid", description: "Please provide a signal name" })
      return
    }

    try {
      const payload = {
        name: signalConfig.name.trim(),
        description: signalConfig.description.trim(),
        // Persist conditions under a `parameters` object so strategies API can store them
        parameters: { conditions: signalConfig.conditions },
        is_public: false,
      }

      await createStrategy.mutateAsync(payload)
      toast({ title: "Saved", description: "Signal saved to your Strategies library" })
      // Optionally refresh the page so lists update
      try {
        router.refresh()
      } catch (e) {
        // no-op if router not available
      }
    } catch (err: any) {
      toast({ title: "Error", description: err?.message || "Failed to save strategy" })
    }
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
            <Button className="text-sm px-3 py-1 border border-input bg-background hover:bg-accent" onClick={handleAddCondition}>
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
                    className="mt-2 text-destructive bg-transparent"
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
