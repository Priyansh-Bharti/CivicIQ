import { describe, it, expect, vi, beforeEach } from 'vitest';
import { Logger } from '../../utils/logger';

describe('Logger Utility', () => {
  beforeEach(() => {
    vi.spyOn(console, 'log').mockImplementation(() => {});
    vi.spyOn(console, 'error').mockImplementation(() => {});
    vi.spyOn(console, 'warn').mockImplementation(() => {});
    vi.spyOn(console, 'info').mockImplementation(() => {});
  });

  it('should mask emails in logs', () => {
    Logger.info('Test', 'User email is test@example.com');
    expect(console.info).toHaveBeenCalledWith(expect.stringContaining('[Test]'), 'User email is [REDACTED_EMAIL]');
  });

  it('should format errors correctly', () => {
    const err = new Error('Test Error');
    Logger.error('Test', 'Something failed', err);
    expect(console.error).toHaveBeenCalled();
  });
});
