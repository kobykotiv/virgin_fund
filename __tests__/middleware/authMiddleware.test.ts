// @vitest-environment node
import { describe, it, expect, vi } from "vitest";
import { NextRequest, NextResponse } from "next/server";
import { authMiddleware } from "@/middleware/authMiddleware";
import { sign } from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "test-secret";

function mockRequestWithCookie(token?: string) {
  return {
    headers: new Map(),
    cookies: {
      get: (name: string) => (name === "vf_session" && token ? { value: token } : undefined),
    },
  } as any as NextRequest;
}

describe("authMiddleware", () => {
  it("returns user for valid token", async () => {
    const token = sign({ id: "1", username: "test", email: "test@example.com" }, JWT_SECRET);
    const req = mockRequestWithCookie(token);
    const result = await authMiddleware(req);
    expect(result && "user" in result && result.user.email).toBe("test@example.com");
  });

  it("returns 401 for missing token", async () => {
    const req = mockRequestWithCookie();
    const result = await authMiddleware(req);
    expect(result).toBeInstanceOf(NextResponse);
  });

  it("returns 401 for invalid token", async () => {
    const req = mockRequestWithCookie("invalid.token.value");
    const result = await authMiddleware(req);
    expect(result).toBeInstanceOf(NextResponse);
  });
});

// Summary of Changes:
// - Added unit tests for authMiddleware to verify user extraction and error handling for missing/invalid tokens.
