"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select } from "@/components/ui/select"
import { toast } from "@/components/ui/use-toast"
import { Plus, Edit, Trash } from "lucide-react"

interface CustomSignal {
  id: string
  name: string
  description: string
  conditions: {
    indicator: string
    operator: string
    value: number
  }[]
  notifications: {
    type: string
    enabled: boolean
  }
}

export default function CustomSignalsPage() {
  const [signals, setSignals] = useState<CustomSignal[]>([])
  const [isEditing, setIsEditing] = useState(false)
  const [currentSignal, setCurrentSignal] = useState<CustomSignal | null>(null)

  const handleSave = async (signal: CustomSignal) => {
    try {
      const response = await fetch("/api/signals", {
        method: isEditing ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(signal),
      })

      if (!response.ok) throw new Error("Failed to save signal")
      
      const savedSignal = await response.json()
      setSignals(prev => isEditing 
        ? prev.map(s => s.id === savedSignal.id ? savedSignal : s)
        : [...prev, savedSignal]
      )
      
      toast({
        title: "Success",
        description: `Signal ${isEditing ? "updated" : "created"} successfully`,
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save signal",
        variant: "destructive",
      })
    }
  }

  const handleDelete = async (id: string) => {
    try {
      await fetch(`/api/signals/${id}`, { method: "DELETE" })
      setSignals(prev => prev.filter(s => s.id !== id))
      toast({
        title: "Success",
        description: "Signal deleted successfully",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete signal",
        variant: "destructive",
      })
    }
  }

  return (
    <div className="container mx-auto py-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Custom Signals</h1>
        <Button onClick={() => setIsEditing(false)}>
          <Plus className="mr-2 h-4 w-4" />
          New Signal
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {signals.map(signal => (
          <Card key={signal.id}>
            <CardHeader>
              <CardTitle className="flex justify-between items-center">
                {signal.name}
                <div className="space-x-2">
                  <Button variant="ghost" size="icon" onClick={() => {
                    setCurrentSignal(signal)
                    setIsEditing(true)
                  }}>
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="icon" onClick={() => handleDelete(signal.id)}>
                    <Trash className="h-4 w-4" />
                  </Button>
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">{signal.description}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
