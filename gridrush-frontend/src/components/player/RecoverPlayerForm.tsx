'use client';

import React, { useState } from 'react';
import { usePlayer } from '../../context/PlayerContext';
import { KeyRound, ArrowRight } from 'lucide-react';

export const RecoverPlayerForm: React.FC = () => {
  const { recoverPlayer } = usePlayer();
  const [code, setCode] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = code.trim().toUpperCase();

    if (!trimmed) {
      setError('Please enter your recovery code.');
      return;
    }

    setError(null);
    setIsSubmitting(true);

    try {
      await recoverPlayer(trimmed);
    } catch (err: any) {
      setError(err.message || 'Invalid recovery code. Please check and try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="recoveryCode" className="block text-xs font-semibold text-gray-300 uppercase tracking-wider mb-2">
          Your Recovery Code
        </label>
        <div className="relative">
          <input
            id="recoveryCode"
            type="text"
            value={code}
            onChange={(e) => {
              setCode(e.target.value.toUpperCase());
              if (error) setError(null);
            }}
            placeholder="GR-XXXX-XXXX-XXXX-XXXX"
            disabled={isSubmitting}
            className="w-full font-mono px-4 py-3 bg-surface-elevated border border-border rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-sm tracking-wider uppercase transition-all"
            autoFocus
          />
        </div>
        <p className="text-xs text-gray-500 mt-1.5">
          Enter the recovery code given when you created your player.
        </p>
      </div>

      {error && (
        <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-xs">
          {error}
        </div>
      )}

      <button
        type="submit"
        disabled={isSubmitting || !code.trim()}
        className="w-full flex items-center justify-center gap-2 py-3 px-4 bg-primary hover:bg-primary-hover disabled:opacity-50 disabled:cursor-not-allowed text-white font-medium rounded-xl text-sm transition-all shadow-lg shadow-primary/20"
      >
        {isSubmitting ? (
          <span className="inline-block animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent" />
        ) : (
          <>
            <KeyRound className="w-4 h-4" />
            <span>Recover My Player</span>
            <ArrowRight className="w-4 h-4" />
          </>
        )}
      </button>
    </form>
  );
};

