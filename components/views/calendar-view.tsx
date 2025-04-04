"use client"

import { useState } from "react"
import FullCalendar from "@fullcalendar/react"
import dayGridPlugin from "@fullcalendar/daygrid"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface CalendarEvent {
  id: string
  title: string
  start: string
  end?: string
  color?: string
  url?: string
  type: "news" | "earnings" | "economic" | "dividend"
}

export function CalendarView() {
  const [filter, setFilter] = useState<string>("all")
  const [events, setEvents] = useState<CalendarEvent[]>([])

  const fetchEvents = async (start: Date, end: Date) => {
    // Implement event fetching logic
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Market Calendar</h2>
        <Select value={filter} onValueChange={setFilter}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Filter events" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Events</SelectItem>
            <SelectItem value="news">News</SelectItem>
            <SelectItem value="earnings">Earnings</SelectItem>
            <SelectItem value="economic">Economic</SelectItem>
            <SelectItem value="dividend">Dividends</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <Card>
        <CardContent className="pt-6">
          <FullCalendar
            plugins={[dayGridPlugin]}
            initialView="dayGridMonth"
            events={events}
            height="auto"
            eventClick={(info) => {
              if (info.event.url) {
                window.open(info.event.url)
              }
            }}
          />
        </CardContent>
      </Card>
    </div>
  )
}
