'use client';

import React from 'react';
import { BoardStats } from '../../types';
import { usePlayer } from '../../context/PlayerContext';
import { Grid, Flag, CheckCircle2, Shield } from 'lucide-react';

interface StatsOverviewProps {
  stats: BoardStats;
}

export const StatsOverview: React.FC<StatsOverviewProps> = ({ stats }) => {
  const { player } = usePlayer();
  const claimedPercent = stats.total > 0 ? Math.round((stats.claimed / stats.total) * 100) : 0;
  const myPercent = stats.total > 0 && player ? Math.round((player.claimedCount / stats.total) * 100) : 0;

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
      {/* Total Cells */}
      <div className="p-4 bg-surface border border-border rounded-2xl flex items-center gap-3 shadow-sm">
        <div className="p-2.5 rounded-xl bg-blue-500/10 text-blue-400 border border-blue-500/20">
          <Grid className="w-5 h-5" />
        </div>
        <div>
          <span className="text-[11px] font-medium text-gray-400 uppercase tracking-wider">Total Grid</span>
          <p className="text-xl font-bold text-white tracking-tight">{stats.total} <span className="text-xs text-gray-500 font-normal">cells</span></p>
        </div>
      </div>

      {/* Claimed Cells */}
      <div className="p-4 bg-surface border border-border rounded-2xl flex items-center gap-3 shadow-sm">
        <div className="p-2.5 rounded-xl bg-purple-500/10 text-purple-400 border border-purple-500/20">
          <Flag className="w-5 h-5" />
        </div>
        <div>
          <span className="text-[11px] font-medium text-gray-400 uppercase tracking-wider">Claimed</span>
          <p className="text-xl font-bold text-white tracking-tight">
            {stats.claimed} <span className="text-xs text-purple-400 font-normal">({claimedPercent}%)</span>
          </p>
        </div>
      </div>

      {/* Available Cells */}
      <div className="p-4 bg-surface border border-border rounded-2xl flex items-center gap-3 shadow-sm">
        <div className="p-2.5 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
          <CheckCircle2 className="w-5 h-5" />
        </div>
        <div>
          <span className="text-[11px] font-medium text-gray-400 uppercase tracking-wider">Available</span>
          <p className="text-xl font-bold text-white tracking-tight">{stats.available} <span className="text-xs text-gray-500 font-normal">left</span></p>
        </div>
      </div>

      {/* My Territory */}
      <div className="p-4 bg-surface border border-border rounded-2xl flex items-center gap-3 shadow-sm">
        <div
          className="p-2.5 rounded-xl text-white shadow-sm flex items-center justify-center font-bold text-sm"
          style={{ backgroundColor: player?.color || '#6366F1' }}
        >
          <Shield className="w-5 h-5" />
        </div>
        <div>
          <span className="text-[11px] font-medium text-gray-400 uppercase tracking-wider">My Territory</span>
          <p className="text-xl font-bold text-white tracking-tight">
            {player?.claimedCount || 0} <span className="text-xs text-gray-400 font-normal">({myPercent}%)</span>
          </p>
        </div>
      </div>
    </div>
  );
};

