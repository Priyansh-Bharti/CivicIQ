import { describe, it, expect, beforeEach } from 'vitest';
import { useTimelineStore } from '../../../store/timelineStore';

describe('Timeline Store', () => {
  beforeEach(() => {
    // Reset state manually if needed, but Zustand stores persist in tests 
    // unless we have a specific reset mechanism.
  });

  it('should set the active phase', () => {
    useTimelineStore.getState().setActivePhaseId('phase-2');
    expect(useTimelineStore.getState().activePhaseId).toBe('phase-2');
  });

  it('should update progress', () => {
    useTimelineStore.getState().markPhaseComplete('phase-1');
    expect(useTimelineStore.getState().progress['phase-1']).toBe(true);
  });
});
