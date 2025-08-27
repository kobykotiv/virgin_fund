// hooks/useApiKeys.ts
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

export interface ApiKeyStatus {
  configured: boolean;
  id?: string;
  last_verified?: string;
}

export function useAlpacaApiKeyStatus() {
  return useQuery({
    queryKey: ['api-keys', 'alpaca', 'status'],
    queryFn: async (): Promise<ApiKeyStatus> => {
      const res = await fetch('/api/alpaca/keys');
      const data = await res.json();
      if (!data.ok) throw new Error(data.error || 'Failed to fetch Alpaca API key status');
      return data;
    },
    staleTime: 60_000,
  });
}

export function useCoinGeckoApiKeyStatus() {
  return useQuery({
    queryKey: ['api-keys', 'coingecko', 'status'],
    queryFn: async (): Promise<ApiKeyStatus> => {
      const res = await fetch('/api/coingecko/keys');
      const data = await res.json();
      if (!data.ok) throw new Error(data.error || 'Failed to fetch CoinGecko API key status');
      return data;
    },
    staleTime: 60_000,
  });
}

export function useSetAlpacaApiKey() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (keyData: { apiKey: string; apiSecret: string }): Promise<{ id: string }> => {
      const res = await fetch('/api/alpaca/keys', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(keyData),
      });
      const data = await res.json();
      if (!data.ok) throw new Error(data.error || 'Failed to set Alpaca API key');
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['api-keys', 'alpaca'] });
    },
  });
}

export function useSetCoinGeckoApiKey() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (keyData: { apiKey: string }): Promise<{ id: string }> => {
      const res = await fetch('/api/coingecko/keys', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(keyData),
      });
      const data = await res.json();
      if (!data.ok) throw new Error(data.error || 'Failed to set CoinGecko API key');
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['api-keys', 'coingecko'] });
    },
  });
}

// Compatibility alias used by some components: useCreateApiKey
// This helper returns a function that delegates to the appropriate provider mutation based on a `provider` field.
export function useCreateApiKey() {
  const setAlpaca = useSetAlpacaApiKey();
  const setCoingecko = useSetCoinGeckoApiKey();

  return {
    mutateAsync: async (payload: any) => {
      const provider = payload.provider || 'alpaca';
      if (provider === 'coingecko') {
        return setCoingecko.mutateAsync({ apiKey: payload.apiKey });
      }
      // default to alpaca
      return setAlpaca.mutateAsync({ apiKey: payload.api_key || payload.apiKey, apiSecret: payload.secret_key || payload.apiSecret });
    }
  };
}

export function useValidateAlpacaApiKey() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (): Promise<{ valid: boolean; message: string }> => {
      const res = await fetch('/api/alpaca/validate', {
        method: 'POST',
      });
      const data = await res.json();
      if (!data.ok) throw new Error(data.error || 'Failed to validate Alpaca API key');
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['api-keys', 'alpaca'] });
    },
  });
}

export function useValidateCoinGeckoApiKey() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (): Promise<{ valid: boolean; message: string }> => {
      const res = await fetch('/api/coingecko/validate', {
        method: 'POST',
      });
      const data = await res.json();
      if (!data.ok) throw new Error(data.error || 'Failed to validate CoinGecko API key');
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['api-keys', 'coingecko'] });
    },
  });
}
