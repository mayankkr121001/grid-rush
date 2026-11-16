'use client';

import React from 'react';
import { LeaderboardEntry } from '../../types';
import { usePlayer } from '../../context/PlayerContext';
import { Trophy, Medal } from 'lucide-react';

interface LeaderboardProps {
  entries: LeaderboardEntry[];
  isLoading?: boolean;
}

export const Leaderboard: React.FC<LeaderboardProps> = ({ entries, isLoading }) => {
  const { player } = usePlayer();

  return (
    <div className="bg-surface border border-border rounded-2xl p-4 sm:p-5 shadow-sm space-y-4">
      {/* Title */}
      <div className="flex items-center justify-between pb-3 border-b border-border">
        <div className="flex items-center gap-2 text-white font-bold text-sm">
          <Trophy className="w-4 h-4 text-amber-400" />
          <span>Leaderboard</span>
        </div>
        <span className="text-[11px] font-medium text-gray-500 uppercase tracking-wider">
          Top Capturers
        </span>
      </div>

      {/* List */}
      {isLoading ? (
        <div className="space-y-2 py-4">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="h-8 bg-surface-elevated animate-pulse rounded-lg" />
          ))}
        </div>
      ) : entries.length === 0 ? (
        <div className="py-8 text-center text-xs text-gray-500">
          No cells captured yet. Be the first to claim a block!
        </div>
      ) : (
        <div className="space-y-1.5 max-h-[360px] overflow-y-auto pr-1">
          {entries.map((entry, index) => {
            const isMe = player?.id === entry.id;

            return (
              <div
                key={entry.id}
                className={`flex items-center justify-between p-2 rounded-xl text-xs transition-all ${
                  isMe
                    ? 'bg-primary/10 border border-primary/30 text-white font-semibold'
                    : 'hover:bg-surface-elevated text-gray-300'
                }`}
              >
                {/* Rank & User */}
                <div className="flex items-center gap-2.5 min-w-0">
                  <span className="w-5 text-center font-bold text-gray-400">
                    {index === 0 ? (
                      <span className="text-amber-400 text-sm">🥇</span>
                    ) : index === 1 ? (
                      <span className="text-slate-300 text-sm">🥈</span>
                    ) : index === 2 ? (
                      <span className="text-amber-600 text-sm">🥉</span>
                    ) : (
                      `#${index + 1}`
                    )}
                  </span>
                  <div
                    className="w-3.5 h-3.5 rounded-full shrink-0 shadow-sm"
                    style={{ backgroundColor: entry.color }}
                  />
                  <span className="truncate">
                    {entry.username} {isMe && <span className="text-[10px] text-primary font-bold">(You)</span>}
                  </span>
                </div>

                {/* Score */}
                <div className="font-mono font-bold text-gray-200 shrink-0">
                  {entry.claimedCount} <span className="text-[10px] font-normal text-gray-500">cells</span>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

