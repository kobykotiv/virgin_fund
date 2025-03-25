import type { ReactNode } from "react"
import { cn } from "@/lib/utils"

interface DashboardShellProps {
  children: ReactNode
  className?: string
}

export function DashboardShell({ children, className }: DashboardShellProps) {
  return <div className={cn("flex flex-col gap-4", className)}>{children}</div>
}

