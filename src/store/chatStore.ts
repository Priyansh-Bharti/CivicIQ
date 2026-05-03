/**
 * Chat State Management
 * Handles the global state for the AI chat panel, including message history and visibility.
 */

import { create } from 'zustand';
import { ChatMessage } from '../types/election';

interface ChatState {
  messages: ChatMessage[];
  isOpen: boolean;
  activeContext: string | null;
  /**
   * Adds a new message to the chat history.
   * @param {ChatMessage} message The message to add.
   */
  addMessage: (message: ChatMessage) => void;
  /**
   * Updates the content of the last message in history (used for streaming).
   * @param {string} content The new text content.
   */
  updateLastMessage: (content: string) => void;
  /**
   * Replaces the entire message history.
   * @param {ChatMessage[]} messages The new messages array.
   */
  setMessages: (messages: ChatMessage[]) => void;
  /**
   * Toggles the visibility of the chat panel.
   * @param {boolean} isOpen Visibility state.
   */
  setIsOpen: (isOpen: boolean) => void;
  /**
   * Sets the active conversational context (e.g., current election phase).
   * @param {string | null} context The context name or null.
   */
  setActiveContext: (context: string | null) => void;
  /**
   * Resets the message history to an empty state.
   */
  clearMessages: () => void;
}

/**
 * Zustand store for managing chat interactions.
 */
export const useChatStore = create<ChatState>((set) => ({
  messages: [],
  isOpen: false,
  activeContext: null,
  addMessage: (message: ChatMessage): void => set((state) => ({ 
    messages: [...state.messages, message] 
  })),
  updateLastMessage: (content: string): void => set((state) => {
    const newMessages = [...state.messages];
    if (newMessages.length > 0) {
      newMessages[newMessages.length - 1].content = content;
    }
    return { messages: newMessages };
  }),
  setMessages: (messages: ChatMessage[]): void => set({ messages }),
  setIsOpen: (isOpen: boolean): void => set({ isOpen }),
  setActiveContext: (context: string | null): void => set({ activeContext: context }),
  clearMessages: (): void => set({ messages: [] }),
}));
