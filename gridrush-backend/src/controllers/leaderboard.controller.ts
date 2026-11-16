import { Request, Response, NextFunction } from 'express';
import * as leaderboardService from '../services/leaderboard.service.js';

export const handleGetLeaderboard = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const limit = req.query.limit ? parseInt(req.query.limit as string, 10) : 10;
    const leaderboard = await leaderboardService.getLeaderboard(isNaN(limit) ? 10 : limit);

    res.status(200).json({
      success: true,
      data: {
        leaderboard,
      },
    });
  } catch (error) {
    next(error);
  }
};

