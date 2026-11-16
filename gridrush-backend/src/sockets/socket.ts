import { Server as HttpServer } from 'http';
import { Server, Socket } from 'socket.io';
import { env } from '../config/env.js';
import { verifyPlayerToken } from '../utils/jwt.js';
import { Player } from '../models/Player.model.js';
import { setSocketEmitter } from '../services/board.service.js';
import {
  ServerToClientEvents,
  ClientToServerEvents,
  SocketData,
} from './socket.types.js';

type CustomSocket = Socket<ClientToServerEvents, ServerToClientEvents, Record<string, never>, SocketData>;

// In-memory presence map: playerId -> Set<socketId>
const activePlayers = new Map<string, Set<string>>();

const getUniquePlayerCount = (): number => activePlayers.size;

export const initSocketServer = (httpServer: HttpServer) => {
  const io = new Server<ClientToServerEvents, ServerToClientEvents, Record<string, never>, SocketData>(
    httpServer,
    {
      cors: {
        origin: env.CLIENT_URL,
        credentials: true,
      },
      pingTimeout: 20000,
      pingInterval: 25000,
    }
  );

  // Authentication Middleware for Socket.IO Handshake
  io.use(async (socket: CustomSocket, next) => {
    try {
      const cookieHeader = socket.handshake.headers.cookie || '';
      
      // Parse cookies without external heavy dependencies
      const cookies: Record<string, string> = {};
      cookieHeader.split(';').forEach((item) => {
        const [key, ...v] = item.trim().split('=');
        if (key) cookies[key] = decodeURIComponent(v.join('='));
      });

      const token = cookies[env.SESSION_COOKIE_NAME];

      if (token) {
        const payload = verifyPlayerToken(token);
        if (payload && payload.playerId) {
          const player = await Player.findById(payload.playerId);
          if (player) {
            socket.data.player = {
              id: player._id.toString(),
              username: player.username,
              color: player.color,
            };
          }
        }
      }

      // Sockets are allowed to connect (guests as spectators, players as authenticated)
      next();
    } catch (err) {
      console.error('Socket authentication error:', err);
      next();
    }
  });

  // Handle Socket Connections
  io.on('connection', (socket: CustomSocket) => {
    const player = socket.data.player;

    if (player) {
      console.log(`⚡ [Socket] Player connected: ${player.username} (${player.id}) [Socket: ${socket.id}]`);

      // Track presence with multi-tab deduplication
      const existingSockets = activePlayers.get(player.id) || new Set<string>();
      const wasAlreadyOnline = existingSockets.size > 0;
      existingSockets.add(socket.id);
      activePlayers.set(player.id, existingSockets);

      // If this is the player's first open tab, broadcast updated online count
      if (!wasAlreadyOnline) {
        io.emit('presence:count', { count: getUniquePlayerCount() });
      }
    } else {
      console.log(`👀 [Socket] Guest connected [Socket: ${socket.id}]`);
    }

    // Send initial presence count to the connecting socket
    socket.emit('presence:initial', { count: getUniquePlayerCount() });

    // Handle Disconnect
    socket.on('disconnect', () => {
      if (player) {
        console.log(`🔌 [Socket] Player disconnected: ${player.username} [Socket: ${socket.id}]`);

        const playerSockets = activePlayers.get(player.id);
        if (playerSockets) {
          playerSockets.delete(socket.id);

          if (playerSockets.size === 0) {
            // Player has no remaining active tabs
            activePlayers.delete(player.id);
            io.emit('presence:count', { count: getUniquePlayerCount() });
          }
        }
      } else {
        console.log(`🔌 [Socket] Guest disconnected [Socket: ${socket.id}]`);
      }
    });
  });

  // Wire Socket Emitter to Board Service for immediate real-time capture broadcasts
  setSocketEmitter((event: string, payload: any) => {
    if (event === 'board:cell-captured') {
      io.emit('board:cell-captured', payload);
    }
  });

  return io;
};

