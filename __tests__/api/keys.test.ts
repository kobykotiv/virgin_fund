import { describe, it, expect, beforeAll, vi } from "vitest";

/**
 * Unit tests for API Keys service (mocked Supabase)
 *
 * Strategy:
 * - Mock @supabase/supabase-js.createClient to return an in-memory fake supabase client.
 * - Use a deterministic KEY_ENCRYPTION_KEY for AES-GCM so encryption is deterministic in tests.
 *
 * Note: We must mock before importing the service to ensure the module-level createClient call
 * inside services/keys-service.ts uses our fake client.
 */

const TEST_KEY = Buffer.from("a".repeat(32)).toString("base64");

vi.stubEnv("KEY_ENCRYPTION_KEY", TEST_KEY);

vi.mock("@supabase/supabase-js", async () => {
  // minimal in-memory supabase-like client
  const fakeDB: Record<string, any[]> = {
    api_keys: [],
    sessions: [],
  };

  function createFakeClient() {
    return {
      from(tableName: string) {
        return {
          insert: (payloadArray: any[]) => {
            const payload = { ...payloadArray[0] };
            // ensure id
            payload.id = payload.id ?? `id-${Math.random().toString(36).slice(2, 9)}`;
            payload.created_at = new Date().toISOString();
            payload.updated_at = new Date().toISOString();
            // Store in DB
            fakeDB[tableName] = fakeDB[tableName] || [];
            fakeDB[tableName].push(payload);
            return {
              select: () => ({
                single: async () => ({ data: payload, error: null }),
              }),
            };
          },
          select: (_cols?: string) => {
            const self: any = {};
            self._table = tableName;
            self._filters = [];
            self.eq = (col: string, val: any) => {
              self._filters.push({ col, val });
              return self;
            };
            self.order = (_col: string, _opts?: any) => self;
            self.limit = (_n?: number) => self;
            self.maybeSingle = async () => {
              const rows = (fakeDB[tableName] || []).filter((r) =>
                self._filters.every((f: any) => {
                  // simple equality
                  return r[f.col] === f.val;
                })
              );
              return { data: rows[0] ?? null, error: null };
            };
            self.single = async () => {
              const rows = (fakeDB[tableName] || []).filter((r) =>
                self._filters.every((f: any) => r[f.col] === f.val)
              );
              return { data: rows[0] ?? null, error: null };
            };
            self.eq = self.eq.bind(self);
            return self;
          },
          update: (payload: any) => {
            const self: any = {};
            self._payload = payload;
            self.eq = (col: string, val: any) => {
              self._filters = [{ col, val }];
              return self;
            };
            self.select = () => ({
              single: async () => {
                const rows = (fakeDB[tableName] || []).filter((r) =>
                  self._filters.every((f: any) => r[f.col] === f.val)
                );
                if (!rows[0]) {
                  return { data: null, error: { message: "Not found" } };
                }
                // apply updates
                Object.assign(rows[0], self._payload);
                rows[0].updated_at = new Date().toISOString();
                return { data: rows[0], error: null };
              },
              maybeSingle: async () => {
                const rows = (fakeDB[tableName] || []).filter((r) =>
                  self._filters.every((f: any) => r[f.col] === f.val)
                );
                if (!rows[0]) return { data: null, error: null };
                Object.assign(rows[0], self._payload);
                rows[0].updated_at = new Date().toISOString();
                return { data: rows[0], error: null };
              },
            });
            self.match = (_m: any) => self;
            self.eq = self.eq.bind(self);
            return self;
          },
          delete: () => ({
            eq: async (_col: string, _val: any) => ({ data: null, error: null }),
          }),
        };
      },
    };
  }

  return { createClient: () => createFakeClient() };
});

let keysService: typeof import("../../services/keys-service");

beforeAll(async () => {
  // import after mocking
  keysService = await import("../../services/keys-service");
});

describe("keys-service (in-memory supabase)", () => {
  const USER_ID = "user-123";

  it("creates a key and returns safe metadata", async () => {
    const created = await keysService.createKey(USER_ID, {
      name: "Test Key",
      provider: "alpaca",
      apiKey: "public-key-1",
      secret: "super-secret-abc",
      isPaper: true,
      metadata: { note: "created in test" },
    });

    expect(created).toHaveProperty("id");
    expect(created.name).toBe("Test Key");
    expect(created.is_paper).toBe(true);
    expect(created).not.toHaveProperty("encrypted_secret");
  });

  it("lists keys for user", async () => {
    const list = await keysService.listKeys(USER_ID);
    expect(Array.isArray(list)).toBe(true);
    expect(list.length).toBeGreaterThanOrEqual(1);
    expect(list[0]).toHaveProperty("id");
    expect(list[0]).toHaveProperty("name");
  });

  it("reveals the secret for a key", async () => {
    const list = await keysService.listKeys(USER_ID);
    const key = list[0];
    const revealed = await keysService.revealKey(USER_ID, key.id);
    expect(revealed).toHaveProperty("secret");
    expect(typeof revealed.secret).toBe("string");
    expect(revealed.secret).toContain("super-secret"); // original secret substring
  });

  it("updates key secret and metadata", async () => {
    const list = await keysService.listKeys(USER_ID);
    const key = list[0];

    const updated = await keysService.updateKey(USER_ID, key.id, {
      metadata: { note: "rotated" },
      secret: "new-super-secret-xyz",
    });

    expect(updated).toHaveProperty("id");
    expect(updated.metadata).toMatchObject({ note: "rotated" });

    const revealed = await keysService.revealKey(USER_ID, key.id);
    expect(revealed.secret).toBe("new-super-secret-xyz");
  });

  it("soft-deletes a key", async () => {
    const list = await keysService.listKeys(USER_ID);
    const key = list[0];

    const deleted = await keysService.deleteKey(USER_ID, key.id);
    expect(deleted).toHaveProperty("id");
    expect(deleted.is_active).toBe(false);
  });
});
