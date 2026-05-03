import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { ChatPanel } from '../../../src/components/chat/ChatPanel';
import { useChatStore } from '../../../src/store/chatStore';

// ─── Browser stub ─────────────────────────────────────────────────────────────
window.HTMLElement.prototype.scrollIntoView = vi.fn();

// ─── Mock useGemini with correct return shape ────────────────────────────────
const mockSendMessage = vi.fn();
const mockClearChat = vi.fn(() => {
  useChatStore.getState().clearMessages();
});

vi.mock('../../../src/hooks/useGemini', () => ({
  useGemini: () => ({
    messages: useChatStore.getState().messages,
    sendMessage: mockSendMessage,
    isLoading: false,
    error: null,
    clearChat: mockClearChat,
  }),
}));

vi.mock('../../../src/hooks/useTranslation', () => ({
  useTranslation: () => ({
    t: (key: string) => key,
    lang: 'en',
    changeLanguage: vi.fn(),
    dir: 'ltr'
  }),
}));

// ─── Suite ───────────────────────────────────────────────────────────────────
describe('Chat Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    useChatStore.setState({
      isOpen: true,
      activeContext: null,
      messages: [],
    });
  });

  const renderChat = () => render(<ChatPanel />);

  it('ChatPanel renders', () => {
    renderChat();
    expect(screen.getByPlaceholderText(/Ask CivicIQ/i)).toBeInTheDocument();
  });

  it('renders with phase context banner', () => {
    useChatStore.setState({ isOpen: true, activeContext: 'Phase 1 Context', messages: [] });
    renderChat();
    expect(screen.getByText(/Asking about/i)).toBeInTheDocument();
    expect(screen.getByText('Phase 1 Context')).toBeInTheDocument();
  });

  it('User message appends immediately', async () => {
    mockSendMessage.mockImplementationOnce(() => {
      useChatStore.getState().addMessage({
        id: 'u1', role: 'user', content: 'Hello', timestamp: Date.now(),
      });
    });
    renderChat();
    const input = screen.getByPlaceholderText(/Ask CivicIQ/i);
    fireEvent.change(input, { target: { value: 'Hello' } });
    fireEvent.keyDown(input, { key: 'Enter', code: 'Enter' });
    await waitFor(() => { expect(mockSendMessage).toHaveBeenCalledWith('Hello'); });
  });

  it('Send button disabled when input empty', () => {
    renderChat();
    const btn = screen.getByRole('button', { name: /Send message/i });
    expect(btn).toBeDisabled();
  });

  it('Enter key sends message', async () => {
    renderChat();
    const input = screen.getByPlaceholderText(/Ask CivicIQ/i);
    fireEvent.change(input, { target: { value: 'Test message' } });
    fireEvent.keyDown(input, { key: 'Enter', code: 'Enter' });
    await waitFor(() => { expect(mockSendMessage).toHaveBeenCalledWith('Test message'); });
  });

  it('Shift+Enter does NOT send message', () => {
    renderChat();
    const input = screen.getByPlaceholderText(/Ask CivicIQ/i);
    fireEvent.change(input, { target: { value: 'Line 1' } });
    fireEvent.keyDown(input, { key: 'Enter', code: 'Enter', shiftKey: true });
    expect(mockSendMessage).not.toHaveBeenCalled();
  });

  it('500 char limit enforced via maxLength attribute', () => {
    renderChat();
    const input = screen.getByPlaceholderText(/Ask CivicIQ/i);
    expect(input).toHaveAttribute('maxLength', '500');
  });

  it('Clear chat empties message list', () => {
    useChatStore.setState({
      isOpen: true,
      messages: [{ id: '1', role: 'user', content: 'Test msg', timestamp: 1 }],
    });
    renderChat();
    expect(screen.getByText('Test msg')).toBeInTheDocument();

    const clearBtn = screen.getByRole('button', { name: /Clear chat/i });
    fireEvent.click(clearBtn);
    expect(mockClearChat).toHaveBeenCalled();
  });

  it('Disclaimer text present', () => {
    renderChat();
    expect(screen.getByText(/AI can make mistakes/i)).toBeInTheDocument();
  });

  it('Close button closes panel', () => {
    renderChat();
    const closeBtn = screen.getByRole('button', { name: /Close chat/i });
    fireEvent.click(closeBtn);
    expect(useChatStore.getState().isOpen).toBe(false);
  });

  it('Focus management: focus moves to close button on open', async () => {
    vi.useFakeTimers();
    renderChat();
    act(() => {
      vi.runAllTimers();
    });
    const closeBtn = screen.getByRole('button', { name: /Close chat/i });
    expect(document.activeElement).toBe(closeBtn);
    vi.useRealTimers();
  });

  it('ARIA: message list has role="log" and aria-live="polite"', () => {
    renderChat();
    const log = screen.getByRole('log');
    expect(log).toHaveAttribute('aria-live', 'polite');
  });

  it('ARIA: Chat panel has role="dialog"', () => {
    renderChat();
    expect(screen.getByRole('dialog')).toBeInTheDocument();
  });

  it('ARIA: Close button has aria-label', () => {
    renderChat();
    expect(screen.getByRole('button', { name: /Close chat/i })).toBeInTheDocument();
  });

  it('ARIA: Input has aria-label="Message CivicIQ"', () => {
    renderChat();
    const input = screen.getByPlaceholderText(/Ask CivicIQ/i);
    expect(input).toHaveAttribute('aria-label', 'Message CivicIQ');
  });

  it('ARIA: Clear button has aria-label', () => {
    renderChat();
    expect(screen.getByRole('button', { name: /Clear chat/i })).toBeInTheDocument();
  });

  it('Empty state shows prompt text', () => {
    renderChat();
    expect(screen.getByText(/How can I help you today/i)).toBeInTheDocument();
  });

  it('Panel header contains "Ask CivicIQ" title', () => {
    renderChat();
    expect(screen.getByText('Ask CivicIQ')).toBeInTheDocument();
  });

  it('Panel sub-header shows "Powered by Gemini 2.0"', () => {
    renderChat();
    expect(screen.getByText(/Powered by Gemini 2.0/i)).toBeInTheDocument();
  });
});
