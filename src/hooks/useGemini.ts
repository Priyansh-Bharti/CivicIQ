import { useState, useEffect } from 'react';
import { 
  validatePrompt, 
  streamCivicAnswer, 
  saveMessageToFirestore, 
  loadChatHistory, 
  clearChatHistory 
} from '../lib/gemini';
import { useChatStore } from '../store/chatStore';
import { useAuth } from './useAuth';
import { useRateLimit } from './useSecurity';
import { ChatMessage } from '../types/election';
import { trackEvent } from '../lib/analytics';

export const useGemini = () => {
  const { user } = useAuth();
  const { checkLimit } = useRateLimit();
  const { 
    messages, 
    addMessage, 
    updateLastMessage, 
    setMessages, 
    clearMessages,
    activeContext 
  } = useChatStore();
  
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (user) {
      const fetchHistory = async () => {
        const history = await loadChatHistory(user.uid);
        setMessages(history);
      };
      void fetchHistory();
    }
  }, [user, setMessages]);

  const sendMessage = async (content: string) => {
    // Security: Check Rate Limits (3-tier)
    const aiLimit = checkLimit('ai');
    if (!aiLimit.allowed) {
      setError(`You've reached your AI message limit. Please try again in 15 minutes.`);
      return;
    }

    const generalLimit = checkLimit('general');
    if (!generalLimit.allowed) {
      setError(`System is busy. Please try again later.`);
      return;
    }

    const validation = validatePrompt(content);
    if (!validation.safe) {
      setError(validation.reason || 'Invalid prompt');
      return;
    }

    trackEvent('question_asked', {
      phase_id: activeContext || 'none',
      question_length: content.length,
      has_phase_context: !!activeContext
    });

    setError(null);
    setIsLoading(true);

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      content,
      timestamp: Date.now(),
      phaseContext: activeContext || undefined
    };

    addMessage(userMessage);
    if (user) void saveMessageToFirestore(user.uid, userMessage);

    const aiMessageId = (Date.now() + 1).toString();
    const initialAiMessage: ChatMessage = {
      id: aiMessageId,
      role: 'model',
      content: '',
      timestamp: Date.now()
    };
    addMessage(initialAiMessage);

    try {
      let fullResponse = '';
      // Use fresh state from store to avoid stale closures
      const currentMessages = useChatStore.getState().messages.slice(0, -2); // Exclude current user message and empty AI message
      const stream = streamCivicAnswer(content, currentMessages, activeContext || undefined);
      
      for await (const chunk of stream) {
        fullResponse += chunk;
        updateLastMessage(fullResponse);
      }

      if (user) {
        const finalAiMessage: ChatMessage = {
          ...initialAiMessage,
          content: fullResponse
        };
        void saveMessageToFirestore(user.uid, finalAiMessage);
      }
    } catch (err) {
      setError('Sorry, I encountered an error. Please try again.');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const clearChat = async () => {
    clearMessages();
    if (user) await clearChatHistory(user.uid);
  };

  return {
    messages,
    isLoading,
    error,
    sendMessage,
    clearChat
  };
};
