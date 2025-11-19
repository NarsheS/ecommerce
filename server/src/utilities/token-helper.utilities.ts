import * as crypto from 'crypto';

export function generateRandomToken(len = 48) {
  return crypto.randomBytes(len).toString('hex'); // long opaque token
}

export function hashToken(token: string) {
  // use sha256 for speed (not reversible), or bcrypt if you want slow hash
  return crypto.createHash('sha256').update(token).digest('hex');
}
