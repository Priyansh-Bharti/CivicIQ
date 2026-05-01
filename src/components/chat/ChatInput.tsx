import { useState, useRef, useEffect } from 'react';
import { Send, Mic } from 'lucide-react';
import { clsx } from 'clsx';

interface ChatInputProps {
  onSendMessage: (content: string) => void;
  isLoading: boolean;
}

export const ChatInput = ({ onSendMessage, isLoading }: ChatInputProps) => {
  const [content, setContent] = useState('');
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleSend = () => {
    if (content.trim() && !isLoading && content.length <= 500) {
      onSendMessage(content.trim());
      setContent('');
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 120)}px`;
    }
  }, [content]);

  return (
    <div className="p-4 bg-white border-t border-gray-100">
      <div className="relative bg-gray-50 rounded-xl border border-gray-200 focus-within:border-indigo transition-colors p-2">
        <textarea
          ref={textareaRef}
          value={content}
          onChange={(e) => setContent(e.target.value)}
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
            <button className="p-2 text-gray-400 hover:text-indigo transition-colors">
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
