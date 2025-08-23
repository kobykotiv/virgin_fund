"use client"

import React from "react"
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

export type Strategy = {
  id: string
  name: string
  description?: string | null
  parameters?: Record<string, unknown> | null
  is_public?: boolean
  created_at?: string
}

export interface StrategyCardProps {
  strategy: Strategy
  onEdit?: (s: Strategy) => void
  onDelete?: (id: string) => void
  onImport?: (s: Strategy) => void
  /**
   * When true, disables interactive controls to indicate a pending async op.
   */
  isProcessing?: boolean
}

/**
 * StrategyCard
 * - Accepts typed props and exposes a small isProcessing flag to allow callers
 *   to disable controls during mutations.
 * - Buttons include aria-labels for better accessibility.
 */
export default function StrategyCard({
  strategy,
  onEdit,
  onDelete,
  onImport,
  isProcessing = false,
}: StrategyCardProps) {
  return (
    <Card className="overflow-hidden">
      <CardHeader>
        <div className="flex items-start justify-between gap-4">
          <div>
            <CardTitle className="text-sm">{strategy.name}</CardTitle>
            <p className="text-xs text-muted-foreground mt-1">{strategy.description}</p>
            <div className="mt-2 flex items-center gap-2">
              <Badge className="text-xs">
                Params: {strategy.parameters ? Object.keys(strategy.parameters).length : 0}
              </Badge>
              {strategy.is_public ? <Badge className="text-xs">Public</Badge> : null}
            </div>
          </div>
          <div className="text-xs text-muted-foreground" aria-hidden>
            {strategy.created_at ? new Date(strategy.created_at).toLocaleDateString() : null}
          </div>
        </div>
      </CardHeader>

      <CardContent>
        <pre className="text-xs max-h-40 overflow-auto bg-muted p-2 rounded" aria-live="polite">
          {JSON.stringify(strategy.parameters ?? {}, null, 2)}
        </pre>
      </CardContent>

      <CardFooter className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Button
            className="text-sm px-3 py-1 bg-transparent hover:bg-accent"
            onClick={() => onImport?.(strategy)}
            aria-label={`Import strategy ${strategy.name}`}
            title="Import strategy"
            disabled={isProcessing}
          >
            Import
          </Button>

          <Button
            className="text-sm px-3 py-1"
            onClick={() => onEdit?.(strategy)}
            aria-label={`Edit strategy ${strategy.name}`}
            title="Edit strategy"
            disabled={isProcessing}
          >
            Edit
          </Button>
        </div>

        <div>
          <Button
            className="text-sm px-3 py-1 text-destructive bg-destructive/10"
            onClick={() => {
              // use default browser confirm for simplicity / accessibility
              if (!confirm(`Delete strategy "${strategy.name}"? This action cannot be undone.`)) return
              onDelete?.(strategy.id)
            }}
            aria-label={`Delete strategy ${strategy.name}`}
            title="Delete strategy"
            disabled={isProcessing}
          >
            Delete
          </Button>
        </div>
      </CardFooter>
    </Card>
  )
}
