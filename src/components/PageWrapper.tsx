// src/components/PageWrapper.tsx

import React from "react"
import { Card } from "@/components/ui/card"
import { Tooltip, TooltipTrigger, TooltipContent } from "@/components/ui/tooltip"
import { cn } from "@/lib/utils"

interface PageWrapperProps {
  title: string
  helpText?: string
  children: React.ReactNode
  className?: string
}

export function PageWrapper({ title, helpText, children, className }: PageWrapperProps) {
  return (
    <div className={cn("w-full max-w-6xl mx-auto px-4 py-6", className)}>
      <div className="flex items-center gap-2 mb-4">
        <h1 className="text-2xl font-bold">{title}</h1>
        {helpText && (
          <Tooltip>
            <TooltipTrigger asChild>
              <span className="cursor-help text-muted-foreground">?</span>
            </TooltipTrigger>
            <TooltipContent>
              <span>{helpText}</span>
            </TooltipContent>
          </Tooltip>
        )}
      </div>
      <Card className="p-6">
        {children}
      </Card>
    </div>
  )
}
