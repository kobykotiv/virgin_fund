import type { Metadata } from "next"
import { DashboardHeader } from "@/components/dashboard-header"
import { DashboardShell } from "@/components/dashboard-shell"
import { RetirementCalculator } from "@/components/calculators/retirement-calculator"

export const metadata: Metadata = {
  title: "Retirement Calculator",
  description: "Plan for your retirement by calculating how much you need to save.",
}

export default function RetirementCalculatorPage() {
  return (
    <DashboardShell>
      <DashboardHeader
        heading="Retirement Calculator"
        text="Plan for your retirement by calculating how much you need to save."
      />
      <div className="grid gap-8">
        <RetirementCalculator />
      </div>
    </DashboardShell>
  )
}

