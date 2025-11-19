// src/utilities/token-utils.ts
import * as crypto from 'crypto';

/**
 * generateRandomToken(lenBytes)
 * - returns hex string of lenBytes bytes (default 24)
 */
export function generateRandomToken(len = 24): string {
  return crypto.randomBytes(len).toString('hex');
}

/**
 * hashToken(token)
 * - returns a SHA-256 hex string (fast but not reversible)
 * - for refresh tokens you can use sha256 and store in DB
 */
export function hashToken(token: string): string {
  return crypto.createHash('sha256').update(token).digest('hex');
}

/**
 * timingSafeEqualHash(a,b)
 * - safe compare to avoid timing attacks
 */
export function timingSafeEqualHash(a: string, b: string): boolean {
  try {
    const aBuf = Buffer.from(a);
    const bBuf = Buffer.from(b);
    if (aBuf.length !== bBuf.length) return false;
    return crypto.timingSafeEqual(aBuf, bBuf);
  } catch {
    return false;
  }
}
