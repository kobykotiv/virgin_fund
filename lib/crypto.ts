/**
 * lib/crypto.ts
 *
 * AES-256-GCM helpers using a server-side key provided in process.env.KEY_ENCRYPTION_KEY (base64, 32 bytes).
 *
 * API:
 *  - encrypt(plain: string): Promise<string>  // returns base64 of (iv || ciphertext || tag)
 *  - decrypt(cipherBase64: string): Promise<string>
 *
 * Notes:
 *  - Uses Web Crypto (globalThis.crypto.subtle) — available in Bun.
 *  - The output is a single base64 string containing IV (12 bytes) + ciphertext + tag (16 bytes).
 *  - Do NOT expose KEY_ENCRYPTION_KEY to clients. Store in CI / server secrets.
 */

const KEY_ENV = "KEY_ENCRYPTION_KEY";
const IV_LENGTH = 12;
const TAG_LENGTH = 16;

function toBase64(u8: Uint8Array) {
  return Buffer.from(u8).toString("base64");
}
function fromBase64(s: string) {
  return Uint8Array.from(Buffer.from(s, "base64"));
}

async function importKey(): Promise<CryptoKey> {
  const rawBase64 = process.env[KEY_ENV];
  if (!rawBase64) throw new Error(`${KEY_ENV} is not defined`);
  const raw = fromBase64(rawBase64);
  if (raw.length !== 32) throw new Error(`${KEY_ENV} must be 32 bytes (base64-encoded)`);
  // Import as raw ArrayBuffer
  return crypto.subtle.importKey("raw", raw.buffer as ArrayBuffer, { name: "AES-GCM", length: 256 }, false, [
    "encrypt",
    "decrypt",
  ]);
}

function randomIv() {
  return crypto.getRandomValues(new Uint8Array(IV_LENGTH));
}

/**
 * Encrypt plaintext -> base64(iv||ciphertext||tag)
 */
export async function encrypt(plain: string): Promise<string> {
  const key = await importKey();
  const iv = randomIv();
  const encoder = new TextEncoder();
  const data = encoder.encode(plain);

  const buf = await crypto.subtle.encrypt({ name: "AES-GCM", iv }, key, data.buffer as ArrayBuffer);
  const cipher = new Uint8Array(buf); // ciphertext || tag

  // Build combined: iv || cipher
  const combined = new Uint8Array(iv.length + cipher.length);
  combined.set(iv, 0);
  combined.set(cipher, iv.length);

  return toBase64(combined);
}

/**
 * Decrypt base64(iv||ciphertext||tag) -> plaintext
 */
export async function decrypt(cipherBase64: string): Promise<string> {
  const raw = fromBase64(cipherBase64);
  if (raw.length < IV_LENGTH + TAG_LENGTH) throw new Error("Ciphertext too short");

  const iv = raw.slice(0, IV_LENGTH);
  const cipher = raw.slice(IV_LENGTH);

  const key = await importKey();
  const plainBuf = await crypto.subtle.decrypt({ name: "AES-GCM", iv }, key, cipher.buffer as ArrayBuffer);
  const decoder = new TextDecoder();
  return decoder.decode(plainBuf);
}

export default { encrypt, decrypt };

/*
Summary of Changes:
- Added lib/crypto.ts implementing AES-256-GCM encrypt/decrypt using KEY_ENCRYPTION_KEY env (base64, 32 bytes).
- Returns/accepts a single base64 string encoding iv||ciphertext||tag so DB storage is simple (text).
*/
