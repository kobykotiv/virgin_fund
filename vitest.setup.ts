/**
 * Vitest setup file to polyfill Web Crypto API in the Node test environment.
 * Uses Node's built-in webcrypto (node:crypto) and attaches it to globalThis.crypto
 * so lib/encryption.ts can call crypto.subtle in tests.
 *
 * This file is referenced by vitest.config.ts (create that file if missing).
 */

import { webcrypto } from "node:crypto";

if (typeof globalThis.crypto === "undefined") {
  // Attach Node's Web Crypto implementation to the global scope for tests
  ;(globalThis as any).crypto = webcrypto;
}
