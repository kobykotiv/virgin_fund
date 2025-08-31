// Ensure a WebCrypto implementation exists (Node <20 compatibility for tests)
if (typeof (globalThis as any).crypto === 'undefined') {
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const nodeCrypto = require('crypto')
  ;(globalThis as any).crypto = nodeCrypto.webcrypto
}

import { SignJWT, jwtVerify } from 'jose'

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key'
const JWT_ISSUER = process.env.JWT_ISSUER || 'virgin-fund'
const JWT_AUDIENCE = process.env.JWT_AUDIENCE || 'virgin-fund-client'
const JWT_EXPIRATION = process.env.JWT_EXPIRATION || '7d'

export async function verifySessionToken(token: string) {
  try {
    if (!token) return null

    const secret = new TextEncoder().encode(JWT_SECRET)
    const { payload } = await jwtVerify(token, secret, {
      issuer: JWT_ISSUER,
      audience: JWT_AUDIENCE,
    })

    return payload
  } catch (error) {
    console.error('Token verification failed:', error)
    return null
  }
}

export async function createSessionToken(payload: any) {
  const secret = new TextEncoder().encode(JWT_SECRET)
  const jwt = await new SignJWT(payload)
    .setProtectedHeader({ alg: 'HS256', typ: 'JWT' })
    .setIssuedAt()
    .setIssuer(JWT_ISSUER)
    .setAudience(JWT_AUDIENCE)
    .setExpirationTime(JWT_EXPIRATION)
    .sign(secret)

  return jwt
}
