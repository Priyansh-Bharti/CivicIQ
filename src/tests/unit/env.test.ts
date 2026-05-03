import { describe, it, expect } from 'vitest';
import { requireEnv } from '../../utils/env';

describe('Environment Utilities', () => {
  it('should return the environment variable if it exists', () => {
    import.meta.env.VITE_TEST_VAR = 'test_value';
    expect(requireEnv('VITE_TEST_VAR')).toBe('test_value');
  });

  it('should throw an error if the environment variable is missing', () => {
    expect(() => requireEnv('VITE_MISSING_VAR')).toThrow();
  });
});
