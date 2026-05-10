import { describe, it, expect } from 'vitest';
import * as TimelineEngine from '../../engines/TimelineEngine';
import { ELECTION_PHASES } from '../../lib/constants';
import { ElectionPhase } from '../../types';

describe('timelineEngine', () => {
  it('getPhaseById returns correct phase', () => {
    expect(TimelineEngine.getPhaseById('2', ELECTION_PHASES)?.name).toBe('National Conventions');
  });

  it('getPhaseById returns undefined for invalid id', () => {
    expect(TimelineEngine.getPhaseById('invalid', ELECTION_PHASES)).toBeUndefined();
  });

  it('getActivePhase returns active phase', () => {
    const phases: ElectionPhase[] = JSON.parse(JSON.stringify(ELECTION_PHASES)) as ElectionPhase[];
    phases[2].status = 'active';
    expect(TimelineEngine.getActivePhase(phases)?.id).toBe('3');
  });

  it('getActivePhase returns null if none active', () => {
    const phases: ElectionPhase[] = JSON.parse(JSON.stringify(ELECTION_PHASES)) as ElectionPhase[];
    phases.forEach((p: ElectionPhase) => { p.status = 'pending'; });
    expect(TimelineEngine.getActivePhase(phases)).toBeNull();
  });

  it('getPhaseProgress calculates correctly (0%)', () => {
    const phases: ElectionPhase[] = JSON.parse(JSON.stringify(ELECTION_PHASES)) as ElectionPhase[];
    phases.forEach((p: ElectionPhase) => { p.status = 'pending'; });
    expect(TimelineEngine.getPhaseProgress(phases)).toBe(0);
  });

  it('getPhaseProgress calculates correctly (100%)', () => {
    const phases: ElectionPhase[] = JSON.parse(JSON.stringify(ELECTION_PHASES)) as ElectionPhase[];
    const completed = phases.map((p: ElectionPhase) => ({ ...p, status: 'completed' as const }));
    expect(TimelineEngine.getPhaseProgress(completed)).toBe(100);
  });

  it('getPhaseProgress calculates correctly (~50%)', () => {
    const phases: ElectionPhase[] = JSON.parse(JSON.stringify(ELECTION_PHASES)) as ElectionPhase[];
    phases.forEach((p: ElectionPhase) => { p.status = 'pending'; });
    phases[0].status = 'completed';
    phases[1].status = 'completed';
    phases[2].status = 'completed';
    expect(TimelineEngine.getPhaseProgress(phases)).toBe(50); // 3 of 6
  });

  it('getNextPhaseById returns next phase', () => {
    expect(TimelineEngine.getNextPhaseById('1', ELECTION_PHASES)?.id).toBe('2');
  });

  it('getNextPhaseById returns null if at end', () => {
    expect(TimelineEngine.getNextPhaseById('6', ELECTION_PHASES)).toBeNull();
  });

  it('getPreviousPhase returns prev phase', () => {
    expect(TimelineEngine.getPreviousPhase('2', ELECTION_PHASES)?.id).toBe('1');
  });

  it('getPreviousPhase returns null if at start', () => {
    expect(TimelineEngine.getPreviousPhase('1', ELECTION_PHASES)).toBeNull();
  });

  it('formatPhaseDuration formats correctly', () => {
    expect(TimelineEngine.formatPhaseDuration(ELECTION_PHASES[0])).toBe('January – June');
  });

  it('isPhaseComplete returns true when completed', () => {
    const p: ElectionPhase = { ...ELECTION_PHASES[0], status: 'completed' as const };
    expect(TimelineEngine.isPhaseComplete(p)).toBe(true);
  });

  it('isPhaseComplete returns false when pending', () => {
    const p: ElectionPhase = { ...ELECTION_PHASES[0], status: 'pending' as const };
    expect(TimelineEngine.isPhaseComplete(p)).toBe(false);
  });

  it('handles empty array gracefully', () => {
    expect(TimelineEngine.getActivePhase([])).toBeNull();
    expect(TimelineEngine.getPhaseProgress([])).toBe(0);
    expect(TimelineEngine.getNextPhaseById('1', [])).toBeNull();
  });

  it('getPhaseById handles non-existent numeric id', () => {
    expect(TimelineEngine.getPhaseById('99', ELECTION_PHASES)).toBeUndefined();
  });

  it('getNextPhaseById handles non-existent current id', () => {
    expect(TimelineEngine.getNextPhaseById('99', ELECTION_PHASES)).toBeNull();
  });

  it('getPreviousPhase handles non-existent current id', () => {
    expect(TimelineEngine.getPreviousPhase('99', ELECTION_PHASES)).toBeNull();
  });

  it('getPhaseProgress handles partially completed phases', () => {
    const phases: ElectionPhase[] = JSON.parse(JSON.stringify(ELECTION_PHASES)) as ElectionPhase[];
    phases[0].status = 'completed';
    // 1 out of 6
    expect(TimelineEngine.getPhaseProgress(phases)).toBe(17);
  });

  it('getActivePhase handles multiple active phases (returns first)', () => {
    const phases: ElectionPhase[] = JSON.parse(JSON.stringify(ELECTION_PHASES)) as ElectionPhase[];
    phases[0].status = 'active';
    phases[1].status = 'active';
    expect(TimelineEngine.getActivePhase(phases)?.id).toBe('1');
  });

  it('formatPhaseDuration handles missing duration', () => {
    const phase = { ...ELECTION_PHASES[0], duration: undefined };
    expect(TimelineEngine.formatPhaseDuration(phase as unknown as ElectionPhase)).toBe('TBD');
  });

  it('isPhaseComplete handles undefined status', () => {
    const phase = { ...ELECTION_PHASES[0], status: undefined };
    expect(TimelineEngine.isPhaseComplete(phase as unknown as ElectionPhase)).toBe(false);
  });

  it('getNextPhaseById returns null for invalid input', () => {
    expect(TimelineEngine.getNextPhaseById('', ELECTION_PHASES)).toBeNull();
  });

  it('getPreviousPhase returns null for invalid input', () => {
    expect(TimelineEngine.getPreviousPhase('', ELECTION_PHASES)).toBeNull();
  });

  it('getPhaseById returns first item if no id provided', () => {
    expect(TimelineEngine.getPhaseById(undefined as unknown as string, ELECTION_PHASES)).toBeUndefined();
  });

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
