import type { Metadata } from "next"
import { DashboardHeader } from "@/components/dashboard-header"
import { DashboardShell } from "@/components/dashboard-shell"
import { DebtCalculator } from "@/components/calculators/debt-calculator"

export const metadata: Metadata = {
  title: "Debt Calculator",
  description: "Calculate your debt payoff timeline and strategies",
}

export default function DebtCalculatorPage() {
  return (
    <DashboardShell>
      <DashboardHeader heading="Debt Calculator" text="Plan your debt payoff strategy" />
      <div className="grid gap-8">
        <DebtCalculator />
      </div>
    </DashboardShell>
  )
}
