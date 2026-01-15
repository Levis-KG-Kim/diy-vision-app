import React from 'react';
import { AlertCircle } from 'lucide-react';

interface ErrorAlertProps {
  message: string;
  onClose?: () => void;
}

export function ErrorAlert({ message, onClose }: ErrorAlertProps) {
  return (
    <div className="fixed bottom-6 right-6 bg-red-50 border border-red-200 rounded-lg p-4 shadow-lg max-w-md z-50">
      <div className="flex items-start gap-3">
        <AlertCircle size={20} className="text-red-500 mt-0.5 flex-shrink-0" />
        <div className="flex-1 min-w-0">
          <h4 className="font-medium text-red-900 text-sm">Error</h4>
          <p className="text-sm text-red-700 mt-1">{message}</p>
        </div>
        {onClose && (
          <button
            onClick={onClose}
            className="text-red-400 hover:text-red-600 text-xl leading-none flex-shrink-0"
            aria-label="Close"
          >
            ×
          </button>
        )}
      </div>
    </div>
  );
}