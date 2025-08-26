import { describe, it, expect, beforeAll, vi } from "vitest";
import { NextRequest } from "next/server";

/**
 * Tests for signals endpoints using mocked Supabase and mocked NextRequest/NextResponse behavior.
 * - Mocks @/lib/supabaseAdmin to provide an in-memory chainable client
 * - Mocks @/lib/session to return a test session
 * - Exercises create/list/get/update/delete operations
 * - Verifies authentication flow and data persistence
 */

// Mock Supabase admin with an in-memory chainable client
vi.mock("@/lib/supabaseAdmin", () => {
  let signals: any[] = [];
  
  const mockQuery = {
    select: (fields = '*') => mockQuery,
    insert: (data: any[]) => mockQuery,
    update: (data: any) => mockQuery,
    delete: () => mockQuery,
    eq: (field: string, value: any) => mockQuery,
    order: (field: string, options?: any) => mockQuery,
    limit: (count: number) => mockQuery,
    maybeSingle: async () => {
      if (signals.length === 0) return { data: null, error: null };
      return { data: signals[0], error: null };
    },
    then: async (resolve: any) => {
      return resolve({ data: signals, error: null });
    }
  };

  return {
    getSupabaseAdmin: () => ({
      from: (table: string) => {
        if (table === 'signals') {
          return {
            select: (fields = '*') => ({
              eq: (field: string, value: any) => ({
                order: (field: string, options?: any) => ({
                  then: async (resolve: any) => resolve({ data: signals, error: null })
                }),
                eq: (field2: string, value2: any) => ({
                  maybeSingle: async () => {
                    const found = signals.find(s => s[field] === value && s[field2] === value2);
                    return { data: found || null, error: null };
                  }
                }),
                maybeSingle: async () => {
                  const found = signals.find(s => s[field] === value);
                  return { data: found || null, error: null };
                }
              })
            }),
            insert: (data: any[]) => ({
              select: () => ({
                limit: (count: number) => ({
                  maybeSingle: async () => {
                    const newSignal = { 
                      id: `signal-${Date.now()}`, 
                      created_at: new Date().toISOString(),
                      updated_at: new Date().toISOString(),
                      ...data[0] 
                    };
                    signals.push(newSignal);
                    return { data: newSignal, error: null };
                  }
                })
              })
            }),
            update: (data: any) => ({
              eq: (field: string, value: any) => ({
                eq: (field2: string, value2: any) => ({
                  select: () => ({
                    limit: (count: number) => ({
                      maybeSingle: async () => {
                        const index = signals.findIndex(s => s[field] === value && s[field2] === value2);
                        if (index !== -1) {
                          signals[index] = { ...signals[index], ...data, updated_at: new Date().toISOString() };
                          return { data: signals[index], error: null };
                        }
                        return { data: null, error: null };
                      }
                    })
                  })
                })
              })
            }),
            delete: () => ({
              eq: (field: string, value: any) => ({
                eq: (field2: string, value2: any) => ({
                  then: async (resolve: any) => {
                    signals = signals.filter(s => !(s[field] === value && s[field2] === value2));
                    return resolve({ error: null });
                  }
                })
              })
            })
          };
        }
        return mockQuery;
      }
    })
  };
});

// Mock session management
vi.mock("@/lib/session", () => ({
  verifySessionToken: async (token: string) => {
    if (token === "valid-session") {
      return { id: "session-1", user_id: "user-1", expired: false };
    }
    return null;
  }
}));

let signalsRoute: typeof import("../../app/api/signals/route");
let signalByIdRoute: typeof import("../../app/api/signals/[id]/route");

beforeAll(async () => {
  signalsRoute = await import("../../app/api/signals/route");
  signalByIdRoute = await import("../../app/api/signals/[id]/route");
});

