import { describe, it, expect } from 'vitest';
import { TimelineEngine } from '../../engines/TimelineEngine';
import { ElectionPhase } from '../../types/election';

describe('TimelineEngine', () => {
  const mockPhases: ElectionPhase[] = [
    { id: '1', name: 'Phase 1', status: 'pending' } as any,
    { id: '2', name: 'Phase 2', status: 'pending' } as any,
  ];

  it('should calculate completion correctly', () => {
    const progress = { '1': true };
    expect(TimelineEngine.calculateCompletion(mockPhases, progress)).toBe(50);
  });

  it('should handle empty phases list for completion calculation', () => {
    expect(TimelineEngine.calculateCompletion([], {})).toBe(0);
  });

  it('should handle missing progress IDs gracefully', () => {
    const phases = [{ id: '1', name: 'P1' } as any];
    expect(TimelineEngine.calculateCompletion(phases, { '2': true })).toBe(0);
  });

  it('should return null for next phase if all are completed', () => {
    const phases = [{ id: '1', name: 'P1' } as any];
    expect(TimelineEngine.getNextPhase(phases, { '1': true })).toBe(null);
  });

  it('should return null for next phase if phases list is empty', () => {
    expect(TimelineEngine.getNextPhase([], {})).toBe(null);
  });

  it('should handle out of bounds index in isPhaseAccessible', () => {
    expect(TimelineEngine.isPhaseAccessible('unknown', [], {})).toBe(true);
  });

  it('should identify the next phase', () => {
    const progress = { '1': true };
    expect(TimelineEngine.getNextPhase(mockPhases, progress)?.id).toBe('2');
  });

  it('should check phase accessibility', () => {
    const progress = { '1': true };
    expect(TimelineEngine.isPhaseAccessible('2', mockPhases, progress)).toBe(true);
    expect(TimelineEngine.isPhaseAccessible('2', mockPhases, {})).toBe(false);
  });
});
