import { describe, it, expect, beforeEach } from "bun:test";

/**
 * Bun-native tests for lib/session using an injected in-memory supabase-like client.
 *
 * These tests avoid mocking module imports and instead pass a lightweight client
 * object to session helpers (createSession, verifySessionToken, refreshSession, revokeSession).
 */

let mockSessions = [];
let idCounter = 0;
let mockRevokeCalled = false;

function makeInMemoryClient() {
  return {
    from(table) {
      if (table !== "sessions") {
        return {
          select: () => ({ maybeSingle: async () => ({ data: null, error: null }) }),
        };
      }

      return {
        insert(rows) {
          const row = { ...rows[0] };
          idCounter += 1;
          row.id = String(idCounter);
          mockSessions.push(row);
          return {
            select: () => ({
              single: async () => ({ data: row, error: null }),
            }),
          };
        },
        select() {
          let filters = [];
          return {
            eq(field, value) {
              filters.push({ field, value });
              return {
                limit: (_n) => ({
                  maybeSingle: async () => {
                    const found = mockSessions.find((r) => filters.every((f) => r[f.field] === f.value));
                    return { data: found ?? null, error: null };
                  },
                }),
              };
            },
            maybeSingle: async () => {
              return { data: mockSessions[0] ?? null, error: null };
            },
          };
        },
        update(updates) {
          return {
            eq: async (field, value) => {
              const matched = mockSessions.filter((r) => r[field] === value);
              for (const r of matched) Object.assign(r, updates);
              return { error: null };
            },
          };
        },
      };
    },
  };
}

beforeEach(() => {
  // reset state
  mockSessions = [];
  idCounter = 0;
  mockRevokeCalled = false;

  // ensure envs set minimally for session module (imports may rely on them)
  process.env.SUPABASE_URL = "https://example.supabase.co";
  process.env.SUPABASE_SERVICE_ROLE_KEY = "service-role";
  delete process.env.SESSION_REVOKE_SUPABASE;
});

describe("lib/session (bun in-memory client)", () => {
  it("createSession inserts a row and returns cookie + tokens", async () => {
    const session = await import("../../lib/session");
    const client = makeInMemoryClient();

    const result = await session.createSession("user-123", { maxAgeSeconds: 3600 }, client);

    expect(result.cookie).toBeDefined();
    expect(result.cookie.name).toBe("vf_session");
    expect(typeof result.sessionToken).toBe("string");
    expect(typeof result.refreshToken).toBe("string");

    const stored = mockSessions.find((r) => r.session_token === result.sessionToken);
    expect(stored).toBeDefined();
    expect(stored.user_id).toBe("user-123");
  });

  it("verifySessionToken returns session for valid token and expired marker for expired", async () => {
    const session = await import("../../lib/session");
    const client = makeInMemoryClient();

    const live = await session.createSession("user-live", { maxAgeSeconds: 3600 }, client);
    const verified = await session.verifySessionToken(live.sessionToken, client);
    expect(verified).toBeDefined();
    expect(verified.user_id).toBe("user-live");

    // add expired session row
    const expiredRow = {
      id: "x-exp",
      user_id: "user-exp",
      session_token: "expired-token",
      refresh_token: "r-exp",
      issued_at: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(),
      last_used_at: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(),
      expires_at: new Date(Date.now() - 1000).toISOString(),
      revoked: false,
      metadata: {},
    };
    mockSessions.push(expiredRow);

    const verifiedExpired = await session.verifySessionToken("expired-token", client);
    expect(verifiedExpired).toBeDefined();
    expect(verifiedExpired.expired).toBeTruthy();
    expect(verifiedExpired.session).toBeDefined();
    expect(verifiedExpired.session.session_token).toBe("expired-token");
  });

  it("refreshSession rotates tokens and returns cookie + new refreshToken", async () => {
    const session = await import("../../lib/session");
    const client = makeInMemoryClient();

    const now = new Date();
    const expiresAt = new Date(now.getTime() - 1000).toISOString();
    const row = {
      id: "to-refresh",
      user_id: "user-refresh",
      session_token: "old-session",
      refresh_token: "old-refresh",
      issued_at: new Date().toISOString(),
      last_used_at: new Date().toISOString(),
      expires_at: expiresAt,
      revoked: false,
      metadata: {},
    };
    mockSessions.push(row);

    const res = await session.refreshSession("old-refresh", client);
    expect(res.success).toBe(true);
    expect(res.cookie).toBeDefined();
    expect(res.refreshToken).toBeDefined();

    const updated = mockSessions.find((r) => r.user_id === "user-refresh");
    expect(updated).toBeDefined();
    expect(updated.session_token).toBe(res.cookie.value);
    expect(updated.refresh_token).toBe(res.refreshToken);
  });

  it("revokeSession marks session revoked and calls supabase admin when configured", async () => {
    process.env.SESSION_REVOKE_SUPABASE = "true";
    const session = await import("../../lib/session");
    const client = makeInMemoryClient();

    // use an injected adminGetter to track calls (avoid patching module exports)
    const adminGetter = () => ({
      auth: {
        admin: {
          revokeRefreshTokensForUser: async (userId) => {
            mockRevokeCalled = true;
            return;
          },
        },
      },
    });

    const { sessionToken } = await session.createSession("user-to-revoke", { maxAgeSeconds: 3600 }, client);

    const res = await session.revokeSession(sessionToken, client, adminGetter);
    expect(res.success).toBe(true);

    const s = mockSessions.find((r) => r.session_token === sessionToken);
    expect(s).toBeDefined();
    expect(s.revoked).toBe(true);

    expect(mockRevokeCalled).toBe(true);
  });
});
