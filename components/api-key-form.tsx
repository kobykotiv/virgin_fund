"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { KeyRound, AlertCircle, Info } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Switch } from "@/components/ui/switch"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

interface ApiKeyFormProps {
  onSave: () => void
  onCancel: () => void
  currentConfig?: {
    keyId: string
    secretKey: string
    baseUrl: string
    isPaper: boolean
  }
}

export function ApiKeyForm({ onSave, onCancel, currentConfig }: ApiKeyFormProps) {
  const [keyId, setKeyId] = useState(currentConfig?.keyId || "")
  const [secretKey, setSecretKey] = useState(currentConfig?.secretKey || "")
  const [baseUrl, setBaseUrl] = useState(currentConfig?.baseUrl || "https://paper-api.alpaca.markets")
  const [isPaper, setIsPaper] = useState(currentConfig?.isPaper !== undefined ? currentConfig.isPaper : true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setError(null)

    try {
      const response = await fetch("/api/alpaca/configure", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          keyId,
          secretKey,
          baseUrl,
          isPaper,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || "Failed to configure API keys")
      }

      onSave()
    } catch (err) {
      setError(err instanceof Error ? err.message : "An unknown error occurred")
    } finally {
      setIsSubmitting(false)
    }
  }

  // Update the base URL when paper trading toggle changes
  useEffect(() => {
    if (isPaper) {
      setBaseUrl("https://paper-api.alpaca.markets")
    } else {
      setBaseUrl("https://api.alpaca.markets")
    }
  }, [isPaper])

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <KeyRound className="h-5 w-5" />
          <h2 className="text-xl font-semibold">Alpaca API Configuration</h2>
        </div>
      </div>

      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <div className="space-y-2">
        <Label htmlFor="baseUrl">Base URL</Label>
        <Input
          id="baseUrl"
          value={baseUrl}
          onChange={(e) => setBaseUrl(e.target.value)}
          placeholder="API Base URL"
          required
        />
        <p className="text-xs text-muted-foreground">
          {isPaper ? "Using paper trading API endpoint" : "Using live trading API endpoint"}
        </p>
      </div>

      <div className="space-y-2">
        <Label htmlFor="keyId">Key ID</Label>
        <Input
          id="keyId"
          value={keyId}
          onChange={(e) => setKeyId(e.target.value)}
          placeholder="Your Alpaca Key ID"
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="secretKey">Secret Key</Label>
        <Input
          id="secretKey"
          type="password"
          value={secretKey}
          onChange={(e) => setSecretKey(e.target.value)}
          placeholder="Your Alpaca Secret Key"
          required
        />
      </div>

      <div className="flex items-center space-x-2">
        <Switch id="isPaper" checked={isPaper} onCheckedChange={setIsPaper} />
        <div className="flex items-center gap-2">
          <Label htmlFor="isPaper" className="text-sm font-normal">
            Use Paper Trading
          </Label>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Info className="h-3.5 w-3.5 text-muted-foreground" />
              </TooltipTrigger>
              <TooltipContent>
                <p>Paper trading uses simulated money for testing strategies</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </div>

      {currentConfig && (
        <div className="mt-4 p-3 bg-muted rounded-md">
          <h3 className="text-sm font-medium mb-2">Current Configuration</h3>
          <div className="space-y-1 text-xs">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Base URL:</span>
              <span className="font-mono">{currentConfig.baseUrl}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Key ID:</span>
              <span className="font-mono">
                {currentConfig.keyId.substring(0, 5)}...{currentConfig.keyId.substring(currentConfig.keyId.length - 5)}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Environment:</span>
              <span>{currentConfig.isPaper ? "Paper Trading" : "Live Trading"}</span>
            </div>
          </div>
        </div>
      )}

      <div className="pt-2 text-xs text-muted-foreground">
        <p>Your API keys are stored securely and are only used to connect to Alpaca Markets.</p>
        <p className="mt-1">
          Don't have API keys?{" "}
          <a
            href="https://app.alpaca.markets/signup"
            target="_blank"
            rel="noopener noreferrer"
            className="text-primary hover:underline"
          >
            Sign up for Alpaca
          </a>
        </p>
      </div>

      <div className="flex justify-end space-x-2 pt-4">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Saving..." : "Save API Keys"}
        </Button>
      </div>
    </form>
  )
}

