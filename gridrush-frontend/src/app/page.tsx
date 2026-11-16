'use client';

import React from 'react';
import { PlayerProvider, usePlayer } from '../context/PlayerContext';
import { SocketProvider, useSocket } from '../context/SocketContext';
import { useBoard } from '../hooks/useBoard';
import { Header } from '../components/layout/Header';
import { WelcomeScreen } from '../components/player/WelcomeScreen';
import { RecoveryCodeScreen } from '../components/player/RecoveryCodeScreen';
import { StatsOverview } from '../components/dashboard/StatsOverview';
import { Leaderboard } from '../components/dashboard/Leaderboard';
import { BoardLegend } from '../components/board/BoardLegend';
import { GridBoard } from '../components/board/GridBoard';
import { ConfirmModal } from '../components/ui/ConfirmModal';
import { AlertCircle, Keyboard } from 'lucide-react';

function GridRushDashboard() {
  const { connectionStatus, onlineCount } = useSocket();
  const {
    cells,
    stats,
    leaderboard,
    isLoading,
    pendingCellId,
    recentlyCapturedIds,
    conflictToast,
    claimError,
    clearClaimError,
    claimCell,
  } = useBoard();

  return (
    <div className="min-h-screen flex flex-col bg-background text-gray-100">
      {/* Recovery Code Screen (Displayed once when code is active) */}
      <RecoveryCodeScreen />

      {/* Header Bar */}
      <Header onlineCount={onlineCount} connectionStatus={connectionStatus} />

      {/* Error Alert Modal */}
      <ConfirmModal
        isOpen={!!claimError}
        title="Action Failed"
        message={claimError || ''}
        type="danger"
        isAlertOnly={true}
        confirmText="Understood"
        onConfirm={clearClaimError}
        onCancel={clearClaimError}
      />

      {/* Conflict Toast Alert with Shake Animation */}
      {conflictToast && (
        <div className="fixed top-16 left-1/2 -translate-x-1/2 z-50 animate-shake">
          <div className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-red-600/95 text-white text-xs font-semibold shadow-2xl backdrop-blur-md border border-red-400/40">
            <AlertCircle className="w-4 h-4 text-white shrink-0" />
            <span>{conflictToast}</span>
          </div>
        </div>
      )}

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 space-y-6">
        {/* Metric Cards HUD */}
        <StatsOverview stats={stats} />

        {/* Legend */}
        <BoardLegend />

        {/* Two-Column Layout: Grid on Left, Leaderboard & Rules on Right */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          <div className="lg:col-span-8 flex justify-center">
            <GridBoard
              cells={cells}
              pendingCellId={pendingCellId}
              recentlyCapturedIds={recentlyCapturedIds}
              onClaim={claimCell}
              isLoading={isLoading}
            />
          </div>

          <div className="lg:col-span-4 space-y-4">
            <Leaderboard entries={leaderboard} />

            {/* Quick Rules & Keyboard Accessibility Info */}
            <div className="p-4 bg-surface border border-border rounded-2xl text-xs text-gray-400 space-y-3 shadow-sm">
              <h4 className="font-semibold text-white flex items-center gap-1.5">
                <Keyboard className="w-3.5 h-3.5 text-primary" />
                <span>Controls & Rules</span>
              </h4>
              <ul className="list-disc list-inside space-y-1.5 text-gray-300">
                <li>Click any neutral block or use <strong className="text-white">Arrow keys + Enter/Space</strong> to claim.</li>
                <li>Once claimed, a block is permanently yours.</li>
                <li>All active players see your captures in real time!</li>
              </ul>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

function MainContent() {
  const { isAuthenticated, isLoading } = usePlayer();

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-3">
          <span className="inline-block animate-spin rounded-full h-8 w-8 border-2 border-primary border-t-transparent" />
          <p className="text-sm text-gray-400 font-medium">Connecting to GridRush...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <WelcomeScreen />;
  }

  return (
    <SocketProvider>
      <GridRushDashboard />
    </SocketProvider>
  );
}

export default function Page() {
  return (
    <PlayerProvider>
      <MainContent />
    </PlayerProvider>
  );
}
