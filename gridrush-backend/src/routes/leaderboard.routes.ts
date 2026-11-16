import { Router } from 'express';
import { handleGetLeaderboard } from '../controllers/leaderboard.controller.js';

const router = Router();

// GET /api/v1/leaderboard
router.get('/', handleGetLeaderboard);

export default router;

