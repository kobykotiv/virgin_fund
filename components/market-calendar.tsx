"use client"

import useMarketData from '@/hooks/useMarketData';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';
import { format } from 'date-fns';

interface CalendarDay {
  date: string;
  open: string;
  close: string;
  session_open: boolean;
  session_close: boolean;
}

export function MarketCalendar({ days = 30 }: { days?: number }) {
  const startDate = new Date().toISOString().split('T')[0];
  const endDate = new Date(Date.now() + days * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
  
  const res = useMarketData();
  const dataRaw = res.data as unknown;
  const data = Array.isArray(dataRaw) ? (dataRaw as CalendarDay[]) : null;
  const isLoading = (res as any).isLoading ?? (res as any).loading ?? false;
  const error = res.error as Error | null;
  
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex justify-between items-center">
          <span>Market Calendar</span>
          {isLoading && <Skeleton className="h-4 w-[100px]" />}
        </CardTitle>
      </CardHeader>
      <CardContent>
  {error && (
          <div className="p-4 border border-red-300 bg-red-50 text-red-800 rounded-md">
            Failed to load market calendar: {error.message}
          </div>
        )}
        
  {isLoading && !data && (
          <div className="space-y-2">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="flex justify-between">
                <Skeleton className="h-6 w-[120px]" />
                <Skeleton className="h-6 w-[100px]" />
              </div>
            ))}
          </div>
        )}
        
  {data && (
          <div className="space-y-2">
            {data.map((day) => (
              <div key={day.date} className="flex justify-between items-center py-2 border-b">
                <div>
                  <div className="font-medium">{format(new Date(day.date), 'EEEE, MMMM d, yyyy')}</div>
                  <div className="text-sm text-muted-foreground">
                    {day.open} - {day.close}
                  </div>
                </div>
                <Badge className={day.session_open ? "success" : "destructive"}>
                  {day.session_open ? "Open" : "Closed"}
                </Badge>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
