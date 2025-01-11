interface ApiKeyState {
  currentKeyIndex: number;
  rateLimits: Record<string, number>;
  lastUsed: Record<string, number>;
  incrementKeyIndex: () => void;
  updateRateLimit: (key: string, remaining: number) => void;
  getNextAvailableKey: () => string | null;
}
export declare const useApiKeyStore: import("zustand").UseBoundStore<
  import("zustand").StoreApi<ApiKeyState>
>;
export {};
//# sourceMappingURL=apiKeyRotation.d.ts.map
