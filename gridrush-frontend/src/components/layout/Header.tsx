'use client';

import React, { useState } from 'react';
import { usePlayer } from '../../context/PlayerContext';
import { PlayerSettingsModal } from '../player/PlayerSettingsModal';
import { LayoutGrid, Users, Settings, Wifi, WifiOff } from 'lucide-react';
import { ConnectionStatus } from '../../types';

interface HeaderProps {
  onlineCount: number;
  connectionStatus: ConnectionStatus;
}

export const Header: React.FC<HeaderProps> = ({ onlineCount, connectionStatus }) => {
  const { player } = usePlayer();
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  return (
    <>
      <header className="sticky top-0 z-40 w-full border-b border-border bg-surface/80 backdrop-blur-md px-4 sm:px-6 py-3">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-primary/10 text-primary border border-primary/20">
              <LayoutGrid className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-lg font-bold text-white tracking-tight flex items-center gap-1">
                Grid<span className="text-primary">Rush</span>
                <span className="text-[10px] font-semibold uppercase tracking-wider px-1.5 py-0.5 rounded bg-primary/20 text-primary border border-primary/30">
                  Live
                </span>
              </h1>
            </div>
          </div>

          {/* Center / Right Badges */}
          <div className="flex items-center gap-3">
            {/* Connection Status Pill */}
            <div
              className={`hidden sm:inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border ${
                connectionStatus === 'connected'
                  ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                  : connectionStatus === 'connecting'
                  ? 'bg-amber-500/10 text-amber-400 border-amber-500/20'
                  : 'bg-red-500/10 text-red-400 border-red-500/20'
              }`}
            >
              {connectionStatus === 'connected' ? (
                <>
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  <span>Live</span>
                </>
              ) : connectionStatus === 'connecting' ? (
                <>
                  <span className="h-1.5 w-1.5 rounded-full bg-amber-400 animate-ping" />
                  <span>Reconnecting</span>
                </>
              ) : (
                <>
                  <WifiOff className="w-3 h-3 text-red-400" />
                  <span>Offline</span>
                </>
              )}
            </div>

            {/* Online Players Pill */}
            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-surface-elevated text-gray-300 border border-border text-xs font-medium">
              <Users className="w-3.5 h-3.5 text-primary" />
              <span>
                <strong className="text-white">{onlineCount}</strong> online
              </span>
            </div>

            {/* Player Profile & Settings Trigger */}
            {player && (
              <button
                onClick={() => setIsSettingsOpen(true)}
                className="flex items-center gap-2 p-1.5 sm:px-3 sm:py-1.5 rounded-xl bg-surface-elevated hover:bg-gray-800 border border-border transition-all group"
                title="Player Settings"
              >
                <div
                  className="w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold text-white shadow-sm"
                  style={{ backgroundColor: player.color }}
                >
                  {player.username.slice(0, 1).toUpperCase()}
                </div>
                <span className="text-xs font-semibold text-gray-200 hidden sm:inline truncate max-w-[100px]">
                  {player.username}
                </span>
                <Settings className="w-3.5 h-3.5 text-gray-400 group-hover:text-white transition-colors" />
              </button>
            )}
          </div>
        </div>
      </header>

      <PlayerSettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
      />
    </>
  );
};

