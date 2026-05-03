import { describe, it, expect, vi, beforeEach } from 'vitest';
import { validateEnv } from '../../utils/env';

describe('Environment Utilities', () => {
  const originalEnv = { ...import.meta.env };

  beforeEach(() => {
    vi.resetModules();
    Object.assign(import.meta.env, originalEnv);
  });

  it('should not throw when all variables are present', () => {
    import.meta.env.VITE_FIREBASE_API_KEY = 'test';
    import.meta.env.VITE_FIREBASE_AUTH_DOMAIN = 'test';
    import.meta.env.VITE_FIREBASE_PROJECT_ID = 'test';
    import.meta.env.VITE_FIREBASE_STORAGE_BUCKET = 'test';
    import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID = 'test';
    import.meta.env.VITE_FIREBASE_APP_ID = 'test';
    import.meta.env.VITE_GEMINI_API_KEY = 'test';

    expect(() => validateEnv()).not.toThrow();
  });

  it('should return an object with all required keys', () => {
    import.meta.env.VITE_FIREBASE_API_KEY = 'key1';
    import.meta.env.VITE_FIREBASE_AUTH_DOMAIN = 'domain1';
    import.meta.env.VITE_FIREBASE_PROJECT_ID = 'proj1';
    import.meta.env.VITE_FIREBASE_STORAGE_BUCKET = 'bucket1';
    import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID = 'sender1';
    import.meta.env.VITE_FIREBASE_APP_ID = 'app1';
    import.meta.env.VITE_GEMINI_API_KEY = 'gemini1';

    const config = validateEnv();
    expect(config.FIREBASE_API_KEY).toBe('key1');
    expect(config.GEMINI_API_KEY).toBe('gemini1');
  });

  it('should not throw in dev mode even if a variable is missing', () => {
    import.meta.env.VITE_FIREBASE_API_KEY = '';
    expect(() => validateEnv()).not.toThrow();
  });
});

