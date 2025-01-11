/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_DEBUG_MODE: string;
  readonly VITE_ALPHA_VANTAGE_API_KEY: string;
  readonly VITE_SUPABASE_URL: string;
  readonly VITE_SUPABASE_ANON_KEY: string;
  readonly ALPHAVANTAGE_API_KEYS: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
