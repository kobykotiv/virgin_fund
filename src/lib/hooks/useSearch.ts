import { useState, useCallback } from 'react';
import { supabase } from '../supabase';
import { useToast } from '@/components/ui/use-toast';
import { useSearchMetrics } from './useSearchMetrics';
import { SearchError, handleSearchError } from '../errors/searchErrors';
import { validateSearchQuery } from '../services/searchValidation';
import { useApiKeyStore } from '../services/apiKeyRotation';
import axios from 'axios';

interface SearchResult {
  symbol: string;
  name: string;
  type: string;
  region: string;
  marketOpen: string;
  marketClose: string;
  timezone: string;
  currency: string;
  matchScore: string;
}

interface SearchState {
  results: SearchResult[];
  loading: boolean;
  error: SearchError | null;
  source: 'cache' | 'api' | null;
}

export function useSearch() {
  const { toast } = useToast();
  const metrics = useSearchMetrics();
  const getNextApiKey = useApiKeyStore(state => state.getNextAvailableKey);
  const updateRateLimit = useApiKeyStore(state => state.updateRateLimit);
  const [state, setState] = useState<SearchState>({
    results: [],
    loading: false,
    error: null,
    source: null
  });

  const search = useCallback(async (query: string) => {
    // Clear results if query is empty
    if (!query.trim()) {
      setState(prev => ({ ...prev, results: [], loading: false, error: null }));
      return;
    }

    try {
      validateSearchQuery(query);
    } catch (error) {
      setState(prev => ({
        ...prev,
        error: error as SearchError,
        loading: false
      }));
      return;
    }
    setState(prev => ({ ...prev, loading: true, error: null }));
    const searchStart = Date.now();

    try {
      // Get next available API key
      const apiKey = getNextApiKey();
      if (!apiKey) {
        throw new SearchError({
          code: 'RATE_LIMIT_ALL_KEYS',
          message: 'All API keys are rate limited',
          userMessage: 'Search is temporarily unavailable. Please try again in a minute.',
          stage: 'api',
          origin: 'client'
        });
      }
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        throw new SearchError({
          code: 'AUTH_REQUIRED',
          message: 'Authentication required',
          userMessage: 'Please sign in to search',
          stage: 'validation',
          origin: 'client'
        });
      }

      // Step 2: Check local database first
      const { data: localResults, error: dbError } = await supabase
        .rpc('get_latest_search', {
          p_user_id: user.id,
          p_symbol: query.toUpperCase()
        });

      if (dbError) {
        console.warn('Database search error:', dbError);
        // Don't throw, continue to API
      }

      // If we have recent results (less than 24h old), show them immediately
      if (localResults && isRecentSearch(localResults.last_searched)) {
        metrics.incrementCacheHits();
        setState(prev => ({
          ...prev,
          results: localResults.results,
          loading: true, // Keep loading while we fetch fresh data
          source: 'cache'
        }));
      }

      // Step 3: Fetch fresh data from API
      try {
        const response = await axios.get('https://www.alphavantage.co/query', {
          params: {
            function: 'SYMBOL_SEARCH',
            keywords: query,
            apikey: apiKey
          }
        });

        // Update rate limit based on response headers
        const remainingCalls = parseInt(response.headers['x-ratelimit-remaining'] || '5');
        updateRateLimit(apiKey, remainingCalls);

        metrics.incrementApiCalls();
        metrics.addResponseTime(Date.now() - searchStart);

        if (response.data.bestMatches) {
          const apiResults = mapApiResults(response.data.bestMatches);
          
          // Step 4: Store in database
          await storeSearchResults(user.id, query, apiResults);

          setState({
            results: apiResults,
            loading: false,
            error: null,
            source: 'api'
          });
        } else {
          throw new SearchError({
            code: 'INVALID_RESPONSE',
            message: 'Invalid API response format',
            userMessage: 'Unable to process search results',
            stage: 'processing',
            origin: 'third-party'
          });
        }
      } catch (apiError) {
        // Handle rate limit error
        if (axios.isAxiosError(apiError) && apiError.response?.status === 429) {
          updateRateLimit(apiKey, 0);
          // Retry with next key
          const nextKey = getNextApiKey();
          if (nextKey) {
            return search(query);
          }
        }

        // API error but we have cache results
        if (state.results.length > 0) {
          toast({
            title: "Using cached results",
            description: "Couldn't fetch fresh data. Showing recent results instead.",
            variant: "default"
          });
          setState(prev => ({ ...prev, loading: false }));
        } else {
          throw apiError; // Re-throw if no cache available
        }
      }
    } catch (error) {
      const searchError = handleSearchError(error);
      setState(prev => ({
        ...prev,
        error: searchError,
        loading: false
      }));
    }
  }, [toast, metrics]);

  return {
    ...state,
    search
  };
}

function isRecentSearch(timestamp: string | number): boolean {
  const searchTime = typeof timestamp === 'string' 
    ? new Date(timestamp).getTime()
    : timestamp;
  return Date.now() - searchTime < 24 * 60 * 60 * 1000; // 24 hours
}

function mapApiResults(matches: any[]): SearchResult[] {
  return matches.map(match => ({
    symbol: match['1. symbol'],
    name: match['2. name'],
    type: match['3. type'],
    region: match['4. region'],
    marketOpen: match['5. marketOpen'],
    marketClose: match['6. marketClose'],
    timezone: match['7. timezone'],
    currency: match['8. currency'],
    matchScore: match['9. matchScore']
  }));
}

async function storeSearchResults(
  userId: string,
  symbol: string,
  results: SearchResult[]
): Promise<void> {
  try {
    await supabase
      .from('search_history')
      .upsert({
        user_id: userId,
        symbol: symbol.toUpperCase(),
        results,
        search_count: 1,
        last_searched: new Date().toISOString()
      }, {
        onConflict: 'user_id,symbol'
      });
  } catch (error) {
    console.warn('Failed to store search results:', error);
    // Don't throw - this is a non-critical operation
  }
}