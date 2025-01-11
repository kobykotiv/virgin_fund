interface SearchResult {
  symbol: string;
  name: string;
  market: string;
  score?: number;
}
export declare function searchTickers(query: string): Promise<SearchResult[]>;
export declare function validateTicker(symbol: string): Promise<boolean>;
export declare function recordSearch(symbol: string): Promise<void>;
export {};
//# sourceMappingURL=search.d.ts.map
