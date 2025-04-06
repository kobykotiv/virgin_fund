"use client"

import { Tabs, TabsList, TabsTrigger, TabsContent } from "./ui/tabs"

interface TabItem {
  value: string
  label: string
  content: React.ReactNode
  icon?: React.ReactNode
}

interface TabContainerProps {
  tabs: TabItem[]
  defaultValue?: string
  className?: string
}

export function TabContainer({ tabs, defaultValue, className }: TabContainerProps) {
  return (
    <Tabs defaultValue={defaultValue || tabs[0].value} className={className}>
      <TabsList>
        {tabs.map((tab) => (
          <TabsTrigger key={tab.value} value={tab.value}>
            {tab.icon && <span className="mr-2">{tab.icon}</span>}
            {tab.label}
          </TabsTrigger>
        ))}
      </TabsList>
      {tabs.map((tab) => (
        <TabsContent key={tab.value} value={tab.value}>
          {tab.content}
        </TabsContent>
      ))}
    </Tabs>
  )
}
