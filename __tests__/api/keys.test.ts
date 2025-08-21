import { beforeAll, describe, it, expect, vi } from "vitest";
import * as keysService from "../../services/keys-service";

// Provide deterministic encryption key for tests (32 bytes base64)
beforeAll(() => {
  process.env.KEY_ENCRYPTION_KEY = Buffer.from(new Array(32).fill(2)).toString("base64");
});

/**
 * Mock supabaseAdmin with a tiny in-memory adapter that implements the
 * chainable API used by services/keys-service.ts for the `api_keys` table.
 */
vi.mock("../../lib/supabaseAdmin", () => {
  const store = new Map<string, any>();

  function makeBuilder(table: string) {
    const context: any = { table, op: null, payload: null, filters: [] };

    const builder: any = {
      insert(rows: any[]) {
        context.op = "insert";
        context.payload = rows[0];
        return builder;
      },
      select(_cols?: any) {
        context.op = context.op || "select";
        return builder;
      },
      update(changes: any) {
        context.op = "update";
        context.payload = changes;
        return builder;
      },
      eq(col: string, val: any) {
        context.filters.push({ col, val });
        return builder;
      },
      order() {
        return builder;
      },
      limit() {
        return builder;
      },
      maybeSingle() {
        return builder.single(true);
      },
      single(isMaybe?: boolean) {
        return new Promise((res) => {
          // handle insert
          if (context.op === "insert") {
            const id = Math.random().toString(36).slice(2, 10);
            const row = { id, ...context.payload, created_at: new Date().toISOString(), updated_at: new Date().toISOString() };
            store.set(id, row);
            res({ data: row, error: null });
            return;
          }

          // handle select with filters
          const all = Array.from(store.values());
          let results = all;
          for (const f of context.filters) {
            results = results.filter((r) => {
              // support nested JSON comparisons for convenience
              return r[f.col] === f.val;
            });
          }

          if (context.op === "update") {
            // update matching rows by filters (expect eq id)
            const matched = results;
            if (matched.length === 0) {
              res({ data: null, error: { message: "Not found" } });
              return;
            }
            const updatedRow = { ...matched[0], ...context.payload, updated_at: new Date().toISOString() };
            store.set(updatedRow.id, updatedRow);
            res({ data: updatedRow, error: null });
            return;
          }

          // default select/single
          if (results.length === 0) return res({ data: null, error: { message: "Not found" } });
          res({ data: results[0], error: null });
        });
      },
      // Support .maybeSingle() pattern with .select().limit(1).maybeSingle()
      // and support chained .select(...).eq(...).order(...)
    };

    return builder;
  }

  return {
    default: {
      from(table: string) {
        return makeBuilder(table);
      },
    },
  };
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
