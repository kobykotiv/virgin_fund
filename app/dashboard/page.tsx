"use client"

import { EnhancedDashboard } from "@/components/enhanced-dashboard"

export default function DashboardPage() {
  return (
    <div className="flex-1 space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
      </div>

      <EnhancedDashboard />
    </div>
  )
}

