import { ElectionPhase } from '../types/election';

export const getPhaseById = (id: string, phases: ElectionPhase[]): ElectionPhase | undefined => {
  return phases.find(p => p.id === id);
};

export const getActivePhase = (phases: ElectionPhase[]): ElectionPhase | null => {
  return phases.find(p => p.status === 'active') || null;
};

export const getPhaseProgress = (phases: ElectionPhase[]): number => {
  if (phases.length === 0) return 0;
  const completed = phases.filter(p => p.status === 'completed').length;
  return Math.round((completed / phases.length) * 100);
};

export const getNextPhase = (currentId: string, phases: ElectionPhase[]): ElectionPhase | null => {
  const currentIndex = phases.findIndex(p => p.id === currentId);
  if (currentIndex === -1 || currentIndex === phases.length - 1) return null;
  return phases[currentIndex + 1];
};

export const getPreviousPhase = (currentId: string, phases: ElectionPhase[]): ElectionPhase | null => {
  const currentIndex = phases.findIndex(p => p.id === currentId);
  if (currentIndex <= 0) return null;
  return phases[currentIndex - 1];
};

export const formatPhaseDuration = (phase: ElectionPhase): string => {
  return phase.duration || 'TBD';
};

export const isPhaseComplete = (phase: ElectionPhase): boolean => {
  return phase.status === 'completed';
};
