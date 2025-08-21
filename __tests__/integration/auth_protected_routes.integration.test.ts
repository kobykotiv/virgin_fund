// TypeScript

import request from "supertest";
import { createServer } from "http";
import next from "next";

const app = next({ dev: true });
const handle = app.getRequestHandler();

let server: any;

beforeAll(async () => {
  await app.prepare();
  server = createServer((req, res) => handle(req, res)).listen(4000);
});

afterAll(async () => {
  if (server) server.close();
});

describe("Authentication & Protected Routes Integration", () => {
  it("should deny access to protected route when unauthenticated", async () => {
    const res = await request(server).get("/(protected)/home");
    expect(res.status).toBe(302); // Should redirect to /home
    expect(res.headers.location).toBe("/home");
  });

  it("should allow access to protected route when authenticated", async () => {
    // Simulate login to get JWT cookie
    const loginRes = await request(server)
      .post("/auth/login")
      .send({ email: "testuser@example.com", password: "testpassword" });

    expect(loginRes.status).toBe(200);
    const cookies = loginRes.headers["set-cookie"];
    expect(cookies).toBeDefined();

    // Use cookie to access protected route
    const res = await request(server)
      .get("/(protected)/home")
      .set("Cookie", cookies);

    expect(res.status).toBe(200);
    expect(res.text).toContain("Virgin Fund");
  });

  it("should persist session across multiple requests", async () => {
    // Simulate login to get JWT cookie
    const loginRes = await request(server)
      .post("/auth/login")
      .send({ email: "testuser@example.com", password: "testpassword" });

    expect(loginRes.status).toBe(200);
    const cookies = loginRes.headers["set-cookie"];
    expect(cookies).toBeDefined();

    // Access protected route multiple times with the same cookie
    const res1 = await request(server)
      .get("/(protected)/home")
      .set("Cookie", cookies);
    expect(res1.status).toBe(200);

    const res2 = await request(server)
      .get("/(protected)/settings")
      .set("Cookie", cookies);
    expect(res2.status).toBe(200);
  });
});

// Summary of Changes:
// Added integration tests for authentication and protected route access using Supertest and Next.js server.
// Tests cover unauthenticated redirect and authenticated access to protected dashboard.
