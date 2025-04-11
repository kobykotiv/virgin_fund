import crypto from 'crypto';

const ALGORITHM = 'aes-256-gcm';
const IV_LENGTH = 12; // Recommended for GCM
const AUTH_TAG_LENGTH = 16; // Standard for GCM

// Ensure the encryption key is set and is the correct length (32 bytes for AES-256)
const encryptionKeyEnv = process.env.ENCRYPTION_KEY;
if (!encryptionKeyEnv || Buffer.from(encryptionKeyEnv, 'hex').length !== 32) {
  throw new Error('ENCRYPTION_KEY environment variable must be set and be a 32-byte hex string.');
}
const encryptionKey = Buffer.from(encryptionKeyEnv, 'hex');

/**
 * Encrypts text using AES-256-GCM.
 * @param text The text to encrypt.
 * @returns A hex string containing the IV, auth tag, and encrypted text.
 */
export function encrypt(text: string): string {
  try {
    const iv = crypto.randomBytes(IV_LENGTH);
    const cipher = crypto.createCipheriv(ALGORITHM, encryptionKey, iv);
    
    let encrypted = cipher.update(text, 'utf8', 'hex');
    encrypted += cipher.final('hex');
    
    const authTag = cipher.getAuthTag();
    
    // Concatenate IV, auth tag, and encrypted text, then convert to hex
    const combined = Buffer.concat([iv, authTag, Buffer.from(encrypted, 'hex')]);
    return combined.toString('hex');
  } catch (error) {
    console.error('Encryption failed:', error);
    throw new Error('Encryption failed');
  }
}

/**
 * Decrypts text encrypted with AES-256-GCM.
 * @param encryptedHex The hex string containing IV, auth tag, and encrypted text.
 * @returns The original decrypted text.
 */
export function decrypt(encryptedHex: string): string {
  try {
    const combined = Buffer.from(encryptedHex, 'hex');
    
    // Extract IV, auth tag, and encrypted text
    const iv = combined.subarray(0, IV_LENGTH);
    const authTag = combined.subarray(IV_LENGTH, IV_LENGTH + AUTH_TAG_LENGTH);
    const encryptedText = combined.subarray(IV_LENGTH + AUTH_TAG_LENGTH);
    
    const decipher = crypto.createDecipheriv(ALGORITHM, encryptionKey, iv);
    decipher.setAuthTag(authTag);
    
    let decrypted = decipher.update(encryptedText.toString('hex'), 'hex', 'utf8');
    decrypted += decipher.final('utf8');
    
    return decrypted;
  } catch (error) {
    console.error('Decryption failed:', error);
    // It's common for decryption to fail if the key is wrong or data is corrupt
    throw new Error('Decryption failed. Check key or data integrity.');
  }
}
