import { Request, Response, NextFunction } from 'express';
import { AuthenticatedRequest } from '../middleware/auth.middleware.js';
import * as boardService from '../services/board.service.js';

export const handleGetBoard = async (
  _req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const boardData = await boardService.getBoard();
    res.status(200).json({
      success: true,
      data: boardData,
    });
  } catch (error) {
    next(error);
  }
};

export const handleClaimCell = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    if (!req.player) {
      res.status(401).json({ success: false, error: 'Unauthorized' });
      return;
    }

    const rawCellId = Array.isArray(req.params.cellId) ? req.params.cellId[0] : req.params.cellId;
    const cellId = parseInt(rawCellId || '', 10);
    if (isNaN(cellId)) {
      res.status(400).json({ success: false, error: 'Invalid cell ID parameter.' });
      return;
    }

    const result = await boardService.claimCell(cellId, req.player);

    res.status(200).json({
      success: true,
      data: result.cell,
    });
  } catch (error) {
    next(error);
  }
};
