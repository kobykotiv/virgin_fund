"use client";

import { useEffect, useState } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { formatCurrency, formatPercentage } from '@/lib/utils';

interface Position {
  symbol: string;
  qty: string;
  avg_entry_price: string;
  current_price: string;
  market_value: string;
  unrealized_pl: string;
  unrealized_plpc: string;
  change_today: string;
}

export function PositionsTable() {
  const [positions, setPositions] = useState<Position[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchPositions() {
      try {
        setLoading(true);
        const response = await fetch('/api/market/positions');
        
        if (!response.ok) {
          throw new Error(`HTTP error ${response.status}`);
        }
        
        const result = await response.json();
        
        if (!result.success) {
          throw new Error(result.error || 'Failed to fetch positions');
        }
        
        setPositions(result.data);
      } catch (err) {
        console.error('Error fetching positions:', err);
        setError(err instanceof Error ? err.message : 'Unknown error occurred');
      } finally {
        setLoading(false);
      }
    }
    
    fetchPositions();
  }, []);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Current Positions</CardTitle>
        <CardDescription>Your open positions in Alpaca</CardDescription>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="space-y-2">
            <Skeleton className="h-8 w-full" />
            <Skeleton className="h-8 w-full" />
            <Skeleton className="h-8 w-full" />
          </div>
        ) : error ? (
          <div className="p-4 border border-red-300 bg-red-50 text-red-800 rounded-md">
            Error: {error}
          </div>
        ) : positions.length > 0 ? (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Symbol</TableHead>
                <TableHead>Quantity</TableHead>
                <TableHead>Avg. Entry</TableHead>
                <TableHead>Current Price</TableHead>
                <TableHead>Market Value</TableHead>
                <TableHead>P&L</TableHead>
                <TableHead>Change Today</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {positions.map((position) => (
                <TableRow key={position.symbol}>
                  <TableCell className="font-medium">{position.symbol}</TableCell>
                  <TableCell>{position.qty}</TableCell>
                  <TableCell>{formatCurrency(parseFloat(position.avg_entry_price))}</TableCell>
                  <TableCell>{formatCurrency(parseFloat(position.current_price))}</TableCell>
                  <TableCell>{formatCurrency(parseFloat(position.market_value))}</TableCell>
                  <TableCell className={parseFloat(position.unrealized_pl) >= 0 ? 'text-green-600' : 'text-red-600'}>
                    {formatCurrency(parseFloat(position.unrealized_pl))}
                    <span className="ml-1 text-xs">
                      ({formatPercentage(parseFloat(position.unrealized_plpc))})
                    </span>
                  </TableCell>
                  <TableCell className={parseFloat(position.change_today) >= 0 ? 'text-green-600' : 'text-red-600'}>
                    {formatPercentage(parseFloat(position.change_today))}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        ) : (
          <div className="text-center py-4 text-muted-foreground">
            No positions found
          </div>
        )}
      </CardContent>
    </Card>
  );
}
