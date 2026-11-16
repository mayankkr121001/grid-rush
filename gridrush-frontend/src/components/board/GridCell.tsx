'use client';

import React, { memo } from 'react';
import { Cell } from '../../types';
import { usePlayer } from '../../context/PlayerContext';

interface GridCellProps {
  cell: Cell;
  isPending: boolean;
  isJustCaptured?: boolean;
  onClaim: (cellId: number) => void;
}

export const GridCell: React.FC<GridCellProps> = memo(({
  cell,
  isPending,
  isJustCaptured,
  onClaim,
}) => {
  const { player } = usePlayer();
  const isClaimed = cell.owner !== null;
  const isMine = isClaimed && player?.id === cell.owner?.id;

  const handleClick = () => {
    if (isClaimed || isPending) return;
    onClaim(cell.cellId);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if ((e.key === 'Enter' || e.key === ' ') && !isClaimed && !isPending) {
      e.preventDefault();
      onClaim(cell.cellId);
    }
  };

  const titleTooltip = isClaimed
    ? `Block #${cell.cellId} (Row ${cell.row + 1}, Col ${cell.column + 1})\nCaptured by: ${cell.owner?.username} ${isMine ? '(You)' : ''}`
    : `Block #${cell.cellId} (Row ${cell.row + 1}, Col ${cell.column + 1})\nStatus: Available — Click or Press Enter/Space to claim!`;

  return (
    <button
      type="button"
      data-cell-id={cell.cellId}
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      disabled={isClaimed || isPending}
      title={titleTooltip}
      aria-label={titleTooltip}
      className={`relative aspect-square w-full rounded-md transition-all duration-200 select-none group focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-1 focus-visible:ring-offset-background focus-visible:z-20 ${
        isJustCaptured ? 'animate-pop ring-2 ring-white shadow-lg shadow-white/30 z-10' : ''
      } ${
        isPending
          ? 'bg-amber-400/40 border-2 border-amber-400 animate-pulse scale-95 shadow-md shadow-amber-400/20'
          : isClaimed
          ? 'border border-black/30 shadow-sm cursor-default hover:brightness-110'
          : 'bg-surface-elevated/80 border border-gray-800/80 hover:bg-gray-700 hover:border-gray-500 hover:scale-105 active:scale-95 cursor-pointer'
      }`}
      style={{
        backgroundColor: isClaimed ? cell.owner?.color : undefined,
      }}
    >
      {/* Visual ripple beacon when freshly captured */}
      {isJustCaptured && (
        <span className="absolute inset-0 rounded-md bg-white/40 animate-ping pointer-events-none" />
      )}

      {/* Available cell center guide */}
      {!isClaimed && !isPending && (
        <span className="absolute inset-0 m-auto w-1.5 h-1.5 rounded-full bg-gray-600/30 group-hover:bg-primary transition-colors opacity-0 group-hover:opacity-100" />
      )}

      {/* Indicator crown for blocks you own */}
      {isMine && (
        <span className="absolute top-0.5 right-0.5 w-1.5 h-1.5 rounded-full bg-white shadow-sm ring-1 ring-black/20" />
      )}
    </button>
  );
});

GridCell.displayName = 'GridCell';
