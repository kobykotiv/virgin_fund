import { supabase } from './supabase';
// import Fuse from 'fuse.js';
const ALPHA_VANTAGE_API_KEY = import.meta.env.VITE_ALPHA_VANTAGE_API_KEY;
const BASE_URL = 'https://www.alphavantage.co/query';
export async function searchTickers(query) {
    try {
        const response = await fetch(`${BASE_URL}?function=SYMBOL_SEARCH&keywords=${encodeURIComponent(query)}&apikey=${ALPHA_VANTAGE_API_KEY}`, {
            headers: { 'User-Agent': 'DCA Strategy App' }
        });
        if (!response.ok) {
            throw new Error(`API request failed: ${response.status}`);
        }
        const data = await response.json();
        if (data.bestMatches) {
            return data.bestMatches.map((match) => ({
                symbol: match['1. symbol'],
                name: match['2. name'],
                market: match['4. region'],
                score: 0
            }));
        }
        return [];
    }
    catch (error) {
        console.error('Search error:', error);
        return [];
    }
}
export async function validateTicker(symbol) {
    try {
        const response = await fetch(`${BASE_URL}?function=GLOBAL_QUOTE&symbol=${encodeURIComponent(symbol)}&apikey=${ALPHA_VANTAGE_API_KEY}`, {
            headers: { 'User-Agent': 'DCA Strategy App' }
        });
        if (!response.ok) {
            return false;
        }
        const data = await response.json();
        return !!data['Global Quote']['01. symbol'];
    }
    catch (error) {
        console.error('Validation error:', error);
        return false;
    }
}
export async function recordSearch(symbol) {
    try {
        const { data, error: userError } = await supabase.auth.getUser();
        if (userError || !data?.user)
            return;
        const { error } = await supabase
            .from('search_history')
            .upsert({
            user_id: data.user.id,
            symbol,
            search_count: 1,
            last_searched: new Date().toISOString()
        }, {
            onConflict: 'user_id,symbol'
        });
        if (error) {
            console.error('Error recording search:', error);
        }
    }
    catch (error) {
        console.error('Unexpected error recording search:', error);
    }
}
