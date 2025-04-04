/**
 * Encryption utilities for storing sensitive credentials
 */

const ENCRYPTION_KEY = process.env.NEXT_PUBLIC_CREDENTIAL_ENCRYPTION_KEY || 'default-development-key-not-for-prod'

/**
 * Encrypts a string using AES-GCM
 */
export async function encryptData(data: string): Promise<string> {
  const encoder = new TextEncoder()
  const dataBuffer = encoder.encode(data)
  
  // Generate random IV
  const iv = crypto.getRandomValues(new Uint8Array(12))
  const keyBuffer = encoder.encode(ENCRYPTION_KEY.slice(0, 32))
  
  // Import encryption key
  const key = await crypto.subtle.importKey(
    'raw',
    keyBuffer,
    { name: 'AES-GCM', length: 256 },
    false,
    ['encrypt']
  )
  
  // Encrypt the data
  const encryptedData = await crypto.subtle.encrypt(
    { name: 'AES-GCM', iv },
    key,
    dataBuffer
  )
  
  // Combine IV and encrypted data
  const result = new Uint8Array(iv.length + encryptedData.byteLength)
  result.set(iv)
  result.set(new Uint8Array(encryptedData), iv.length)
  
  return btoa(String.fromCharCode(...result))
}

/**
 * Decrypts an encrypted string using AES-GCM
 */
export async function decryptData(encryptedData: string): Promise<string> {
  try {
    const decoder = new TextDecoder()
    const data = Uint8Array.from(atob(encryptedData), c => c.charCodeAt(0))
    
    // Extract IV and encrypted data
    const iv = data.slice(0, 12)
    const encryptedBuffer = data.slice(12)
    
    // Import decryption key
    const keyBuffer = new TextEncoder().encode(ENCRYPTION_KEY.slice(0, 32))
    const key = await crypto.subtle.importKey(
      'raw',
      keyBuffer,
      { name: 'AES-GCM', length: 256 },
      false,
      ['decrypt']
    )
    
    // Decrypt the data
    const decryptedData = await crypto.subtle.decrypt(
      { name: 'AES-GCM', iv },
      key,
      encryptedBuffer
    )
    
    return decoder.decode(decryptedData)
  } catch (error) {
    console.error('Decryption failed:', error)
    return ''
  }
}
