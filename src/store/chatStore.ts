import { create } from 'zustand';
import { ChatMessage } from '../types/election';

interface ChatState {
  messages: ChatMessage[];
  isOpen: boolean;
  activeContext: string | null;
  addMessage: (message: ChatMessage) => void;
  updateLastMessage: (content: string) => void;
  setMessages: (messages: ChatMessage[]) => void;
  setIsOpen: (isOpen: boolean) => void;
  setActiveContext: (context: string | null) => void;
  clearMessages: () => void;
}

export const useChatStore = create<ChatState>((set) => ({
  messages: [],
  isOpen: false,
  activeContext: null,
  addMessage: (message) => set((state) => ({ 
    messages: [...state.messages, message] 
  })),
  updateLastMessage: (content) => set((state) => {
    const newMessages = [...state.messages];
    if (newMessages.length > 0) {
      newMessages[newMessages.length - 1].content = content;
    }
    return { messages: newMessages };
  }),
  setMessages: (messages) => set({ messages }),
  setIsOpen: (isOpen) => set({ isOpen }),
  setActiveContext: (context) => set({ activeContext: context }),
  clearMessages: () => set({ messages: [] }),
}));
