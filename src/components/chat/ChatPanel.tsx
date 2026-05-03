/**
 * Chat Panel Component
 * Acts as the main container for the AI chat interface, providing animations, focus trapping, and layout.
 */

import React, { useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShieldCheck } from 'lucide-react';
import { ChatHeader } from './ChatHeader';
import { MessageList } from './MessageList';
import { ChatInput } from './ChatInput';
import { useChatStore } from '../../store/chatStore';
import { useGemini } from '../../hooks/useGemini';

/**
 * Renders the sliding chat panel with the AI assistant.
 * @returns {React.JSX.Element} The rendered chat panel.
 */
export const ChatPanel: React.FC = (): React.JSX.Element => {
  const { isOpen, setIsOpen, activeContext, setActiveContext } = useChatStore();
  const { messages, sendMessage, isLoading, clearChat, error } = useGemini();
  const scrollRef = useRef<HTMLDivElement>(null!);
  const closeBtnRef = useRef<HTMLButtonElement>(null!);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isLoading]);

  const handleClose = (): void => {
    setIsOpen(false);
    setActiveContext(null);
  };

  /**
   * Auto-focus the close button when the panel opens for accessibility.
   */
  useEffect(() => {
    if (isOpen && closeBtnRef.current) {
      setTimeout(() => { closeBtnRef.current?.focus(); }, 100);
    }
  }, [isOpen]);

  /**
   * Implements a focus trap and escape key handler when the panel is open.
   */
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent): void => {
      if (e.key === 'Escape') handleClose();
      if (e.key === 'Tab') {
        const elements = scrollRef.current?.parentElement?.querySelectorAll(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );
        if (!elements || elements.length === 0) return;
        
        const first = elements[0] as HTMLElement;
        const last = elements[elements.length - 1] as HTMLElement;

        if (e.shiftKey && document.activeElement === first) {
          last.focus();
          e.preventDefault();
        } else if (!e.shiftKey && document.activeElement === last) {
          first.focus();
          e.preventDefault();
        }
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => { document.removeEventListener('keydown', handleKeyDown); };
  }, [isOpen]);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ x: '100%' }}
          animate={{ x: 0 }}
          exit={{ x: '100%' }}
          transition={{ type: 'spring', damping: 25, stiffness: 200 }}
          className="fixed top-0 right-0 w-full md:w-[450px] h-full bg-white shadow-2xl z-[100] flex flex-col"
          role="dialog"
          aria-label="Ask CivicIQ Chat"
        >
          <ChatHeader onClear={clearChat} onClose={handleClose} closeBtnRef={closeBtnRef} />

          {activeContext && (
            <div className="bg-amber/10 border-b border-amber/20 p-3 px-6 flex items-center gap-3">
              <ShieldCheck className="w-4 h-4 text-amber" aria-hidden="true" />
              <p className="text-xs text-navy font-medium">
                Asking about: <span className="font-bold">{activeContext}</span>
              </p>
            </div>
          )}

          <MessageList messages={messages} isLoading={isLoading} error={error} scrollRef={scrollRef} />

          <div className="flex flex-col">
            <p className="text-[10px] text-gray-400 text-center py-2 bg-gray-50 border-t border-gray-100">
              AI can make mistakes. CivicIQ only covers election processes.
            </p>
            <ChatInput onSendMessage={sendMessage} isLoading={isLoading} />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
