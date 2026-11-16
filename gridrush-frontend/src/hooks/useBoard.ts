'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { Cell, BoardStats, LeaderboardEntry } from '../types';
import { boardApi, leaderboardApi } from '../api/client';
import { useSocket } from '../context/SocketContext';
import { usePlayer } from '../context/PlayerContext';
import { soundEffects } from '../utils/audio';

export const useBoard = () => {
  const { socket } = useSocket();
  const { player, refreshProfile } = usePlayer();

  const [cells, setCells] = useState<Cell[]>([]);
  const [stats, setStats] = useState<BoardStats>({ total: 400, claimed: 0, available: 400 });
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [pendingCellId, setPendingCellId] = useState<number | null>(null);
  const [recentlyCapturedIds, setRecentlyCapturedIds] = useState<Set<number>>(new Set());
  const [conflictToast, setConflictToast] = useState<string | null>(null);
  const [claimError, setClaimError] = useState<string | null>(null);

  const isInitialMount = useRef(true);

  // Fetch complete board and leaderboard
  const refreshBoard = useCallback(async () => {
    try {
      const [boardData, lbData] = await Promise.all([
        boardApi.getBoard().catch(() => null),
        leaderboardApi.getLeaderboard(10).catch(() => null),
      ]);

      if (boardData) {
        setCells(boardData.cells);
        setStats(boardData.stats);
      }
      if (lbData) {
        setLeaderboard(lbData.leaderboard);
      }
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Initial load
  useEffect(() => {
    refreshBoard();
  }, [refreshBoard]);

  // Real-Time Socket.IO Subscriptions & Reconnection Reconciliation
  useEffect(() => {
    if (!socket) return;

    // 1. Reconnection Reconciliation: If socket reconnects, re-sync full board state
    const handleConnect = () => {
      if (!isInitialMount.current) {
        console.log('🔄 [Socket] Reconnected — reconciling board state from server...');
        refreshBoard();
        refreshProfile();
      }
      isInitialMount.current = false;
    };

    // 2. Real-time capture event: Triggered whenever any player captures a block
    const handleCellCaptured = (data: {
      cellId: number;
      owner: { id: string; username: string; color: string };
      claimedAt?: string;
    }) => {
      console.log(`📡 [Real-Time] Block #${data.cellId} captured by ${data.owner.username}`);

      // Flash bounce animation
      setRecentlyCapturedIds((prev) => new Set(prev).add(data.cellId));
      setTimeout(() => {
        setRecentlyCapturedIds((prev) => {
          const next = new Set(prev);
          next.delete(data.cellId);
          return next;
        });
      }, 1200);

      // Play soft capture sound
      soundEffects.playCapture();

      // Update matching cell in board state immutably
      setCells((prevCells) =>
        prevCells.map((cell) =>
          cell.cellId === data.cellId
            ? {
                ...cell,
                owner: data.owner,
                claimedAt: data.claimedAt || new Date().toISOString(),
              }
            : cell
        )
      );

      // Update board summary counts
      setStats((prevStats) => {
        const newClaimed = prevStats.claimed + 1;
        return {
          total: prevStats.total,
          claimed: newClaimed,
          available: Math.max(0, prevStats.total - newClaimed),
        };
      });

      // Update leaderboard & user profile
      leaderboardApi.getLeaderboard(10).then((lb) => {
        if (lb?.leaderboard) setLeaderboard(lb.leaderboard);
      }).catch(() => {});

      if (player && data.owner.id === player.id) {
        refreshProfile();
      }
    };

    socket.on('connect', handleConnect);
    socket.on('board:cell-captured', handleCellCaptured);

    return () => {
      socket.off('connect', handleConnect);
      socket.off('board:cell-captured', handleCellCaptured);
    };
  }, [socket, refreshBoard, refreshProfile, player]);

  // Claim Cell Action
  const claimCell = async (cellId: number) => {
    if (pendingCellId !== null) return;

    setPendingCellId(cellId);
    setConflictToast(null);

    try {
      await boardApi.claim(cellId);
      // The socket event `board:cell-captured` will automatically arrive and update the UI!
    } catch (err: any) {
      if (err.status === 409) {
        soundEffects.playConflict();
        setConflictToast(`Block #${cellId} was just claimed by another player!`);
        setTimeout(() => setConflictToast(null), 4000);
        refreshBoard(); // Re-sync board in case socket was momentarily lagging
      } else {
        setClaimError(err.message || 'Failed to claim block.');
      }
    } finally {
      setPendingCellId(null);
    }
  };

  return {
    cells,
    stats,
    leaderboard,
    isLoading,
    pendingCellId,
    recentlyCapturedIds,
    conflictToast,
    claimError,
    clearClaimError: () => setClaimError(null),
    claimCell,
    refreshBoard,
  };
};

