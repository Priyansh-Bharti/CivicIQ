/**
 * Chat Input Component
 * Provides a text area for users to interact with the AI assistant, featuring auto-expansion and character limits.
 */

import React, { useState, useRef, useEffect } from 'react';
import { Send, Mic } from 'lucide-react';
import { clsx } from 'clsx';

interface ChatInputProps {
  /** Callback function to send the user's message. */
  onSendMessage: (content: string) => void;
  /** Indicates if the AI is currently processing a response. */
  isLoading: boolean;
}

/**
 * Renders an auto-expanding textarea for chat input.
 * @param {ChatInputProps} props Component properties.
 * @returns {React.JSX.Element} The rendered input area.
 */
export const ChatInput: React.FC<ChatInputProps> = ({ onSendMessage, isLoading }): React.JSX.Element => {
  const [content, setContent] = useState<string>('');
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  /**
   * Triggers the message sending logic if the content is valid.
   */
  const handleSend = (): void => {
    if (content.trim() && !isLoading && content.length <= 500) {
      onSendMessage(content.trim());
      setContent('');
    }
  };

  /**
   * Handles keyboard interactions, allowing Enter (without Shift) to send the message.
   */
  const handleKeyDown = (e: React.KeyboardEvent): void => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  /**
   * Dynamically adjusts the textarea height based on its content.
   */
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 120)}px`;
    }
  }, [content]);

  return (
    <div className="p-4 bg-white border-t border-gray-100">
      <div className="flex justify-center mb-3">
        <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-navy/5 text-navy/60 rounded-full text-[10px] font-bold uppercase tracking-widest border border-navy/10">
          <span className="w-1.5 h-1.5 bg-emerald rounded-full animate-pulse" />
          🛡️ Non-partisan · Factual only
        </span>
      </div>
      <div className="relative bg-gray-50 rounded-xl border border-gray-200 focus-within:border-indigo transition-colors p-2">
        <textarea
          ref={textareaRef}
          value={content}
          onChange={(e) => { setContent(e.target.value); }}
          onKeyDown={handleKeyDown}
          placeholder="Ask CivicIQ your election question..."
          aria-label="Message CivicIQ"
          maxLength={500}
          className="w-full bg-transparent border-none focus:ring-0 text-sm resize-none py-2 px-2 max-h-[120px] custom-scrollbar"
          rows={1}
          disabled={isLoading}
        />
        
        <div className="flex items-center justify-between mt-2 px-2">
          <span className={clsx(
            "text-[10px] font-bold uppercase tracking-widest",
            content.length > 500 ? "text-error" : "text-gray-400"
          )}>
            {content.length}/500
          </span>
          
          <div className="flex items-center gap-2">
            <button className="p-2 text-gray-400 hover:text-indigo transition-colors" aria-label="Voice input">
              <Mic className="w-5 h-5" />
            </button>
            <button
              onClick={handleSend}
              disabled={isLoading || !content.trim() || content.length > 500}
              aria-disabled={isLoading || !content.trim() || content.length > 500}
              aria-label="Send message"
              className={clsx(
                "p-2 rounded-lg transition-all",
                content.trim() && !isLoading 
                  ? "bg-indigo text-white shadow-md hover:scale-105" 
                  : "bg-gray-200 text-gray-400"
              )}
            >
              <Send className="w-5 h-5" aria-hidden="true" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
