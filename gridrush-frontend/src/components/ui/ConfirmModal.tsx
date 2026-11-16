'use client';

import React from 'react';
import { AlertTriangle, AlertCircle, Info, LogOut, RefreshCw, X } from 'lucide-react';

export type ModalType = 'danger' | 'warning' | 'info' | 'logout' | 'rotate';

interface ConfirmModalProps {
  isOpen: boolean;
  title: string;
  message: string;
  type?: ModalType;
  confirmText?: string;
  cancelText?: string;
  isConfirming?: boolean;
  isAlertOnly?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

export const ConfirmModal: React.FC<ConfirmModalProps> = ({
  isOpen,
  title,
  message,
  type = 'warning',
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  isConfirming = false,
  isAlertOnly = false,
  onConfirm,
  onCancel,
}) => {
  if (!isOpen) return null;

  const getIcon = () => {
    switch (type) {
      case 'danger':
        return <AlertTriangle className="w-6 h-6 text-red-400" />;
      case 'warning':
        return <AlertCircle className="w-6 h-6 text-amber-400" />;
      case 'rotate':
        return <RefreshCw className="w-6 h-6 text-primary" />;
      case 'logout':
        return <LogOut className="w-6 h-6 text-red-400" />;
      default:
        return <Info className="w-6 h-6 text-blue-400" />;
    }
  };

  const getIconBg = () => {
    switch (type) {
      case 'danger':
      case 'logout':
        return 'bg-red-500/10 border-red-500/20';
      case 'warning':
        return 'bg-amber-500/10 border-amber-500/20';
      case 'rotate':
        return 'bg-primary/10 border-primary/20';
      default:
        return 'bg-blue-500/10 border-blue-500/20';
    }
  };

  const getConfirmButtonClasses = () => {
    if (type === 'danger' || type === 'logout') {
      return 'bg-red-600 hover:bg-red-500 text-white shadow-lg shadow-red-600/20';
    }
    return 'bg-primary hover:bg-primary-hover text-white shadow-lg shadow-primary/20';
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-md animate-fade-in"
      onClick={onCancel}
    >
      <div
        className="w-full max-w-sm bg-surface border border-border rounded-2xl p-6 shadow-2xl space-y-5 animate-pop"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
      >
        {/* Header with Icon */}
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className={`p-2.5 rounded-xl border ${getIconBg()}`}>
              {getIcon()}
            </div>
            <h3 id="modal-title" className="text-base font-bold text-white tracking-tight">
              {title}
            </h3>
          </div>
          <button
            onClick={onCancel}
            className="p-1 rounded-lg text-gray-400 hover:text-white hover:bg-surface-elevated transition-colors"
            title="Close"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Message */}
        <p className="text-xs sm:text-sm text-gray-300 leading-relaxed">
          {message}
        </p>

        {/* Actions */}
        <div className="flex items-center justify-end gap-2.5 pt-2">
          {!isAlertOnly && (
            <button
              type="button"
              onClick={onCancel}
              disabled={isConfirming}
              className="flex-1 py-2.5 px-4 bg-surface-elevated hover:bg-gray-800 border border-border text-xs font-semibold text-gray-300 rounded-xl transition-all"
            >
              {cancelText}
            </button>
          )}

          <button
            type="button"
            onClick={onConfirm}
            disabled={isConfirming}
            className={`${isAlertOnly ? 'w-full' : 'flex-1'} py-2.5 px-4 font-semibold rounded-xl text-xs transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-1.5 ${getConfirmButtonClasses()}`}
          >
            {isConfirming ? (
              <span className="inline-block animate-spin rounded-full h-3.5 w-3.5 border-2 border-white border-t-transparent" />
            ) : (
              confirmText
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

