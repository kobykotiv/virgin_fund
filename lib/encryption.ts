/**
 * Server-side AES-GCM helpers for encrypting/decrypting API credentials.
 *
 * Usage:
 *  - Set VF_MASTER_KEY env var to a base64-encoded 32-byte key (AES-256).
 *  - Call encryptString()/encryptObject() before persisting to DB and decryptString()/decryptObject() after reading.
 *
 * Notes:
 *  - AES-GCM tag (16 bytes) is split out and returned separately to match DB schema (encrypted_value, iv, tag).
 *  - This file uses the Web Crypto API (globalThis.crypto.subtle) which is available in Bun.
 *
 * TypeScript notes:
 *  - Some environments/type definitions make TypedArray buffer types incompatible with Web Crypto signatures.
 *    We cast the underlying ArrayBuffer to satisfy the subtle API while retaining runtime correctness.
 */

type EncryptedPayload = {
  encryptedBase64: string; // ciphertext (without tag) as base64
  ivBase64: string;
  tagBase64: string;
};

const MASTER_KEY_ENV = "VF_MASTER_KEY";
const TAG_LENGTH_BYTES = 16;
const IV_LENGTH_BYTES = 12; // recommended for GCM

async function ensureKey(): Promise<CryptoKey> {
  const rawBase64 = process.env[MASTER_KEY_ENV];
  if (!rawBase64) {
    throw new Error(`${MASTER_KEY_ENV} is not defined. Set a base64 32-byte key in your environment.`);
  }
  const raw = Uint8Array.from(Buffer.from(rawBase64, "base64"));
  if (raw.length !== 32) {
    throw new Error(`${MASTER_KEY_ENV} must be 32 bytes (base64-encoded). Got ${raw.length} bytes.`);
  }

  // Cast to ArrayBuffer to satisfy TypeScript for crypto.subtle.importKey in some envs
  return await crypto.subtle.importKey(
    "raw",
    raw.buffer as ArrayBuffer,
    { name: "AES-GCM", length: 256 },
    false,
    ["encrypt", "decrypt"]
  );
}

function randomIv(): Uint8Array {
  return crypto.getRandomValues(new Uint8Array(IV_LENGTH_BYTES));
}

function toBase64(bytes: Uint8Array): string {
  return Buffer.from(bytes).toString("base64");
}

function fromBase64(s: string): Uint8Array {
  return Uint8Array.from(Buffer.from(s, "base64"));
}

/**
 * Encrypt a UTF-8 string and return components suitable for DB storage.
 */
export async function encryptString(plaintext: string): Promise<EncryptedPayload> {
  const key = await ensureKey();
  const iv = randomIv();
  const encoder = new TextEncoder();
  const data = encoder.encode(plaintext);

  // Use ArrayBuffer casts to satisfy TypeScript's BufferSource expectations
  const cipherBuf = await crypto.subtle.encrypt(
    { name: "AES-GCM", iv: iv.buffer as ArrayBuffer },
    key,
    data.buffer as ArrayBuffer
  );

  // crypto.subtle.encrypt returns an ArrayBuffer containing ciphertext || tag
  const cipher = new Uint8Array(cipherBuf);

  // Split tag from ciphertext
  if (cipher.length < TAG_LENGTH_BYTES) {
    throw new Error("Ciphertext too short to contain tag");
  }
  const tag = cipher.slice(cipher.length - TAG_LENGTH_BYTES);
  const ciphertext = cipher.slice(0, cipher.length - TAG_LENGTH_BYTES);

  return {
    encryptedBase64: toBase64(ciphertext),
    ivBase64: toBase64(iv),
    tagBase64: toBase64(tag),
  };
}

/**
 * Decrypt from stored DB components back to UTF-8 string.
 */
export async function decryptString(payload: EncryptedPayload): Promise<string> {
  const key = await ensureKey();
  const iv = fromBase64(payload.ivBase64);
  const ciphertext = fromBase64(payload.encryptedBase64);
  const tag = fromBase64(payload.tagBase64);

  // Reconstruct combined buffer (ciphertext || tag)
  const combined = new Uint8Array(ciphertext.length + tag.length);
  combined.set(ciphertext, 0);
  combined.set(tag, ciphertext.length);

  // Cast combined.buffer to ArrayBuffer for subtle.decrypt
  const plainBuf = await crypto.subtle.decrypt(
    { name: "AES-GCM", iv: iv.buffer as ArrayBuffer },
    key,
    combined.buffer as ArrayBuffer
  );

  const decoder = new TextDecoder();
  return decoder.decode(plainBuf);
}

/**
 * Convenience helpers for JSON objects.
 */
export async function encryptObject(obj: unknown): Promise<EncryptedPayload> {
  const json = JSON.stringify(obj);
  return encryptString(json);
}

export async function decryptObject<T = any>(payload: EncryptedPayload): Promise<T> {
  const json = await decryptString(payload);
  return JSON.parse(json) as T;
}

/**
 * Utility to convert payload to DB-friendly values (Buffer/Uint8Array) if needed.
 * Example usage before insert:
 *   const { encryptedBase64, ivBase64, tagBase64 } = await encryptObject(creds);
 *   const encrypted_value = Buffer.from(encryptedBase64, "base64");
 *   const iv = Buffer.from(ivBase64, "base64");
 *   const tag = Buffer.from(tagBase64, "base64");
 */
export const helpers = {
  toBase64,
  fromBase64,
  TAG_LENGTH_BYTES,
  IV_LENGTH_BYTES,
};

export default {
  encryptString,
  decryptString,
  encryptObject,
  decryptObject,
  helpers,
};

/*
Summary of Changes:
- Adjusted Web Crypto calls to cast underlying ArrayBuffers for TypeScript compatibility.
- Retains AES-GCM behavior and returns ciphertext, iv, and tag separately to match DB schema.
*/
