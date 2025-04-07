"use client"

import { ReactNode } from "react"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { cn } from "@/lib/utils"

export interface DashboardTab {
  id: string
  label: string
  icon?: ReactNode
  content: ReactNode
  disabled?: boolean
}

interface DashboardTabsProps {
  tabs: DashboardTab[]
  defaultTab?: string 
  onChange?: (value: string) => void
  variant?: "default" | "secondary"
  className?: string
}

export function DashboardTabs({
  tabs,
  defaultTab,
  onChange,
  variant = "default",
  className,
}: DashboardTabsProps) {
  if (!tabs || tabs.length === 0) {
    return null;
  }
  
  return (
    <Tabs
      defaultValue={defaultTab || tabs[0]?.id}
      onValueChange={onChange}
      className={cn("w-full", className)}
    >
      <TabsList className="w-full justify-start border-b bg-transparent p-0">
        {tabs.map((tab) => (
          <TabsTrigger
            key={tab.id}
            value={tab.id}
            disabled={tab.disabled}
            className={cn(
              "flex items-center gap-2 rounded-none border-b-2 border-transparent px-4 py-2",
              "data-[state=active]:border-primary",
              variant === "secondary" && "data-[state=active]:bg-secondary"
            )}
          >
            {tab.icon}
            {tab.label}
          </TabsTrigger>
        ))}
      </TabsList>
      {tabs.map((tab) => (
        <TabsContent key={tab.id} value={tab.id} className="mt-4">
          {tab.content}
        </TabsContent>
      ))}
    </Tabs>
  )
}
