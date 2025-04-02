import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Search } from "lucide-react"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import Link from "next/link"
import { cn } from "@/lib/utils"

interface SearchResult {
  title: string
  href: string
  content: string
}

export function SearchDialog({ 
  open, 
  onOpenChange 
}: { 
  open: boolean
  onOpenChange: (open: boolean) => void 
}) {
  const [searchQuery, setSearchQuery] = useState("")
  const [results, setResults] = useState<SearchResult[]>([])
  
  // Mock search function - in a real app, this would search the actual docs
  const handleSearch = (query: string) => {
    setSearchQuery(query)
    
    if (!query) {
      setResults([])
      return
    }
    
    // Mock results
    const mockResults: SearchResult[] = [
      {
        title: "Getting Started",
        href: "/docs/getting-started",
        content: "Learn how to set up your account and create your first portfolio..."
      },
      {
        title: "Portfolio Management",
        href: "/docs/portfolio-management",
        content: "Manage multiple investment portfolios containing various assets..."
      },
      {
        title: "API Routes",
        href: "/docs/api-routes",
        content: "Explore all API routes in the Virgin Fund application..."
      }
    ].filter(result => 
      result.title.toLowerCase().includes(query.toLowerCase()) ||
      result.content.toLowerCase().includes(query.toLowerCase())
    )
    
    setResults(mockResults)
  }
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[550px]">
        <DialogHeader>
          <DialogTitle>Search Documentation</DialogTitle>
        </DialogHeader>
        <div className="relative">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search for documentation..."
            className="pl-8"
            value={searchQuery}
            onChange={(e) => handleSearch(e.target.value)}
          />
        </div>
        {results.length > 0 ? (
          <ScrollArea className="max-h-[50vh]">
            <div className="space-y-2">
              {results.map((result, index) => (
                <Link
                  key={index}
                  href={result.href}
                  onClick={() => onOpenChange(false)}
                  className={cn(
                    "block rounded-md p-2 hover:bg-muted"
                  )}
                >
                  <h4 className="text-sm font-medium">{result.title}</h4>
                  <p className="text-xs text-muted-foreground line-clamp-2">{result.content}</p>
                </Link>
              ))}
            </div>
          </ScrollArea>
        ) : searchQuery && (
          <p className="text-center text-sm text-muted-foreground py-6">
            No results found for "{searchQuery}"
          </p>
        )}
        {!searchQuery && (
          <div className="py-6 text-center text-sm text-muted-foreground">
            <p>Type to start searching</p>
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}
