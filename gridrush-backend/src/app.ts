import express, { Request, Response } from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import { env } from './config/env.js';
import playerRoutes from './routes/player.routes.js';
import boardRoutes from './routes/board.routes.js';
import leaderboardRoutes from './routes/leaderboard.routes.js';
import { errorHandler } from './middleware/error.middleware.js';

const app = express();

app.use(
  cors({
    origin: env.CLIENT_URL,
    credentials: true,
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Base health check
app.get('/api/v1/health', (_req: Request, res: Response) => {
  res.status(200).json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    service: 'gridrush-backend',
    env: env.NODE_ENV,
  });
});

// Mount modular API v1 routes
app.use('/api/v1/players', playerRoutes);
app.use('/api/v1', boardRoutes);
app.use('/api/v1/leaderboard', leaderboardRoutes);

// Centralized error handling
app.use(errorHandler);

export default app;
