import { describe, it, expect, vi, beforeAll } from "vitest";
import { POST } from "../../../app/api/auth/login/route";

beforeAll(() => {
  // ensure any crypto/env expectations are satisfied in tests
  process.env.KEY_ENCRYPTION_KEY = Buffer.from(new Array(32).fill(2)).toString("base64");
});

// Mock supabaseAdmin.auth.signInWithPassword
vi.mock("../../../lib/supabaseAdmin", () => {
  return {
    default: {
      auth: {
        signInWithPassword: vi.fn(async ({ email, password }: any) => {
          if (email === "valid@example.com" && password === "password123") {
            return { data: { user: { id: "user-123" } }, error: null };
          }
          return { data: null, error: { message: "Invalid credentials" } };
        }),
      },
    },
  };
});

// Mock createSession to avoid DB interaction and return deterministic cookie
vi.mock("../../../lib/session", () => {
  return {
    createSession: vi.fn(async (userId: string) => {
      return {
        sessionToken: "sess-abc",
        refreshToken: "ref-abc",
        cookie: {
          name: "vf_session",
          value: "sess-abc",
          opts: { httpOnly: true, secure: false, sameSite: "strict", path: "/", maxAge: 604800 },
        },
        row: { id: "row-1", user_id: userId },
      };
    }),
  };
});

describe("POST /api/auth/login", () => {
  it("returns 400 when missing fields", async () => {
    const req = new Request("http://localhost/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: "" }),
    });

    const res = await POST(req as any);
    const json = await res.json();
    expect(res.status).toBe(400);
    expect(json).toHaveProperty("error");
  });

  it("returns 401 for invalid credentials", async () => {
    const req = new Request("http://localhost/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: "nope@example.com", password: "wrong" }),
    });

    const res = await POST(req as any);
    const json = await res.json();
    expect(res.status).toBe(401);
    expect(json).toHaveProperty("error");
  });

  it("sets httpOnly cookie and returns ok on success", async () => {
    const req = new Request("http://localhost/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: "valid@example.com", password: "password123" }),
    });

    const res: any = await POST(req as any);
    expect(res.status).toBe(200);
    const json = await res.json();
    expect(json.ok).toBe(true);

    const setCookie = res.headers.get("Set-Cookie");
    expect(setCookie).toBeDefined();
    expect(setCookie).toContain("vf_session=sess-abc");
    expect(setCookie).toContain("HttpOnly");
    expect(setCookie).toContain("SameSite=strict");
  });
});
