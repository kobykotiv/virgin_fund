"use client";

import { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { formatCurrency } from '@/lib/utils';

interface AccountData {
  id: string;
  account_number: string;
  status: string;
  currency: string;
  buying_power: string;
  cash: string;
  portfolio_value: string;
}

export function AccountSummary() {
  const [account, setAccount] = useState<AccountData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchAccountData() {
      try {
        setLoading(true);
        const response = await fetch('/api/market/account');
        
        if (!response.ok) {
          throw new Error(`HTTP error ${response.status}`);
        }
        
        const result = await response.json();
        
        if (!result.success) {
          throw new Error(result.error || 'Failed to fetch account data');
        }
        
        setAccount(result.data);
      } catch (err) {
        console.error('Error fetching account data:', err);
        setError(err instanceof Error ? err.message : 'Unknown error occurred');
      } finally {
        setLoading(false);
      }
    }
    
    fetchAccountData();
  }, []);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Account Summary</CardTitle>
        <CardDescription>Your Alpaca trading account information</CardDescription>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="space-y-2">
            <Skeleton className="h-4 w-[250px]" />
            <Skeleton className="h-4 w-[200px]" />
            <Skeleton className="h-4 w-[300px]" />
            <Skeleton className="h-4 w-[250px]" />
          </div>
        ) : error ? (
          <div className="p-4 border border-red-300 bg-red-50 text-red-800 rounded-md">
            Error: {error}
          </div>
        ) : account ? (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Account Number</p>
                <p className="text-xl font-bold">{account.account_number}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Status</p>
                <p className="text-xl font-bold">
                  <span className={`inline-block rounded-full w-2 h-2 mr-2 ${
                    account.status === 'ACTIVE' ? 'bg-green-500' : 'bg-red-500'
                  }`}></span>
                  {account.status}
                </p>
              </div>
            </div>
            
            <div className="space-y-2">
              <div className="flex justify-between items-center py-2 border-b">
                <span className="font-medium">Portfolio Value</span>
                <span className="text-lg">{formatCurrency(parseFloat(account.portfolio_value))}</span>
              </div>
              <div className="flex justify-between items-center py-2 border-b">
                <span className="font-medium">Cash</span>
                <span className="text-lg">{formatCurrency(parseFloat(account.cash))}</span>
              </div>
              <div className="flex justify-between items-center py-2">
                <span className="font-medium">Buying Power</span>
                <span className="text-lg">{formatCurrency(parseFloat(account.buying_power))}</span>
              </div>
            </div>
          </div>
        ) : (
          <div className="text-center py-4 text-muted-foreground">
            No account data available
          </div>
        )}
      </CardContent>
    </Card>
  );
}
