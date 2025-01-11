import { supabase } from '../supabase';
// import { useToast } from '@/components/ui/use-toast';
import { useSearchMetrics } from '@/lib/hooks/useSearchMetrics';
import { AxiosError } from 'axios';
import axios from 'axios';
import { // handleSearchError, 
SearchError } from '@/lib/errors/searchErrors';
// interface SearchHistoryEntry {
//   user_id: string;
//   symbol: string;
//   results: any;
//   search_count: number;
//   last_searched: number;
// }
// interface ApiResponse {
//   data: any;
//   source: 'cache' | 'database' | 'api';
// }
const CACHE_DURATION = 24 * 60 * 60 * 1000; // 24 hours in milliseconds
const CACHE_KEY_PREFIX = 'financial_data_';
const API_TIMEOUT = 5000; // 5 seconds
const MAX_RETRIES = 2;
const RETRY_DELAY = 1000; // 1 second
export async function searchFinancialData(symbol) {
    let retryCount = 0;
    let lastError = null;
    const startTime = Date.now();
    const metrics = useSearchMetrics.getState();
    try {
        const { data: { user }, error: authError } = await supabase.auth.getUser();
        if (authError || !user) {
            throw new Error('Authentication required to search financial data');
        }
        // Step 1: Check browser cache
        try {
            const cachedData = getBrowserCache(symbol, user.id);
            if (cachedData) {
                console.debug('Cache hit: Browser cache for symbol', symbol);
                metrics.incrementCacheHits();
                await updateSearchHistory(symbol, user.id, cachedData);
                return { data: cachedData, source: 'cache' };
            }
        }
        catch (error) {
            console.warn('Browser cache error:', error);
            // Continue to database cache
        }
        // Step 2: Check Supabase cache
        try {
            const supabaseCache = await getSupabaseCache(symbol, user.id);
            if (supabaseCache) {
                console.debug('Cache hit: Supabase cache for symbol', symbol);
                metrics.incrementCacheHits();
                await setBrowserCache(symbol, user.id, supabaseCache);
                return { data: supabaseCache, source: 'database' };
            }
        }
        catch (error) {
            console.warn('Database cache error:', error);
            // Continue to API fetch
        }
        // Step 3: Fetch from API
        while (retryCount < MAX_RETRIES) {
            try {
                // Add delay between retries
                if (retryCount > 0) {
                    await new Promise(resolve => setTimeout(resolve, RETRY_DELAY));
                }
                console.debug(`API attempt ${retryCount + 1} for symbol ${symbol}`);
                const data = await fetchFinancialDataWithTimeout(symbol);
                metrics.incrementApiCalls();
                // Validate API response
                if (!validateApiResponse(data)) {
                    throw new Error('Invalid API response format');
                }
                // Step 4: Cache and record search
                await Promise.all([
                    setBrowserCache(symbol, user.id, data),
                    recordSearch(symbol, user.id, data)
                ]);
                // Record response time
                metrics.addResponseTime(Date.now() - startTime);
                return { data, source: 'api' };
            }
            catch (error) {
                lastError = error;
                retryCount++;
                if (retryCount >= MAX_RETRIES)
                    break;
                console.debug(`Retrying in ${RETRY_DELAY}ms...`);
                continue;
                break;
            }
        }
        throw handleSearchError(lastError || new Error('Failed to fetch data after all retries'));
    }
    catch (error) {
        throw handleSearchError(error);
    }
}
function getBrowserCache(symbol, userId) {
    try {
        const key = `${CACHE_KEY_PREFIX}${userId}_${symbol}`;
        const cached = localStorage.getItem(key);
        if (!cached)
            return null;
        const { data, timestamp } = JSON.parse(cached);
        const isExpired = Date.now() - timestamp > CACHE_DURATION;
        if (isExpired) {
            localStorage.removeItem(key);
            return null;
        }
        return data;
    }
    catch (error) {
        console.warn('Error reading browser cache:', error);
        return null;
    }
}
async function getSupabaseCache(symbol, userId) {
    try {
        const { data, error } = await supabase
            .rpc('get_latest_search', {
            p_user_id: userId,
            p_symbol: symbol.toUpperCase()
        });
        if (error) {
            throw new SearchError({
                code: 'CACHE_ERROR',
                message: error.message,
                userMessage: 'Unable to check cached results',
                technical: `Supabase cache error: ${error.message}`,
                stage: 'cache',
                origin: 'server'
            });
        }
        if (!data) {
            return null;
        }
        const isExpired = Date.now() - new Date(data.last_searched).getTime() > CACHE_DURATION;
        return isExpired ? null : data.results;
    }
    catch (error) {
        if (error instanceof SearchError) {
            throw error;
        }
        throw new SearchError({
            code: 'CACHE_ERROR',
            message: 'Failed to read from cache',
            userMessage: 'Unable to retrieve cached results',
            technical: error instanceof Error ? error.message : 'Unknown cache error',
            stage: 'cache',
            origin: 'client'
        });
        return null;
    }
}
function setBrowserCache(symbol, userId, data) {
    try {
        const key = `${CACHE_KEY_PREFIX}${userId}_${symbol}`;
        const entry = {
            data,
            timestamp: Date.now()
        };
        localStorage.setItem(key, JSON.stringify(entry));
    }
    catch (error) {
        console.warn('Error setting browser cache:', error);
    }
}
async function recordSearch(symbol, userId, results) {
    try {
        const { data: existing } = await supabase
            .from('search_history')
            .select('search_count')
            .eq('user_id', userId)
            .eq('symbol', symbol)
            .single();
        const searchCount = (existing?.search_count || 0) + 1;
        const { error } = await supabase
            .from('search_history')
            .upsert({
            user_id: userId,
            symbol,
            results,
            search_count: searchCount,
            last_searched: Date.now()
        }, {
            onConflict: 'user_id,symbol'
        });
        if (error)
            throw error;
    }
    catch (error) {
        console.error('Error recording search history:', error);
    }
}
async function updateSearchHistory(symbol, userId, results) {
    try {
        const { error } = await supabase
            .from('search_history')
            .update({
            last_searched: Date.now(),
            results: results
        })
            .eq('user_id', userId)
            .eq('symbol', symbol);
        if (error)
            throw error;
    }
    catch (error) {
        console.warn('Error updating search history:', error);
    }
}
async function fetchFinancialDataWithTimeout(symbol) {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), API_TIMEOUT);
    try {
        const response = await axios.get(`https://www.alphavantage.co/query`, {
            params: {
                function: 'SYMBOL_SEARCH',
                keywords: symbol,
                apikey: import.meta.env.VITE_ALPHA_VANTAGE_API_KEY
            },
            signal: controller.signal,
            timeout: API_TIMEOUT
        });
        return response.data;
    }
    finally {
        clearTimeout(timeoutId);
    }
}
function validateApiResponse(data) {
    return (data &&
        data['bestMatches'] &&
        Array.isArray(data['bestMatches']) &&
        data['bestMatches'].length > 0);
}
function handleSearchError(error) {
    const errorDetails = {
        message: '',
        timestamp: Date.now(),
        request: undefined,
        response: undefined
    };
    if (error instanceof AxiosError) {
        errorDetails.request = {
            url: error.config?.url,
            method: error.config?.method,
            params: error.config?.params
        };
        errorDetails.response = error.response?.data;
        if (error.code === 'ECONNABORTED') {
            errorDetails.message = 'Request timed out. Please try again.';
            throw Object.assign(new Error(errorDetails.message), { debug: errorDetails });
        }
        if (error.response?.status === 429) {
            errorDetails.message = 'Rate limit exceeded. Please try again later.';
            useSearchMetrics.getState().updateRateLimit(0);
            throw Object.assign(new Error(errorDetails.message), { debug: errorDetails });
        }
    }
    if (error instanceof Error) {
        errorDetails.message = `Financial data search failed: ${error.message}`;
        throw Object.assign(new Error(errorDetails.message), { debug: errorDetails });
    }
    errorDetails.message = 'An unexpected error occurred while searching financial data.';
    throw Object.assign(new Error(errorDetails.message), { debug: errorDetails });
}
// function logPerformanceMetrics(
//   symbol: string,
//   source: 'cache' | 'database' | 'api',
//   startTime: number
// ): void {
//   const duration = Date.now() - startTime;
//   console.debug(`Performance: ${symbol} from ${source} took ${duration}ms`);
// }
