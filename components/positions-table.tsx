"use client";

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";
import { AlertCircle, TrendingUp, TrendingDown } from 'lucide-react';
import { AlpacaPosition } from '@/lib/alpaca-client'; // Assuming interface is exported

// Define a type for the transformed position data used in the table
interface DisplayPosition extends Omit<AlpacaPosition, 
  'qty' | 'market_value' | 'cost_basis' | 'unrealized_pl' | 'current_price' | 'avg_entry_price'> {
  qty: number;
  market_value: number;
  cost_basis: number;
  unrealized_pl: number;
  current_price: number;
  avg_entry_price: number;
  unrealized_pl_pct: number; // Add percentage P/L
}


export function PositionsTable() {
  const [positions, setPositions] = useState<DisplayPosition[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPositions = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const response = await fetch('/api/alpaca/positions');
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || `Failed to fetch positions (${response.status})`);
        }
        // The API route already transforms string numbers to floats
        const data: DisplayPosition[] = await response.json(); 
        
        // Calculate P/L percentage
        const positionsWithPct = data.map(pos => ({
          ...pos,
          unrealized_pl_pct: pos.cost_basis !== 0 ? (pos.unrealized_pl / pos.cost_basis) * 100 : 0,
        }));
        
        setPositions(positionsWithPct);
      } catch (err) {
        console.error("Error fetching positions:", err);
        setError(err instanceof Error ? err.message : "An unknown error occurred");
      } finally {
        setIsLoading(false);
      }
    };

    fetchPositions();
  }, []);

  const formatCurrency = (value: number | undefined) => {
     if (value === undefined || value === null || isNaN(value)) return '$--.--';
     return `$${value.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
   };

   const formatPercentage = (value: number | undefined) => {
     if (value === undefined || value === null || isNaN(value)) return '--.--%';
     return `${value >= 0 ? '+' : ''}${value.toFixed(2)}%`;
   };

   const formatQuantity = (value: number | undefined) => {
      if (value === undefined || value === null || isNaN(value)) return '--';
      // Show more decimal places for potentially fractional shares
      return value.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 8 });
   };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Current Positions</CardTitle>
        <CardDescription>Your open positions in your Alpaca account.</CardDescription>
      </CardHeader>
      <CardContent>
        {isLoading && (
          <div className="space-y-2">
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
          </div>
        )}
        {error && (
          <div className="text-destructive flex items-center gap-2">
            <AlertCircle className="h-5 w-5" />
            <p>Error loading positions: {error}</p>
          </div>
        )}
        {!isLoading && !error && positions.length === 0 && (
          <p className="text-center text-muted-foreground py-4">No open positions found.</p>
        )}
        {!isLoading && !error && positions.length > 0 && (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Symbol</TableHead>
                <TableHead className="text-right">Quantity</TableHead>
                <TableHead className="text-right">Avg. Entry</TableHead>
                <TableHead className="text-right">Current Price</TableHead>
                <TableHead className="text-right">Market Value</TableHead>
                <TableHead className="text-right">Unrealized P/L</TableHead>
                <TableHead className="text-right">Unrealized P/L %</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {positions.map((pos) => (
                <TableRow key={pos.asset_id}>
                  <TableCell className="font-medium">{pos.symbol}</TableCell>
                  <TableCell className="text-right">{formatQuantity(pos.qty)}</TableCell>
                  <TableCell className="text-right">{formatCurrency(pos.avg_entry_price)}</TableCell>
                  <TableCell className="text-right">{formatCurrency(pos.current_price)}</TableCell>
                  <TableCell className="text-right">{formatCurrency(pos.market_value)}</TableCell>
                  <TableCell className={`text-right font-medium ${pos.unrealized_pl >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                     {formatCurrency(pos.unrealized_pl)}
                  </TableCell>
                   <TableCell className={`text-right font-medium ${pos.unrealized_pl_pct >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                     <span className="flex items-center justify-end gap-1">
                       {pos.unrealized_pl_pct >= 0 ? <TrendingUp className="h-4 w-4"/> : <TrendingDown className="h-4 w-4"/>}
                       {formatPercentage(pos.unrealized_pl_pct)}
                     </span>
                   </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  );
}
