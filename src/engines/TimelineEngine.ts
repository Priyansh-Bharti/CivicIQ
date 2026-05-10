import { ElectionPhase } from '../types/election';

export const calculateCompletion = (phases: ElectionPhase[], progress: Record<string, boolean>): number => {
  if (!phases.length) return 0;
  const validProgressKeys = Object.keys(progress).filter(key =>
    progress[key] && phases.some(p => p.id === key)
  );
  return Math.round((validProgressKeys.length / phases.length) * 100);
};

export const getNextPhase = (phases: ElectionPhase[], progress: Record<string, boolean>): ElectionPhase | null => {
  return phases.find(phase => !progress[phase.id]) || null;
};

export const isPhaseAccessible = (phaseId: string, phases: ElectionPhase[], progress: Record<string, boolean>): boolean => {
  const index = phases.findIndex(p => p.id === phaseId);
  if (index <= 0) return true;
  return !!progress[phases[index - 1].id];
};

export const getPhaseById = (id: string, phases: ElectionPhase[]): ElectionPhase | undefined => phases.find(p => p.id === id);

export const getActivePhase = (phases: ElectionPhase[]): ElectionPhase | null => phases.find(p => p.status === 'active') || null;

export const getPhaseProgress = (phases: ElectionPhase[]): number => {
  if (phases.length === 0) return 0;
  const completed = phases.filter(p => p.status === 'completed').length;
  return Math.round((completed / phases.length) * 100);
};

export const getNextPhaseById = (currentId: string, phases: ElectionPhase[]): ElectionPhase | null => {
  const currentIndex = phases.findIndex(p => p.id === currentId);
  return (currentIndex === -1 || currentIndex === phases.length - 1) ? null : phases[currentIndex + 1];
};

export const getPreviousPhase = (currentId: string, phases: ElectionPhase[]): ElectionPhase | null => {
  const currentIndex = phases.findIndex(p => p.id === currentId);
  return currentIndex <= 0 ? null : phases[currentIndex - 1];
};

export const formatPhaseDuration = (phase: ElectionPhase): string => phase.duration || 'TBD';

export const isPhaseComplete = (phase: ElectionPhase): boolean => phase.status === 'completed';
