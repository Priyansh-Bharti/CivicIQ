/**
 * Election Timeline Hook
 * Manages the state and persistence of the user's progress through election phases.
 */

import { useEffect } from 'react';
import { db, auth } from '../lib/firebase';
import { doc, onSnapshot, updateDoc } from 'firebase/firestore';
import { useTimelineStore } from '../store/timelineStore';
import { logger } from '../utils/logger';
import { ElectionPhase } from '../types/election';
import * as TimelineEngine from '../engines/TimelineEngine';

/**
 * Return type for the useTimeline hook.
 */
interface TimelineHookResult {
  /** The list of election phases */
  phases: ElectionPhase[];
  /** The currently active phase ID */
  activePhaseId: string;
  /** Record of completed phase IDs */
  progress: Record<string, boolean>;
  /** Percentage of timeline completed (0-100) */
  completionPercentage: number;
  /** The next phase to be completed */
  nextPhase: ElectionPhase | null;
  /** Function to set the active phase */
  setActivePhase: (phaseId: string) => void;
  /** Function to mark a phase as viewed */
  markPhaseViewed: (phaseId: string) => Promise<void>;
}

/**
 * Custom hook for interacting with the election timeline.
 * @returns {TimelineHookResult} The timeline state and methods.
 */
export const useTimeline = (): TimelineHookResult => {
  const { 
    phases, 
    activePhaseId, 
    progress, 
    setActivePhaseId, 
    setProgress,
    markPhaseComplete 
  } = useTimelineStore();

  const user = auth.currentUser;

  useEffect(() => {
    if (!user) return;

    /** Reference to the user's Firestore document */
    const userRef = doc(db, 'users', user.uid);
    
    /** Unsubscribe function for the snapshot listener */
    const unsubscribe = onSnapshot(userRef, (snapshot) => {
      if (snapshot.exists()) {
        /** The snapshot data payload */
        const data = snapshot.data();
        if (data.progress) {
          setProgress(data.progress);
        }
      }
    }, (error) => {
      logger.error('Timeline subscription error:', error);
    });

    return () => { unsubscribe(); };
  }, [user, setProgress]);

  /**
   * Marks a specific election phase as viewed/complete.
   * @param {string} phaseId The identifier of the phase.
   */
  const markPhaseViewed = async (phaseId: string): Promise<void> => {
    markPhaseComplete(phaseId);

    if (user) {
      /** Reference to the user's Firestore document */
      const userRef = doc(db, 'users', user.uid);
      try {
        await updateDoc(userRef, {
          [`progress.${phaseId}`]: true
        });
      } catch (error) {
        logger.error('Error updating progress:', error);
      }
    }
  };

  /**
   * Updates the active phase and marks it as viewed.
   * @param {string} phaseId The identifier of the phase to activate.
   */
  const setActivePhase = (phaseId: string): void => {
    setActivePhaseId(phaseId);
    void markPhaseViewed(phaseId);
  };

  /** Dynamically calculated completion percentage */
  const completionPercentage = TimelineEngine.calculateCompletion(phases, progress);

  /** Dynamically calculated next phase */
  const nextPhase = TimelineEngine.getNextPhase(phases, progress);

  return {
    phases,
    activePhaseId,
    progress,
    completionPercentage,
    nextPhase,
    setActivePhase,
    markPhaseViewed
  };
};
