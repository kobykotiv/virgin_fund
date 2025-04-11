import { useEffect, useState } from 'react';
import { Bot, Trade } from '@prisma/client';
import { useToast } from '@/components/ui/use-toast';

interface BotUpdate {
  type: 'init' | 'update';
  timestamp: string;
  status: Bot['status'];
  lastTrade?: Trade;
  openOrders?: number;
}

interface UseBotUpdatesOptions {
  onNewTrade?: (trade: Trade) => void;
  onStatusChange?: (status: Bot['status']) => void;
}

export function useBotUpdates(botId: string, options: UseBotUpdatesOptions = {}) {
  const [lastUpdate, setLastUpdate] = useState<BotUpdate | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [retryCount, setRetryCount] = useState(0);
  const { toast } = useToast();
  const MAX_RETRIES = 3;

  useEffect(() => {
    let eventSource: EventSource | null = null;
    let retryTimeout: NodeJS.Timeout;

    const connect = () => {
      if (retryCount >= MAX_RETRIES) {
        toast({
          title: "Connection Error",
          description: "Failed to connect to bot updates after multiple attempts",
          variant: "destructive",
        });
        return;
      }

      try {
        eventSource = new EventSource(`/api/bots/${botId}/events`);

        eventSource.onopen = () => {
          setIsConnected(true);
          setError(null);
          setRetryCount(0);
        };

        eventSource.onmessage = (event) => {
          try {
            const data: BotUpdate = JSON.parse(event.data);
            setLastUpdate(data);

            // Handle different update types
            switch (data.type) {
              case 'update':
                // Compare with previous update to detect changes
                if (lastUpdate?.status !== data.status && options.onStatusChange) {
                  options.onStatusChange(data.status);
                }
                
                // Check for new trades
                if (
                  data.lastTrade &&
                  lastUpdate?.lastTrade?.id !== data.lastTrade.id &&
                  options.onNewTrade
                ) {
                  options.onNewTrade(data.lastTrade);
                }
                break;
            }
          } catch (err) {
            console.error('Error parsing SSE data:', err);
            setError('Failed to parse update data');
          }
        };

        eventSource.onerror = (error) => {
          console.error('SSE error:', error);
          setIsConnected(false);
          setError('Connection error');
          eventSource?.close();

          // Attempt to reconnect
          retryTimeout = setTimeout(() => {
            setRetryCount(prev => prev + 1);
            connect();
          }, 5000); // Wait 5 seconds before retrying
        };
      } catch (error) {
        console.error('Error setting up SSE:', error);
        setError('Failed to establish connection');
      }
    };

    connect();

    // Cleanup function
    return () => {
      if (eventSource) {
        eventSource.close();
      }
      if (retryTimeout) {
        clearTimeout(retryTimeout);
      }
    };
  }, [botId, options.onNewTrade, options.onStatusChange, retryCount, toast, lastUpdate?.status]);

  const reconnect = () => {
    setRetryCount(0);
    setError(null);
  };

  return {
    lastUpdate,
    isConnected,
    error,
    reconnect
  };
}

// Type guard to check if an update contains a trade
export function hasNewTrade(update: BotUpdate): update is BotUpdate & { lastTrade: Trade } {
  return 'lastTrade' in update && update.lastTrade !== undefined;
}

// Utility function to format the connection status
export function getConnectionStatus(isConnected: boolean, error: string | null): {
  status: 'connected' | 'disconnected' | 'error';
  message: string;
} {
  if (error) {
    return {
      status: 'error',
      message: error
    };
  }

  return {
    status: isConnected ? 'connected' : 'disconnected',
    message: isConnected ? 'Connected to bot updates' : 'Disconnected from bot updates'
  };
}
