/**
 * Gemini AI Integration Hook
 * Handles chat state, AI streaming, and integration with Firestore for persistence.
 */

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
import { logger } from '../utils/logger';

interface GeminiHookResult {
  messages: ChatMessage[];
  isLoading: boolean;
  error: string | null;
  sendMessage: (content: string) => Promise<void>;
  clearChat: () => Promise<void>;
}

/**
 * Custom hook for managing the Gemini AI chat interface.
 * @returns {GeminiHookResult} The chat state and control methods.
 */
export const useGemini = (): GeminiHookResult => {
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
      /**
       * Initialization: Load chat history.
       * Synchronizes the local session with persistent Firestore storage.
       */
      const fetchHistory = async (): Promise<void> => {
        try {
          const history = await loadChatHistory(user.uid);
          setMessages(history);
        } catch (err) {
          logger.error('Failed to load chat history:', err);
        }
      };
      void fetchHistory();
    }
  }, [user, setMessages]);

  /**
   * AI Orchestration: sendMessage
   * 
   * Handles the complete lifecycle of an AI interaction:
   * 1. Rate limiting & Safety validation
   * 2. Message state management (Local & Firestore)
   * 3. Streaming response processing
   * 4. Error handling & Tracking
   */
  const sendMessage = async (content: string): Promise<void> => {
    // 1. Security Check: Enforce AI-specific and General rate limits
    const aiLimit = checkLimit('AI');
    if (!aiLimit.allowed) {
      setError(`You've reached your AI message limit. Please try again in 15 minutes.`);
      return;
    }

    const generalLimit = checkLimit('GENERAL');
    if (!generalLimit.allowed) {
      setError(`System is busy. Please try again later.`);
      return;
    }

    // 2. Safety Check: Verify prompt against blocked terms
    const validation = validatePrompt(content);
    if (!validation.safe) {
      setError(validation.reason || 'Invalid prompt');
      return;
    }

    // 3. Analytics: Track the interaction
    trackEvent('question_asked', {
      phase_id: activeContext || 'none',
      question_length: content.length,
    });

    setError(null);
    setIsLoading(true);

    // 4. Local State: Immediate feedback with the user's message
    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      content,
      timestamp: Date.now(),
      phaseContext: activeContext || undefined
    };

    addMessage(userMessage);
    if (user) void saveMessageToFirestore(user.uid, userMessage);

    // 5. AI State: Create a placeholder for the incoming stream
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
      // We pass the history (excluding the current user/empty-ai messages) to give the AI context
      const currentMessages = useChatStore.getState().messages.slice(0, -2);
      const stream = streamCivicAnswer(content, currentMessages, activeContext || undefined);
      
      // 6. Streaming: Progressively update the UI as chunks arrive
      for await (const chunk of stream) {
        fullResponse += chunk;
        updateLastMessage(fullResponse);
      }

      // 7. Persistence: Save the final complete AI response
      if (user) {
        const finalAiMessage: ChatMessage = { ...initialAiMessage, content: fullResponse };
        void saveMessageToFirestore(user.uid, finalAiMessage);
      }
    } catch (err) {
      setError('Sorry, I encountered an error. Please try again.');
      logger.error('Gemini stream error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Clears the current chat session and persistent history.
   */
  const clearChat = async (): Promise<void> => {
    clearMessages();
    if (user) await clearChatHistory(user.uid);
  };

  return { messages, isLoading, error, sendMessage, clearChat };
};
