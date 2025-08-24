"use client"

import React, { useState } from "react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { useCreateDcaStrategy, useUpdateDcaStrategy } from "@/hooks/useDcaStrategies"
import { useToast } from "@/components/ui/use-toast"
import { useRouter } from "next/navigation"

type Props = {
  initial?: {
    id?: string
    name?: string
    description?: string
    asset?: string
    interval?: string
    amount?: number
    duration?: string
  }
  onCreated?: (s: any) => void
}

export default function DcaForm({ initial, onCreated }: Props) {
  const [name, setName] = useState(initial?.name || "")
  const [description, setDescription] = useState(initial?.description || "")
  const [asset, setAsset] = useState(initial?.asset || "AAPL")
  const [interval, setInterval] = useState(initial?.interval || "0 0 * * 1")
  const [amount, setAmount] = useState<number>(initial?.amount ?? 100)
  const [duration, setDuration] = useState(initial?.duration || "")

  const { toast } = useToast()
  const router = useRouter()

  const create = useCreateDcaStrategy()
  const update = useUpdateDcaStrategy()

  // local submitting flag (avoid depending on mutation .isLoading typing differences)
  const [submitting, setSubmitting] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const payload = { name, description, asset, interval, amount, duration }
    setSubmitting(true)
    try {
      let res
      if (initial?.id) {
        res = await update.mutateAsync({ id: initial.id, ...payload })
        toast({ title: "DCA updated", description: res?.name || "Updated" })
      } else {
        res = await create.mutateAsync(payload)
        toast({ title: "DCA created", description: res?.name || "Created" })
      }
      onCreated?.(res)
      router.push("/bots")
    } catch (err: any) {
      toast({ title: "Error", description: err?.message || "Failed to save DCA", variant: "destructive" })
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>{initial?.id ? "Edit DCA Strategy" : "Create DCA Strategy"}</CardTitle>
        <CardDescription>Schedule recurring purchases for an asset using DCA</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Name</Label>
            <Input id="name" value={name} onChange={(e) => setName(e.target.value)} required />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Input id="description" value={description} onChange={(e) => setDescription(e.target.value)} />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="asset">Asset Symbol</Label>
              <Input id="asset" value={asset} onChange={(e) => setAsset(e.target.value.toUpperCase())} required />
            </div>

            <div className="space-y-2">
              <Label htmlFor="interval">Interval (cron)</Label>
              <Input id="interval" value={interval} onChange={(e) => setInterval(e.target.value)} required />
            </div>

            <div className="space-y-2">
              <Label htmlFor="amount">Amount ($)</Label>
              <Input id="amount" type="number" value={String(amount)} onChange={(e) => setAmount(Number(e.target.value))} min={1} required />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="duration">Duration (optional)</Label>
            <Input id="duration" value={duration} onChange={(e) => setDuration(e.target.value)} placeholder="30days" />
            <p className="text-xs text-muted-foreground">Examples: "30days", "3months" or leave empty for indefinite</p>
          </div>

          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={() => router.back()} disabled={submitting}>
              Cancel
            </Button>
            <Button type="submit" disabled={submitting}>{initial?.id ? "Save" : "Create"}</Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
