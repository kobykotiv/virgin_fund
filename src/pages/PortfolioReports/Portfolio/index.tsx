// src/pages/PortfolioReports/Portfolio/index.tsx

import React from "react"
import { DashboardLayout } from "../../../components/DashboardLayout"
import { PageWrapper } from "../../../components/PageWrapper"

export default function PortfolioPage() {
  return (
    <DashboardLayout>
      <PageWrapper
        title="Portfolio Overview"
        helpText="View your portfolio allocation, performance, and recent activity."
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Placeholder chart */}
          <div className="bg-muted rounded p-4 flex items-center justify-center h-64">
            <span className="text-muted-foreground">[Portfolio Chart Placeholder]</span>
          </div>
          {/* Example portfolio metrics */}
          <div className="space-y-4">
            <div className="bg-card rounded p-4 shadow">
              <span className="font-semibold">Total Value</span>
              <div className="text-2xl mt-2">$42,000</div>
            </div>
            <div className="bg-card rounded p-4 shadow">
              <span className="font-semibold">Performance (YTD)</span>
              <div className="text-2xl mt-2">+8.2%</div>
            </div>
          </div>
        </div>
      </PageWrapper>
    </DashboardLayout>
  )
}
