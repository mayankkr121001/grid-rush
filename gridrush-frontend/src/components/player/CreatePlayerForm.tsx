'use client';

import React, { useState } from 'react';
import { usePlayer } from '../../context/PlayerContext';
import { Sparkles, ArrowRight } from 'lucide-react';

export const CreatePlayerForm: React.FC = () => {
  const { createPlayer } = usePlayer();
  const [username, setUsername] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = username.trim();

    if (trimmed.length < 2) {
      setError('Username must be at least 2 characters.');
      return;
    }
    if (trimmed.length > 20) {
      setError('Username cannot exceed 20 characters.');
      return;
    }

    setError(null);
    setIsSubmitting(true);

    try {
      await createPlayer(trimmed);
    } catch (err: any) {
      setError(err.message || 'Failed to create player.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="username" className="block text-xs font-semibold text-gray-300 uppercase tracking-wider mb-2">
          Choose a Display Name
        </label>
        <div className="relative">
          <input
            id="username"
            type="text"
            value={username}
            onChange={(e) => {
              setUsername(e.target.value);
              if (error) setError(null);
            }}
            placeholder="e.g. PixelKnight, Nova99"
            maxLength={20}
            disabled={isSubmitting}
            className="w-full px-4 py-3 bg-surface-elevated border border-border rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-sm transition-all"
            autoFocus
          />
        </div>
        <p className="text-xs text-gray-500 mt-1.5">
          2–20 characters. You will be automatically assigned a unique color.
        </p>
      </div>

      {error && (
        <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-xs">
          {error}
        </div>
      )}

      <button
        type="submit"
        disabled={isSubmitting || username.trim().length < 2}
        className="w-full flex items-center justify-center gap-2 py-3 px-4 bg-primary hover:bg-primary-hover disabled:opacity-50 disabled:cursor-not-allowed text-white font-medium rounded-xl text-sm transition-all shadow-lg shadow-primary/20"
      >
        {isSubmitting ? (
          <span className="inline-block animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent" />
        ) : (
          <>
            <span>Join the Grid</span>
            <ArrowRight className="w-4 h-4" />
          </>
        )}
      </button>
    </form>
  );
};

