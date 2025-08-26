import { beforeAll, describe, it, expect, vi } from "vitest";
import { makeSupabaseAdminMock } from "../helpers/mockSupabase"

// Create the mock before importing the service under test so vitest can hoist it
vi.mock("../../lib/supabaseAdmin", () => {
  const client = makeSupabaseAdminMock()
  return { default: client, supabaseAdmin: client, getSupabaseAdmin: () => client }
})

let keysService: typeof import("../../services/keys-service");

// Provide deterministic encryption key for tests (32 bytes base64)
beforeAll(() => {
  process.env.KEY_ENCRYPTION_KEY = Buffer.from(new Array(32).fill(2)).toString("base64");
  // Some crypto helpers expect SESSION_ENCRYPTION_KEY
  process.env.SESSION_ENCRYPTION_KEY = process.env.KEY_ENCRYPTION_KEY
  // import service after mocks
  return import("../../services/keys-service").then((m) => {
    keysService = m as typeof keysService
  })
});

describe("services/keys-service (integration-style, in-memory supabase mock)", () => {
  const userId = "user-test-1";

  it("creates a key, lists it, reveals secret, and deletes (soft-delete)", async () => {
    const created = await keysService.createKey(userId, {
      name: "Test Key",
      provider: "mock",
      apiKey: "public-123",
      secret: "super-secret-value",
      isPaper: false,
      metadata: { env: "test" },
    });

    expect(created).toHaveProperty("id");
    expect(created.name).toBe("Test Key");
    expect(created.provider).toBe("mock");

    const list = await keysService.listKeys(userId);
    expect(Array.isArray(list)).toBe(true);
    expect(list.length).toBeGreaterThanOrEqual(1);
    const found = list.find((k) => k.name === "Test Key");
    expect(found).toBeDefined();

    // reveal
    const revealed = await keysService.revealKey(userId, created.id);
    expect(revealed).toHaveProperty("secret");
    expect(revealed.secret).toBe("super-secret-value");

    // soft-delete
    const del = await keysService.deleteKey(userId, created.id);
    expect(del.id).toBe(created.id);

    // after delete, reveal should error (inactive)
    await expect(keysService.revealKey(userId, created.id)).rejects.toThrow(/inactive/i);
  });
});
