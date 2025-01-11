export interface ErrorDetails {
  code: string;
  message: string;
  userMessage: string;
  technical: string;
  stage: "cache" | "database" | "api" | "validation" | "processing";
  origin: "client" | "server" | "third-party";
  timestamp: number;
  troubleshooting: string[];
  referenceCode?: string;
}
export declare class SearchError extends Error {
  details: ErrorDetails;
  constructor(details: Partial<ErrorDetails>);
}
export declare function handleSearchError(error: unknown): SearchError;
//# sourceMappingURL=searchErrors.d.ts.map
