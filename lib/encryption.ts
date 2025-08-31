// Simple encryption utilities for development
// In production, use proper encryption libraries

const ENCRYPTION_KEY = process.env.ENCRYPTION_KEY || 'dev-key-change-in-production';

export function encrypt(text: string): string {
  // Simple base64 encoding for development
  // Replace with proper encryption in production
  return Buffer.from(text).toString('base64');
}

export function decrypt(encryptedText: string): string {
  // Simple base64 decoding for development
  // Replace with proper decryption in production
  return Buffer.from(encryptedText, 'base64').toString();
}

export function hashPassword(password: string): string {
  // Simple hash for development
  // Use bcrypt or argon2 in production
  return encrypt(password + ENCRYPTION_KEY);
}

export function verifyPassword(password: string, hash: string): boolean {
  // Simple verification for development
  // Use proper password verification in production
  return hashPassword(password) === hash;
}

export function encryptObject(obj: any): string {
  // Simple JSON stringification and encryption for development
  // Replace with proper object encryption in production
  const jsonString = JSON.stringify(obj);
  return encrypt(jsonString);
}

export function decryptObject(encryptedText: string): any {
  // Simple decryption and JSON parsing for development
  // Replace with proper object decryption in production
  const jsonString = decrypt(encryptedText);
  return JSON.parse(jsonString);
}
