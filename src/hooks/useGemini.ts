/**
 * Gemini AI Integration Hook
 * Handles chat state, AI streaming, and integration with Firestore for persistence.
 */

import { useState, useEffect, useCallback } from 'react';
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
  const { messages, addMessage, updateLastMessage, setMessages, clearMessages, activeContext } = useChatStore();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!user) return;
    const fetchHistory = async (): Promise<void> => {
      try {
        const history = await loadChatHistory(user.uid);
        setMessages(history);
      } catch (err) { logger.error('Failed to load chat history:', err); }
    };
    void fetchHistory();
  }, [user, setMessages]);

  const performSecurityChecks = useCallback((content: string): boolean => {
    const aiLimit = checkLimit('AI');
    if (!aiLimit.allowed) {
      setError(`You've reached your AI message limit. Please try again in 15 minutes.`);
      return false;
    }
    const validation = validatePrompt(content);
    if (!validation.safe) {
      setError(validation.reason || 'Invalid prompt');
      return false;
    }
    return true;
  }, [checkLimit]);

  const streamResponse = useCallback(async (content: string, aiId: string) => {
    try {
      let fullResponse = '';
      const currentMessages = useChatStore.getState().messages.slice(0, -2);
      const stream = streamCivicAnswer(content, currentMessages, activeContext || undefined);
      for await (const chunk of stream) {
        fullResponse += chunk;
        updateLastMessage(fullResponse);
      }
      if (user) {
        const finalMsg: ChatMessage = { id: aiId, role: 'model', content: fullResponse, timestamp: Date.now() };
        void saveMessageToFirestore(user.uid, finalMsg);
      }
    } catch (err) {
      setError('Sorry, I encountered an error. Please try again.');
      logger.error('Gemini stream error:', err);
    } finally { setIsLoading(false); }
  }, [activeContext, updateLastMessage, user]);

  const sendMessage = async (content: string): Promise<void> => {
    if (!performSecurityChecks(content)) return;
    trackEvent('question_asked', { phase_id: activeContext || 'none', question_length: content.length });
    setError(null);
    setIsLoading(true);

    const userMessage: ChatMessage = { id: Date.now().toString(), role: 'user', content, timestamp: Date.now(), phaseContext: activeContext || undefined };
    addMessage(userMessage);
    if (user) void saveMessageToFirestore(user.uid, userMessage);

    const aiMessageId = (Date.now() + 1).toString();
    addMessage({ id: aiMessageId, role: 'model', content: '', timestamp: Date.now() });
    await streamResponse(content, aiMessageId);
  };

  const clearChat = async (): Promise<void> => {
    clearMessages();
    if (user) await clearChatHistory(user.uid);
  };

  return { messages, isLoading, error, sendMessage, clearChat };
};
