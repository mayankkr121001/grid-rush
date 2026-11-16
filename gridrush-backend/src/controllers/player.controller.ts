import { Request, Response, NextFunction } from 'express';
import { AuthenticatedRequest } from '../middleware/auth.middleware.js';
import * as playerService from '../services/player.service.js';
import { setSessionCookie, clearSessionCookie } from '../utils/cookies.js';

export const handleCreatePlayer = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { username } = req.body;
    const result = await playerService.createPlayer(username);

    // Set signed HttpOnly session cookie
    setSessionCookie(res, result.token);

    // Return public player profile, recovery code, and token
    res.status(201).json({
      success: true,
      data: {
        player: result.player,
        recoveryCode: result.rawRecoveryCode,
        token: result.token,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const handleRecoverPlayer = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { recoveryCode } = req.body;
    const result = await playerService.recoverPlayer(recoveryCode);

    // Set signed HttpOnly session cookie
    setSessionCookie(res, result.token);

    // Return public player profile and token
    res.status(200).json({
      success: true,
      data: {
        player: result.player,
        token: result.token,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const handleGetMe = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    if (!req.player) {
      res.status(401).json({ success: false, error: 'Unauthorized' });
      return;
    }

    const profile = await playerService.getPlayerProfile(req.player._id.toString());

    res.status(200).json({
      success: true,
      data: {
        player: profile,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const handleRotateRecoveryCode = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    if (!req.player) {
      res.status(401).json({ success: false, error: 'Unauthorized' });
      return;
    }

    const result = await playerService.rotateRecoveryCode(req.player._id.toString());

    res.status(200).json({
      success: true,
      data: {
        recoveryCode: result.newRecoveryCode,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const handleLogout = async (
  _req: Request,
  res: Response
): Promise<void> => {
  clearSessionCookie(res);
  res.status(200).json({
    success: true,
    message: 'Logged out successfully',
  });
};

