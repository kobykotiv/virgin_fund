"use client"

import { useState, useEffect } from "react"
import { BacktestForm } from "@/components/backtest-form"
import { BacktestResults } from "@/components/backtest-results"
import { BacktestService } from "@/services/backtest-service" 
import { DashboardHeader } from "@/components/dashboard-header"
import { DashboardShell } from "@/components/dashboard-shell"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useAuth } from "@/providers/auth-provider"
import { Button } from "@/components/ui/button"
import { useToast } from "@/components/ui/use-toast"
import { useBots } from "@/hooks/useBots"
import { Bot } from "@/types/bot"

export default function BacktestPage() {
  const [activeTab, setActiveTab] = useState("form")
  const [isRunning, setIsRunning] = useState(false)
  const [backtestResults, setBacktestResults] = useState<any>(null)
  const [selectedBot, setSelectedBot] = useState<Bot | null>(null)
  const { bots, fetchBots } = useBots()
  const { apiKey, secretKey, isPaper, isDemoMode } = useAuth()
  const { toast } = useToast()
  
  useEffect(() => {
    fetchBots()
  }, [fetchBots])

  const handleRunBacktest = async (botId: string, params: any) => {
    setIsRunning(true)
    
    try {
      const bot = bots.find(b => b.id === botId)
      if (!bot) {
        throw new Error("Selected bot not found")
      }
      
      setSelectedBot(bot)
      
      // Create a backtest service instance
      const backtestService = new BacktestService(
        apiKey || "demo",
        secretKey || "demo",
        isPaper || isDemoMode
      )
      
      // Run the backtest
      const result = await backtestService.runBacktest(
        bot,
        params.startDate,
        params.endDate,
        params.initialCapital
      )
      
      setBacktestResults(result)
      setActiveTab("results")
      
      toast({
        title: "Backtest completed",
        description: "Your trading strategy has been evaluated successfully.",
      })
    } catch (error) {
      console.error("Backtest error:", error)
      toast({
        title: "Backtest failed",
        description: error instanceof Error ? error.message : "An unknown error occurred",
        variant: "destructive"
      })
    } finally {
      setIsRunning(false)
    }
  }
  
  const handleSaveResults = async (results: any) => {
    // Save backtest results logic would go here
    toast({
      title: "Results saved",
      description: "Backtest results have been saved successfully.",
    })
  }

  return (
    <DashboardShell>
      <DashboardHeader heading="Strategy Backtesting" text="Test your trading strategies on historical data" />
      
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList>
          <TabsTrigger value="form">Configuration</TabsTrigger>
          <TabsTrigger value="results" disabled={!backtestResults}>Results</TabsTrigger>
        </TabsList>
        
        <TabsContent value="form" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Backtest Configuration</CardTitle>
              <CardDescription>
                Configure your backtest parameters
              </CardDescription>
            </CardHeader>
            <CardContent>
              <BacktestForm 
                bots={bots}
                onSubmit={handleRunBacktest}
                isLoading={isRunning}
              />
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="results">
          {backtestResults && (
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Backtest Results: {selectedBot?.name}</CardTitle>
                    <CardDescription>
                      {new Date(backtestResults.startDate).toLocaleDateString()} - {new Date(backtestResults.endDate).toLocaleDateString()}
                    </CardDescription>
                  </div>
                  <Button variant="outline" onClick={() => setActiveTab("form")}>
                    New Backtest
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <BacktestResults 
                  result={backtestResults}
                  onSave={handleSaveResults}
                />
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </DashboardShell>
  )
}

