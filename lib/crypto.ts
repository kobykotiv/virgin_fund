import crypto from "crypto";

/**
 * lib/crypto.ts
 *
 * Server-side helpers for encrypting/decrypting API secrets.
 * - AES-256-GCM with 12 byte IV and 16 byte auth tag.
 * - Exposes: encryptSecret(plainText) -> base64(iv||ciphertext||tag)
 *            decryptSecret(base64Blob) -> plainText
 *            hashApiKey(apiKey) -> base64(sha256)
 *
 * NOTE:
 * - Uses SESSION_ENCRYPTION_KEY env var. Provide a 32-byte key (recommended as base64 or utf8 string).
 * - This module MUST only be imported from server code.
 */

function resolveKey(): Buffer {
  const raw = process.env.SESSION_ENCRYPTION_KEY || "";
  if (!raw) {
    throw new Error("Missing SESSION_ENCRYPTION_KEY env var required for secret encryption");
  }

  // Accept either a base64-encoded 32-byte key or a raw utf8 key (>=32 bytes recommended)
  try {
    const maybe = Buffer.from(raw, "base64");
    if (maybe.length === 32) return maybe;
  } catch (e) {
    // ignore
  }

  const buf = Buffer.from(raw, "utf8");
  if (buf.length < 32) {
    // still allow, but warn (not throwing to preserve dev experience)
    console.warn("SESSION_ENCRYPTION_KEY shorter than 32 bytes; consider using a 32-byte key (base64-encoded)");
  }
  // If longer than 32, truncate to 32 bytes for AES-256
  return buf.length === 32 ? buf : buf.slice(0, 32);
}

/**
 * Encrypt plaintext and return base64(iv||ciphertext||tag)
 */
export function encryptSecret(plainText: string) {
  const key = resolveKey();
  const iv = crypto.randomBytes(12); // 96-bit IV recommended for GCM
  const cipher = crypto.createCipheriv("aes-256-gcm", key, iv);
  const ciphertext = Buffer.concat([cipher.update(plainText, "utf8"), cipher.final()]);
  const tag = cipher.getAuthTag();

  const out = Buffer.concat([iv, ciphertext, tag]);
  return out.toString("base64");
}

/**
 * Decrypt base64(iv||ciphertext||tag) to plaintext
 */
export function decryptSecret(base64Blob: string) {
  const key = resolveKey();
  const buf = Buffer.from(base64Blob, "base64");
  if (buf.length < 12 + 16) {
    throw new Error("Malformed encrypted blob");
  }
  const iv = buf.slice(0, 12);
  const tag = buf.slice(buf.length - 16);
  const ciphertext = buf.slice(12, buf.length - 16);

  const decipher = crypto.createDecipheriv("aes-256-gcm", key, iv);
  decipher.setAuthTag(tag);
  const decrypted = Buffer.concat([decipher.update(ciphertext), decipher.final()]);
  return decrypted.toString("utf8");
}

/**
 * Compute SHA-256 hash of apiKey and return base64 string for storage/lookup.
 * This avoids storing raw API keys and allows matching.
 */
export function hashApiKey(apiKey: string) {
  const h = crypto.createHash("sha256").update(apiKey, "utf8").digest();
  return h.toString("base64");
}

export const encrypt = encryptSecret;
export const decrypt = decryptSecret;
export const hash = hashApiKey;

// Default export for modules that import the library as a default
export default {
  encrypt,
  decrypt,
  hash,
  encryptSecret,
  decryptSecret,
  hashApiKey,
};
