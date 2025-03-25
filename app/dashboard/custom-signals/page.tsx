import type { Metadata } from "next"
import { DashboardHeader } from "@/components/dashboard-header"
import { DashboardShell } from "@/components/dashboard-shell"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import Link from "next/link"

export const metadata: Metadata = {
  title: "Custom Signals",
  description: "Manage your custom trading signals",
}

export default function CustomSignalsPage() {
  return (
    <DashboardShell>
      <DashboardHeader heading="Custom Signals" text="Manage your custom trading signals">
        <Button asChild>
          <Link href="/dashboard/custom-signals/builder">
            <Plus className="mr-2 h-4 w-4" /> New Signal
          </Link>
        </Button>
      </DashboardHeader>
      <div className="grid gap-8">
        {/* Custom signals list will go here */}
        <div className="rounded-lg border p-8 text-center">
          <h2 className="text-lg font-medium">No custom signals yet</h2>
          <p className="mt-2 text-sm text-muted-foreground">Create your first custom signal to get started.</p>
          <Button className="mt-4" asChild>
            <Link href="/dashboard/custom-signals/builder">
              <Plus className="mr-2 h-4 w-4" /> Create Signal
            </Link>
          </Button>
        </div>
      </div>
    </DashboardShell>
  )
}

