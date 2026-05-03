import { describe, it, expect, vi, beforeEach } from 'vitest';
import { logger } from '../../utils/logger';

describe('Logger Utility', () => {
  beforeEach(() => {
    vi.spyOn(console, 'log').mockImplementation(() => {});
    vi.spyOn(console, 'error').mockImplementation(() => {});
    vi.spyOn(console, 'warn').mockImplementation(() => {});
    vi.spyOn(console, 'info').mockImplementation(() => {});
  });

  it('should mask emails in logs', () => {
    logger.info('Test', 'User email is test@example.com');
    expect(console.log).toHaveBeenCalledWith('[INFO] Test', 'User email is ***@***.***');
  });

  it('should format errors correctly', () => {
    const err = new Error('Test Error');
    logger.error('Test', 'Something failed', err);
    expect(console.error).toHaveBeenCalled();
  });
});
