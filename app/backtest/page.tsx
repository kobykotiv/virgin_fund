"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { BacktestForm } from "@/components/backtest-form"
import { BacktestResults } from "@/components/backtest-results"
import { runBacktest, saveBacktestResult, optimizeStrategy, getSavedBacktests } from "@/lib/backtest-service"
import { fetchBots } from "@/services/bot-service"
import type { Bot } from "@/types/bot"
import type { BacktestParams, BacktestResult } from "@/lib/backtest-service"
import { ArrowLeft, BarChart2, History } from "lucide-react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent } from "@/components/ui/tabs"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Checkbox } from "@/components/ui/checkbox"

export default function BacktestPage() {
  const [bots, setBots] = useState<Bot[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [backtestResult, setBacktestResult] = useState<BacktestResult | null>(null)
  const [savedBacktests, setSavedBacktests] = useState<BacktestResult[]>([])
  const [selectedBacktests, setSelectedBacktests] = useState<string[]>([])
  const [comparisonResults, setComparisonResults] = useState<BacktestResult[]>([])
  const [activeTab, setActiveTab] = useState<string>("new")
  const router = useRouter()

  useEffect(() => {
    const loadBots = async () => {
      try {
        const botData = await fetchBots()
        setBots(botData)
      } catch (error) {
        console.error("Error loading bots:", error)
      }
    }

    const loadSavedBacktests = async () => {
      try {
        const results = await getSavedBacktests()
        setSavedBacktests(results)
      } catch (error) {
        console.error("Error loading saved backtests:", error)
      }
    }

    loadBots()
    loadSavedBacktests()
  }, [])

  const handleRunBacktest = async (params: BacktestParams) => {
    setIsLoading(true)
    try {
      const selectedBot = bots.find((bot) => bot.id === params.botId)
      if (!selectedBot) throw new Error("Bot not found")

      const result = await runBacktest(selectedBot, params)
      setBacktestResult(result)
      setActiveTab("results")
    } catch (error) {
      console.error("Error running backtest:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleOptimizeStrategy = async (
    botId: string,
    paramToOptimize: string,
    rangeStart: number,
    rangeEnd: number,
    steps: number,
  ) => {
    setIsLoading(true)
    try {
      const selectedBot = bots.find((bot) => bot.id === botId)
      if (!selectedBot) throw new Error("Bot not found")

      // Create basic backtest params
      const params: BacktestParams = {
        botId,
        startDate: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
        endDate: new Date().toISOString().split("T")[0],
        initialCapital: 10000,
      }

      // Run optimization
      const optimizationResults = await optimizeStrategy(
        selectedBot,
        params,
        paramToOptimize,
        rangeStart,
        rangeEnd,
        steps,
      )

      // Run backtest with the best parameter
      if (optimizationResults.length > 0) {
        const bestParam = optimizationResults[0]
        const botCopy = JSON.parse(JSON.stringify(selectedBot)) as Bot

        // Update the parameter with the optimal value
        if (paramToOptimize.startsWith("indicator.")) {
          const indicatorParam = paramToOptimize.split(".")[1]
          if (botCopy.indicatorConfig) {
            botCopy.indicatorConfig[indicatorParam as keyof typeof botCopy.indicatorConfig] = bestParam.value as any
          }
        } else if (paramToOptimize.startsWith("grid.")) {
          const gridParam = paramToOptimize.split(".")[1]
          if (botCopy.gridConfig) {
            botCopy.gridConfig[gridParam as keyof typeof botCopy.gridConfig] = bestParam.value as any
          }
        } else if (paramToOptimize.startsWith("dca.")) {
          const dcaParam = paramToOptimize.split(".")[1]
          if (botCopy.dcaConfig) {
            botCopy.dcaConfig[dcaParam as keyof typeof botCopy.dcaConfig] = bestParam.value as any
          }
        } else if (paramToOptimize === "stopLoss") {
          botCopy.stopLoss = bestParam.value
        } else if (paramToOptimize === "takeProfit") {
          botCopy.takeProfit = bestParam.value
        }

        const result = await runBacktest(botCopy, params)

        // Add optimization results to the backtest result
        result.optimizationResults = optimizationResults

        setBacktestResult(result)
        setActiveTab("results")
      }
    } catch (error) {
      console.error("Error optimizing strategy:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleSaveResult = async (result: BacktestResult) => {
    try {
      await saveBacktestResult(result)
      const results = await getSavedBacktests()
      setSavedBacktests(results)
      alert("Backtest result saved successfully!")
    } catch (error) {
      console.error("Error saving backtest result:", error)
    }
  }

  const handleToggleBacktestSelection = (id: string) => {
    setSelectedBacktests((prev) => (prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]))
  }

  const handleCompareBacktests = () => {
    if (selectedBacktests.length === 0) return

    const results = savedBacktests.filter((result) => selectedBacktests.includes(result.id))

    if (results.length > 0) {
      setBacktestResult(results[0])
      setComparisonResults(results.slice(1))
      setActiveTab("results")
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString()
  }

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(value)
  }

  const formatPercentage = (value: number) => {
    return `${value > 0 ? "+" : ""}${value.toFixed(2)}%`
  }

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Button variant="outline" size="icon" onClick={() => router.push("/")}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <h1 className="text-2xl font-bold">Strategy Backtesting</h1>
        </div>
        <div className="flex gap-2">
          <Button variant={activeTab === "new" ? "default" : "outline"} onClick={() => setActiveTab("new")}>
            <BarChart2 className="h-4 w-4 mr-2" />
            New Backtest
          </Button>
          <Button variant={activeTab === "history" ? "default" : "outline"} onClick={() => setActiveTab("history")}>
            <History className="h-4 w-4 mr-2" />
            History
          </Button>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsContent value="new" className="mt-0">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-1">
              <BacktestForm
                bots={bots}
                onSubmit={handleRunBacktest}
                onOptimize={handleOptimizeStrategy}
                isLoading={isLoading}
              />
            </div>

            <div className="md:col-span-2">
              {backtestResult && activeTab === "new" ? (
                <BacktestResults
                  result={backtestResult}
                  onSave={handleSaveResult}
                  comparisonResults={comparisonResults}
                />
              ) : (
                <div className="h-full flex items-center justify-center border rounded-lg bg-card p-8">
                  <div className="text-center">
                    <h3 className="text-lg font-medium mb-2">No Backtest Results</h3>
                    <p className="text-muted-foreground">
                      Select a bot and configure your backtest parameters to run a simulation.
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </TabsContent>

        <TabsContent value="history" className="mt-0">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle>Backtest History</CardTitle>
                  <CardDescription>View and compare previous backtest results</CardDescription>
                </div>
                <Button onClick={handleCompareBacktests} disabled={selectedBacktests.length === 0}>
                  Compare Selected
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-12">
                        <span className="sr-only">Select</span>
                      </TableHead>
                      <TableHead>Bot Name</TableHead>
                      <TableHead>Date Range</TableHead>
                      <TableHead>Initial Capital</TableHead>
                      <TableHead>Final Capital</TableHead>
                      <TableHead>P&L</TableHead>
                      <TableHead>Sharpe</TableHead>
                      <TableHead>Trades</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {savedBacktests.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={8} className="text-center py-6 text-muted-foreground">
                          No saved backtest results
                        </TableCell>
                      </TableRow>
                    ) : (
                      savedBacktests.map((result) => (
                        <TableRow key={result.id}>
                          <TableCell>
                            <Checkbox
                              checked={selectedBacktests.includes(result.id)}
                              onCheckedChange={() => handleToggleBacktestSelection(result.id)}
                            />
                          </TableCell>
                          <TableCell className="font-medium">{result.botName}</TableCell>
                          <TableCell>
                            {formatDate(result.startDate)} - {formatDate(result.endDate)}
                          </TableCell>
                          <TableCell>{formatCurrency(result.initialCapital)}</TableCell>
                          <TableCell>{formatCurrency(result.finalCapital)}</TableCell>
                          <TableCell className={result.pnlPercentage >= 0 ? "text-green-500" : "text-red-500"}>
                            {formatPercentage(result.pnlPercentage)}
                          </TableCell>
                          <TableCell>{result.sharpeRatio.toFixed(2)}</TableCell>
                          <TableCell>{result.statistics.totalTrades}</TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="results" className="mt-0">
          {backtestResult ? (
            <BacktestResults result={backtestResult} onSave={handleSaveResult} comparisonResults={comparisonResults} />
          ) : (
            <div className="h-full flex items-center justify-center border rounded-lg bg-card p-8">
              <div className="text-center">
                <h3 className="text-lg font-medium mb-2">No Results to Display</h3>
                <p className="text-muted-foreground">Run a backtest or select saved results to view details.</p>
              </div>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}

