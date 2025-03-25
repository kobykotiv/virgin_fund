import type { Metadata } from "next"
import { DashboardHeader } from "@/components/dashboard-header"
import { DashboardShell } from "@/components/dashboard-shell"
import { InflationCalculator } from "@/components/calculators/inflation-calculator"

export const metadata: Metadata = {
  title: "Inflation Calculator",
  description: "Calculate the impact of inflation on your purchasing power over time.",
}

export default function InflationCalculatorPage() {
  return (
    <DashboardShell>
      <DashboardHeader
        heading="Inflation Calculator"
        text="Calculate the impact of inflation on your purchasing power over time."
      />
      <div className="grid gap-8">
        <InflationCalculator />
      </div>
    </DashboardShell>
  )
}

