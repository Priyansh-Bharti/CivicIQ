import { ElectionPhase } from '../types/election';

/**
 * Calculates the overall completion percentage of the election journey based on progress map.
 * @param {ElectionPhase[]} phases The list of phases.
 * @param {Record<string, boolean>} progress The user's progress map.
 * @returns {number} Percentage from 0 to 100.
 */
export const calculateCompletion = (
  phases: ElectionPhase[],
  progress: Record<string, boolean>
): number => {
  if (!phases.length) return 0;
  const validProgressKeys = Object.keys(progress).filter(key =>
    progress[key] && phases.some(p => p.id === key)
  );
  return Math.round((validProgressKeys.length / phases.length) * 100);
};

/**
 * Identifies the next logical phase to focus on based on progress map.
 * @param {ElectionPhase[]} phases The list of phases.
 * @param {Record<string, boolean>} progress The user's progress map.
 * @returns {ElectionPhase | null} The next phase to focus on.
 */
export const getNextPhase = (
  phases: ElectionPhase[],
  progress: Record<string, boolean>
): ElectionPhase | null => {
  return phases.find(phase => !progress[phase.id]) || null;
};

/**
 * Determines if a phase is accessible to the user (e.g., prerequisites met).
 * @param {string} phaseId The phase to check.
 * @param {ElectionPhase[]} phases The full list of phases.
 * @param {Record<string, boolean>} progress The user's progress map.
 * @returns {boolean} True if the phase can be accessed.
 */
export const isPhaseAccessible = (
  phaseId: string,
  phases: ElectionPhase[],
  progress: Record<string, boolean>
): boolean => {
  const index = phases.findIndex(p => p.id === phaseId);
  if (index <= 0) return true;

  const previousPhase = phases[index - 1];
  return !!progress[previousPhase.id];
};

/**
 * Retrieves a specific phase by its unique identifier.
 * @param {string} id The phase ID.
 * @param {ElectionPhase[]} phases The list of phases to search.
 * @returns {ElectionPhase | undefined} The matching phase or undefined.
 */
export const getPhaseById = (id: string, phases: ElectionPhase[]): ElectionPhase | undefined => {
  return phases.find(p => p.id === id);
};

/**
 * Identifies the currently active election phase.
 * @param {ElectionPhase[]} phases The list of phases.
 * @returns {ElectionPhase | null} The active phase or null if none are active.
 */
export const getActivePhase = (phases: ElectionPhase[]): ElectionPhase | null => {
  return phases.find(p => p.status === 'active') || null;
};

/**
 * Calculates the overall completion percentage based on phase status.
 * @param {ElectionPhase[]} phases The list of phases.
 * @returns {number} The completion percentage (0-100).
 */
export const getPhaseProgress = (phases: ElectionPhase[]): number => {
  if (phases.length === 0) {
    return 0;
  }
  const completed = phases.filter(p => p.status === 'completed').length;
  return Math.round((completed / phases.length) * 100);
};

/**
 * Retrieves the phase immediately following the specified phase by ID.
 * @param {string} currentId The current phase ID.
 * @param {ElectionPhase[]} phases The list of phases.
 * @returns {ElectionPhase | null} The next phase or null if at the end.
 */
export const getNextPhaseById = (currentId: string, phases: ElectionPhase[]): ElectionPhase | null => {
  const currentIndex = phases.findIndex(p => p.id === currentId);
  if (currentIndex === -1 || currentIndex === phases.length - 1) {
    return null;
  }
  return phases[currentIndex + 1];
};

/**
 * Retrieves the phase immediately preceding the specified phase.
 * @param {string} currentId The current phase ID.
 * @param {ElectionPhase[]} phases The list of phases.
 * @returns {ElectionPhase | null} The previous phase or null if at the beginning.
 */
export const getPreviousPhase = (currentId: string, phases: ElectionPhase[]): ElectionPhase | null => {
  const currentIndex = phases.findIndex(p => p.id === currentId);
  if (currentIndex <= 0) {
    return null;
  }
  return phases[currentIndex - 1];
};

/**
 * Returns a human-readable duration string for a phase.
 * @param {ElectionPhase} phase The phase data.
 * @returns {string} The duration string.
 */
export const formatPhaseDuration = (phase: ElectionPhase): string => {
  return phase.duration || 'TBD';
};

/**
 * Determines if a phase is fully completed.
 * @param {ElectionPhase} phase The phase data.
 * @returns {boolean} True if completed.
 */
export const isPhaseComplete = (phase: ElectionPhase): boolean => {
  return phase.status === 'completed';
};
