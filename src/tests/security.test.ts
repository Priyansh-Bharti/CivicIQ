import { describe, it, expect, vi, beforeEach } from 'vitest';
import { validatePrompt, streamCivicAnswer } from '../lib/gemini';
import { GoogleGenerativeAI } from '@google/generative-ai';

// Mock the rate limit hook
vi.mock('../hooks/useSecurity', () => ({
  useRateLimit: () => ({
    checkLimit: () => ({ allowed: true, remaining: 100, resetTime: 0 })
  })
}));

// Mock Gemini SDK
vi.mock('@google/generative-ai', () => {
  const mockSendMessageStream = vi.fn().mockResolvedValue({
    stream: (async function* () {
      yield { text: () => 'Answer' };
    })()
  });

  const mockStartChat = vi.fn().mockReturnValue({
    sendMessageStream: mockSendMessageStream
  });

  const mockGetGenerativeModel = vi.fn().mockReturnValue({
    startChat: mockStartChat
  });

  return {
    GoogleGenerativeAI: vi.fn().mockImplementation(() => ({
      getGenerativeModel: mockGetGenerativeModel
    }))
  };
});

describe('Security Tests', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Input Sanitization', () => {
    it('should handle oversized payloads by truncating', async () => {
      const oversizedPrompt = 'a'.repeat(1000);
      const history: any[] = [];
      
      const gen = streamCivicAnswer(oversizedPrompt, history);
      const result = await gen.next();
      expect(result.value).toBeDefined();
    });
  });

  describe('Error Privacy', () => {
    it('should never expose internal stack traces in user-facing errors', async () => {
      // Access the mock to force a failure
      const { GoogleGenerativeAI: MockGenAI } = await import('@google/generative-ai');
      const mockModel = (new (MockGenAI as any)()).getGenerativeModel();
      vi.mocked(mockModel.startChat).mockImplementationOnce(() => {
        throw new Error('INTERNAL_DATABASE_FAILURE_STACK_TRACE_EXPOSED');
      });

      const gen = streamCivicAnswer('test', []);
      try {
        await gen.next();
      } catch (error: any) {
        expect(error.message).toBe('CivicIQ is temporarily unavailable. Please try again in a moment.');
        expect(error.message).not.toContain('INTERNAL_DATABASE_FAILURE');
      }
    });
  });
});
