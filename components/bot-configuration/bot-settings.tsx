"use client"

import { useState } from "react"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Slider } from "@/components/ui/slider"
import { Switch } from "@/components/ui/switch"
import { useToast } from "@/components/ui/use-toast"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"

const botSettingsSchema = z.object({
  name: z.string().min(3, "Bot name must be at least 3 characters"),
  strategy: z.object({
    type: z.enum(["mean_reversion", "trend_following", "momentum", "custom"]),
    parameters: z.record(z.any()),
  }),
  riskManagement: z.object({
    maxPositionSize: z.number().min(0),
    stopLoss: z.number().min(0),
    takeProfit: z.number().min(0),
    maxDrawdown: z.number().min(0),
    useTrailingStop: z.boolean(),
  }),
  tradingSchedule: z.object({
    enabled: z.boolean(),
    startTime: z.string(),
    endTime: z.string(),
    timeZone: z.string(),
  }),
  assets: z.array(z.string()).min(1, "Select at least one asset"),
  notifications: z.object({
    email: z.boolean(),
    slack: z.boolean(),
    telegram: z.boolean(),
  }),
})

type BotSettings = z.infer<typeof botSettingsSchema>

interface BotSettingsProps {
  botId: string
  initialData?: BotSettings
  onSave: (settings: BotSettings) => Promise<void>
}

export function BotSettings({ botId, initialData, onSave }: BotSettingsProps) {
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(false)

  const form = useForm<BotSettings>({
    resolver: zodResolver(botSettingsSchema),
    defaultValues: initialData || {
      name: "",
      strategy: {
        type: "mean_reversion",
        parameters: {},
      },
      riskManagement: {
        maxPositionSize: 5000,
        stopLoss: 2,
        takeProfit: 4,
        maxDrawdown: 10,
        useTrailingStop: false,
      },
      tradingSchedule: {
        enabled: true,
        startTime: "09:30",
        endTime: "16:00",
        timeZone: "America/New_York",
      },
      assets: [],
      notifications: {
        email: true,
        slack: false,
        telegram: false,
      },
    },
  })

  const onSubmit = async (data: BotSettings) => {
    try {
      setIsLoading(true)
      await onSave(data)
      toast({
        title: "Settings saved",
        description: "Bot configuration has been updated successfully.",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save bot settings. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Bot Configuration</CardTitle>
            <CardDescription>
              Configure your trading bot's parameters and behavior
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Basic Settings */}
            <div className="space-y-4">
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
                name="strategy.type"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Trading Strategy</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a strategy" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="mean_reversion">
                          Mean Reversion
                        </SelectItem>
                        <SelectItem value="trend_following">
                          Trend Following
                        </SelectItem>
                        <SelectItem value="momentum">Momentum</SelectItem>
                        <SelectItem value="custom">Custom</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormDescription>
                      Choose the trading strategy for this bot
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Risk Management */}
            <div className="space-y-4">
              <h3 className="font-medium">Risk Management</h3>
              <FormField
                control={form.control}
                name="riskManagement.maxPositionSize"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Max Position Size ($)</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        {...field}
                        onChange={(e) => field.onChange(Number(e.target.value))}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid gap-4 grid-cols-2">
                <FormField
                  control={form.control}
                  name="riskManagement.stopLoss"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Stop Loss (%)</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          {...field}
                          onChange={(e) => field.onChange(Number(e.target.value))}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="riskManagement.takeProfit"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Take Profit (%)</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          {...field}
                          onChange={(e) => field.onChange(Number(e.target.value))}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="riskManagement.useTrailingStop"
                render={({ field }) => (
                  <FormItem className="flex items-center justify-between rounded-lg border p-3">
                    <div className="space-y-0.5">
                      <FormLabel>Trailing Stop Loss</FormLabel>
                      <FormDescription>
                        Automatically adjust stop loss as price moves in your favor
                      </FormDescription>
                    </div>
                    <FormControl>
                      <Switch
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
            </div>

            {/* Trading Schedule */}
            <div className="space-y-4">
              <h3 className="font-medium">Trading Schedule</h3>
              <FormField
                control={form.control}
                name="tradingSchedule.enabled"
                render={({ field }) => (
                  <FormItem className="flex items-center justify-between rounded-lg border p-3">
                    <div className="space-y-0.5">
                      <FormLabel>Enable Trading Schedule</FormLabel>
                      <FormDescription>
                        Restrict trading to specific hours
                      </FormDescription>
                    </div>
                    <FormControl>
                      <Switch
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />

              {form.watch("tradingSchedule.enabled") && (
                <div className="grid gap-4 grid-cols-2">
                  <FormField
                    control={form.control}
                    name="tradingSchedule.startTime"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Start Time</FormLabel>
                        <FormControl>
                          <Input type="time" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="tradingSchedule.endTime"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>End Time</FormLabel>
                        <FormControl>
                          <Input type="time" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              )}
            </div>

            {/* Notifications */}
            <div className="space-y-4">
              <h3 className="font-medium">Notifications</h3>
              <div className="space-y-4">
                <FormField
                  control={form.control}
                  name="notifications.email"
                  render={({ field }) => (
                    <FormItem className="flex items-center justify-between rounded-lg border p-3">
                      <div className="space-y-0.5">
                        <FormLabel>Email Notifications</FormLabel>
                        <FormDescription>
                          Receive trade alerts via email
                        </FormDescription>
                      </div>
                      <FormControl>
                        <Switch
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="notifications.slack"
                  render={({ field }) => (
                    <FormItem className="flex items-center justify-between rounded-lg border p-3">
                      <div className="space-y-0.5">
                        <FormLabel>Slack Notifications</FormLabel>
                        <FormDescription>
                          Receive trade alerts via Slack
                        </FormDescription>
                      </div>
                      <FormControl>
                        <Switch
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="notifications.telegram"
                  render={({ field }) => (
                    <FormItem className="flex items-center justify-between rounded-lg border p-3">
                      <div className="space-y-0.5">
                        <FormLabel>Telegram Notifications</FormLabel>
                        <FormDescription>
                          Receive trade alerts via Telegram
                        </FormDescription>
                      </div>
                      <FormControl>
                        <Switch
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="flex justify-end space-x-4">
          <Button
            type="button"
            variant="outline"
            onClick={() => form.reset()}
            disabled={isLoading}
          >
            Reset
          </Button>
          <Button type="submit" disabled={isLoading}>
            {isLoading ? "Saving..." : "Save Changes"}
          </Button>
        </div>
      </form>
    </Form>
  )