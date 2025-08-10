// src/components/ui/card.tsx

import React from "react"
import { cn } from "../../lib/utils"

export function Card({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={cn("bg-white dark:bg-card rounded shadow", className)}>
      {children}
    </div>
  )
}
