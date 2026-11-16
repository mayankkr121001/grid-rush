import { Router } from 'express';
import {
  handleCreatePlayer,
  handleRecoverPlayer,
  handleGetMe,
  handleRotateRecoveryCode,
  handleLogout,
} from '../controllers/player.controller.js';
import { requireAuth } from '../middleware/auth.middleware.js';

const router = Router();

// Public routes
router.post('/', handleCreatePlayer);
router.post('/recover', handleRecoverPlayer);
router.post('/logout', handleLogout);

// Protected routes (Session Cookie Required)
router.get('/me', requireAuth, handleGetMe);
router.post('/recovery-code/rotate', requireAuth, handleRotateRecoveryCode);

export default router;

