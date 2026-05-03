/**
 * Message List Component
 * Renders the scrollable list of chat messages and the empty state.
 */

import React from 'react';
import { ShieldCheck } from 'lucide-react';
import { ChatMessage as MessageComponent } from './ChatMessage';
import { ChatMessage } from '../../types/election';
import { useTranslation } from '../../hooks/useTranslation';

interface MessageListProps {
  /** Array of messages to display. */
  messages: ChatMessage[];
  /** Loading state indicator. */
  isLoading: boolean;
  /** Error message if any. */
  error: string | null;
  /** Ref for the scrollable container. */
  scrollRef: React.RefObject<HTMLDivElement>;
}

/**
 * Renders the list of messages or an empty state placeholder.
 * @param {MessageListProps} props Component properties.
 * @returns {React.JSX.Element} The rendered message list.
 */
export const MessageList: React.FC<MessageListProps> = ({ 
  messages, 
  isLoading, 
  error, 
  scrollRef 
}): React.JSX.Element => {
  const { t } = useTranslation();
  return (
    <div 
      ref={scrollRef}
      className="flex-grow overflow-y-auto p-6 custom-scrollbar bg-gray-50/50"
      role="log"
      aria-live="polite"
      aria-busy={isLoading}
    >
      {messages.length === 0 ? (
        <div className="h-full flex flex-col items-center justify-center text-center p-8">
          <div className="w-16 h-16 bg-indigo/10 rounded-full flex items-center justify-center text-indigo mb-4">
            <ShieldCheck className="w-8 h-8" />
          </div>
          
          <div className="mb-6 bg-white border border-gray-200 px-4 py-2 rounded-full shadow-sm flex items-center gap-2">
            <div className="w-2 h-2 bg-emerald rounded-full animate-pulse" />
            <span className="text-[10px] font-bold text-navy uppercase tracking-wider">
              {t('chat.input.disclaimer')}
            </span>
          </div>

          <h3 className="text-navy font-hero text-lg mb-2">{t('chat.empty')}</h3>
          <p className="text-sm text-gray-500">
            {t('chat.placeholder')}
          </p>
        </div>
      ) : (
        messages.map((msg) => (
          <MessageComponent key={msg.id} message={msg} />
        ))
      )}
      
      {isLoading && messages[messages.length - 1]?.content === '' && (
        <MessageComponent message={{ id: 'loading', role: 'model', content: '...', timestamp: 0 }} />
      )}

      {error && (
        <div className="p-4 bg-error/10 border border-error/20 rounded-lg text-error text-xs font-medium mb-4" role="alert">
          {error}
        </div>
      )}
    </div>
  );
};
