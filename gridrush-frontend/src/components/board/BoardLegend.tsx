'use client';

import React from 'react';
import { usePlayer } from '../../context/PlayerContext';

export const BoardLegend: React.FC = () => {
  const { player } = usePlayer();

  return (
    <div className="flex flex-wrap items-center justify-between gap-3 p-3 bg-surface border border-border rounded-xl text-xs text-gray-400">
      <div className="flex items-center gap-2">
        <div className="w-3.5 h-3.5 rounded bg-surface-elevated border border-gray-700" />
        <span>Unclaimed</span>
      </div>

      <div className="flex items-center gap-2">
        <div
          className="w-3.5 h-3.5 rounded border border-white/20 shadow-sm"
          style={{ backgroundColor: player?.color || '#3B82F6' }}
        />
        <span>Your Blocks ({player?.username || 'You'})</span>
      </div>

      <div className="flex items-center gap-2">
        <div className="w-3.5 h-3.5 rounded bg-purple-500 border border-purple-400/30" />
        <span>Opponent Blocks</span>
      </div>

      <div className="flex items-center gap-2">
        <div className="w-3.5 h-3.5 rounded bg-amber-400/40 border border-amber-400 animate-pulse" />
        <span>Claiming...</span>
      </div>
    </div>
  );
};

