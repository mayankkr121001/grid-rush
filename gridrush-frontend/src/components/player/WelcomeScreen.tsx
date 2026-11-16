'use client';

import React, { useState } from 'react';
import { CreatePlayerForm } from './CreatePlayerForm';
import { RecoverPlayerForm } from './RecoverPlayerForm';
import { LayoutGrid, Sparkles, KeyRound } from 'lucide-react';

export const WelcomeScreen: React.FC = () => {
  const [mode, setMode] = useState<'create' | 'recover'>('create');

  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-4 sm:p-6 bg-background">
      <div className="w-full max-w-md bg-surface border border-border rounded-2xl p-6 sm:p-8 shadow-2xl space-y-6">
        {/* Brand Logo & Headline */}
        <div className="text-center space-y-2">
          <div className="inline-flex p-3 rounded-2xl bg-primary/10 text-primary border border-primary/20 mb-1">
            <LayoutGrid className="w-8 h-8" />
          </div>
          <h1 className="text-3xl font-extrabold text-white tracking-tight">
            Grid<span className="text-primary">Rush</span>
          </h1>
          <p className="text-xs sm:text-sm text-gray-400">
            A real-time multiplayer territory battle on a 400-block live canvas.
          </p>
        </div>

        {/* Mode Switch Tabs */}
        <div className="flex p-1 bg-surface-elevated rounded-xl border border-border">
          <button
            onClick={() => setMode('create')}
            className={`flex-1 flex items-center justify-center gap-1.5 py-2 text-xs font-semibold rounded-lg transition-all ${
              mode === 'create'
                ? 'bg-primary text-white shadow-md'
                : 'text-gray-400 hover:text-gray-200'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>New Player</span>
          </button>
          <button
            onClick={() => setMode('recover')}
            className={`flex-1 flex items-center justify-center gap-1.5 py-2 text-xs font-semibold rounded-lg transition-all ${
              mode === 'recover'
                ? 'bg-primary text-white shadow-md'
                : 'text-gray-400 hover:text-gray-200'
            }`}
          >
            <KeyRound className="w-3.5 h-3.5" />
            <span>Recover Account</span>
          </button>
        </div>

        {/* Tab Forms */}
        {mode === 'create' ? <CreatePlayerForm /> : <RecoverPlayerForm />}

        {/* Footer info */}
        <div className="pt-2 text-center text-xs text-gray-500 border-t border-border">
          No passwords or emails required. Instant real-time play.
        </div>
      </div>
    </div>
  );
};

