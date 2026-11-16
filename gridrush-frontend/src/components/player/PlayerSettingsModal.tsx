'use client';

import React, { useState } from 'react';
import { usePlayer } from '../../context/PlayerContext';
import { ConfirmModal } from '../ui/ConfirmModal';
import { X, RefreshCw, LogOut, ShieldCheck, Check, Copy } from 'lucide-react';

interface PlayerSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const PlayerSettingsModal: React.FC<PlayerSettingsModalProps> = ({ isOpen, onClose }) => {
  const { player, rotateRecoveryCode, logout } = usePlayer();
  const [isRotating, setIsRotating] = useState(false);
  const [rotatedCode, setRotatedCode] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Custom Confirmation Modals state
  const [showRotateConfirm, setShowRotateConfirm] = useState(false);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

  if (!isOpen || !player) return null;

  const executeRotate = async () => {
    setShowRotateConfirm(false);
    setIsRotating(true);
    setError(null);
    try {
      const newCode = await rotateRecoveryCode();
      setRotatedCode(newCode);
    } catch (err: any) {
      setError(err.message || 'Failed to rotate recovery code.');
    } finally {
      setIsRotating(false);
    }
  };

  const executeLogout = () => {
    setShowLogoutConfirm(false);
    logout();
    onClose();
  };

  const handleCopy = async (code: string) => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      setCopied(true);
    }
  };

  return (
    <>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm">
        <div className="w-full max-w-md bg-surface border border-border rounded-2xl p-6 shadow-2xl space-y-5 animate-pop">
          {/* Header */}
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-bold text-white">Player Settings</h3>
            <button
              onClick={onClose}
              className="p-1 rounded-lg text-gray-400 hover:text-white hover:bg-surface-elevated transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Player Profile Card */}
          <div className="p-4 bg-surface-elevated border border-border rounded-xl flex items-center gap-3">
            <div
              className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-sm shadow-md"
              style={{ backgroundColor: player.color }}
            >
              {player.username.slice(0, 2).toUpperCase()}
            </div>
            <div className="flex-1 min-w-0">
              <h4 className="text-sm font-semibold text-white truncate">{player.username}</h4>
              <p className="text-xs text-gray-400">
                Color: <span className="font-mono text-gray-300">{player.color}</span>
              </p>
            </div>
            <div className="text-right">
              <span className="text-xs text-gray-400">Captured</span>
              <p className="text-sm font-bold text-primary">{player.claimedCount} cells</p>
            </div>
          </div>

          {/* Rotated Code Alert */}
          {rotatedCode && (
            <div className="p-3.5 bg-emerald-500/10 border border-emerald-500/20 rounded-xl space-y-2">
              <div className="flex items-center gap-1.5 text-emerald-400 text-xs font-semibold">
                <ShieldCheck className="w-4 h-4" />
                <span>New Recovery Code Generated</span>
              </div>
              <div className="flex items-center justify-between gap-2 p-2.5 bg-surface rounded-lg border border-border">
                <code className="text-xs font-mono text-emerald-300 break-all select-all font-bold">
                  {rotatedCode}
                </code>
                <button
                  onClick={() => handleCopy(rotatedCode)}
                  className="p-1 text-gray-400 hover:text-white shrink-0"
                  title="Copy code"
                >
                  {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                </button>
              </div>
              <p className="text-xs text-gray-400">Your previous code is now permanently disabled.</p>
            </div>
          )}

          {error && (
            <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-xs">
              {error}
            </div>
          )}

          {/* Actions */}
          <div className="space-y-2 pt-2 border-t border-border">
            <button
              onClick={() => setShowRotateConfirm(true)}
              disabled={isRotating}
              className="w-full flex items-center justify-center gap-2 py-2.5 px-4 bg-surface-elevated hover:bg-gray-800 border border-border text-xs font-medium text-gray-200 rounded-xl transition-all"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isRotating ? 'animate-spin' : ''}`} />
              <span>Rotate Recovery Code</span>
            </button>

            <button
              onClick={() => setShowLogoutConfirm(true)}
              className="w-full flex items-center justify-center gap-2 py-2.5 px-4 bg-red-500/10 hover:bg-red-500/20 border border-red-500/20 text-xs font-medium text-red-400 rounded-xl transition-all"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Log Out</span>
            </button>
          </div>
        </div>
      </div>

      {/* Rotate Confirmation Modal */}
      <ConfirmModal
        isOpen={showRotateConfirm}
        title="Rotate Recovery Code?"
        message="Generating a new recovery code will immediately invalidate your existing key. Make sure to copy the new code to retain access to your player profile."
        type="rotate"
        confirmText="Yes, Rotate Code"
        cancelText="Cancel"
        isConfirming={isRotating}
        onConfirm={executeRotate}
        onCancel={() => setShowRotateConfirm(false)}
      />

      {/* Logout Confirmation Modal */}
      <ConfirmModal
        isOpen={showLogoutConfirm}
        title="Log Out of GridRush?"
        message="Logging out will clear your session cookie on this browser. Ensure you have your recovery code saved so you can log back in later."
        type="logout"
        confirmText="Log Out"
        cancelText="Stay Logged In"
        onConfirm={executeLogout}
        onCancel={() => setShowLogoutConfirm(false)}
      />
    </>
  );
};
