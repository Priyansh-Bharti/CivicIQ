/**
 * Timeline Engine Utilities
 * Provides logic for querying, navigating, and calculating progress through election phases.
 */

import { ElectionPhase } from '../types/election';

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
 * Calculates the overall completion percentage of the election journey.
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
 * Retrieves the phase immediately following the specified phase.
 * @param {string} currentId The current phase ID.
 * @param {ElectionPhase[]} phases The list of phases.
 * @returns {ElectionPhase | null} The next phase or null if at the end.
 */
export const getNextPhase = (currentId: string, phases: ElectionPhase[]): ElectionPhase | null => {
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
