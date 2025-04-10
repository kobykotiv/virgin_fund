import type React from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { SectionBreak, SectionDivider } from "@/components/section-break"

interface ExampleSectionProps {
  title: string
  description?: string
  children: React.ReactNode
}

export const ExampleSection = ({ title, description, children }: ExampleSectionProps) => {
  return (
    <div className="mb-8">
      <Card>
        <CardHeader>
          <CardTitle className="text-primary">{title}</CardTitle>
          {description && <CardDescription>{description}</CardDescription>}
        </CardHeader>
        <SectionBreak />
        <CardContent>{children}</CardContent>
      </Card>
    </div>
  )
}

export const DashboardSection = () => {
  return (
    <div className="space-y-8">
      <ExampleSection title="Trading Overview" description="Summary of your current trading activities">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          <Card className="p-4 border-l-4 border-primary">
            <h3 className="font-medium">Active Trades</h3>
            <p className="text-2xl font-bold">12</p>
          </Card>
          <Card className="p-4 border-l-4 border-secondary">
            <h3 className="font-medium">Daily Profit</h3>
            <p className="text-2xl font-bold">+2.4%</p>
          </Card>
          <Card className="p-4 border-l-4 border-accent">
            <h3 className="font-medium">Portfolio Value</h3>
            <p className="text-2xl font-bold">$12,450</p>
          </Card>
        </div>
      </ExampleSection>

      <SectionDivider />

      <ExampleSection title="Market Analysis" description="Current market conditions and trends">
        <div className="h-64 bg-muted rounded-md flex items-center justify-center">
          <p className="text-muted-foreground">Market chart placeholder</p>
        </div>
      </ExampleSection>

      <SectionDivider />

      <ExampleSection title="Recent Transactions" description="Your latest trading activities">
        <div className="space-y-2">
          {[1, 2, 3].map((i) => (
            <div key={i} className="p-3 bg-muted/50 rounded-md flex justify-between">
              <div>
                <p className="font-medium">BTC/USD</p>
                <p className="text-sm text-muted-foreground">Buy • 0.05 BTC</p>
              </div>
              <div className="text-right">
                <p className="font-medium text-primary">$24,350</p>
                <p className="text-sm text-muted-foreground">2 hours ago</p>
              </div>
            </div>
          ))}
        </div>
      </ExampleSection>
    </div>
  )
}

