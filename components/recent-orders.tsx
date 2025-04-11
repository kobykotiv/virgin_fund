"use client";

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";
import { AlertCircle, ArrowUpRight, ArrowDownLeft } from 'lucide-react';
import { AlpacaOrder } from '@/lib/alpaca-client'; // Assuming interface is exported
import { Badge } from "@/components/ui/badge";
import { formatDistanceToNow } from 'date-fns';

// Define a type for the transformed order data used in the table
interface DisplayOrder extends Omit<AlpacaOrder, 
  'qty' | 'notional' | 'limit_price' | 'stop_price' | 'filled_avg_price' | 'filled_qty' | 'trail_price' | 'trail_percent'> {
  qty?: number;
  notional?: number;
  limit_price?: number;
  stop_price?: number;
  filled_avg_price?: number;
  filled_qty?: number;
  trail_price?: number;
  trail_percent?: number;
}

export function RecentOrders({ limit = 5 }: { limit?: number }) {
  const [orders, setOrders] = useState<DisplayOrder[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchOrders = async () => {
      setIsLoading(true);
      setError(null);
      try {
        // Fetch only recent orders, e.g., limit to 10 or 20, sort by date descending
        const response = await fetch(`/api/alpaca/orders?limit=${limit}&status=all&direction=desc`); 
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || `Failed to fetch orders (${response.status})`);
        }
        // API route already transforms string numbers to floats
        const data: DisplayOrder[] = await response.json(); 
        setOrders(data);
      } catch (err) {
        console.error("Error fetching orders:", err);
        setError(err instanceof Error ? err.message : "An unknown error occurred");
      } finally {
        setIsLoading(false);
      }
    };

    fetchOrders();
     // Optional: Add a refresh interval if needed
     // const interval = setInterval(fetchOrders, 60000); // Refresh every minute
     // return () => clearInterval(interval);
  }, [limit]);

   const formatCurrency = (value: number | undefined) => {
     if (value === undefined || value === null || isNaN(value)) return '$--.--';
     return `$${value.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
   };

   const formatQuantity = (value: number | undefined) => {
      if (value === undefined || value === null || isNaN(value)) return '--';
      return value.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 8 });
   };

   const getStatusVariant = (status: DisplayOrder['status']): 'default' | 'secondary' | 'destructive' | 'outline' | 'success' => {
      switch (status) {
         case 'filled':
         case 'accepted':
            return 'success';
         case 'canceled':
         case 'expired':
         case 'rejected':
            return 'destructive';
         case 'new':
         case 'pending_new':
         case 'partially_filled':
            return 'secondary'; // Or maybe 'warning' if you add that variant
         default:
            return 'outline';
      }
   };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Orders</CardTitle>
        <CardDescription>Your latest order activity.</CardDescription>
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
            <p>Error loading orders: {error}</p>
          </div>
        )}
        {!isLoading && !error && orders.length === 0 && (
          <p className="text-center text-muted-foreground py-4">No recent orders found.</p>
        )}
        {!isLoading && !error && orders.length > 0 && (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Symbol</TableHead>
                <TableHead>Side</TableHead>
                <TableHead>Type</TableHead>
                <TableHead className="text-right">Qty/Notional</TableHead>
                <TableHead className="text-right">Filled Price</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Submitted</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {orders.map((order) => (
                <TableRow key={order.id || order.client_order_id}>
                  <TableCell className="font-medium">{order.symbol}</TableCell>
                  <TableCell>
                     <span className={`flex items-center gap-1 ${order.side === 'buy' ? 'text-green-600' : 'text-red-600'}`}>
                       {order.side === 'buy' ? <ArrowUpRight className="h-4 w-4"/> : <ArrowDownLeft className="h-4 w-4"/>}
                       {order.side.toUpperCase()}
                     </span>
                  </TableCell>
                  <TableCell className="capitalize">{order.type?.replace('_', ' ') || 'N/A'}</TableCell>
                  <TableCell className="text-right">
                     {order.qty ? formatQuantity(order.qty) : order.notional ? formatCurrency(order.notional) : '--'}
                  </TableCell>
                  <TableCell className="text-right">
                     {order.filled_avg_price ? formatCurrency(order.filled_avg_price) : '--'}
                  </TableCell>
                  <TableCell>
                     <Badge variant={getStatusVariant(order.status)} className="capitalize text-xs">
                       {order.status?.replace(/_/g, ' ') || 'Unknown'}
                     </Badge>
                  </TableCell>
                  <TableCell className="text-right text-xs text-muted-foreground">
                     {order.submitted_at ? formatDistanceToNow(new Date(order.submitted_at), { addSuffix: true }) : '--'}
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
