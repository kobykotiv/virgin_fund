import * as crypto from 'crypto';

// Use environment variable for salt or fallback to a default
const ENCRYPTION_SALT = process.env.NEXT_PUBLIC_ENCRYPTION_SALT || 'default-salt-value';

export function encrypt(text: string): string {
  const key = crypto.scryptSync(ENCRYPTION_SALT, 'salt', 32);
  const iv = crypto.randomBytes(16);
  const cipher = crypto.createCipheriv('aes-256-cbc', key, iv);
  const encrypted = cipher.update(text, 'utf8', 'hex') + cipher.final('hex');
  return `${iv.toString('hex')}:${encrypted}`;
}

export function decrypt(encryptedText: string): string {
  try {
    const key = crypto.scryptSync(ENCRYPTION_SALT, 'salt', 32);
    const [iv, encrypted] = encryptedText.split(':').map(part => Buffer.from(part, 'hex'));
    const decipher = crypto.createDecipheriv('aes-256-cbc', key, iv);
    return decipher.update(encrypted) + decipher.final('utf8');
  } catch (error) {
    console.error('Decryption failed:', error);
    throw new Error('Failed to decrypt data');
  }
}

export function decryptWithSalt(encryptedText: string, salt: string): string {
  const key = crypto.scryptSync(salt, 'salt', 32);
  const [iv, encrypted] = encryptedText.split(':').map(part => Buffer.from(part, 'hex'));
  const decipher = crypto.createDecipheriv('aes-256-cbc', key, iv);
  return decipher.update(encrypted) + decipher.final('utf8');
}
