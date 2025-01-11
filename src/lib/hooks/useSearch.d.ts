import { SearchError } from '../errors/searchErrors';
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
export declare function useSearch(): {
    search: (query: string) => Promise<void>;
    results: SearchResult[];
    loading: boolean;
    error: SearchError | null;
    source: "cache" | "api" | null;
};
export {};
//# sourceMappingURL=useSearch.d.ts.map