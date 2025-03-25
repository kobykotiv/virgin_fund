import type { Metadata } from "next"
import { DashboardHeader } from "@/components/dashboard-header"
import { DashboardShell } from "@/components/dashboard-shell"
import { SavingsCalculator } from "@/components/calculators/savings-calculator"

export const metadata: Metadata = {
  title: "Savings Calculator",
  description: "Calculate your savings growth over time",
}

export default function SavingsCalculatorPage() {
  return (
    <DashboardShell>
      <DashboardHeader heading="Savings Calculator" text="Calculate how your savings will grow over time" />
      <div className="grid gap-8">
        <SavingsCalculator />
      </div>
    </DashboardShell>
  )
}

