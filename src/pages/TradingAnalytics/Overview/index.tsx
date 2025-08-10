// src/pages/TradingAnalytics/Overview/index.tsx

import React from "react"
import { DashboardLayout } from "../../../components/DashboardLayout"
import { PageWrapper } from "../../../components/PageWrapper"

export default function TradingAnalyticsOverviewPage() {
  return (
    <DashboardLayout>
      <PageWrapper
        title="Trading Analytics Overview"
        helpText="This page provides an overview of trading analytics, including market trends and custom signals."
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Placeholder chart */}
          <div className="bg-muted rounded p-4 flex items-center justify-center h-64">
            <span className="text-muted-foreground">[Chart Placeholder]</span>
          </div>
          {/* Example metrics */}
          <div className="space-y-4">
            <div className="bg-card rounded p-4 shadow">
              <span className="font-semibold">Total Trades</span>
              <div className="text-2xl mt-2">1,234</div>
            </div>
            <div className="bg-card rounded p-4 shadow">
              <span className="font-semibold">Win Rate</span>
              <div className="text-2xl mt-2">62%</div>
            </div>
          </div>
        </div>
      </PageWrapper>
    </DashboardLayout>
  )
}
