'use client';

import React, { createContext, useContext, useEffect, useState, useRef } from 'react';
import { io, Socket } from 'socket.io-client';
import { usePlayer } from './PlayerContext';
import { getAuthToken } from '../api/client';
import { ConnectionStatus } from '../types';

interface CapturedCellEvent {
  cellId: number;
  owner: {
    id: string;
    username: string;
    color: string;
  };
  claimedAt?: string;
}

interface SocketContextType {
  socket: Socket | null;
  connectionStatus: ConnectionStatus;
  onlineCount: number;
}

const SocketContext = createContext<SocketContextType | undefined>(undefined);

const SOCKET_URL = process.env.NEXT_PUBLIC_SOCKET_URL || 'http://localhost:5000';

export const SocketProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated } = usePlayer();
  const [socket, setSocket] = useState<Socket | null>(null);
  const [connectionStatus, setConnectionStatus] = useState<ConnectionStatus>('connecting');
  const [onlineCount, setOnlineCount] = useState<number>(1);
  const socketRef = useRef<Socket | null>(null);

  useEffect(() => {
    // Sockets are initialized when the client mounts
    const socketInstance: Socket = io(SOCKET_URL, {
      withCredentials: true,
      auth: {
        token: getAuthToken() || undefined,
      },
      autoConnect: true,
      reconnection: true,
      reconnectionAttempts: Infinity,
      reconnectionDelay: 1000,
      reconnectionDelayMax: 5000,
      timeout: 20000,
    });

    socketRef.current = socketInstance;
    setSocket(socketInstance);

    socketInstance.on('connect', () => {
      console.log('⚡ [Socket] Connected to GridRush server:', socketInstance.id);
      setConnectionStatus('connected');
    });

    socketInstance.on('disconnect', (reason) => {
      console.log('🔌 [Socket] Disconnected:', reason);
      setConnectionStatus('offline');
    });

    socketInstance.on('connect_error', () => {
      setConnectionStatus('connecting');
    });

    socketInstance.on('presence:count', (data: { count: number }) => {
      if (typeof data?.count === 'number') {
        setOnlineCount(Math.max(1, data.count));
      }
    });

    socketInstance.on('presence:initial', (data: { count: number }) => {
      if (typeof data?.count === 'number') {
        setOnlineCount(Math.max(1, data.count));
      }
    });

    return () => {
      socketInstance.disconnect();
    };
  }, []);

  // Update socket credentials and reconnect when authentication status changes
  useEffect(() => {
    if (socketRef.current) {
      const token = getAuthToken();
      socketRef.current.auth = { token: token || undefined };
      if (!socketRef.current.connected) {
        socketRef.current.connect();
      }
    }
  }, [isAuthenticated]);

  return (
    <SocketContext.Provider
      value={{
        socket,
        connectionStatus,
        onlineCount,
      }}
    >
      {children}
    </SocketContext.Provider>
  );
};

export const useSocket = () => {
  const context = useContext(SocketContext);
  if (!context) {
    throw new Error('useSocket must be used within a SocketProvider');
  }
  return context;
};

