import crypto from 'crypto';
import { env } from '../config/env.js';

/**
 * Generates a 128-bit cryptographically secure recovery code formatted as:
 * GR-XXXX-XXXX-XXXX-XXXX
 */
export const generateRecoveryCode = (): string => {
  const bytes = crypto.randomBytes(16); // 128 bits
  const hex = bytes.toString('hex').toUpperCase();
  // Group into 4 blocks of 8 characters: GR-XXXXXXXX-XXXXXXXX-XXXXXXXX-XXXXXXXX
  const parts = hex.match(/.{1,4}/g) || [];
  return `GR-${parts.join('-')}`;
};

/**
 * Computes an HMAC-SHA-256 digest of the recovery code using the server's pepper.
 * Normalizes code by trimming whitespace and converting to uppercase.
 */
export const hashRecoveryCode = (code: string): string => {
  const normalized = code.trim().toUpperCase();
  return crypto
    .createHmac('sha256', env.RECOVERY_CODE_PEPPER)
    .update(normalized)
    .digest('hex');
};

