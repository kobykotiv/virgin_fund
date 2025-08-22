import { describe, it, expect, vi, beforeEach } from "vitest";

/**
 * Skeleton tests for supabase clients.
 * These tests mock @supabase/supabase-js.createClient and verify:
 * - modules initialize when required envs are present
 * - modules throw when required envs are missing
 *
 * Keep tests minimal — they only assert import-time behavior.
 */

vi.mock("@supabase/supabase-js", () => {
  return {
    createClient: vi.fn(() => ({})),
  };
});

beforeEach(() => {
  // Ensure module cache is cleared between tests
  vi.resetModules();
});

describe("supabase client modules", () => {
  it("initializes admin and public clients when envs present", async () => {
    process.env.SUPABASE_URL = "https://example.supabase.co";
    process.env.SUPABASE_SERVICE_ROLE_KEY = "service-role-key";
    process.env.NEXT_PUBLIC_SUPABASE_URL = "https://example.supabase.co";
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY = "anon-key";

    const admin = await import("../../lib/supabaseAdmin");
    const client = await import("../../lib/supabaseClient");

    expect(admin.supabaseAdmin).toBeDefined();
    expect(typeof admin.getSupabaseAdmin).toBe("function");
    expect(client.supabase).toBeDefined();
  });

  it("throws when SUPABASE_SERVICE_ROLE_KEY is missing for admin client", async () => {
    process.env.SUPABASE_URL = "https://example.supabase.co";
    delete process.env.SUPABASE_SERVICE_ROLE_KEY;

    await expect(import("../../lib/supabaseAdmin")).rejects.toThrow("Missing SUPABASE_SERVICE_ROLE_KEY");
  });

  it("throws when NEXT_PUBLIC_SUPABASE_ANON_KEY is missing for public client", async () => {
    process.env.NEXT_PUBLIC_SUPABASE_URL = "https://example.supabase.co";
    delete process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    await expect(import("../../lib/supabaseClient")).rejects.toThrow("Missing NEXT_PUBLIC_SUPABASE_ANON_KEY");
  });
});
