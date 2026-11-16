'use client';

import React, { useRef } from 'react';
import { Cell } from '../../types';
import { GridCell } from './GridCell';

interface GridBoardProps {
  cells: Cell[];
  pendingCellId: number | null;
  recentlyCapturedIds: Set<number>;
  onClaim: (cellId: number) => void;
  isLoading?: boolean;
}

const GRID_SIZE = 20;
const TOTAL_CELLS = 400;

export const GridBoard: React.FC<GridBoardProps> = ({
  cells,
  pendingCellId,
  recentlyCapturedIds,
  onClaim,
  isLoading,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);

  // Keyboard navigation across the 20x20 grid
  const handleKeyDown = (e: React.KeyboardEvent) => {
    const activeElement = document.activeElement as HTMLElement;
    if (!activeElement || !activeElement.hasAttribute('data-cell-id')) return;

    const currentId = parseInt(activeElement.getAttribute('data-cell-id') || '-1', 10);
    if (currentId < 0) return;

    let targetId = -1;

    switch (e.key) {
      case 'ArrowUp':
        e.preventDefault();
        targetId = currentId - GRID_SIZE;
        break;
      case 'ArrowDown':
        e.preventDefault();
        targetId = currentId + GRID_SIZE;
        break;
      case 'ArrowLeft':
        e.preventDefault();
        if (currentId % GRID_SIZE !== 0) targetId = currentId - 1;
        break;
      case 'ArrowRight':
        e.preventDefault();
        if ((currentId + 1) % GRID_SIZE !== 0) targetId = currentId + 1;
        break;
      default:
        return;
    }

    if (targetId >= 0 && targetId < TOTAL_CELLS && containerRef.current) {
      const targetBtn = containerRef.current.querySelector<HTMLButtonElement>(
        `[data-cell-id="${targetId}"]`
      );
      if (targetBtn) {
        targetBtn.focus();
      }
    }
  };

  if (isLoading) {
    return (
      <div className="w-full aspect-square max-w-[640px] mx-auto p-4 bg-surface border border-border rounded-2xl flex items-center justify-center">
        <div className="flex flex-col items-center gap-3 text-gray-400 text-sm">
          <span className="inline-block animate-spin rounded-full h-8 w-8 border-2 border-primary border-t-transparent" />
          <span>Synchronizing 400 grid cells...</span>
        </div>
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      onKeyDown={handleKeyDown}
      tabIndex={0}
      aria-label="Interactive 400-cell game board. Use mouse or arrow keys to navigate, Space or Enter to capture."
      className="w-full max-w-[640px] mx-auto p-2 sm:p-4 bg-surface border border-border rounded-2xl shadow-xl focus:outline-none focus:ring-1 focus:ring-primary/40"
    >
      <div
        className="grid gap-1 sm:gap-1.5 w-full aspect-square"
        style={{
          gridTemplateColumns: 'repeat(20, minmax(0, 1fr))',
          gridTemplateRows: 'repeat(20, minmax(0, 1fr))',
        }}
      >
        {cells.map((cell) => (
          <GridCell
            key={cell.cellId}
            cell={cell}
            isPending={pendingCellId === cell.cellId}
            isJustCaptured={recentlyCapturedIds.has(cell.cellId)}
            onClaim={onClaim}
          />
        ))}
      </div>
    </div>
  );
};
