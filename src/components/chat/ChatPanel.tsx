import { useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, RotateCcw, ShieldCheck } from 'lucide-react';
import { ChatMessage } from './ChatMessage';
import { ChatInput } from './ChatInput';
import { useChatStore } from '../../store/chatStore';
import { useGemini } from '../../hooks/useGemini';

export const ChatPanel = () => {
  const { isOpen, setIsOpen, activeContext, setActiveContext } = useChatStore();
  const { messages, sendMessage, isLoading, clearChat, error } = useGemini();
  const scrollRef = useRef<HTMLDivElement>(null);

  const closeBtnRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isLoading]);

  useEffect(() => {
    if (isOpen && closeBtnRef.current) {
      closeBtnRef.current.focus();
    }
  }, [isOpen]);

  const handleClose = () => {
    setIsOpen(false);
    setActiveContext(null);
  };

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
          {/* Header */}
          <div className="p-6 border-b border-gray-100 flex items-center justify-between bg-navy text-white">
            <div>
              <h2 className="text-xl font-hero">Ask CivicIQ</h2>
              <p className="text-[10px] text-white/60 uppercase tracking-widest font-bold">Powered by Gemini 2.0</p>
            </div>
            <div className="flex items-center gap-2">
              <button 
                onClick={clearChat}
                className="p-2 hover:bg-white/10 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-amber"
                aria-label="Clear chat"
              >
                <RotateCcw className="w-5 h-5" aria-hidden="true" />
              </button>
              <button 
                ref={closeBtnRef}
                onClick={handleClose}
                className="p-2 hover:bg-white/10 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-amber"
                aria-label="Close chat"
              >
                <X className="w-6 h-6" aria-hidden="true" />
              </button>
            </div>
          </div>

          {/* Phase Context Banner */}
          {activeContext && (
            <div className="bg-amber/10 border-b border-amber/20 p-3 px-6 flex items-center gap-3">
              <ShieldCheck className="w-4 h-4 text-amber" aria-hidden="true" />
              <p className="text-xs text-navy font-medium">
                Asking about: <span className="font-bold">{activeContext}</span>
              </p>
            </div>
          )}

          {/* Message List */}
          <div 
            ref={scrollRef}
            className="flex-grow overflow-y-auto p-6 custom-scrollbar bg-gray-50/50"
            role="log"
            aria-live="polite"
          >
            {messages.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center p-8">
                <div className="w-16 h-16 bg-indigo/10 rounded-full flex items-center justify-center text-indigo mb-4">
                  <ShieldCheck className="w-8 h-8" />
                </div>
                <h3 className="text-navy font-hero text-lg mb-2">How can I help you today?</h3>
                <p className="text-sm text-gray-500">
                  Ask me about voter registration, election timelines, or how ballots are counted.
                </p>
              </div>
            ) : (
              messages.map((msg) => (
                <ChatMessage key={msg.id} message={msg} />
              ))
            )}
            
            {isLoading && messages[messages.length - 1]?.content === '' && (
              <ChatMessage message={{ id: 'loading', role: 'model', content: '...', timestamp: Date.now() }} />
            )}

            {error && (
              <div className="p-4 bg-error/10 border border-error/20 rounded-lg text-error text-xs font-medium mb-4">
                {error}
              </div>
            )}
          </div>

          {/* Footer / Input */}
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
