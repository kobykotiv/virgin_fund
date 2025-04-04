"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { LayoutGrid, List, Search } from "lucide-react"
import { Toggle } from "@/components/ui/toggle"

interface NewsItem {
  title: string
  description: string
  link: string
  pubDate: string
  source: string
  image?: string
}

export function NewsFeed() {
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")
  const [searchQuery, setSearchQuery] = useState("")
  const [newsItems, setNewsItems] = useState<NewsItem[]>([])

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex w-full max-w-sm items-center space-x-2">
          <Input
            type="text"
            placeholder="Search news..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <Button size="icon">
            <Search className="h-4 w-4" />
          </Button>
        </div>
        <div className="flex items-center space-x-2">
          <Toggle
            pressed={viewMode === "grid"}
            onPressedChange={() => setViewMode("grid")}
          >
            <LayoutGrid className="h-4 w-4" />
          </Toggle>
          <Toggle
            pressed={viewMode === "list"}
            onPressedChange={() => setViewMode("list")}
          >
            <List className="h-4 w-4" />
          </Toggle>
        </div>
      </div>

      <div className={viewMode === "grid" ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4" : "space-y-4"}>
        {/* News items would be mapped here */}
      </div>
    </div>
  )
}
