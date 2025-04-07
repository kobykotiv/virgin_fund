import { cn } from "@/lib/utils"
import { DashboardFooter } from "@/components/dashboard-footer"

interface DashboardShellProps extends React.HTMLAttributes<HTMLDivElement> {}

export function DashboardShell({
  children,
  className,
  ...props
}: DashboardShellProps) {
  return (
    <div className={cn("flex flex-col min-h-screen", className)} {...props}>
      <div className="flex-1 grid items-start gap-4 p-4 sm:gap-8 sm:p-6 lg:gap-10">
        {children}
      </div>
      <DashboardFooter />
    </div>
  )
}

