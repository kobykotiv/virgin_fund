import { useState } from "react"
import { SignalCard } from "@/components/signal/signal-card"
import { Modal } from "@/components/ui/modal"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { PlusCircle, LineChart, Code, Zap } from "lucide-react"

interface CustomSignalsTabProps {
  onSelectSignal: (signal: any) => void
}

export default function CustomSignalsTab({ onSelectSignal }: CustomSignalsTabProps) {
  const [signals, setSignals] = useState([
    {
      id: 1,
      title: "RSI Crossover",
      description: "Custom signal based on RSI crossing specific thresholds",
      type: "Formula",
      lastUpdated: "2 days ago",
      performance: "+12.5%",
    },
    {
      id: 2,
      title: "MACD Divergence",
      description: "Detects bullish and bearish divergences in MACD",
      type: "Script",
      lastUpdated: "1 week ago",
      performance: "+8.3%",
    },
    {
      id: 3,
      title: "Volume Spike",
      description: "Identifies unusual volume activity",
      type: "Formula",
      lastUpdated: "3 days ago",
      performance: "+5.7%",
    },
  ])
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [newSignal, setNewSignal] = useState({ title: "", description: "", type: "Formula" })

  const handleCreateSignal = () => {
    setSignals([
      ...signals,
      {
        id: signals.length + 1,
        ...newSignal,
        lastUpdated: "Just now",
        performance: "N/A",
      },
    ])
    setNewSignal({ title: "", description: "", type: "Formula" })
    setIsModalOpen(false)
  }

  const handleDeleteSignal = (id: number) => {
    setSignals(signals.filter((signal) => signal.id !== id))
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold">Custom Signals</h2>
        <Button onClick={() => setIsModalOpen(true)}>Create New Signal</Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {signals.map((signal) => (
          <SignalCard
            key={signal.id}
            title={signal.title}
            description={signal.description}
            type={signal.type}
            lastUpdated={signal.lastUpdated}
            performance={signal.performance}
            onDelete={() => handleDeleteSignal(signal.id)}
            onClick={() => onSelectSignal(signal)}
          />
        ))}
      </div>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
        <div className="space-y-4">
          <h3 className="text-lg font-bold">Create New Signal</h3>
          <Input
            placeholder="Signal Title"
            value={newSignal.title}
            onChange={(e) => setNewSignal({ ...newSignal, title: e.target.value })}
          />
          <Textarea
            placeholder="Signal Description"
            value={newSignal.description}
            onChange={(e) => setNewSignal({ ...newSignal, description: e.target.value })}
          />
          <Button onClick={handleCreateSignal}>Create Signal</Button>
        </div>
      </Modal>
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
  onClick?: () => void
}

function SignalCard({ title, description, type, lastUpdated, performance, backtest, onClick }: SignalCardProps) {
  return (
    <Card onClick={onClick}>
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

