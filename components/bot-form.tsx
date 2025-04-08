"use client"

import type React from "react"

import { useState, useEffect } from "react"
import type { Bot, BotType } from "@/types/bot"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { X, Plus, Info } from "lucide-react"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
// Add subscription tier check to the BotForm component
// Import the useSubscription hook at the top of the file
import { useSubscription } from "@/providers/subscription-provider"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { useBot } from "@/hooks/use-bot"

const botFormSchema = z.object({
  name: z.string().min(1).max(50),
  type: z.enum(["indicator", "grid", "dca", "basket"]),
  assets: z.array(z.string()).min(1),
  // Add validation for strategy-specific fields
  indicatorConfig: z.object({
    type: z.enum(["rsi", "macd", "bollinger"]),
    timeframe: z.string(),
    entryThreshold: z.number(),
    exitThreshold: z.number()
  }).optional(),
  gridConfig: z.object({
    gridSize: z.number(),
    upperLimit: z.number(),
    lowerLimit: z.number(),
    quantity: z.number()
  }).optional(),
  dcaConfig: z.object({
    interval: z.string(),
    amount: z.number()
  }).optional()
})

interface BotFormProps {
  initialData?: Bot
  onSuccess?: (bot: Bot) => void
}

export function BotForm({ initialData, onSuccess }: BotFormProps) {
  const [isLoading, setIsLoading] = useState(false)
  const { createBot, updateBot } = useBot()

  const form = useForm<z.infer<typeof botFormSchema>>({
    resolver: zodResolver(botFormSchema),
    defaultValues: initialData || {
      name: "",
      type: "indicator",
      assets: [],
    }
  })

  const onSubmit = async (values: z.infer<typeof botFormSchema>) => {
    try {
      setIsLoading(true)
      const bot = initialData 
        ? await updateBot(initialData.id, values)
        : await createBot(values)
      onSuccess?.(bot)
    } catch (error) {
      console.error(error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Bot Name</FormLabel>
              <FormControl>
                <Input {...field} />
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
              <FormLabel>Strategy Type</FormLabel>
              <Select 
                onValueChange={field.onChange} 
                defaultValue={field.value}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a strategy type" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="indicator">Indicator</SelectItem>
                  <SelectItem value="grid">Grid Trading</SelectItem>
                  <SelectItem value="dca">Dollar Cost Averaging</SelectItem>
                  <SelectItem value="basket">Portfolio Basket</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Add strategy-specific configuration fields */}
        {form.watch("type") === "indicator" && (
          <FormField
            control={form.control}
            name="indicatorConfig.type"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Indicator Type</FormLabel>
                <Select 
                  onValueChange={field.onChange} 
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select an indicator" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="rsi">RSI</SelectItem>
                    <SelectItem value="macd">MACD</SelectItem>
                    <SelectItem value="bollinger">Bollinger Bands</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        )}

        <Button type="submit" disabled={isLoading}>
          {initialData ? "Update Bot" : "Create Bot"}
        </Button>
      </form>
    </Form>
  )
}

