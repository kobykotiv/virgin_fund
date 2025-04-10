import type { Metadata } from "next"
import { DashboardHeader } from "@/components/dashboard-header"
import { DashboardShell } from "@/components/dashboard-shell"
import { CompoundInterestCalculator } from "@/components/calculators/compound-interest-calculator"

export const metadata: Metadata = {
  title: "Compound Interest Calculator",
  description: "Calculate the power of compound interest on your investments",
}

export default function CompoundInterestCalculatorPage() {
  return (
    <DashboardShell>
      <DashboardHeader
        heading="Compound Interest Calculator"
        text="See how your investments can grow with compound interest"
      />
      <div className="grid gap-8">
        <CompoundInterestCalculator />
      </div>
    </DashboardShell>
  )
}

