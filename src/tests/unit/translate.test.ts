import { describe, it, expect, vi, beforeEach } from 'vitest';
import { translateText } from '../../lib/translate';

// Mock fetch globally
global.fetch = vi.fn();

describe('Cloud Translate Module', () => {
  beforeEach(() => {
    vi.resetAllMocks();
    vi.stubEnv('VITE_TRANSLATE_API_KEY', 'dummy_key');
  });

  it('returns original text on API failure (graceful fallback)', async () => {
    // Simulate API error
    (global.fetch as any).mockResolvedValueOnce({
      ok: false,
      statusText: 'Internal Server Error'
    });

    const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

    const result = await translateText('Hello World', 'es');
    
    // Should return original text despite the error
    expect(result).toBe('Hello World');
    expect(consoleErrorSpy).toHaveBeenCalled();
    
    consoleErrorSpy.mockRestore();
  });
});
