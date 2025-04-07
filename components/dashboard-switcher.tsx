"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { useState } from "react"

interface DashboardSwitcherProps {
  onSwitch: (type: 'enhanced' | 'basic') => void
}

export function DashboardSwitcher({ onSwitch }: DashboardSwitcherProps) {
  const [useEnhanced, setUseEnhanced] = useState(true)

  const handleSwitch = (checked: boolean) => {
    setUseEnhanced(checked)
    onSwitch(checked ? 'enhanced' : 'basic')
  }

  return (
    <Card className="mb-4">
      <CardContent className="py-3">
        <div className="flex items-center justify-between">
          <Label htmlFor="dashboard-switch" className="flex items-center space-x-2">
            <span>Dashboard Mode:</span>
            <span className="text-muted-foreground">
              {useEnhanced ? 'Enhanced View' : 'Basic View'}
            </span>
          </Label>
          <Switch
            id="dashboard-switch"
            checked={useEnhanced}
            onCheckedChange={handleSwitch}
          />
        </div>
      </CardContent>
    </Card>
  )
}
