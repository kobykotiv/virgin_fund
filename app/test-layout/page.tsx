"use client"

import { EnhancedDashboardLayout } from "@/components/layout/enhanced-dashboard-layout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { TrendingUp, TrendingDown, BarChart3, PieChart, Activity } from "lucide-react"

export default function TestLayoutPage() {
  return (
    <EnhancedDashboardLayout>
      <div className="p-6 space-y-6">
        <div className="text-center">
          <h1 className="text-3xl font-bold mb-4">Enhanced Layout Test Page</h1>
          <p className="text-muted-foreground mb-6">
            This page demonstrates the new enhanced dashboard layout with file menu navigation,
            sidebar, notifications, and gamification features.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-green-600" />
                File Menu Navigation
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">
                Desktop-style file menu with keyboard shortcuts and dropdown menus.
              </p>
              <Badge variant="secondary">Ctrl/Cmd + F</Badge>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5 text-blue-600" />
                Advanced Sidebar
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">
                Collapsible sidebar with sections, icons, and real-time updates.
              </p>
              <Badge variant="secondary">Ctrl/Cmd + B</Badge>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Activity className="h-5 w-5 text-purple-600" />
                Real-Time Notifications
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">
                Animated notifications with categories and sound alerts.
              </p>
              <Badge variant="secondary">Live Updates</Badge>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Integration Status</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span>Enhanced Dashboard Layout</span>
                  <Badge className="bg-green-500">✅ Active</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span>File Menu Navigation</span>
                  <Badge className="bg-green-500">✅ Active</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span>Trading Sidebar</span>
                  <Badge className="bg-green-500">✅ Active</Badge>
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span>Real-Time Notifications</span>
                  <Badge className="bg-green-500">✅ Active</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span>Gamification System</span>
                  <Badge className="bg-green-500">✅ Active</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span>Multi-Panel Dashboard</span>
                  <Badge className="bg-green-500">✅ Active</Badge>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="text-center">
          <Button size="lg" className="mr-4">
            Test Navigation Features
          </Button>
          <Button variant="outline" size="lg">
            View Documentation
          </Button>
        </div>
      </div>
    </EnhancedDashboardLayout>
  )
}
