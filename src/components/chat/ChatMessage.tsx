/**
 * Chat Message Component
 * Renders individual messages within the chat history, distinguishing between user and AI roles.
 */

import React from 'react';
import { motion } from 'framer-motion';
import { ChatMessage as ChatMessageType } from '../../types/election';
import { useAuth } from '../../hooks/useAuth';
import { clsx, ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

/**
 * Utility for merging Tailwind CSS classes efficiently.
 * @param {...ClassValue[]} inputs Array of class values.
 * @returns {string} Merged class string.
 */
function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}

interface ChatMessageProps {
  /** The message data to render. */
  message: ChatMessageType;
}

/**
 * Renders a stylized icon for the CivicIQ assistant.
 */
const CivicIQLogo: React.FC = (): React.JSX.Element => (
  <div className="w-8 h-8 bg-navy rounded-full flex items-center justify-center text-amber shrink-0">
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M12 17V17.01" stroke="currentColor" strokeWidth="3" strokeLinecap="round"/>
      <path d="M12 14C12.5523 14 13 13.5523 13 13C13 12.4477 12.5523 12 12 12C11.4477 12 11 12.4477 11 13C11 13.5523 11.4477 14 12 14Z" fill="currentColor"/>
      <path d="M19 3H5C3.89543 3 3 3.89543 3 5V19C3 20.1046 3.89543 21 5 21H19C20.1046 21 21 20.1046 21 19V5C21 3.89543 20.1046 3 19 3Z" stroke="currentColor" strokeWidth="2"/>
    </svg>
  </div>
);

/**
 * Renders an individual chat message bubble.
 * @param {ChatMessageProps} props Component properties.
 * @returns {React.JSX.Element} The rendered message.
 */
export const ChatMessage: React.FC<ChatMessageProps> = ({ message }): React.JSX.Element => {
  const { user } = useAuth();
  const isAI = message.role === 'model';

  return (
    <motion.div
      initial={{ opacity: 0, x: isAI ? -20 : 20 }}
      animate={{ opacity: 1, x: 0 }}
      role="listitem"
      className={cn(
        "flex gap-3 mb-6",
        !isAI && "flex-row-reverse"
      )}
    >
      {isAI ? (
        <CivicIQLogo />
      ) : (
        <img 
          src={user?.photoURL || undefined} 
          alt={user?.displayName || 'User'} 
          className="w-8 h-8 rounded-full border border-gray-200 shrink-0" 
        />
      )}
      
      <div className={cn(
        "max-w-[80%] flex flex-col",
        !isAI && "items-end"
      )}>
        <div 
          role="log"
          aria-label={isAI ? "CivicIQ message" : "Your message"}
          className={cn(
            "px-4 py-3 rounded-2xl text-sm leading-relaxed",
            isAI 
              ? "bg-gray-100 text-on-surface rounded-tl-none" 
              : "bg-indigo text-white rounded-tr-none shadow-md"
          )}
        >
          {message.content === '...' ? (
            <div className="flex gap-1 py-1" aria-label="Thinking...">
              <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" />
              <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce [animation-delay:0.2s]" />
              <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce [animation-delay:0.4s]" />
            </div>
          ) : (
            message.content
          )}
        </div>
        <span className="text-[10px] text-gray-400 mt-1 uppercase tracking-wider">
          {new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </span>
      </div>
    </motion.div>
  );
};
