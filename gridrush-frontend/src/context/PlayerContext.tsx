'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { Player } from '../types';
import { playersApi } from '../api/client';

interface PlayerContextType {
  player: Player | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  rawRecoveryCode: string | null;
  createPlayer: (username: string) => Promise<void>;
  recoverPlayer: (recoveryCode: string) => Promise<void>;
  rotateRecoveryCode: () => Promise<string>;
  dismissRecoveryCode: () => void;
  logout: () => Promise<void>;
  refreshProfile: () => Promise<void>;
}

const PlayerContext = createContext<PlayerContextType | undefined>(undefined);

export const PlayerProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [player, setPlayer] = useState<Player | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [rawRecoveryCode, setRawRecoveryCode] = useState<string | null>(null);

  const refreshProfile = useCallback(async () => {
    try {
      const data = await playersApi.getMe();
      if (data && data.player) {
        setPlayer(data.player);
      } else {
        setPlayer(null);
      }
    } catch {
      setPlayer(null);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    refreshProfile();
  }, [refreshProfile]);

  const createPlayer = async (username: string) => {
    setIsLoading(true);
    try {
      const data = await playersApi.create(username);
      setPlayer(data.player);
      setRawRecoveryCode(data.recoveryCode);
    } finally {
      setIsLoading(false);
    }
  };

  const recoverPlayer = async (recoveryCode: string) => {
    setIsLoading(true);
    try {
      const data = await playersApi.recover(recoveryCode);
      setPlayer(data.player);
    } finally {
      setIsLoading(false);
    }
  };

  const rotateRecoveryCode = async () => {
    const data = await playersApi.rotateRecoveryCode();
    setRawRecoveryCode(data.recoveryCode);
    return data.recoveryCode;
  };

  const dismissRecoveryCode = () => {
    setRawRecoveryCode(null);
  };

  const logout = async () => {
    try {
      await playersApi.logout();
    } catch (e) {
      console.error('Logout error:', e);
    } finally {
      setPlayer(null);
      setRawRecoveryCode(null);
    }
  };

  return (
    <PlayerContext.Provider
      value={{
        player,
        isAuthenticated: !!player,
        isLoading,
        rawRecoveryCode,
        createPlayer,
        recoverPlayer,
        rotateRecoveryCode,
        dismissRecoveryCode,
        logout,
        refreshProfile,
      }}
    >
      {children}
    </PlayerContext.Provider>
  );
};

export const usePlayer = () => {
  const context = useContext(PlayerContext);
  if (!context) {
    throw new Error('usePlayer must be used within a PlayerProvider');
  }
  return context;
};

