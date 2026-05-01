import { describe, it, expect, vi } from 'vitest';
import { trackEvent } from '../../lib/analytics';

describe('Analytics module', () => {
  it('does not throw when Firebase is not initialized', () => {
    const consoleWarnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});
    
    // This should not throw an error even though initAnalytics wasn't called
    expect(() => trackEvent('test_event', { foo: 'bar' })).not.toThrow();
    
    // It should log a warning
    expect(consoleWarnSpy).toHaveBeenCalledWith(
      'Analytics not initialized. Would have tracked: test_event',
      { foo: 'bar' }
    );
    
    consoleWarnSpy.mockRestore();
  });
});
