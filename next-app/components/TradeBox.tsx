'use client';

import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { tradingClient } from '@/lib/api/apiClients';
import { TradeRequest } from '@/lib/schemas/schemas';
import { queryKeys } from '@/components/ReactQueryProvider';
import { TrendingUp, TrendingDown, DollarSign, Activity, AlertTriangle, CheckCircle } from 'lucide-react';

/**
 * Trade Box Component
 * Quick trading interface for executing buy/sell orders
 */

export function TradeBox() {
  const [symbol, setSymbol] = useState('AAPL');
  const [side, setSide] = useState<'buy' | 'sell'>('buy');
  const [quantity, setQuantity] = useState('10');
  const [orderType, setOrderType] = useState<'market' | 'limit'>('market');
  const [limitPrice, setLimitPrice] = useState('');
  
  const queryClient = useQueryClient();

  // Execute trade mutation
  const executeTradeMutation = useMutation({
    mutationFn: (trade: TradeRequest) => tradingClient.executeTrade(trade),
    onSuccess: () => {
      // Invalidate related queries to refresh data
      queryClient.invalidateQueries({ queryKey: queryKeys.portfolio.all });
      queryClient.invalidateQueries({ queryKey: queryKeys.trading.all });
      
      // Reset form
      setQuantity('10');
      setLimitPrice('');
    },
  });

  const handleExecuteTrade = () => {
    const trade: TradeRequest = {
      symbol,
      side,
      quantity: parseInt(quantity),
      orderType,
      ...(orderType === 'limit' && limitPrice && { price: parseFloat(limitPrice) }),
    };

    executeTradeMutation.mutate(trade);
  };

  const isFormValid = quantity && parseInt(quantity) > 0 && 
    (orderType === 'market' || (orderType === 'limit' && limitPrice && parseFloat(limitPrice) > 0));

  const isBuy = side === 'buy';

  return (
    <div className="trading-card p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-2">
          <Activity className="h-6 w-6 text-primary" />
          <div>
            <h2 className="text-xl font-semibold">Quick Trade</h2>
            <p className="text-sm text-muted-foreground">
              Execute trades instantly
            </p>
          </div>
        </div>
        
        {/* Side Toggle */}
        <div className="flex bg-muted rounded-lg p-1">
          <button
            onClick={() => setSide('buy')}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              isBuy 
                ? 'bg-green-500 text-white' 
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            Buy
          </button>
          <button
            onClick={() => setSide('sell')}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              !isBuy 
                ? 'bg-red-500 text-white' 
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            Sell
          </button>
        </div>
      </div>

      {/* Trade Form */}
      <div className="space-y-4">
        {/* Symbol Selection */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-muted-foreground">Symbol</label>
          <select
            value={symbol}
            onChange={(e) => setSymbol(e.target.value)}
            className="w-full p-3 border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary/20"
          >
            <option value="AAPL">AAPL - Apple Inc.</option>
            <option value="GOOGL">GOOGL - Alphabet Inc.</option>
            <option value="MSFT">MSFT - Microsoft Corp.</option>
            <option value="TSLA">TSLA - Tesla Inc.</option>
            <option value="AMZN">AMZN - Amazon.com Inc.</option>
            <option value="NVDA">NVDA - NVIDIA Corp.</option>
            <option value="META">META - Meta Platforms</option>
          </select>
        </div>

        {/* Quantity */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-muted-foreground">Quantity</label>
          <div className="relative">
            <input
              type="number"
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
              placeholder="Enter quantity"
              min="1"
              className="w-full p-3 border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary/20"
            />
            <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground">
              shares
            </div>
          </div>
        </div>

        {/* Order Type */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-muted-foreground">Order Type</label>
          <div className="flex space-x-2">
            <button
              onClick={() => setOrderType('market')}
              className={`flex-1 p-3 rounded-lg border font-medium transition-colors ${
                orderType === 'market'
                  ? 'border-primary bg-primary/10 text-primary'
                  : 'border-border bg-background hover:bg-muted/50'
              }`}
            >
              Market
            </button>
            <button
              onClick={() => setOrderType('limit')}
              className={`flex-1 p-3 rounded-lg border font-medium transition-colors ${
                orderType === 'limit'
                  ? 'border-primary bg-primary/10 text-primary'
                  : 'border-border bg-background hover:bg-muted/50'
              }`}
            >
              Limit
            </button>
          </div>
        </div>

        {/* Limit Price (if limit order) */}
        {orderType === 'limit' && (
          <div className="space-y-2">
            <label className="text-sm font-medium text-muted-foreground">Limit Price</label>
            <div className="relative">
              <input
                type="number"
                value={limitPrice}
                onChange={(e) => setLimitPrice(e.target.value)}
                placeholder="Enter limit price"
                step="0.01"
                min="0"
                className="w-full p-3 pl-8 border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary/20"
              />
              <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            </div>
          </div>
        )}

        {/* Order Summary */}
        <div className="p-4 bg-muted/50 rounded-lg space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Order Summary</span>
            <span className={`font-medium ${isBuy ? 'text-green-600' : 'text-red-600'}`}>
              {isBuy ? 'BUY' : 'SELL'} {quantity} {symbol}
            </span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Order Type</span>
            <span className="font-medium capitalize">{orderType}</span>
          </div>
          {orderType === 'limit' && limitPrice && (
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Limit Price</span>
              <span className="font-medium">${parseFloat(limitPrice).toFixed(2)}</span>
            </div>
          )}
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Estimated Value</span>
            <span className="font-medium">
              ${orderType === 'limit' && limitPrice 
                ? (parseInt(quantity || '0') * parseFloat(limitPrice)).toLocaleString() 
                : 'Market Price'
              }
            </span>
          </div>
        </div>

        {/* Execute Button */}
        <button
          onClick={handleExecuteTrade}
          disabled={!isFormValid || executeTradeMutation.isPending}
          className={`w-full p-4 rounded-lg font-semibold text-white transition-colors ${
            !isFormValid || executeTradeMutation.isPending
              ? 'bg-muted cursor-not-allowed'
              : isBuy 
                ? 'bg-green-600 hover:bg-green-700' 
                : 'bg-red-600 hover:bg-red-700'
          }`}
        >
          {executeTradeMutation.isPending ? (
            <div className="flex items-center justify-center space-x-2">
              <Activity className="h-4 w-4 animate-spin" />
              <span>Executing...</span>
            </div>
          ) : (
            <div className="flex items-center justify-center space-x-2">
              {isBuy ? (
                <TrendingUp className="h-5 w-5" />
              ) : (
                <TrendingDown className="h-5 w-5" />
              )}
              <span>{isBuy ? 'Buy' : 'Sell'} {symbol}</span>
            </div>
          )}
        </button>

        {/* Success Message */}
        {executeTradeMutation.isSuccess && (
          <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
            <div className="flex items-center space-x-2">
              <CheckCircle className="h-4 w-4 text-green-600" />
              <span className="text-sm font-medium text-green-800">
                Trade executed successfully
              </span>
            </div>
            {executeTradeMutation.data && (
              <div className="mt-2 text-xs text-green-600 space-y-1">
                <p>Trade ID: {executeTradeMutation.data.tradeId}</p>
                <p>
                  Executed: {executeTradeMutation.data.quantity} shares @ $
                  {executeTradeMutation.data.executedPrice.toFixed(2)}
                </p>
              </div>
            )}
          </div>
        )}

        {/* Error Message */}
        {executeTradeMutation.isError && (
          <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
            <div className="flex items-center space-x-2">
              <AlertTriangle className="h-4 w-4 text-red-600" />
              <span className="text-sm font-medium text-red-800">
                Trade execution failed
              </span>
            </div>
            <p className="text-xs text-red-600 mt-1">
              {(executeTradeMutation.error as any)?.message || 'Unknown error occurred'}
            </p>
          </div>
        )}
      </div>

      {/* Disclaimer */}
      <div className="mt-6 pt-4 border-t border-border">
        <p className="text-xs text-muted-foreground text-center">
          ⚠️ This is a demo trading interface. No real trades are executed.
        </p>
      </div>
    </div>
  );
}