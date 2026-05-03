/**
 * Election Timeline Hook
 * Manages the state and persistence of the user's progress through election phases.
 */

import { useEffect, useMemo, useCallback } from 'react';
import { db, auth } from '../lib/firebase';
import { doc, onSnapshot, updateDoc } from 'firebase/firestore';
import { useTimelineStore } from '../store/timelineStore';
import { logger } from '../utils/logger';
import { ElectionPhase } from '../types/election';
import { TimelineEngine } from '../engines/TimelineEngine';

interface TimelineHookResult {
  phases: ElectionPhase[];
  activePhaseId: string;
  progress: Record<string, boolean>;
  completionPercentage: number;
  nextPhase: ElectionPhase | null;
  setActivePhase: (phaseId: string) => void;
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

    const userRef = doc(db, 'users', user.uid);
    
    // Real-time synchronization of progress state
    const unsubscribe = onSnapshot(userRef, (snapshot) => {
      if (snapshot.exists()) {
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
  const markPhaseViewed = useCallback(async (phaseId: string): Promise<void> => {
    markPhaseComplete(phaseId);

    if (user) {
      const userRef = doc(db, 'users', user.uid);
      try {
        await updateDoc(userRef, {
          [`progress.${phaseId}`]: true
        });
      } catch (error) {
        logger.error('Error updating progress:', error);
      }
    }
  }, [user, markPhaseComplete]);

  /**
   * Updates the active phase and marks it as viewed.
   * @param {string} phaseId The identifier of the phase to activate.
   */
  const setActivePhase = useCallback((phaseId: string): void => {
    setActivePhaseId(phaseId);
    void markPhaseViewed(phaseId);
  }, [setActivePhaseId, markPhaseViewed]);

  // Memoized derived values — recompute only when phases or progress change
  const completionPercentage = useMemo(
    () => TimelineEngine.calculateCompletion(phases, progress),
    [phases, progress]
  );

  const nextPhase = useMemo(
    () => TimelineEngine.getNextPhase(phases, progress),
    [phases, progress]
  );

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
