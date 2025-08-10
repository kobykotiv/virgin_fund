// components/DemoAccountOnboarding.tsx

import React, { useState } from "react"
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { useRouter } from "next/router"

type Currency = "USD" | "EUR" | "BTC"

interface DemoAccountOnboardingProps {
  onConfirm?: (currency: Currency) => void
}

export function DemoAccountOnboarding({ onConfirm }: DemoAccountOnboardingProps) {
  const [open, setOpen] = useState(true)
  const [currency, setCurrency] = useState<Currency>("USD")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  async function handleConfirm() {
    setLoading(true)
    setError(null)
    try {
      const res = await fetch("/api/demo-login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ currency }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || "Demo account creation failed")
      setOpen(false)
      if (onConfirm) onConfirm(currency)
      // Route to dashboard (customize as needed)
      router.push("/dashboard")
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">Start Demo</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Choose Your Starting Currency</DialogTitle>
        </DialogHeader>
        <RadioGroup value={currency} onValueChange={val => setCurrency(val as Currency)} className="my-4">
          <RadioGroupItem value="USD" id="usd" />
          <label htmlFor="usd" className="ml-2">USD ($10,000)</label>
          <RadioGroupItem value="EUR" id="eur" />
          <label htmlFor="eur" className="ml-2">EUR (€10,000)</label>
          <RadioGroupItem value="BTC" id="btc" />
          <label htmlFor="btc" className="ml-2">BTC (1 BTC)</label>
        </RadioGroup>
        {error && <div className="text-red-600 mb-2">{error}</div>}
        <DialogFooter>
          <Button onClick={handleConfirm} disabled={loading}>
            {loading ? "Creating..." : "Confirm"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
