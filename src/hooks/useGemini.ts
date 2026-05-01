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
import { ChatMessage } from '../types/election';

export const useGemini = () => {
  const { user } = useAuth();
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
    const validation = validatePrompt(content);
    if (!validation.safe) {
      setError(validation.reason || 'Invalid prompt');
      return;
    }

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
      const stream = streamCivicAnswer(content, activeContext || undefined);
      
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
