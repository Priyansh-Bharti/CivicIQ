import { describe, it, expect } from 'vitest';
import * as Engine from '../../lib/timelineEngine';
import { ElectionPhase } from '../../types/election';

const mockPhases: ElectionPhase[] = [
  { id: '1', name: 'P1', duration: 'D1', description: '', keyActors: [], steps: [], status: 'completed' },
  { id: '2', name: 'P2', duration: 'D2', description: '', keyActors: [], steps: [], status: 'active' },
  { id: '3', name: 'P3', duration: 'D3', description: '', keyActors: [], steps: [], status: 'pending' },
];

describe('Timeline Engine', () => {
  it('should find a phase by id', () => {
    const phase = Engine.getPhaseById('2', mockPhases);
    expect(phase?.name).toBe('P2');
  });

  it('should return undefined for non-existent id', () => {
    const phase = Engine.getPhaseById('99', mockPhases);
    expect(phase).toBeUndefined();
  });

  it('should return the currently active phase', () => {
    const active = Engine.getActivePhase(mockPhases);
    expect(active?.id).toBe('2');
  });

  it('should calculate progress correctly', () => {
    const progress = Engine.getPhaseProgress(mockPhases);
    expect(progress).toBe(33); // 1/3
  });

  it('should find the next phase', () => {
    const next = Engine.getNextPhase('1', mockPhases);
    expect(next?.id).toBe('2');
  });

  it('should return null if there is no next phase', () => {
    const next = Engine.getNextPhase('3', mockPhases);
    expect(next).toBeNull();
  });

  it('should find the previous phase', () => {
    const prev = Engine.getPreviousPhase('2', mockPhases);
    expect(prev?.id).toBe('1');
  });

  it('should return null if there is no previous phase', () => {
    const prev = Engine.getPreviousPhase('1', mockPhases);
    expect(prev).toBeNull();
  });

  it('should correctly identify completed phases', () => {
    expect(Engine.isPhaseComplete(mockPhases[0])).toBe(true);
    expect(Engine.isPhaseComplete(mockPhases[2])).toBe(false);
  });
});
