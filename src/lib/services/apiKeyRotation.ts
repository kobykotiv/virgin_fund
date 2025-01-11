import { create } from "zustand";

interface ApiKeyState {
  currentKeyIndex: number;
  rateLimits: Record<string, number>;
  lastUsed: Record<string, number>;
  incrementKeyIndex: () => void;
  updateRateLimit: (key: string, remaining: number) => void;
  getNextAvailableKey: () => string | null;
}

const API_KEYS = JSON.parse(import.meta.env.ALPHAVANTAGE_API_KEYS || "[]");
const RATE_LIMIT_RESET = 60 * 1000; // 1 minute

export const useApiKeyStore = create<ApiKeyState>((set, get) => ({
  currentKeyIndex: 0,
  rateLimits: {},
  lastUsed: {},

  incrementKeyIndex: () => {
    set((state) => ({
      currentKeyIndex: (state.currentKeyIndex + 1) % API_KEYS.length,
    }));
  },

  updateRateLimit: (key: string, remaining: number) => {
    set((state) => ({
      rateLimits: { ...state.rateLimits, [key]: remaining },
      lastUsed: { ...state.lastUsed, [key]: Date.now() },
    }));
  },

  getNextAvailableKey: () => {
    const state = get();
    const now = Date.now();

    // Try each key starting from the current index
    for (let i = 0; i < API_KEYS.length; i++) {
      const index = (state.currentKeyIndex + i) % API_KEYS.length;
      const key = API_KEYS[index];
      const lastUsed = state.lastUsed[key] || 0;
      const timeSinceLastUse = now - lastUsed;

      // If key hasn't been used in the last minute or has remaining rate limit
      if (
        timeSinceLastUse >= RATE_LIMIT_RESET ||
        (state.rateLimits[key] || 5) > 0
      ) {
        if (index !== state.currentKeyIndex) {
          set({ currentKeyIndex: index });
        }
        return key;
      }
    }

    return null; // All keys are rate limited
  },
}));
