import { describe, it, expect } from 'vitest';
import { 
  getPhaseById, 
  getActivePhase, 
  getPhaseProgress, 
  getNextPhase, 
  getPreviousPhase, 
  formatPhaseDuration, 
  isPhaseComplete 
} from '../../lib/timelineEngine';
import { ELECTION_PHASES } from '../../lib/constants';

describe('timelineEngine', () => {
  it('getPhaseById returns correct phase', () => {
    expect(getPhaseById('2', ELECTION_PHASES)?.name).toBe('National Conventions');
  });

  it('getPhaseById returns undefined for invalid id', () => {
    expect(getPhaseById('invalid', ELECTION_PHASES)).toBeUndefined();
  });

  it('getActivePhase returns active phase', () => {
    const phases = JSON.parse(JSON.stringify(ELECTION_PHASES));
    phases[2].status = 'active';
    expect(getActivePhase(phases)?.id).toBe('3');
  });

  it('getActivePhase returns null if none active', () => {
    const phases = JSON.parse(JSON.stringify(ELECTION_PHASES));
    phases.forEach((p: any) => p.status = 'pending');
    expect(getActivePhase(phases)).toBeNull();
  });

  it('getPhaseProgress calculates correctly (0%)', () => {
    const phases = JSON.parse(JSON.stringify(ELECTION_PHASES));
    phases.forEach((p: any) => p.status = 'pending');
    expect(getPhaseProgress(phases)).toBe(0);
  });

  it('getPhaseProgress calculates correctly (100%)', () => {
    const phases = JSON.parse(JSON.stringify(ELECTION_PHASES));
    const completed = phases.map((p: any) => ({ ...p, status: 'completed' as const }));
    expect(getPhaseProgress(completed)).toBe(100);
  });

  it('getPhaseProgress calculates correctly (~50%)', () => {
    const phases = JSON.parse(JSON.stringify(ELECTION_PHASES));
    phases.forEach((p: any) => p.status = 'pending');
    phases[0].status = 'completed';
    phases[1].status = 'completed';
    phases[2].status = 'completed';
    expect(getPhaseProgress(phases)).toBe(50); // 3 of 6
  });

  it('getNextPhase returns next phase', () => {
    expect(getNextPhase('1', ELECTION_PHASES)?.id).toBe('2');
  });

  it('getNextPhase returns null if at end', () => {
    expect(getNextPhase('6', ELECTION_PHASES)).toBeNull();
  });

  it('getPreviousPhase returns prev phase', () => {
    expect(getPreviousPhase('2', ELECTION_PHASES)?.id).toBe('1');
  });

  it('getPreviousPhase returns null if at start', () => {
    expect(getPreviousPhase('1', ELECTION_PHASES)).toBeNull();
  });

  it('formatPhaseDuration formats correctly', () => {
    expect(formatPhaseDuration(ELECTION_PHASES[0])).toBe('January – June');
  });

  it('isPhaseComplete returns true when completed', () => {
    const p = { ...ELECTION_PHASES[0], status: 'completed' as const };
    expect(isPhaseComplete(p)).toBe(true);
  });

  it('isPhaseComplete returns false when pending', () => {
    const p = { ...ELECTION_PHASES[0], status: 'pending' as const };
    expect(isPhaseComplete(p)).toBe(false);
  });

  it('handles empty array gracefully', () => {
    expect(getActivePhase([])).toBeNull();
    expect(getPhaseProgress([])).toBe(0);
    expect(getNextPhase('1', [])).toBeNull();
  });
});
