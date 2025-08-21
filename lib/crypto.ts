import crypto from "crypto";

// Simple AES-256-GCM encryption/decryption using a base64 key in env
const KEY_B64 = process.env.KEY_ENCRYPTION_KEY || "";
const KEY = KEY_B64 ? Buffer.from(KEY_B64, "base64") : null;

export async function encrypt(plaintext: string): Promise<string> {
  if (!KEY || KEY.length !== 32) {
    throw new Error("Invalid KEY_ENCRYPTION_KEY (expect base64 of 32 bytes)");
  }

  const iv = crypto.randomBytes(12);
  const cipher = crypto.createCipheriv("aes-256-gcm", KEY, iv);
  const encrypted = Buffer.concat([cipher.update(plaintext, "utf8"), cipher.final()]);
  const tag = cipher.getAuthTag();
  // store as: iv(12) | tag(16) | ciphertext
  return Buffer.concat([iv, tag, encrypted]).toString("base64");
}

export async function decrypt(payloadB64: string): Promise<string> {
  if (!KEY || KEY.length !== 32) {
    throw new Error("Invalid KEY_ENCRYPTION_KEY (expect base64 of 32 bytes)");
  }
  const data = Buffer.from(payloadB64, "base64");
  const iv = data.slice(0, 12);
  const tag = data.slice(12, 28);
  const encrypted = data.slice(28);
  const decipher = crypto.createDecipheriv("aes-256-gcm", KEY, iv);
  decipher.setAuthTag(tag);
  const decrypted = Buffer.concat([decipher.update(encrypted), decipher.final()]);
  return decrypted.toString("utf8");
}

export function maskApiKey(key: string) {
  if (!key) return "";
  if (key.length <= 8) return key.replace(/.(?=.{4})/g, "*");
  return `${key.slice(0, 4)}****${key.slice(-4)}`;
}

export default { encrypt, decrypt, maskApiKey };
