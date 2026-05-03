import { describe, it, expect } from 'vitest';
import { AIEngine } from '../../engines/AIEngine';
import { ChatMessage } from '../../types/election';

describe('AIEngine', () => {
  it('should sanitize HTML tags', () => {
    const input = 'Hello <script>alert(1)</script> world';
    const result = AIEngine.validateAndSanitize(input);
    expect(result.sanitized).toBe('Hello alert(1) world');
  });

  it('should block sensitive terms', () => {
    const input = 'Who should I vote for? republican';
    const result = AIEngine.validateAndSanitize(input);
    expect(result.safe).toBe(false);
    expect(result.reason).toContain('sensitive or blocked terms');
  });

  it('should format history correctly for Gemini', () => {
    const messages: ChatMessage[] = [
      { id: '1', role: 'user', content: 'Hi', timestamp: 1 },
      { id: '2', role: 'model', content: 'Hello', timestamp: 2 }
    ];
    const history = AIEngine.formatHistory(messages);
    expect(history[0].role).toBe('user');
    expect(history[1].role).toBe('model');
    expect(history[1].parts[0].text).toBe('Hello');
  });

  it('should handle extremely long inputs by truncating', () => {
    const longInput = 'a'.repeat(1000);
    const result = AIEngine.validateAndSanitize(longInput);
    expect(result.sanitized.length).toBe(500);
  });

  it('should block empty or whitespace-only inputs', () => {
    expect(AIEngine.validateAndSanitize('   ').safe).toBe(false);
    expect(AIEngine.validateAndSanitize('').safe).toBe(false);
  });

  it('should sanitize AI responses by masking blocked terms', () => {
    const rawResponse = 'I think the republican party is great.';
    const sanitized = AIEngine.sanitizeResponse(rawResponse);
    expect(sanitized).toContain('[RESTRICTED]');
    expect(sanitized).not.toContain('republican');
  });
});
