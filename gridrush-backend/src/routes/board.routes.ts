import { Router } from 'express';
import { handleGetBoard, handleClaimCell } from '../controllers/board.controller.js';
import { requireAuth } from '../middleware/auth.middleware.js';

const router = Router();

// GET /api/v1/board - Get board state and summary
router.get('/board', handleGetBoard);

// POST /api/v1/cells/:cellId/claim - Atomically claim a cell
router.post('/cells/:cellId/claim', requireAuth, handleClaimCell);

export default router;

