"use client"

import React, { useState } from "react"
import StrategyCard from "@/components/strategies/StrategyCard"
import { useStrategies, useCreateStrategy, useUpdateStrategy, useDeleteStrategy } from "@/hooks/useStrategies"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card } from "@/components/ui/card"
import { useToast } from "@/hooks/use-toast"

type StrategyShape = {
  id: string
  name: string
  description?: string | null
  parameters?: Record<string, unknown> | null
  is_public?: boolean
  created_at?: string
}

/**
 * StrategyList
 * - Lists strategies (user + public)
 * - Allows create / edit / delete inline (simple forms)
 * - Emits import callbacks when user wants to import into signal builder
 */

export default function StrategyList({ onImport }: { onImport?: (s: StrategyShape) => void }) {
  const { data: strategies, isLoading } = useStrategies()
  const create = useCreateStrategy()
  const update = useUpdateStrategy()
  const remove = useDeleteStrategy()
  const { toast } = useToast()
  const router = useRouter()

  // Local loading flags (avoid relying on mutation .isLoading typing inconsistencies)
  const [creatingLoading, setCreatingLoading] = useState(false)
  const [savingLoading, setSavingLoading] = useState(false)

  const [creating, setCreating] = useState(false)
  const [newName, setNewName] = useState("")
  const [newDesc, setNewDesc] = useState("")
  const [editing, setEditing] = useState<StrategyShape | null>(null)
  const [editName, setEditName] = useState("")
  const [editDesc, setEditDesc] = useState("")
  const [deletingId, setDeletingId] = useState<string | null>(null)

  const handleCreate = async () => {
    if (!newName.trim()) {
      toast({ title: "Invalid", description: "Please provide a name" })
      return
    }
    setCreatingLoading(true)
    try {
      await create.mutateAsync({
        name: newName.trim(),
        description: newDesc.trim(),
        parameters: {},
        is_public: false,
      })
      toast({ title: "Created", description: "Strategy created" })
      setNewName("")
      setNewDesc("")
      setCreating(false)
    } catch (err: any) {
      toast({ title: "Error", description: err?.message || "Failed to create" })
    } finally {
      setCreatingLoading(false)
    }
  }

  const handleStartEdit = (s: StrategyShape) => {
    setEditing(s)
    setEditName(s.name)
    setEditDesc(s.description ?? "")
  }

  const handleSaveEdit = async () => {
    if (!editing) return
    setSavingLoading(true)
    try {
      await update.mutateAsync({ id: editing.id, name: editName.trim(), description: editDesc.trim() })
      toast({ title: "Saved", description: "Strategy updated" })
      setEditing(null)
    } catch (err: any) {
      toast({ title: "Error", description: err?.message || "Failed to update" })
    } finally {
      setSavingLoading(false)
    }
  }

  const handleDelete = async (id: string) => {
    setDeletingId(id)
    try {
      await remove.mutateAsync(id)
      toast({ title: "Deleted", description: "Strategy deleted" })
    } catch (err: any) {
      toast({ title: "Error", description: err?.message || "Failed to delete" })
    } finally {
      setDeletingId(null)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Strategies</h3>
        <div>
          <div className="flex items-center gap-2">
            <Button className="text-sm px-3 py-1" onClick={() => setCreating((c) => !c)}>
              {creating ? "Cancel" : "Create Strategy"}
            </Button>
            <Button className="text-sm px-3 py-1" onClick={() => router.push("/strategies/dca/new")}>
              New DCA
            </Button>
          </div>
        </div>
      </div>

      {creating ? (
        <Card className="p-4">
          <div className="grid grid-cols-1 gap-2 md:grid-cols-3">
            <Input
              placeholder="Strategy name"
              aria-label="New strategy name"
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
            />
            <Textarea
              placeholder="Short description"
              aria-label="New strategy description"
              value={newDesc}
              onChange={(e) => setNewDesc(e.target.value)}
            />
            <div className="flex items-center gap-2">
              <Button className="text-sm px-3 py-1" onClick={handleCreate} disabled={creatingLoading}>
                {creatingLoading ? "Creating..." : "Create"}
              </Button>
            </div>
          </div>
        </Card>
      ) : null}

      {editing ? (
        <Card className="p-4">
          <div className="grid grid-cols-1 gap-2 md:grid-cols-3">
            <Input
              placeholder="Strategy name"
              aria-label="Edit strategy name"
              value={editName}
              onChange={(e) => setEditName(e.target.value)}
            />
            <Textarea
              placeholder="Short description"
              aria-label="Edit strategy description"
              value={editDesc}
              onChange={(e) => setEditDesc(e.target.value)}
            />
            <div className="flex items-center gap-2">
              <Button className="text-sm px-3 py-1" onClick={handleSaveEdit} disabled={savingLoading}>
                {savingLoading ? "Saving..." : "Save"}
              </Button>
              <Button className="text-sm px-3 py-1" onClick={() => setEditing(null)}>
                Cancel
              </Button>
            </div>
          </div>
        </Card>
      ) : null}

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {isLoading ? (
          <div>Loading strategies...</div>
        ) : (
            (strategies ?? []).map((s: StrategyShape) => (
            <StrategyCard
              key={s.id}
              strategy={s}
              onEdit={(st) => handleStartEdit(st)}
              onDelete={(id) => handleDelete(id)}
              onImport={(st) => onImport?.(st)}
              isProcessing={deletingId === s.id}
            />
          ))
        )}
      </div>
    </div>
  )
}
