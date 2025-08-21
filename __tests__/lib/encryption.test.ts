import { beforeAll, describe, it, expect } from "vitest";
import { encryptObject, decryptObject } from "../../lib/encryption";

describe("lib/encryption (AES-GCM) roundtrip", () => {
  beforeAll(() => {
    // Use a deterministic 32-byte key for CI/tests. Replace with a secure key in production.
    // 32 bytes of value 1 -> base64
    process.env.VF_MASTER_KEY = Buffer.from(new Array(32).fill(1)).toString("base64");
  });

  it("encrypts and decrypts an object successfully", async () => {
    const secret = { apiKey: "test-key", secret: "test-secret", nested: { token: "x" } };

    const payload = await encryptObject(secret);
    expect(typeof payload.encryptedBase64).toBe("string");
    expect(typeof payload.ivBase64).toBe("string");
    expect(typeof payload.tagBase64).toBe("string");

    const roundtrip = await decryptObject<typeof secret>(payload);
    expect(roundtrip).toEqual(secret);
  });
});

/*
Summary of Changes:
- Added __tests__/lib/encryption.test.ts which verifies encryptObject/decryptObject roundtrip using a test VF_MASTER_KEY.
- Keeps test deterministic by using a fixed 32-byte key; update in CI to use a secure secret.
*/
