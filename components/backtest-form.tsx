"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { cn } from "@/lib/utils"
import { CalendarIcon, Bot, BarChartHorizontal } from "lucide-react"
import { format } from "date-fns"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { Bot as BotType } from "@/types/bot"
import { Card, CardContent } from "@/components/ui/card"

const formSchema = z.object({
  botId: z.string({
    required_error: "Please select a bot to backtest",
  }),
  startDate: z.date({
    required_error: "Start date is required",
  }),
  endDate: z.date({
    required_error: "End date is required",
  }).min(
    new Date("2020-01-01"),
    "End date must be after January 1, 2020"
  ),
  initialCapital: z.coerce.number({
    required_error: "Initial capital is required",
  }).positive("Initial capital must be positive"),
})

interface BacktestFormProps {
  bots: BotType[]
  onSubmit: (botId: string, params: z.infer<typeof formSchema>) => void
  isLoading: boolean
}

export function BacktestForm({ bots, onSubmit, isLoading }: BacktestFormProps) {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      initialCapital: 10000,
    },
  })

  const [selectedBot, setSelectedBot] = useState<BotType | null>(null)
  
  const handleSubmit = form.handleSubmit((data) => {
    onSubmit(data.botId, data)
  })
  
  const handleBotSelection = (botId: string) => {
    setSelectedBot(bots.find(bot => bot.id === botId) || null)
    form.setValue("botId", botId)
  }

  return (
    <Form {...form}>
      <form onSubmit={handleSubmit} className="space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-6">
            {/* Bot Selection */}
            <FormField
              control={form.control}
              name="botId"
              render={({ field }) => (
                <FormItem className="col-span-2 md:col-span-1">
                  <FormLabel>Bot Selection</FormLabel>
                  <Select
                    onValueChange={handleBotSelection}
                    defaultValue={field.value}
                    disabled={isLoading}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a bot to backtest" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {bots.map((bot) => (
                        <SelectItem key={bot.id} value={bot.id}>
                          {bot.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormDescription>
                    Select the trading bot strategy to evaluate
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Date Range Selection */}
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="startDate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Start Date</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant="outline"
                            className={cn(
                              "w-full pl-3 text-left font-normal",
                              !field.value && "text-muted-foreground"
                            )}
                            disabled={isLoading}
                          >
                            {field.value ? (
                              format(field.value, "PPP")
                            ) : (
                              <span>Pick a date</span>
                            )}
                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={field.value}
                          onSelect={field.onChange}
                          disabled={(date) => 
                            date > new Date() || date < new Date("2020-01-01")
                          }
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                    <FormDescription>
                      Historical data start date
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="endDate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>End Date</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant="outline"
                            className={cn(
                              "w-full pl-3 text-left font-normal",
                              !field.value && "text-muted-foreground"
                            )}
                            disabled={isLoading}
                          >
                            {field.value ? (
                              format(field.value, "PPP")
                            ) : (
                              <span>Pick a date</span>
                            )}
                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={field.value}
                          onSelect={field.onChange}
                          disabled={(date) => 
                            date > new Date() || 
                            date < new Date("2020-01-01") ||
                            (form.getValues("startDate") && date < form.getValues("startDate"))
                          }
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                    <FormDescription>
                      Historical data end date
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Capital Input */}
            <FormField
              control={form.control}
              name="initialCapital"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Initial Capital</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      placeholder="10000"
                      {...field}
                      disabled={isLoading}
                    />
                  </FormControl>
                  <FormDescription>
                    Starting capital for the backtest (USD)
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? "Running..." : "Run Backtest"}
            </Button>
          </div>

          {/* Bot Info Card */}
          <Card className="h-fit">
            <CardContent className="pt-6">
              {selectedBot ? (
                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    <Bot className="h-5 w-5 text-primary" />
                    <h3 className="font-medium text-lg">{selectedBot.name}</h3>
                  </div>
                  
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Type:</span>
                      <span className="font-medium">{selectedBot.type}</span>
                    </div>
                    
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Assets:</span>
                      <span className="font-medium">{selectedBot.assets.join(', ')}</span>
                    </div>
                    
                    {selectedBot.gridConfig && (
                      <>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Grid Size:</span>
                          <span className="font-medium">{selectedBot.gridConfig.gridSize}%</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Price Range:</span>
                          <span className="font-medium">
                            {selectedBot.gridConfig.lowerLimit} - {selectedBot.gridConfig.upperLimit}
                          </span>
                        </div>
                      </>
                    )}
                    
                    {selectedBot.dcaConfig && (
                      <>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Amount:</span>
                          <span className="font-medium">${selectedBot.dcaConfig.amount}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Interval:</span>
                          <span className="font-medium">{selectedBot.dcaConfig.interval}</span>
                        </div>
                      </>
                    )}
                    
                    {selectedBot.indicatorConfig && (
                      <>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Indicator:</span>
                          <span className="font-medium">{selectedBot.indicatorConfig.type}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Thresholds:</span>
                          <span className="font-medium">
                            {selectedBot.indicatorConfig.entryThreshold} / {selectedBot.indicatorConfig.exitThreshold}
                          </span>
                        </div>
                      </>
                    )}
                  </div>
                  
                  <div className="flex items-center pt-2 border-t">
                    <BarChartHorizontal className="h-4 w-4 mr-2 text-muted-foreground" />
                    <span className="text-sm text-muted-foreground">
                      This bot will be tested against historical market data
                    </span>
                  </div>
                </div>
              ) : (
                <div className="h-full flex flex-col items-center justify-center p-6 text-center space-y-3">
                  <Bot className="h-12 w-12 text-muted-foreground/50" />
                  <div className="space-y-1">
                    <h3 className="font-medium">Select a Bot</h3>
                    <p className="text-sm text-muted-foreground">
                      Choose a bot to see its configuration details and run a backtest
                    </p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </form>
    </Form>
  )
}

