import { describe, it, expect, beforeEach } from 'vitest';
import { useChatStore } from '../../../src/store/chatStore';

describe('Chat Store', () => {
  beforeEach(() => {
    useChatStore.getState().clearMessages();
  });

  it('should add a message', () => {
    const msg = { id: '1', role: 'user' as const, content: 'Hi', timestamp: 1 };
    useChatStore.getState().addMessage(msg);
    expect(useChatStore.getState().messages).toHaveLength(1);
    expect(useChatStore.getState().messages[0]).toEqual(msg);
  });

  it('should update the last message content', () => {
    useChatStore.getState().addMessage({ id: '1', role: 'user' as const, content: 'Hi', timestamp: 1 });
    useChatStore.getState().updateLastMessage('Updated');
    expect(useChatStore.getState().messages[0].content).toBe('Updated');
  });

  it('should set multiple messages', () => {
    const msgs = [
      { id: '1', role: 'user' as const, content: 'Hi', timestamp: 1 },
      { id: '2', role: 'model' as const, content: 'Hello', timestamp: 2 }
    ];
    useChatStore.getState().setMessages(msgs);
    expect(useChatStore.getState().messages).toHaveLength(2);
  });

  it('should set active context', () => {
    useChatStore.getState().setActiveContext('phase-1');
    expect(useChatStore.getState().activeContext).toBe('phase-1');
  });
});
