'use client';

import React, { useState } from 'react';
import { usePlayer } from '../../context/PlayerContext';
import { ShieldAlert, Copy, Check, ArrowRight } from 'lucide-react';

export const RecoveryCodeScreen: React.FC = () => {
  const { rawRecoveryCode, dismissRecoveryCode, player } = usePlayer();
  const [copied, setCopied] = useState(false);
  const [hasConfirmed, setHasConfirmed] = useState(false);

  if (!rawRecoveryCode) return null;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(rawRecoveryCode);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch {
      // Fallback
      setCopied(true);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-md">
      <div className="w-full max-w-lg bg-surface border border-border rounded-2xl p-6 sm:p-8 shadow-2xl space-y-6 animate-pop">
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="inline-flex p-3 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/20 mb-1">
            <ShieldAlert className="w-6 h-6" />
          </div>
          <h2 className="text-2xl font-bold text-white tracking-tight">
            Save Your Recovery Code
          </h2>
          <p className="text-sm text-gray-400">
            Welcome, <span className="font-semibold text-white">{player?.username}</span>! This code is your only key to access your player identity from another browser or device.
          </p>
        </div>

        {/* Warning Banner */}
        <div className="p-3.5 bg-amber-500/10 border border-amber-500/20 rounded-xl text-amber-300 text-xs leading-relaxed">
          <strong>Important:</strong> We do not store this raw code on our servers. It cannot be recovered or displayed again once you close this screen.
        </div>

        {/* The Code Card */}
        <div className="space-y-2">
          <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
            One-Time Recovery Key
          </label>
          <div className="flex items-center justify-between gap-3 p-3.5 bg-surface-elevated border border-border rounded-xl">
            <code className="font-mono text-sm sm:text-base text-primary font-bold tracking-wider select-all break-all">
              {rawRecoveryCode}
            </code>
            <button
              onClick={handleCopy}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-surface hover:bg-surface-elevated text-xs font-medium text-gray-200 border border-border hover:border-gray-500 transition-all shrink-0"
              title="Copy to clipboard"
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                  <span className="text-emerald-400">Copied!</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  <span>Copy</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Confirmation Checkbox */}
        <label className="flex items-start gap-3 cursor-pointer select-none text-xs text-gray-300">
          <input
            type="checkbox"
            checked={hasConfirmed}
            onChange={(e) => setHasConfirmed(e.target.checked)}
            className="mt-0.5 h-4 w-4 rounded border-gray-600 bg-surface-elevated text-primary focus:ring-primary focus:ring-offset-surface"
          />
          <span>
            I have copied and safely saved this recovery code in a safe location.
          </span>
        </label>

        {/* Enter Grid Button */}
        <button
          onClick={dismissRecoveryCode}
          disabled={!hasConfirmed}
          className="w-full flex items-center justify-center gap-2 py-3 px-4 bg-primary hover:bg-primary-hover disabled:opacity-40 disabled:cursor-not-allowed text-white font-medium rounded-xl text-sm transition-all shadow-lg shadow-primary/20"
        >
          <span>Continue to Grid Board</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

