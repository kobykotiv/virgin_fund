"use client"

import React, { useState } from 'react'
import { Button } from '@/components/ui/button'
import { useAlpacaConnect } from '../lib/client/useAlpacaConnect'

export const AlpacaConnectPanel: React.FC = () => {
  const { connect, connecting } = useAlpacaConnect()
  const [creating, setCreating] = useState(false)
  const [message, setMessage] = useState<string | null>(null)

  async function handleConnect() {
    setMessage(null)
    try {
      await connect('/')
      setMessage('Connected to Alpaca. You can now create a portfolio from your account.')
    } catch (err: any) {
      setMessage(err?.message || 'Connection cancelled')
    }
  }

  async function handleCreatePortfolio() {
    setCreating(true)
    setMessage(null)
    try {
      const res = await fetch('/api/portfolios/create-from-alpaca', { method: 'POST' })
      const json = await res.json()
      if (!res.ok) throw new Error(json?.error || 'Failed to create portfolio')
      setMessage(`Portfolio created: ${json.portfolio?.name || json.portfolio?.id}`)
    } catch (err: any) {
      setMessage(err?.message || 'Failed')
    } finally {
      setCreating(false)
    }
  }

  return (
    <div className="p-4 border rounded-md">
      <h3 className="font-medium mb-2">Alpaca Integration</h3>
      <p className="text-sm text-muted-foreground mb-3">Connect your Alpaca account and seed a portfolio using your Alpaca cash balance.</p>
      <div className="flex gap-2">
        <Button onClick={handleConnect} disabled={connecting}>
          {connecting ? 'Connecting…' : 'Connect Alpaca'}
        </Button>
        <Button onClick={handleCreatePortfolio} disabled={creating} variant="secondary">
          {creating ? 'Creating…' : 'Create Portfolio from Alpaca'}
        </Button>
      </div>
      {message && <div className="mt-3 text-sm">{message}</div>}
    </div>
  )
}
