// src/pages/FinanceCalculators/Savings/index.tsx

import React from "react"
import { DashboardLayout } from "../../../components/DashboardLayout"
import { PageWrapper } from "../../../components/PageWrapper"

export default function SavingsCalculatorPage() {
  return (
    <DashboardLayout>
      <PageWrapper
        title="Savings Calculator"
        helpText="Calculate your savings growth over time with customizable inputs."
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Placeholder chart */}
          <div className="bg-muted rounded p-4 flex items-center justify-center h-64">
            <span className="text-muted-foreground">[Chart Placeholder]</span>
          </div>
          {/* Example inputs/results */}
          <div className="space-y-4">
            <div className="bg-card rounded p-4 shadow">
              <span className="font-semibold">Initial Savings</span>
              <div className="text-2xl mt-2">$5,000</div>
            </div>
            <div className="bg-card rounded p-4 shadow">
              <span className="font-semibold">Projected Value</span>
              <div className="text-2xl mt-2">$8,200</div>
            </div>
          </div>
        </div>
      </PageWrapper>
    </DashboardLayout>
  )
}
