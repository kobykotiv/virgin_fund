"use client"

import * as React from "react"
import { cn } from "@/lib/utils"
import { LayoutGrid } from "lucide-react"

interface GridProps extends React.HTMLAttributes<HTMLDivElement> {
  columns?: number
  gap?: number
  children: React.ReactNode
}

const Grid = React.forwardRef<HTMLDivElement, GridProps>(
  ({ className, columns = 3, gap = 4, children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          `grid grid-cols-1 md:grid-cols-${columns} gap-${gap}`,
          className
        )}
        {...props}
      >
        {children}
      </div>
    )
  }
)
Grid.displayName = "Grid"

export { Grid }
export const GridIcon = LayoutGrid
