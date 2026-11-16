import { Request, Response, NextFunction } from 'express';
import { env } from '../config/env.js';
import { verifyPlayerToken } from '../utils/jwt.js';
import { Player, IPlayer } from '../models/Player.model.js';

export interface AuthenticatedRequest extends Request {
  player?: IPlayer;
}

export const requireAuth = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  // Support both HttpOnly cookie and Authorization Bearer header
  const authHeader = req.headers.authorization;
  const bearerToken = authHeader?.startsWith('Bearer ') ? authHeader.slice(7) : null;
  const token = req.cookies?.[env.SESSION_COOKIE_NAME] || bearerToken;

  if (!token) {
    res.status(401).json({
      success: false,
      error: 'Authentication required. Please create or recover your player session.',
    });
    return;
  }

  const payload = verifyPlayerToken(token);
  if (!payload) {
    res.status(401).json({
      success: false,
      error: 'Invalid or expired session. Please log in or recover your player.',
    });
    return;
  }

  try {
    const player = await Player.findById(payload.playerId);
    if (!player) {
      res.status(401).json({
        success: false,
        error: 'Player profile no longer exists.',
      });
      return;
    }

    req.player = player;
    next();
  } catch (error) {
    console.error('Auth middleware error:', error);
    res.status(500).json({
      success: false,
      error: 'Authentication verification failed.',
    });
  }
};

