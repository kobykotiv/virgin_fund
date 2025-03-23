import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { PlusCircle, LineChart, Code, Zap } from "lucide-react"

export default function CustomSignalsTab() {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Custom Signals</h2>
        <Button>
          <PlusCircle className="mr-2 h-4 w-4" />
          Create New Signal
        </Button>
      </div>

      <Tabs defaultValue="all" className="space-y-4">
        <TabsList>
          <TabsTrigger value="all">All Signals</TabsTrigger>
          <TabsTrigger value="active">Active</TabsTrigger>
          <TabsTrigger value="backtest">Backtest Results</TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {/* Sample Signal Cards */}
            <SignalCard
              title="RSI Crossover"
              description="Custom signal based on RSI crossing specific thresholds"
              type="Formula"
              lastUpdated="2 days ago"
              performance="+12.5%"
            />
            <SignalCard
              title="MACD Divergence"
              description="Detects bullish and bearish divergences in MACD"
              type="Script"
              lastUpdated="1 week ago"
              performance="+8.3%"
            />
            <SignalCard
              title="Volume Spike"
              description="Identifies unusual volume activity"
              type="Formula"
              lastUpdated="3 days ago"
              performance="+5.7%"
            />
            <Card className="border-dashed border-2 hover:border-primary/50 cursor-pointer">
              <CardContent className="flex flex-col items-center justify-center h-[200px]">
                <PlusCircle className="h-8 w-8 text-muted-foreground mb-2" />
                <p className="text-muted-foreground">Create New Signal</p>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="active" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <SignalCard
              title="RSI Crossover"
              description="Custom signal based on RSI crossing specific thresholds"
              type="Formula"
              lastUpdated="2 days ago"
              performance="+12.5%"
            />
            <SignalCard
              title="Volume Spike"
              description="Identifies unusual volume activity"
              type="Formula"
              lastUpdated="3 days ago"
              performance="+5.7%"
            />
          </div>
        </TabsContent>

        <TabsContent value="backtest" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <SignalCard
              title="MACD Divergence"
              description="Detects bullish and bearish divergences in MACD"
              type="Script"
              lastUpdated="1 week ago"
              performance="+8.3%"
              backtest={true}
            />
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}

interface SignalCardProps {
  title: string
  description: string
  type: "Formula" | "Script"
  lastUpdated: string
  performance: string
  backtest?: boolean
}

function SignalCard({ title, description, type, lastUpdated, performance, backtest }: SignalCardProps) {
  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-start">
          <CardTitle>{title}</CardTitle>
          {type === "Formula" ? (
            <LineChart className="h-5 w-5 text-muted-foreground" />
          ) : (
            <Code className="h-5 w-5 text-muted-foreground" />
          )}
        </div>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground">Last updated: {lastUpdated}</span>
          <span className={`font-medium ${performance.startsWith("+") ? "text-green-500" : "text-red-500"}`}>
            {performance}
          </span>
        </div>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button variant="outline" size="sm">
          Edit
        </Button>
        {backtest ? (
          <Button variant="outline" size="sm">
            View Results
          </Button>
        ) : (
          <Button variant="outline" size="sm">
            <Zap className="mr-1 h-4 w-4" />
            Backtest
          </Button>
        )}
      </CardFooter>
    </Card>
  )
}

