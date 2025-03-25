import type { Metadata } from "next"
import { DashboardHeader } from "@/components/dashboard-header"
import { DashboardShell } from "@/components/dashboard-shell"
import { SignalBuilder } from "@/components/signal-builder"

export const metadata: Metadata = {
  title: "Custom Signal Builder",
  description: "Create custom trading signals for your bots",
}

export default function SignalBuilderPage() {
  return (
    <DashboardShell>
      <DashboardHeader heading="Custom Signal Builder" text="Create and test custom trading signals" />
      <div className="grid gap-8">
        <SignalBuilder />
      </div>
    </DashboardShell>
  )
}

