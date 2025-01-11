interface SearchMetricsStore {
  cacheHits: number;
  apiCalls: number;
  averageResponseTime: number;
  rateLimitRemaining: number;
  lastUpdated: Date;
}
interface SearchHelpPopoverProps {
  className?: string;
  metrics?: Partial<SearchMetricsStore>;
}
export declare function SearchHelpPopover({
  className,
  metrics: externalMetrics,
}: SearchHelpPopoverProps): import("@emotion/react/jsx-runtime").JSX.Element;
export {};
//# sourceMappingURL=search-help-popover.d.ts.map
