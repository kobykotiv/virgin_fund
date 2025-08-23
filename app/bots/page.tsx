"use client"

import React from "react"
import { BotManagement } from "@/components/bot-management"
import { useAuth } from "@/providers/auth-provider"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"

export default function BotsPage() {
  const { isDemoMode, enableDemoMode } = useAuth()

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="flex items-start justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold">Bot Army</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Manage your fleet of trading bots. Demo Bitcoin price: <strong>$420.69</strong> (simulated 2013 data).
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Card>
            <CardContent className="flex items-center gap-4">
              <div>
                <div className="text-xs text-muted-foreground">Mode</div>
                <div className="font-medium">{isDemoMode ? "Demo (simulated)" : "Live"}</div>
              </div>
              <div>
                <Button onClick={() => enableDemoMode()} disabled={isDemoMode}>
                  {isDemoMode ? "Demo Enabled" : "Enable Demo Mode"}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <BotManagement />
    </div>
  )
}
