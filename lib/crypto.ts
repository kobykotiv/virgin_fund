// lib/crypto.ts

/**
 * AES-GCM encryption/decryption utility for browser.
 * Uses key from NEXT_PUBLIC_CREDENTIAL_ENCRYPTION_KEY (32 chars, base64 or utf-8).
 */

const KEY_ENV = 'NEXT_PUBLIC_CREDENTIAL_ENCRYPTION_KEY';

function getKey(): Promise<CryptoKey> {
  const keyString = process.env[KEY_ENV] || (typeof window !== 'undefined' && (window as any).env?.[KEY_ENV]);
  if (!keyString || keyString.length !== 32) throw new Error('Invalid encryption key');
  const keyBytes = new TextEncoder().encode(keyString);
  return window.crypto.subtle.importKey(
    'raw',
    keyBytes,
    { name: 'AES-GCM' },
    false,
    ['encrypt', 'decrypt']
  );
}

export async function encrypt(text: string): Promise<string> {
  const iv = window.crypto.getRandomValues(new Uint8Array(12));
  const key = await getKey();
  const encoded = new TextEncoder().encode(text);
  const ciphertext = await window.crypto.subtle.encrypt(
    { name: 'AES-GCM', iv },
    key,
    encoded
  );
  // Store iv + ciphertext as base64
  const buffer = new Uint8Array(iv.length + ciphertext.byteLength);
  buffer.set(iv, 0);
  buffer.set(new Uint8Array(ciphertext), iv.length);
  return btoa(String.fromCharCode(...buffer));
}

export async function decrypt(data: string): Promise<string> {
  const buffer = Uint8Array.from(atob(data), c => c.charCodeAt(0));
  const iv = buffer.slice(0, 12);
  const ciphertext = buffer.slice(12);
  const key = await getKey();
  const decrypted = await window.crypto.subtle.decrypt(
    { name: 'AES-GCM', iv },
    key,
    ciphertext
  );
  return new TextDecoder().decode(decrypted);
}
