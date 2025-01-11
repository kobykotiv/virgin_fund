import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useRef, useCallback, useEffect } from 'react';
import { Search, X, Loader2, ChevronLeft, ChevronRight } from 'lucide-react';
import { Input } from '../ui/input';
import { ErrorMessage } from '../ui/error-message';
import { RawDataPopover } from '../ui/raw-data-popover';
import { useDebounce } from '@/hooks/useDebounce';
import { cn } from '@/lib/utils';
import { AssetList } from './AssetList';
import { SearchResults } from './SearchResults';
import { useToast } from '../ui/use-toast';
import { useSearch } from '@/lib/hooks/useSearch';
// Debug mode check
const DEBUG_MODE = import.meta.env.VITE_DEBUG_MODE === 'true';
const MAX_ASSETS = 20;
const DEBOUNCE_DELAY = 300;
export function StockSearch({ onSelect, selectedAssets }) {
    const { toast } = useToast();
    const { results, loading, error, search } = useSearch();
    const [query, setQuery] = useState('');
    const [rawResponse] = useState(null);
    const debouncedQuery = useDebounce(query, DEBOUNCE_DELAY);
    const assetListRef = useRef(null);
    // Debug toast helper
    const debugToast = useCallback((title, description, type = 'default') => {
        if (!DEBUG_MODE)
            return;
        toast({
            title,
            description,
            variant: type === 'error' ? 'destructive' : 'default',
            className: cn('debug-toast', 'border-2', type === 'error' ? 'border-red-500' : 'border-blue-500', 'bg-black/80'),
            duration: 5000,
        });
    }, [toast]);
    // Scroll handlers for asset list
    const scrollAssetList = (direction) => {
        if (assetListRef.current) {
            const scrollAmount = 200;
            const targetScroll = assetListRef.current.scrollLeft + (direction === 'left' ? -scrollAmount : scrollAmount);
            assetListRef.current.scrollTo({
                left: targetScroll,
                behavior: 'smooth'
            });
        }
    };
    useEffect(() => {
        if (debouncedQuery.trim().length > 2) {
            search(debouncedQuery);
        }
        else {
            // Clear results when query is too short
        }
    }, [debouncedQuery, search]);
    const handleSelect = async (symbol) => {
        try {
            if (!validateSymbol(symbol)) {
                const errorMessage = 'Invalid symbol format. Use 1-5 alphanumeric characters.';
                debugToast('Validation Error', errorMessage, 'error');
                return;
            }
            if (selectedAssets.includes(symbol)) {
                const errorMessage = 'This symbol is already selected.';
                debugToast('Duplicate Symbol', errorMessage, 'error');
                return;
            }
            if (selectedAssets.length >= MAX_ASSETS) {
                const errorMessage = `Maximum ${MAX_ASSETS} assets allowed.`;
                debugToast('Asset Limit', errorMessage, 'error');
                return;
            }
            debugToast('Symbol Selected', `Adding symbol: ${symbol}`);
            onSelect(symbol);
            // setQuery('');
            // setResults([]); // We need the ability for the user to select multiple assets
            // setActiveIndex(-1); // Do NOT go to the next screen right now
        }
        catch (error) {
            const errorMessage = 'Failed to validate ticker. Please try again.';
            console.error('Selection error:', error);
            debugToast('Selection Error', errorMessage, 'error');
        }
    };
    const validateSymbol = (symbol) => {
        const symbolRegex = /^[A-Z0-9.]{1,5}$/;
        const isValid = symbolRegex.test(symbol.toUpperCase());
        if (DEBUG_MODE && !isValid) {
            debugToast('Symbol Validation', `Invalid symbol: "${symbol}". Must be 1-5 alphanumeric characters.`, 'error');
        }
        return isValid;
    };
    return (_jsxs("div", { className: "w-full space-y-4", children: [_jsxs("div", { className: "relative", children: [_jsx("div", { className: "absolute left-0 top-1/2 -translate-y-1/2 z-10", children: _jsx("button", { type: "button", onClick: () => scrollAssetList('left'), className: "p-2 rounded-full bg-white/10 backdrop-blur-lg border border-white/20 shadow-lg\n                     hover:bg-white/20 transition-all duration-200", "aria-label": "Scroll left", children: _jsx(ChevronLeft, { className: "w-4 h-4" }) }) }), _jsx(AssetList, { ref: assetListRef, selectedAssets: selectedAssets, onRemove: (symbol) => {
                            debugToast('Symbol Removed', `Removing symbol: ${symbol}`);
                            onSelect(symbol);
                        } }), _jsx("div", { className: "absolute right-0 top-1/2 -translate-y-1/2 z-10", children: _jsx("button", { type: "button", onClick: () => scrollAssetList('right'), className: "p-2 rounded-full bg-white/10 backdrop-blur-lg border border-white/20 shadow-lg\n                     hover:bg-white/20 transition-all duration-200", "aria-label": "Scroll right", children: _jsx(ChevronRight, { className: "w-4 h-4" }) }) })] }), _jsxs("div", { className: "relative", children: [_jsxs("div", { className: cn("relative rounded-2xl overflow-hidden", "bg-white/10 backdrop-blur-lg border border-white/20", "shadow-[0_8px_32px_0_rgba(31,38,135,0.37)]", "focus-within:shadow-[0_8px_32px_0_rgba(31,38,135,0.47)]", "transition-all duration-300"), children: [_jsx(Input, { value: query, onChange: (e) => {
                                    setQuery(e.target.value.toUpperCase());
                                }, placeholder: "Search stocks...", className: cn("pl-12 pr-12 py-6 text-lg", "bg-transparent border-none", "placeholder:text-white/50", "focus:ring-0 focus:border-none", "transition-all duration-300"), disabled: selectedAssets.length >= MAX_ASSETS }), _jsx("div", { className: "absolute left-4 top-1/2 -translate-y-1/2", children: loading ? (_jsx(Loader2, { className: "w-5 h-5 animate-spin text-white/70" })) : (_jsx(Search, { className: "w-5 h-5 text-white/70" })) }), query && (_jsx("button", { onClick: () => {
                                    setQuery('');
                                }, className: "absolute right-4 top-1/2 -translate-y-1/2 text-white/70 hover:text-white\n                       transition-colors duration-200", children: _jsx(X, { className: "w-5 h-5" }) }))] }), _jsx("div", { className: "absolute right-4 -bottom-12", children: _jsx(RawDataPopover, { data: rawResponse, title: "Raw Search Results", className: "text-muted-foreground/70 hover:text-muted-foreground" }) }), error && (_jsx(ErrorMessage, { error: error.message || 'An error occurred', className: "mt-2" })), _jsx(SearchResults, { results: results, loading: loading, error: error ? error.message : null, query: query, onSelect: handleSelect })] })] }));
}
