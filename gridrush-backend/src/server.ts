import { createServer } from 'http';
import app from './app.js';
import { env } from './config/env.js';
import { connectDatabase } from './config/database.js';
import { seedBoard } from './services/board.service.js';
import { initSocketServer } from './sockets/socket.js';

const httpServer = createServer(app);

// Initialize Socket.IO with authentication, presence tracking, and capture broadcasting
const io = initSocketServer(httpServer);

const startServer = async () => {
  const isConnected = await connectDatabase();
  if (isConnected) {
    await seedBoard();
  }

  httpServer.listen(env.PORT, () => {
    console.log(`🚀 GridRush Backend listening on port ${env.PORT} in ${env.NODE_ENV} mode`);
    console.log(`🔗 Allowed Client Origin: ${env.CLIENT_URL}`);
  });
};

startServer();

export { httpServer, io };