describe("signals API endpoints", () => {
  const createMockRequest = (options: { 
    method?: string, 
    body?: any, 
    cookie?: string,
    headers?: Record<string, string>
  } = {}) => {
    const headers = new Headers(options.headers || {});
    if (options.cookie) {
      headers.set('cookie', options.cookie);
    }
    
    return {
      method: options.method || 'GET',
      headers,
      json: async () => options.body || {},
    } as any;
  };

  describe("GET /api/signals", () => {
    it("returns 401 without valid session", async () => {
      const req = createMockRequest({ cookie: "vf_session=invalid" });
      const res = await signalsRoute.GET(req);
      expect(res.status).toBe(401);
      const body = await res.json();
      expect(body.error).toBe("Unauthorized");
    });

    it("returns empty signals list for authenticated user", async () => {
      const req = createMockRequest({ cookie: "vf_session=valid-session" });
      const res = await signalsRoute.GET(req);
      expect(res.status).toBe(200);
      const body = await res.json();
      expect(body.signals).toEqual([]);
    });
  });

  describe("POST /api/signals", () => {
    it("returns 401 without valid session", async () => {
      const req = createMockRequest({ 
        method: 'POST',
        cookie: "vf_session=invalid",
        body: { name: "Test Signal", ticker: "AAPL", condition: "price > 150" }
      });
      const res = await signalsRoute.POST(req);
      expect(res.status).toBe(401);
    });

    it("creates signal with valid data", async () => {
      const req = createMockRequest({ 
        method: 'POST',
        cookie: "vf_session=valid-session",
        body: { name: "Test Signal", ticker: "AAPL", condition: "price > 150" }
      });
      const res = await signalsRoute.POST(req);
      expect(res.status).toBe(200);
      const body = await res.json();
      expect(body.signal).toMatchObject({
        name: "Test Signal",
        ticker: "AAPL",
        condition: "price > 150",
        user_id: "user-1",
        enabled: true
      });
      expect(body.signal.id).toBeDefined();
    });

    it("creates signal with default name when missing", async () => {
      const req = createMockRequest({ 
        method: 'POST',
        cookie: "vf_session=valid-session",
        body: { ticker: "TSLA", condition: "volume > 1000000" }
      });
      const res = await signalsRoute.POST(req);
      expect(res.status).toBe(200);
      const body = await res.json();
      expect(body.signal.name).toBe("Unnamed Signal");
    });
  });

  describe("GET /api/signals/[id]", () => {
    it("returns 401 without valid session", async () => {
      const req = createMockRequest({ cookie: "vf_session=invalid" });
      const res = await signalByIdRoute.GET(req, { params: { id: "signal-1" } });
      expect(res.status).toBe(401);
    });

    it("returns 404 for non-existent signal", async () => {
      const req = createMockRequest({ cookie: "vf_session=valid-session" });
      const res = await signalByIdRoute.GET(req, { params: { id: "non-existent" } });
      expect(res.status).toBe(404);
    });
  });

  describe("PATCH /api/signals/[id]", () => {
    it("returns 401 without valid session", async () => {
      const req = createMockRequest({ 
        method: 'PATCH',
        cookie: "vf_session=invalid",
        body: { name: "Updated Signal" }
      });
      const res = await signalByIdRoute.PATCH(req, { params: { id: "signal-1" } });
      expect(res.status).toBe(401);
    });
  });

  describe("DELETE /api/signals/[id]", () => {
    it("returns 401 without valid session", async () => {
      const req = createMockRequest({ cookie: "vf_session=invalid" });
      const res = await signalByIdRoute.DELETE(req, { params: { id: "signal-1" } });
      expect(res.status).toBe(401);
    });

    it("deletes signal successfully", async () => {
      const req = createMockRequest({ cookie: "vf_session=valid-session" });
      const res = await signalByIdRoute.DELETE(req, { params: { id: "signal-1" } });
      expect(res.status).toBe(200);
      const body = await res.json();
      expect(body.ok).toBe(true);
    });
  });

  describe("signals CRUD flow", () => {
    it("completes full create, read, update, delete cycle", async () => {
      // Create signal
      const createReq = createMockRequest({ 
        method: 'POST',
        cookie: "vf_session=valid-session",
        body: { name: "Integration Test Signal", ticker: "GOOGL", condition: "RSI < 30" }
      });
      const createRes = await signalsRoute.POST(createReq);
      expect(createRes.status).toBe(200);
      const { signal } = await createRes.json();
      
      // Read signal
      const getReq = createMockRequest({ cookie: "vf_session=valid-session" });
      const getRes = await signalByIdRoute.GET(getReq, { params: { id: signal.id } });
      expect(getRes.status).toBe(200);
      const { signal: fetchedSignal } = await getRes.json();
      expect(fetchedSignal.name).toBe("Integration Test Signal");
      
      // Update signal
      const updateReq = createMockRequest({ 
        method: 'PATCH',
        cookie: "vf_session=valid-session",
        body: { name: "Updated Signal Name", enabled: false }
      });
      const updateRes = await signalByIdRoute.PATCH(updateReq, { params: { id: signal.id } });
      expect(updateRes.status).toBe(200);
      const { signal: updatedSignal } = await updateRes.json();
      expect(updatedSignal.name).toBe("Updated Signal Name");
      expect(updatedSignal.enabled).toBe(false);
      
      // Delete signal
      const deleteReq = createMockRequest({ cookie: "vf_session=valid-session" });
      const deleteRes = await signalByIdRoute.DELETE(deleteReq, { params: { id: signal.id } });
      expect(deleteRes.status).toBe(200);
    });
  });
});