"use client"

import PerformanceDashboard from "@/components/performance/PerformanceDashboard"
import DashboardLayout from "@/components/DashboardLayout"

export default function PerformancePage() {
  return (
    <DashboardLayout>
      <div className="p-4">
        <PerformanceDashboard />
      </div>
    </DashboardLayout>
  )
}
