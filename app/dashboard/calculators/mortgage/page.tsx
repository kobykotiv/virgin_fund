import type { Metadata } from "next"
import { DashboardHeader } from "@/components/dashboard-header"
import { DashboardShell } from "@/components/dashboard-shell"
import { MortgageCalculator } from "@/components/calculators/mortgage-calculator"

export const metadata: Metadata = {
  title: "Mortgage Calculator",
  description: "Calculate your mortgage payments and total costs",
}

export default function MortgageCalculatorPage() {
  return (
    <DashboardShell>
      <DashboardHeader heading="Mortgage Calculator" text="Calculate your mortgage payments and explore different scenarios" />
      <div className="grid gap-8">
        <MortgageCalculator />
      </div>
    </DashboardShell>
  )
}
