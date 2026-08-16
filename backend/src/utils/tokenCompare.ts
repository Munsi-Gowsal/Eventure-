import crypto from 'crypto';
import bcrypt from 'bcryptjs';

/**
 * Compare plain text token against a bcrypt hash securely.
 * Note: bcrypt.compare is inherently secure against timing attacks for the hash verification itself.
 * We use timingSafeEqual for comparing direct secrets (like signatures or raw byte strings) 
 * but for bcrypt hashes, bcrypt.compare is the correct standard.
 */
export const compareBcryptHash = async (plainText: string, hash: string): Promise<boolean> => {
  return bcrypt.compare(plainText, hash);
};

/**
 * Compare two plain text strings securely using crypto.timingSafeEqual.
 * Both strings must be the same length, otherwise it throws, so we pad/hash them first if needed,
 * or simply check length in constant time.
 */
export const secureCompare = (a: string, b: string): boolean => {
  const bufA = Buffer.from(a);
  const bufB = Buffer.from(b);
  if (bufA.length !== bufB.length) {
    return false;
  }
  return crypto.timingSafeEqual(bufA, bufB);
};
