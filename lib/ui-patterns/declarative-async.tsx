// =============================================================================
// Declarative Data Fetching Hook
// =============================================================================

"use client";

import React, { useState, useEffect, useCallback } from 'react';

export interface UseAsyncDataOptions<T> {
  initialData?: T;
  onSuccess?: (data: T) => void;
  onError?: (error: Error) => void;
  enabled?: boolean;
}

export interface UseAsyncDataResult<T> {
  data: T | undefined;
  loading: boolean;
  error: Error | null;
  refetch: () => Promise<void>;
}

export function useAsyncData<T>(
  fetcher: () => Promise<T>,
  options: UseAsyncDataOptions<T> = {}
): UseAsyncDataResult<T> {
  const { initialData, onSuccess, onError, enabled = true } = options;

  const [data, setData] = useState<T | undefined>(initialData);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<Error | null>(null);

  const fetchData = useCallback(async () => {
    if (!enabled) return;

    setLoading(true);
    setError(null);

    try {
      const result = await fetcher();
      setData(result);
      onSuccess?.(result);
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Unknown error');
      setError(error);
      onError?.(error);
    } finally {
      setLoading(false);
    }
  }, [fetcher, enabled, onSuccess, onError]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return {
    data,
    loading,
    error,
    refetch: fetchData,
  };
}

// =============================================================================
// Declarative API Hook
// =============================================================================

export interface ApiEndpoint<TData = any, TParams = any> {
  url: string;
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE';
  headers?: Record<string, string>;
  transformParams?: (params: TParams) => any;
  transformResponse?: (response: any) => TData;
}

export function useApiEndpoint<TData = any, TParams = any>(
  endpoint: ApiEndpoint<TData, TParams>,
  params?: TParams,
  options: UseAsyncDataOptions<TData> = {}
) {
  const fetcher = useCallback(async (): Promise<TData> => {
    const transformedParams = endpoint.transformParams
      ? endpoint.transformParams(params!)
      : params;

    const url = endpoint.method === 'GET' && transformedParams
      ? `${endpoint.url}?${new URLSearchParams(transformedParams)}`
      : endpoint.url;

    const response = await fetch(url, {
      method: endpoint.method || 'GET',
      headers: {
        'Content-Type': 'application/json',
        ...endpoint.headers,
      },
      ...(endpoint.method !== 'GET' && transformedParams && {
        body: JSON.stringify(transformedParams),
      }),
    });

    if (!response.ok) {
      throw new Error(`API error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    return endpoint.transformResponse ? endpoint.transformResponse(data) : data;
  }, [endpoint, params]);

  return useAsyncData(fetcher, options);
}

// =============================================================================
// Declarative Async Component
// =============================================================================

import { AsyncComponentProps } from './declarative-calculator';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { AlertCircle, RefreshCw } from 'lucide-react';

export function DeclarativeAsyncComponent<T>({
  data,
  loading,
  error,
  onRetry,
  loadingComponent,
  errorComponent,
  emptyComponent,
  children,
  className,
}: AsyncComponentProps<T> & {
  loadingComponent?: React.ReactNode;
  errorComponent?: React.ReactNode;
  emptyComponent?: React.ReactNode;
  children: (data: T) => React.ReactNode;
}) {
  if (loading) {
    return loadingComponent || (
      <Card className={className}>
        <CardContent className="p-6">
          <div className="space-y-2">
            <Skeleton className="h-4 w-[250px]" />
            <Skeleton className="h-4 w-[200px]" />
            <Skeleton className="h-4 w-[300px]" />
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return errorComponent || (
      <Card className={className}>
        <CardContent className="p-6">
          <div className="flex items-center space-x-2 text-red-600">
            <AlertCircle className="h-5 w-5" />
            <span>{error instanceof Error ? error.message : 'An error occurred'}</span>
          </div>
          {onRetry && (
            <Button
              variant="outline"
              size="sm"
              onClick={onRetry}
              className="mt-2"
            >
              <RefreshCw className="h-4 w-4 mr-2" />
              Try Again
            </Button>
          )}
        </CardContent>
      </Card>
    );
  }

  if (!data) {
    return emptyComponent || (
      <Card className={className}>
        <CardContent className="p-6">
          <div className="text-center text-muted-foreground">
            No data available
          </div>
        </CardContent>
      </Card>
    );
  }

  return <>{children(data)}</>;
}

// =============================================================================
// Declarative Table Component
// =============================================================================

export interface TableColumn<T> {
  key: keyof T | string;
  header: string;
  render?: (value: any, item: T) => React.ReactNode;
  sortable?: boolean;
  width?: string;
}

export interface DeclarativeTableProps<T> {
  data: T[];
  columns: TableColumn<T>[];
  loading?: boolean;
  emptyMessage?: string;
  onRowClick?: (item: T) => void;
  className?: string;
}

export function DeclarativeTable<T extends Record<string, any>>({
  data,
  columns,
  loading = false,
  emptyMessage = 'No data available',
  onRowClick,
  className,
}: DeclarativeTableProps<T>) {
  if (loading) {
    return (
      <div className={`space-y-2 ${className}`}>
        {Array.from({ length: 5 }).map((_, i) => (
          <Skeleton key={i} className="h-12 w-full" />
        ))}
      </div>
    );
  }

  if (data.length === 0) {
    return (
      <div className={`text-center py-8 text-muted-foreground ${className}`}>
        {emptyMessage}
      </div>
    );
  }

  return (
    <div className={`overflow-x-auto ${className}`}>
      <table className="w-full">
        <thead>
          <tr className="border-b">
            {columns.map((column) => (
              <th
                key={String(column.key)}
                className="text-left p-2 font-medium"
                style={{ width: column.width }}
              >
                {column.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((item, index) => (
            <tr
              key={index}
              className={`border-b hover:bg-muted/50 ${
                onRowClick ? 'cursor-pointer' : ''
              }`}
              onClick={() => onRowClick?.(item)}
            >
              {columns.map((column) => (
                <td key={String(column.key)} className="p-2">
                  {column.render
                    ? column.render(item[column.key as keyof T], item)
                    : String(item[column.key as keyof T] || '')
                  }
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
