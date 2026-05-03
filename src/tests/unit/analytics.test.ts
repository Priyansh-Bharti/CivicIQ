import { describe, it, expect, vi, beforeEach } from 'vitest';
import { trackEvent, initAnalytics } from '../../lib/analytics';
import { logger } from '../../utils/logger';
import * as firebaseAnalytics from 'firebase/analytics';

vi.mock('firebase/analytics', () => ({
  getAnalytics: vi.fn(() => ({})),
  logEvent: vi.fn(),
}));

vi.mock('../../lib/firebase', () => ({
  app: {}
}));

describe('Analytics module', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('does not throw when Firebase is not initialized', () => {
    const loggerSpy = vi.spyOn(logger, 'info').mockImplementation(() => {});
    
    expect(() => { trackEvent('test_event', { foo: 'bar' }); }).not.toThrow();
    
    expect(loggerSpy).toHaveBeenCalledWith(
      'Analytics event triggered (not initialized): test_event',
      { foo: 'bar' }
    );
    
    loggerSpy.mockRestore();
  });

  it('initAnalytics sets up analytics instance', () => {
    initAnalytics();
    expect(firebaseAnalytics.getAnalytics).toHaveBeenCalled();
  });

  it('trackEvent calls logEvent with correct event name when initialized', () => {
    initAnalytics();
    trackEvent('phase_viewed', { phase_id: '1' });
    expect(firebaseAnalytics.logEvent).toHaveBeenCalledWith(expect.anything(), 'phase_viewed', { phase_id: '1' });
  });

  it('trackEvent handles question_asked event', () => {
    initAnalytics();
    trackEvent('question_asked', { phase_id: '1', question_length: 50, has_phase_context: true });
    expect(firebaseAnalytics.logEvent).toHaveBeenCalledWith(
      expect.anything(), 
      'question_asked', 
      { phase_id: '1', question_length: 50, has_phase_context: true }
    );
  });

  it('trackEvent handles checklist_item_toggled event', () => {
    initAnalytics();
    trackEvent('checklist_item_toggled', { item_id: '1', completed: true });
    expect(firebaseAnalytics.logEvent).toHaveBeenCalledWith(
      expect.anything(), 
      'checklist_item_toggled', 
      { item_id: '1', completed: true }
    );
  });

  it('trackEvent handles page_viewed event', () => {
    initAnalytics();
    trackEvent('page_viewed', { page_name: 'Checklist' });
    expect(firebaseAnalytics.logEvent).toHaveBeenCalledWith(
      expect.anything(), 
      'page_viewed', 
      { page_name: 'Checklist' }
    );
  });

  it('trackEvent handles empty params', () => {
    initAnalytics();
    trackEvent('simple_event');
    expect(firebaseAnalytics.logEvent).toHaveBeenCalledWith(expect.anything(), 'simple_event', {});
  });

  it('catches and logs errors during trackEvent gracefully', () => {
    initAnalytics();
    vi.mocked(firebaseAnalytics.logEvent).mockImplementationOnce(() => {
      throw new Error('Analytics error');
    });
    
    const loggerSpy = vi.spyOn(logger, 'error').mockImplementation(() => {});
    expect(() => { trackEvent('test_error'); }).not.toThrow();
    expect(loggerSpy).toHaveBeenCalled();
    
    loggerSpy.mockRestore();
  });
});
