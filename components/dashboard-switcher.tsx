"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useState, useEffect } from "react"
import { Grid3X3, Layout, List, Monitor, Save } from "lucide-react"

export type LayoutType = 'basic' | 'enhanced' | 'multi-panel' | 'compact'

interface DashboardSwitcherProps {
  onSwitch: (type: LayoutType) => void
  currentLayout?: LayoutType
}

const layoutOptions = [
  {
    id: 'basic' as LayoutType,
    name: 'Basic',
    description: 'Simple overview with essential metrics',
    icon: List,
    preview: 'Minimal interface for quick checks'
  },
  {
    id: 'enhanced' as LayoutType,
    name: 'Enhanced',
    description: 'Full-featured dashboard with charts and analytics',
    icon: Monitor,
    preview: 'Complete trading dashboard experience'
  },
  {
    id: 'multi-panel' as LayoutType,
    name: 'Multi-Panel',
    description: 'Three-panel layout for comprehensive monitoring',
    icon: Grid3X3,
    preview: 'Organized panels for different data views'
  },
  {
    id: 'compact' as LayoutType,
    name: 'Compact',
    description: 'Space-efficient layout with grid/list toggle',
    icon: Layout,
    preview: 'Dense information in minimal space'
  }
]

export function DashboardSwitcher({ onSwitch, currentLayout = 'enhanced' }: DashboardSwitcherProps) {
  const [selectedLayout, setSelectedLayout] = useState<LayoutType>(currentLayout)
  const [savedLayout, setSavedLayout] = useState<LayoutType | null>(null)

  // Load saved layout preference from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('dashboard-layout-preference')
    if (saved && layoutOptions.find(opt => opt.id === saved)) {
      setSavedLayout(saved as LayoutType)
      if (!currentLayout || currentLayout === 'enhanced') {
        setSelectedLayout(saved as LayoutType)
        onSwitch(saved as LayoutType)
      }
    }
  }, [])

  const handleLayoutChange = (layout: LayoutType) => {
    setSelectedLayout(layout)
    onSwitch(layout)
  }

  const saveLayoutPreference = () => {
    localStorage.setItem('dashboard-layout-preference', selectedLayout)
    setSavedLayout(selectedLayout)
  }

  const currentOption = layoutOptions.find(opt => opt.id === selectedLayout)

  return (
    <Card className="mb-4">
      <CardContent className="py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div>
              <h3 className="text-sm font-medium">Dashboard Layout</h3>
              <p className="text-xs text-muted-foreground">
                Choose your preferred dashboard style
              </p>
            </div>
            {savedLayout && (
              <Badge variant="secondary" className="text-xs">
                Saved: {layoutOptions.find(opt => opt.id === savedLayout)?.name}
              </Badge>
            )}
          </div>

          <div className="flex items-center space-x-3">
            <Select value={selectedLayout} onValueChange={handleLayoutChange}>
              <SelectTrigger className="w-48">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {layoutOptions.map((option) => (
                  <SelectItem key={option.id} value={option.id}>
                    <div className="flex items-center space-x-2">
                      <option.icon className="h-4 w-4" />
                      <div>
                        <div className="font-medium">{option.name}</div>
                        <div className="text-xs text-muted-foreground">{option.description}</div>
                      </div>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Button
              variant="outline"
              size="sm"
              onClick={saveLayoutPreference}
              className="flex items-center space-x-1"
            >
              <Save className="h-4 w-4" />
              <span>Save</span>
            </Button>
          </div>
        </div>

        {/* Layout Preview */}
        {currentOption && (
          <div className="mt-4 p-3 bg-muted/50 rounded-lg">
            <div className="flex items-center space-x-3">
              <currentOption.icon className="h-5 w-5 text-primary" />
              <div className="flex-1">
                <div className="font-medium text-sm">{currentOption.name} Layout</div>
                <div className="text-xs text-muted-foreground">{currentOption.preview}</div>
              </div>
              {selectedLayout === savedLayout && (
                <Badge variant="outline" className="text-xs">
                  Current
                </Badge>
              )}
            </div>
          </div>
        )}

        {/* Quick Layout Buttons for Mobile/Desktop Toggle */}
        <div className="mt-4 flex flex-wrap gap-2">
          {layoutOptions.map((option) => (
            <Button
              key={option.id}
              variant={selectedLayout === option.id ? "default" : "outline"}
              size="sm"
              onClick={() => handleLayoutChange(option.id)}
              className="flex items-center space-x-1"
            >
              <option.icon className="h-4 w-4" />
              <span className="hidden sm:inline">{option.name}</span>
            </Button>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
