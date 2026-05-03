/**
 * Security Integration Tests
 * Validates input sanitization, rate limiting, and route protection.
 */

import React from 'react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { streamCivicAnswer } from '../lib/gemini';
import { render, screen } from '@testing-library/react';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import { ProtectedRoute } from '../components/auth/ProtectedRoute';
import { useAuth } from '../hooks/useAuth';

// Mock AI Config
vi.mock('../constants', async (importOriginal) => {
  const actual = await importOriginal() as any;
  return {
    ...actual,
    AI_CONFIG: {
      ...actual.AI_CONFIG,
      PROMPT_LIMIT: 500
    }
  };
});

// Mock Auth hook
vi.mock('../hooks/useAuth', () => ({
  useAuth: vi.fn()
}));

// Mock Gemini SDK
const mockSendMessageStream = vi.fn().mockResolvedValue({
  stream: (async function* () {
    yield { text: () => 'Security verified.' };
  })()
});

const mockStartChat = vi.fn().mockReturnValue({
  sendMessageStream: mockSendMessageStream
});

const mockGetGenerativeModel = vi.fn().mockReturnValue({
  startChat: mockStartChat
});

// We must use vi.mock with a factory that returns the mock, 
// and since it's hoisted, we define the mocks inside or use the 'mock' prefix correctly.
vi.mock('@google/generative-ai', () => {
  const mSendMessageStream = vi.fn().mockResolvedValue({
    stream: (async function* () {
      yield { text: () => 'Security verified.' };
    })()
  });

  const mStartChat = vi.fn().mockReturnValue({
    sendMessageStream: mSendMessageStream
  });

  const mGetGenerativeModel = vi.fn().mockReturnValue({
    startChat: mStartChat
  });

  return {
    GoogleGenerativeAI: vi.fn().mockImplementation(() => ({
      getGenerativeModel: mGetGenerativeModel
    })),
    // Export these so we can access them in tests if needed, 
    // but we can also just use vi.mocked on the imported module.
  };
});

describe('Security Standards', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('AI Input Sanitization', () => {
    it('should reject or truncate inputs over 500 characters', async () => {
      const oversizedPrompt = 'a'.repeat(1000);
      const gen = streamCivicAnswer(oversizedPrompt, []);
      await gen.next();

      // We need to access the mock. Since it's inside vi.mock, we can import the module and use vi.mocked
      const { GoogleGenerativeAI } = await import('@google/generative-ai');
      const model = (new (GoogleGenerativeAI as any)()).getGenerativeModel();
      const chat = model.startChat();
      expect(chat.sendMessageStream).toHaveBeenCalled();
      
      const sentPrompt = vi.mocked(chat.sendMessageStream).mock.calls[0][0];
      expect(sentPrompt.length).toBeLessThanOrEqual(500);
    });

    it('should strip HTML script tags before sending to AI', async () => {
      const maliciousPrompt = 'Hello <script>alert("xss")</script> World';
      const gen = streamCivicAnswer(maliciousPrompt, []);
      await gen.next();

      const { GoogleGenerativeAI } = await import('@google/generative-ai');
      const model = (new (GoogleGenerativeAI as any)()).getGenerativeModel();
      const chat = model.startChat();
      const sentPrompt = vi.mocked(chat.sendMessageStream).mock.calls[0][0];
      
      expect(sentPrompt).not.toContain('<script>');
      expect(sentPrompt).toBe('Hello alert("xss") World');
    });
  });

  describe('Route Protection', () => {
    it('should redirect unauthenticated users from protected routes to home', () => {
      vi.mocked(useAuth).mockReturnValue({
        user: null,
        isAuthenticated: false,
        isLoading: false,
        signInWithGoogle: vi.fn(),
        signOut: vi.fn()
      } as any);

      render(
        <MemoryRouter initialEntries={['/protected']}>
          <Routes>
            <Route path="/" element={<div data-testid="home">Home</div>} />
            <Route 
              path="/protected" 
              element={
                <ProtectedRoute>
                  <div data-testid="protected">Protected</div>
                </ProtectedRoute>
              } 
            />
          </Routes>
        </MemoryRouter>
      );

      expect(screen.queryByTestId('protected')).not.toBeInTheDocument();
      expect(screen.getByTestId('home')).toBeInTheDocument();
    });

    it('should allow authenticated users to access protected routes', () => {
      vi.mocked(useAuth).mockReturnValue({
        user: { uid: '123' },
        isAuthenticated: true,
        isLoading: false,
        signInWithGoogle: vi.fn(),
        signOut: vi.fn()
      } as any);

      render(
        <MemoryRouter initialEntries={['/protected']}>
          <Routes>
            <Route path="/" element={<div data-testid="home">Home</div>} />
            <Route 
              path="/protected" 
              element={
                <ProtectedRoute>
                  <div data-testid="protected">Protected</div>
                </ProtectedRoute>
              } 
            />
          </Routes>
        </MemoryRouter>
      );

      expect(screen.getByTestId('protected')).toBeInTheDocument();
    });
  });
});
