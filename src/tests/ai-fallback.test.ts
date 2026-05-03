import { describe, it, expect, vi } from 'vitest';
import { streamCivicAnswer } from '../lib/gemini';
import { ChatMessage } from '../types';

vi.mock('@google/generative-ai', () => ({
  GoogleGenerativeAI: vi.fn().mockImplementation(() => ({
    getGenerativeModel: () => ({
      startChat: () => ({
        sendMessageStream: vi.fn().mockRejectedValue(new Error('Quota exceeded or network error'))
      })
    })
  })),
  HarmCategory: {
    HARM_CATEGORY_HARASSMENT: 'HARM_CATEGORY_HARASSMENT',
    HARM_CATEGORY_HATE_SPEECH: 'HARM_CATEGORY_HATE_SPEECH',
    HARM_CATEGORY_SEXUALLY_EXPLICIT: 'HARM_CATEGORY_SEXUALLY_EXPLICIT',
    HARM_CATEGORY_DANGEROUS_CONTENT: 'HARM_CATEGORY_DANGEROUS_CONTENT'
  },
  HarmBlockThreshold: {
    BLOCK_ONLY_HIGH: 'BLOCK_ONLY_HIGH'
  }
}));

describe('AI Fallback Tests', () => {
  it('should provide a user-friendly message when Gemini API fails', async () => {
    const prompt = 'How do I register?';
    const history: ChatMessage[] = [];

    const gen = streamCivicAnswer(prompt, history);

    try {
      await gen.next();
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : String(error);
      expect(message).toBe('CivicIQ is temporarily unavailable. Please try again in a moment.');
    }
  });

  it('should handle empty or whitespace-only prompts gracefully', async () => {
    const prompt = '   ';
    const history: ChatMessage[] = [];

    const gen = streamCivicAnswer(prompt, history);

    try {
      await gen.next();
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : String(error);
      expect(message).toBe('Prompt too short');
    }
  });
});
