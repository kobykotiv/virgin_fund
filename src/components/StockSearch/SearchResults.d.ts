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
interface SearchResultsProps {
    results: SearchResult[];
    loading: boolean;
    error: string | null;
    query: string;
    onSelect: (symbol: string) => void;
}
export declare function SearchResults({ results, loading, error, query, onSelect, }: SearchResultsProps): import("@emotion/react/jsx-runtime").JSX.Element;
export {};
//# sourceMappingURL=SearchResults.d.ts.map