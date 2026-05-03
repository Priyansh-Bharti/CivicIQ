import { describe, it, expect, vi } from 'vitest';
import { renderHook } from '@testing-library/react';
import { useGemini } from '../../hooks/useGemini';

vi.mock('../../hooks/useAuth', () => ({
  useAuth: () => ({ user: null, loading: false, isAuthenticated: false, signInWithGoogle: vi.fn(), signOut: vi.fn() })
}));
vi.mock('../../hooks/useSecurity', () => ({
  useRateLimit: () => ({ checkLimit: vi.fn(() => ({ allowed: true })) })
}));
vi.mock('../../lib/gemini', () => ({
  validatePrompt: vi.fn(() => ({ safe: true })),
  streamCivicAnswer: vi.fn(async function* () { yield 'mock'; }),
  saveMessageToFirestore: vi.fn(),
  loadChatHistory: vi.fn().mockResolvedValue([]),
  clearChatHistory: vi.fn()
}));
vi.mock('../../lib/analytics', () => ({ trackEvent: vi.fn() }));

describe('useGemini Hook', () => {
  it('should initialize with default state', () => {
    const { result } = renderHook(() => useGemini());
    expect(result.current.isLoading).toBe(false);
    expect(result.current.error).toBeNull();
    expect(result.current.messages).toEqual([]);
  });

  it('should expose sendMessage and clearChat functions', () => {
    const { result } = renderHook(() => useGemini());
    expect(typeof result.current.sendMessage).toBe('function');
    expect(typeof result.current.clearChat).toBe('function');
  });
});
