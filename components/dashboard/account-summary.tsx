"use client";

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton"; // For loading state
import { AlertCircle, CheckCircle, XCircle } from 'lucide-react';
import { AlpacaAccount } from '@/lib/alpaca-client'; // Assuming interface is exported

export default function AccountSummary() {
  const [account, setAccount] = useState<AlpacaAccount | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAccountData = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const response = await fetch('/api/alpaca/account');
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || `Failed to fetch account data (${response.status})`);
        }
        const data: AlpacaAccount = await response.json();
        setAccount(data);
      } catch (err) {
        console.error("Error fetching account data:", err);
        setError(err instanceof Error ? err.message : "An unknown error occurred");
      } finally {
        setIsLoading(false);
      }
    };

    fetchAccountData();
  }, []);

  const formatCurrency = (value: string | number | undefined) => {
    const num = Number(value);
    if (isNaN(num)) return '$--.--';
    return `$${num.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  };

  const renderStatusIcon = (status: string | undefined) => {
    if (!status) return null;
    switch (status.toUpperCase()) {
      case 'ACTIVE':
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'INACTIVE':
      case 'ACCOUNT_CLOSED':
        return <XCircle className="h-5 w-5 text-red-500" />;
      default:
        return <AlertCircle className="h-5 w-5 text-yellow-500" />;
    }
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Account Summary</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Skeleton className="h-20 w-full" />
          <Skeleton className="h-20 w-full" />
          <Skeleton className="h-20 w-full" />
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="border-destructive">
        <CardHeader>
          <CardTitle className="text-destructive">Account Summary Error</CardTitle>
        </CardHeader>
        <CardContent className="text-destructive flex items-center gap-2">
           <AlertCircle className="h-5 w-5" />
           <p>{error}</p>
        </CardContent>
      </Card>
    );
  }

  if (!account) {
     return (
       <Card>
         <CardHeader>
           <CardTitle>Account Summary</CardTitle>
         </CardHeader>
         <CardContent>
           <p className="text-muted-foreground">No account data available.</p>
         </CardContent>
       </Card>
     );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Account Summary</CardTitle>
      </CardHeader>
      <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-muted/50 p-4 rounded-lg">
          <h3 className="text-sm font-medium text-muted-foreground">Portfolio Value</h3>
          <p className="text-2xl font-semibold">{formatCurrency(account.portfolio_value)}</p>
        </div>
        <div className="bg-muted/50 p-4 rounded-lg">
          <h3 className="text-sm font-medium text-muted-foreground">Buying Power</h3>
          <p className="text-2xl font-semibold">{formatCurrency(account.buying_power)}</p>
        </div>
        <div className="bg-muted/50 p-4 rounded-lg">
          <h3 className="text-sm font-medium text-muted-foreground">Account Status</h3>
          <div className="flex items-center gap-2 mt-2">
             {renderStatusIcon(account.status)}
             <p className="text-lg font-medium capitalize">{account.status?.toLowerCase() || 'Unknown'}</p>
          </div>
           {account.trading_blocked && <p className="text-xs text-red-500 mt-1">Trading Blocked</p>}
           {account.transfers_blocked && <p className="text-xs text-red-500 mt-1">Transfers Blocked</p>}
           {account.account_blocked && <p className="text-xs text-red-500 mt-1">Account Blocked</p>}
        </div>
      </CardContent>
    </Card>
  );
}
