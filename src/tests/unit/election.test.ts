import { describe, it, expect } from 'vitest';
import { ELECTION_PHASES } from '../../lib/constants';

describe('Election Constants', () => {
  it('should have exactly 6 election phases', () => {
    expect(ELECTION_PHASES).toHaveLength(6);
  });

  it('should have the first phase as Primary Elections and Caucuses', () => {
    const firstPhase = ELECTION_PHASES[0];
    expect(firstPhase.id).toBe('1');
    expect(firstPhase.name).toBe('Primary Elections and Caucuses');
  });

  it('should have the last phase as Inauguration', () => {
    const lastPhase = ELECTION_PHASES[ELECTION_PHASES.length - 1];
    expect(lastPhase.id).toBe('6');
    expect(lastPhase.name).toBe('Inauguration');
  });

  it('should have at least 4 steps for every phase', () => {
    ELECTION_PHASES.forEach((phase) => {
      expect(phase.steps.length).toBeGreaterThanOrEqual(4);
    });
  });

  it('should have at least 3 key actors for every phase', () => {
    ELECTION_PHASES.forEach((phase) => {
      expect(phase.keyActors.length).toBeGreaterThanOrEqual(3);
    });
  });
});
