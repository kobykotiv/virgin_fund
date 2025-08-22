"use client";

import { useEffect, useState } from 'react';
import { useAuth } from '@/providers/auth-provider';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { formatCurrency, formatDate } from '@/lib/utils';

interface Order {
  id: string;
  symbol: string;
  qty: string;
  side: 'buy' | 'sell';
  type: string;
  status: string;
  submitted_at: string;
  filled_at: string | null;
  limit_price: string | null;
  filled_qty: string;
}

export function RecentOrders() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const { user } = useAuth ? useAuth() : { user: null };

  useEffect(() => {
    async function fetchOrders() {
      try {
        setLoading(true);
        if (!user?.id) {
          setOrders([]);
          setLoading(false);
          return;
        }
        const response = await fetch(`/api/orders?user=${user.id}`);
        if (!response.ok) {
          throw new Error(`HTTP error ${response.status}`);
        }
        const result = await response.json();
        if (!result.orders) {
          throw new Error(result.error || 'Failed to fetch orders');
        }
        setOrders(result.orders);
      } catch (err) {
        console.error('Error fetching orders:', err);
        setError(err instanceof Error ? err.message : 'Unknown error occurred');
      } finally {
        setLoading(false);
      }
    }
    fetchOrders();
  }, [user?.id]);

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'filled':
        return 'bg-green-100 text-green-800';
      case 'new':
      case 'partially_filled':
        return 'bg-blue-100 text-blue-800';
      case 'canceled':
      case 'expired':
        return 'bg-amber-100 text-amber-800';
      case 'rejected':
      case 'failed':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Orders</CardTitle>
        <CardDescription>Your recent Alpaca orders</CardDescription>
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
        ) : orders.length > 0 ? (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Symbol</TableHead>
                <TableHead>Side</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Quantity</TableHead>
                <TableHead>Price</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Date</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {orders.map((order) => (
                <TableRow key={order.id}>
                  <TableCell className="font-medium">{order.symbol}</TableCell>
                  <TableCell className={order.side === 'buy' ? 'text-green-600' : 'text-red-600'}>
                    {order.side.toUpperCase()}
                  </TableCell>
                  <TableCell>{order.type}</TableCell>
                  <TableCell>{order.qty}</TableCell>
                  <TableCell>
                    {order.limit_price ? formatCurrency(parseFloat(order.limit_price)) : 'Market'}
                  </TableCell>
                  <TableCell>
                    <Badge className={`outline ${getStatusColor(order.status)}`}>
                      {order.status}
                    </Badge>
                  </TableCell>
                  <TableCell>{formatDate(order.submitted_at)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        ) : (
          <div className="text-center py-4 text-muted-foreground">
            No orders found
          </div>
        )}
      </CardContent>
    </Card>
  );
}
