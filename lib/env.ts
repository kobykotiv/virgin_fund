/**
 * lib/env.ts
 *
 * Runtime environment validation for critical Supabase/session keys.
 * - Call assertEnv() early from server-only modules to fail-fast in production.
 * - Emits warnings in development for missing optional keys.
 */

export function assertEnv() {
  const missing: string[] = [];

  const required = [
    "NEXT_PUBLIC_SUPABASE_URL",
    "NEXT_PUBLIC_SUPABASE_ANON_KEY",
    "SUPABASE_URL",
    // prefer SUPABASE_SERVICE_ROLE_KEY, allow legacy SUPABASE_KEY as fallback
    "SUPABASE_SERVICE_ROLE_KEY",
    "SESSION_ENCRYPTION_KEY",
  ];

  for (const k of required) {
    if (!process.env[k]) {
      // allow SUPABASE_SERVICE_ROLE_KEY fallback from SUPABASE_KEY
      if (k === "SUPABASE_SERVICE_ROLE_KEY" && process.env.SUPABASE_KEY) {
        continue;
      }
      missing.push(k);
    }
  }

  const sk = process.env.SESSION_ENCRYPTION_KEY || "";
  if (sk && Buffer.from(sk, "utf8").length < 32) {
    console.warn(
      "SESSION_ENCRYPTION_KEY is shorter than 32 bytes — consider using a >=32 byte key for proper encryption."
    );
  }

  if (process.env.NODE_ENV === "production" && missing.length) {
    throw new Error(`Missing required env vars: ${missing.join(", ")}`);
  }

  if (missing.length) {
    console.warn(`Missing env vars (non-fatal in dev): ${missing.join(", ")}`);
  }

  return {
    NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL || "http://localhost:54321",
    NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "local-anon-key-please-replace",
    SUPABASE_URL: process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL || "http://localhost:54321",
    SUPABASE_SERVICE_ROLE_KEY:
      process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_KEY || "local-service-role-key-please-replace",
    SESSION_ENCRYPTION_KEY: process.env.SESSION_ENCRYPTION_KEY || "",
    NODE_ENV: process.env.NODE_ENV || "development",
  };
}
