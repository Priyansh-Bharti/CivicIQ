/**
 * Chat Panel Header Component
 * Displays the chat title, branding, and control buttons.
 */

import React from 'react';
import { X, RotateCcw } from 'lucide-react';
import { useTranslation } from '../../hooks/useTranslation';

interface ChatHeaderProps {
  /** Callback to clear the entire chat history. */
  onClear: () => void;
  /** Callback to close the chat panel. */
  onClose: () => void;
  /** Ref for the close button to handle initial focus. */
  closeBtnRef: React.RefObject<HTMLButtonElement>;
}

/**
 * Renders the header section of the chat panel.
 * @param {ChatHeaderProps} props Component properties.
 * @returns {React.JSX.Element} The rendered header.
 */
export const ChatHeader: React.FC<ChatHeaderProps> = ({ onClear, onClose, closeBtnRef }): React.JSX.Element => {
  const { t } = useTranslation();
  return (
    <div className="p-6 border-b border-gray-100 flex items-center justify-between bg-navy text-white">
      <div>
        <h2 className="text-xl font-hero">{t('chat.title')}</h2>
        <p className="text-[10px] text-white/60 uppercase tracking-widest font-bold">{t('chat.disclaimer')}</p>
      </div>
      <div className="flex items-center gap-2">
        <button 
          onClick={onClear}
          className="p-2 hover:bg-white/10 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-amber"
          aria-label="Clear chat"
        >
          <RotateCcw className="w-5 h-5" aria-hidden="true" />
        </button>
        <button 
          ref={closeBtnRef}
          onClick={onClose}
          className="p-2 hover:bg-white/10 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-amber"
          aria-label="Close chat"
        >
          <X className="w-6 h-6" aria-hidden="true" />
        </button>
      </div>
    </div>
  );
};
