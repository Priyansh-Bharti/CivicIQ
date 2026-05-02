import { describe, it, expect, vi } from 'vitest';
import { streamCivicAnswer } from '../lib/gemini';

vi.mock('@google/generative-ai', () => ({
  GoogleGenerativeAI: vi.fn().mockImplementation(() => ({
    getGenerativeModel: () => ({
      startChat: () => ({
        sendMessageStream: vi.fn().mockRejectedValue(new Error('Quota exceeded or network error'))
      })
    })
  }))
}));

describe('AI Fallback Tests', () => {
  it('should provide a user-friendly message when Gemini API fails', async () => {
    const prompt = 'How do I register?';
    const history: any[] = [];

    const gen = streamCivicAnswer(prompt, history);

    try {
      await gen.next();
    } catch (error: any) {
      expect(error.message).toBe('CivicIQ is temporarily unavailable. Please try again in a moment.');
    }
  });

  it('should handle empty or whitespace-only prompts gracefully', async () => {
    const prompt = '   ';
    const history: any[] = [];

    const gen = streamCivicAnswer(prompt, history);

    try {
      await gen.next();
    } catch (error: any) {
      expect(error.message).toBe('Please provide a valid question.');
    }
  });
});
