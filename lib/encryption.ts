// Simple encryption utilities for API keys
// In production, use a more secure encryption method

const ENCRYPTION_KEY = process.env.ENCRYPTION_KEY || 'default-encryption-key-change-in-production'

export function encrypt(text: string): string {
  try {
    // Simple XOR encryption for demo purposes
    // In production, use proper encryption like AES
    let result = ''
    for (let i = 0; i < text.length; i++) {
      result += String.fromCharCode(text.charCodeAt(i) ^ ENCRYPTION_KEY.charCodeAt(i % ENCRYPTION_KEY.length))
    }
    return btoa(result) // Base64 encode
  } catch (error) {
    console.error('Encryption error:', error)
    return text
  }
}

export function decrypt(encryptedText: string): string {
  try {
    // Simple XOR decryption
    const decoded = atob(encryptedText) // Base64 decode
    let result = ''
    for (let i = 0; i < decoded.length; i++) {
      result += String.fromCharCode(decoded.charCodeAt(i) ^ ENCRYPTION_KEY.charCodeAt(i % ENCRYPTION_KEY.length))
    }
    return result
  } catch (error) {
    console.error('Decryption error:', error)
    return encryptedText
  }
}

export function hashApiKey(apiKey: string): string {
  // Simple hash for demo purposes
  // In production, use proper hashing like bcrypt
  let hash = 0
  for (let i = 0; i < apiKey.length; i++) {
    const char = apiKey.charCodeAt(i)
    hash = ((hash << 5) - hash) + char
    hash = hash & hash // Convert to 32-bit integer
  }
  return Math.abs(hash).toString(36)
}
