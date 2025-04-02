import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { useRouter } from "next/router"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Stepper, Step, StepLabel } from "@/components/ui/stepper"
import { toast } from "@/components/ui/use-toast"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"

// Bot creation form schema matching MongoDB
const botSchema = z.object({
  name: z.string().min(3).max(50),
  type: z.enum(["indicator", "grid", "dca", "basket", "momentum", "meanReversion", "arbitrage", "sentiment", "ml", "custom"]),
  config: z.object({
    signals: z.array(z.object({
      type: z.string(),
      params: z.record(z.any())
    })),
    conditions: z.array(z.object({
      type: z.string(),
      operator: z.string(),
      value: z.any()
    })),
    actions: z.array(z.object({
      type: z.string(),
      params: z.record(z.any())
    })),
    riskManagement: z.object({
      maxPositionSize: z.number(),
      stopLoss: z.number().optional(),
      takeProfit: z.number().optional(),
      maxDrawdown: z.number().optional(),
      trailingStop: z.boolean().optional()
    }),
    timeframes: z.array(z.string()),
    assets: z.array(z.string())
  })
})

type BotFormData = z.infer<typeof botSchema>

const steps = ["Basic Info", "Signals", "Conditions", "Actions", "Risk Management", "Review"]

export function BotCreationForm() {
  const [activeStep, setActiveStep] = useState(0)
  const router = useRouter()
  
  const form = useForm<BotFormData>({
    resolver: zodResolver(botSchema),
    defaultValues: {
      config: {
        signals: [],
        conditions: [],
        actions: [],
        riskManagement: {
          maxPositionSize: 0,
        },
        timeframes: [],
        assets: []
      }
    }
  })

  function handleNext() {
    setActiveStep((prev) => Math.min(prev + 1, steps.length - 1))
  }

  function handleBack() {
    setActiveStep((prev) => Math.max(prev - 1, 0))
  }

  async function onSubmit(data: BotFormData) {
    try {
      const response = await fetch("/api/bots", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      })

      if (!response.ok) throw new Error("Failed to create bot")

      const bot = await response.json()
      toast({
        title: "Bot Created",
        description: "Your trading bot has been created successfully",
      })
      
      router.push(`/dashboard/bots/${bot._id}`)
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create bot. Please try again.",
        variant: "destructive",
      })
    }
  }

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle>Create Trading Bot</CardTitle>
        <CardDescription>Configure your automated trading strategy</CardDescription>
      </CardHeader>
      <CardContent>
        <Stepper activeStep={activeStep} orientation="horizontal" className="mb-8">
          {steps.map((label) => (
            <Step key={label}>
              <StepLabel>{label}</StepLabel>
            </Step>
          ))}
        </Stepper>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {/* Step 1: Basic Info */}
            {activeStep === 0 && (
              <div className="space-y-4">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Bot Name</FormLabel>
                      <FormControl>
                        <Input placeholder="My Trading Bot" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="type"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Bot Type</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select bot type" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="indicator">Indicator-based</SelectItem>
                          <SelectItem value="grid">Grid Trading</SelectItem>
                          <SelectItem value="dca">Dollar Cost Averaging</SelectItem>
                          <SelectItem value="basket">Basket Trading</SelectItem>
                          <SelectItem value="momentum">Momentum</SelectItem>
                          <SelectItem value="meanReversion">Mean Reversion</SelectItem>
                          <SelectItem value="arbitrage">Arbitrage</SelectItem>
                          <SelectItem value="sentiment">Sentiment Analysis</SelectItem>
                          <SelectItem value="ml">Machine Learning</SelectItem>
                          <SelectItem value="custom">Custom Strategy</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            )}

            {/* Step 2: Signals */}
            {activeStep === 1 && (
              <SignalBuilder
                signals={form.watch("config.signals")}
                onChange={(signals) => form.setValue("config.signals", signals)}
              />
            )}

            {/* Step 3: Conditions */}
            {activeStep === 2 && (
              <ConditionBuilder
                conditions={form.watch("config.conditions")}
                signals={form.watch("config.signals")}
                onChange={(conditions) => form.setValue("config.conditions", conditions)}
              />
            )}

            {/* Step 4: Actions */}
            {activeStep === 3 && (
              <ActionBuilder
                actions={form.watch("config.actions")}
                onChange={(actions) => form.setValue("config.actions", actions)}
              />
            )}

            {/* Step 5: Risk Management */}
            {activeStep === 4 && (
              <RiskManagementForm
                riskManagement={form.watch("config.riskManagement")}
                onChange={(riskManagement) => form.setValue("config.riskManagement", riskManagement)}
              />
            )}

            {/* Step 6: Review */}
            {activeStep === 5 && (
              <BotReview
                data={form.watch()}
                onEdit={(step) => setActiveStep(step)}
              />
            )}

            <div className="flex justify-between pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={handleBack}
                disabled={activeStep === 0}
              >
                Back
              </Button>
              
              {activeStep === steps.length - 1 ? (
                <Button type="submit">Create Bot</Button>
              ) : (
                <Button type="button" onClick={handleNext}>
                  Next
                </Button>
              )}
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  )
}

// Sub-components for each step
function SignalBuilder({ signals, onChange }) {
  // Implementation for signal configuration
  return (
    <div className="space-y-4">
      {/* Signal configuration UI */}
    </div>
  )
}

function ConditionBuilder({ conditions, signals, onChange }) {
  // Implementation for condition configuration
  return (
    <div className="space-y-4">
      {/* Condition configuration UI */}
    </div>
  )
}

function ActionBuilder({ actions, onChange }) {
  // Implementation for action configuration
  return (
    <div className="space-y-4">
      {/* Action configuration UI */}
    </div>
  )
}

function RiskManagementForm({ riskManagement, onChange }) {
  // Implementation for risk management configuration
  return (
    <div className="space-y-4">
      {/* Risk management configuration UI */}
    </div>
  )
}

function BotReview({ data, onEdit }) {
  // Implementation for final review
  return (
    <div className="space-y-4">
      {/* Review UI */}
    </div>
  )
}