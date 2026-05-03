/**
 * Election Timeline State Management
 * Handles the global state for election phases and user progress tracking.
 */

import { create } from 'zustand';
import { ElectionPhase } from '../types/election';
import { ELECTION_PHASES } from '../constants';

interface TimelineState {
  phases: ElectionPhase[];
  activePhaseId: string;
  progress: Record<string, boolean>;
  /**
   * Replaces the current election phases.
   * @param {ElectionPhase[]} phases The new phases array.
   */
  setPhases: (phases: ElectionPhase[]) => void;
  /**
   * Sets the currently active election phase.
   * @param {string} id The identifier of the phase.
   */
  setActivePhaseId: (id: string) => void;
  /**
   * Replaces the user's progress state.
   * @param {Record<string, boolean>} progress The new progress map.
   */
  setProgress: (progress: Record<string, boolean>) => void;
  /**
   * Marks a specific phase as viewed or complete.
   * @param {string} id The identifier of the phase.
   */
  markPhaseComplete: (id: string) => void;
}

/**
 * Zustand store for managing the election timeline and journey progress.
 */
export const useTimelineStore = create<TimelineState>((set) => ({
  phases: ELECTION_PHASES,
  activePhaseId: ELECTION_PHASES[0].id,
  progress: {},
  setPhases: (phases: ElectionPhase[]): void => { set({ phases }); },
  setActivePhaseId: (id: string): void => { set({ activePhaseId: id }); },
  setProgress: (progress: Record<string, boolean>): void => { set({ progress }); },
  markPhaseComplete: (id: string): void => { set((state) => ({
    progress: { ...state.progress, [id]: true }
  })); },
}));
