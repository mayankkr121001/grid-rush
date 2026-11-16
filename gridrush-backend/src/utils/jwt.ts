import jwt from 'jsonwebtoken';
import { env } from '../config/env.js';

export interface PlayerTokenPayload {
  playerId: string;
}

export const signPlayerToken = (playerId: string): string => {
  return jwt.sign({ playerId }, env.JWT_SECRET, {
    expiresIn: `${env.SESSION_MAX_AGE_DAYS}d`,
  });
};

export const verifyPlayerToken = (token: string): PlayerTokenPayload | null => {
  try {
    const decoded = jwt.verify(token, env.JWT_SECRET) as PlayerTokenPayload;
    if (decoded && decoded.playerId) {
      return decoded;
    }
    return null;
  } catch {
    return null;
  }
};

