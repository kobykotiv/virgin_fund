import type { Metadata } from "next"
import { DashboardHeader } from "@/components/dashboard-header"
import { DashboardShell } from "@/components/dashboard-shell"

export const metadata: Metadata = {
  title: "Signal Backtest Results",
  description: "View the performance of your custom signals",
}

export default function SignalBacktestPage() {
  return (
    <DashboardShell>
      <DashboardHeader
        heading="Signal Backtest Results"
        text="View the historical performance of your custom signals"
      />
      <div className="grid gap-8">
        {/* Backtest results will go here */}
        <div className="rounded-lg border p-8 text-center">
          <h2 className="text-lg font-medium">No backtest results yet</h2>
          <p className="mt-2 text-sm text-muted-foreground">Create and backtest a custom signal to see results here.</p>
        </div>
      </div>
    </DashboardShell>
  )
}

