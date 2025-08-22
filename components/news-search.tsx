"use client"

import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Button, buttonVariants } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Badge, badgeVariants } from "@/components/ui/badge"
import { Search, CalendarIcon, X, Filter } from "lucide-react"
import { cn } from "@/lib/utils"
import { format } from "date-fns"
import { NewsSource, NewsSentiment, type NewsSearchParams } from "@/lib/news-service"

interface NewsSearchProps {
  onSearch: (params: NewsSearchParams) => void
  isLoading?: boolean
}

export function NewsSearch({ onSearch, isLoading = false }: NewsSearchProps) {
  const [query, setQuery] = useState("")
  const [ticker, setTicker] = useState("")
  const [selectedSources, setSelectedSources] = useState<NewsSource[]>([])
  const [sentiment, setSentiment] = useState<NewsSentiment | "">("")
  const [startDate, setStartDate] = useState<Date | undefined>()
  const [endDate, setEndDate] = useState<Date | undefined>()
  const [showFilters, setShowFilters] = useState(false)

  const handleSearch = () => {
    const params: NewsSearchParams = {
      limit: 20,
    }

    if (query) params.query = query
    if (ticker) params.ticker = ticker
    if (selectedSources.length > 0) params.sources = selectedSources
    if (sentiment) params.sentiment = sentiment as NewsSentiment
    if (startDate) params.startDate = startDate
    if (endDate) params.endDate = endDate

    onSearch(params)
  }

  const handleReset = () => {
    setQuery("")
    setTicker("")
    setSelectedSources([])
    setSentiment("")
    setStartDate(undefined)
    setEndDate(undefined)

    onSearch({ limit: 20 })
  }

  const toggleSource = (source: NewsSource) => {
    if (selectedSources.includes(source)) {
      setSelectedSources(selectedSources.filter((s) => s !== source))
    } else {
      setSelectedSources([...selectedSources, source])
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search news..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="pl-8"
            onKeyDown={(e) => e.key === "Enter" && handleSearch()}
          />
        </div>
        <div className="relative flex-1">
          <Input
            placeholder="Ticker symbol (e.g., AAPL)"
            value={ticker}
            onChange={(e) => setTicker(e.target.value.toUpperCase())}
            className="font-mono"
            onKeyDown={(e) => e.key === "Enter" && handleSearch()}
          />
        </div>
        <Button onClick={() => setShowFilters(!showFilters)} className={cn(buttonVariants({ variant: "outline" }), "sm:w-auto w-full")}>
          <Filter className="h-4 w-4 mr-2" />
          Filters
          {(selectedSources.length > 0 || sentiment || startDate || endDate) && (
            <Badge className="secondary ml-2 px-1 py-0 h-5 min-w-5 flex items-center justify-center">
              {selectedSources.length + (sentiment ? 1 : 0) + (startDate || endDate ? 1 : 0)}
            </Badge>
          )}
        </Button>
        <Button onClick={handleSearch} disabled={isLoading} className="sm:w-auto w-full">
          <Search className="h-4 w-4 mr-2" />
          Search
        </Button>
      </div>

      {showFilters && (
        <div className="p-4 border rounded-md space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-sm font-medium">Advanced Filters</h3>
            <Button onClick={handleReset} className={cn(buttonVariants({ variant: "ghost", size: "sm" }), "h-8 px-2 text-xs")}>
              Reset All
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Date Range</label>
              <div className="flex gap-2">
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      className={cn(
                        buttonVariants({ variant: "outline" }),
                        "w-full justify-start text-left font-normal",
                        !startDate && "text-muted-foreground",
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {startDate ? format(startDate, "PPP") : "Start date"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar mode="single" selected={startDate} onSelect={setStartDate} initialFocus />
                  </PopoverContent>
                </Popover>

                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      className={cn(buttonVariants({ variant: "outline" }), "w-full justify-start text-left font-normal", !endDate && "text-muted-foreground")}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {endDate ? format(endDate, "PPP") : "End date"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar mode="single" selected={endDate} onSelect={setEndDate} initialFocus />
                  </PopoverContent>
                </Popover>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Sentiment</label>
              <Select value={sentiment} onValueChange={(value) => setSentiment(value as NewsSentiment | "")}>
                <SelectTrigger>
                  <SelectValue placeholder="Any sentiment" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="any">Any sentiment</SelectItem>
                  <SelectItem value={NewsSentiment.POSITIVE}>Positive</SelectItem>
                  <SelectItem value={NewsSentiment.NEGATIVE}>Negative</SelectItem>
                  <SelectItem value={NewsSentiment.NEUTRAL}>Neutral</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Sources</label>
            <div className="flex flex-wrap gap-2">
              {Object.values(NewsSource).map((source) => (
                <Badge
                  key={source}
                  className={cn(badgeVariants({ variant: selectedSources.includes(source) ? "default" : "outline" }), "cursor-pointer")}
                  onClick={() => toggleSource(source)}
                >
                  {source}
                  {selectedSources.includes(source) && <X className="ml-1 h-3 w-3" />}
                </Badge>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
