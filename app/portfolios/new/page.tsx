"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { toast } from "@/components/ui/use-toast"
import { ArrowLeft } from "lucide-react"

export default function CreatePortfolioPage() {
  const router = useRouter()
  
  const [name, setName] = useState("")
  const [description, setDescription] = useState("")
  const [type, setType] = useState<"standard" | "margin" | "retirement" | "managed">("standard")
  const [strategy, setStrategy] = useState<"passive" | "active" | "automated" | "copy">("passive")
  const [risk, setRisk] = useState<"conservative" | "moderate" | "aggressive">("moderate")
  const [isSubmitting, setIsSubmitting] = useState(false)
  
  const handleCreatePortfolio = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!name) {
      toast({
        variant: "destructive",
        title: "Validation Error",
        description: "Portfolio name is required"
      })
      return
    }
    
    setIsSubmitting(true)
    
    try {
      const response = await fetch("/api/db/portfolios", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          name,
          description,
          type,
          strategy,
          risk
        })
      })
      
      if (!response.ok) throw new Error("Failed to create portfolio")
      
      const portfolio = await response.json()
      
      toast({
        title: "Portfolio Created",
        description: "Your new portfolio has been created successfully"
      })
      
      router.push(`/portfolios/${portfolio.id}`)
    } catch (err: any) {
      console.error("Error creating portfolio:", err)
      toast({
        variant: "destructive",
        title: "Creation Failed",
        description: err.message || "Failed to create portfolio"
      })
    } finally {
      setIsSubmitting(false)
    }
  }
  
  return (
    <div className="container py-6">
      <div className="flex items-center gap-4 mb-6">
        <Button variant="ghost" size="sm" onClick={() => router.back()}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back
        </Button>
        <div>
          <h1 className="text-2xl font-bold">Create New Portfolio</h1>
          <p className="text-muted-foreground">Set up your investment portfolio</p>
        </div>
      </div>
      
      <div className="max-w-2xl mx-auto">
        <Card>
          <form onSubmit={handleCreatePortfolio}>
            <CardHeader>
              <CardTitle>Portfolio Details</CardTitle>
              <CardDescription>
                Enter the basic information for your new portfolio
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Portfolio Name</Label>
                <Input
                  id="name"
                  placeholder="My Investment Portfolio"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="description">Description (Optional)</Label>
                <Textarea
                  id="description"
                  placeholder="Describe your portfolio strategy and goals"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={3}
                />
              </div>
              
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="type">Account Type</Label>
                  <Select
                    value={type}
                    onValueChange={(value: "standard" | "margin" | "retirement" | "managed") => setType(value)}
                  >
                    <SelectTrigger id="type">
                      <SelectValue placeholder="Select account type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="standard">Standard</SelectItem>
                      <SelectItem value="margin">Margin</SelectItem>
                      <SelectItem value="retirement">Retirement</SelectItem>
                      <SelectItem value="managed">Managed</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="strategy">Investment Strategy</Label>
                  <Select
                    value={strategy}
                    onValueChange={(value: "passive" | "active" | "automated" | "copy") => setStrategy(value)}
                  >
                    <SelectTrigger id="strategy">
                      <SelectValue placeholder="Select strategy" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="passive">Passive</SelectItem>
                      <SelectItem value="active">Active</SelectItem>
                      <SelectItem value="automated">Automated</SelectItem>
                      <SelectItem value="copy">Copy Trading</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="risk">Risk Profile</Label>
                <Select
                  value={risk}
                  onValueChange={(value: "conservative" | "moderate" | "aggressive") => setRisk(value)}
                >
                  <SelectTrigger id="risk">
                    <SelectValue placeholder="Select risk profile" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="conservative">Conservative</SelectItem>
                    <SelectItem value="moderate">Moderate</SelectItem>
                    <SelectItem value="aggressive">Aggressive</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button variant="outline" type="button" onClick={() => router.back()}>
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? "Creating..." : "Create Portfolio"}
              </Button>
            </CardFooter>
          </form>
        </Card>
      </div>
    </div>
  )
}
