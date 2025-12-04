import * as crypto from 'crypto';

// Gera token aleátorio de 24 caracteres (quanto maior melhor)
export function generateRandomToken(len = 24): string {
  return crypto.randomBytes(len).toString('hex'); // long token opaco
}

export function hashToken(token: string): string {
  // use sha256 para velocidade (não reversível), ou bcrypt se vc quiser um hash lento
  return crypto.createHash('sha256').update(token).digest('hex');
}

// Não sei o que é mas funciona e é necessário
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
