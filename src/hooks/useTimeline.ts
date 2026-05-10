/**
 * Election Timeline Hook
 * Manages the state and persistence of the user's progress through election phases.
 */

import { useEffect, useCallback } from 'react';
import { db, auth } from '../lib/firebase';
import { doc, onSnapshot, updateDoc } from 'firebase/firestore';
import { useTimelineStore } from '../store/timelineStore';
import { logger } from '../utils/logger';
import { ElectionPhase } from '../types/election';
import * as TimelineEngine from '../engines/TimelineEngine';

interface TimelineHookResult {
  phases: ElectionPhase[];
  activePhaseId: string;
  progress: Record<string, boolean>;
  completionPercentage: number;
  nextPhase: ElectionPhase | null;
  setActivePhase: (phaseId: string) => void;
  markPhaseViewed: (phaseId: string) => Promise<void>;
}

export const useTimeline = (): TimelineHookResult => {
  const { phases, activePhaseId, progress, setActivePhaseId, setProgress, markPhaseComplete } = useTimelineStore();
  const user = auth.currentUser;

  useEffect(() => {
    if (!user) return;
    const userRef = doc(db, 'users', user.uid);
    return onSnapshot(userRef, (snapshot) => {
      if (snapshot.exists()) {
        const data = snapshot.data();
        if (data.progress) setProgress(data.progress);
      }
    }, (error) => { logger.error('Timeline subscription error:', error); });
  }, [user, setProgress]);

  const markPhaseViewed = useCallback(async (phaseId: string): Promise<void> => {
    markPhaseComplete(phaseId);
    if (!user) return;
    const userRef = doc(db, 'users', user.uid);
    try { await updateDoc(userRef, { [`progress.${phaseId}`]: true }); }
    catch (error) { logger.error('Error updating progress:', error); }
  }, [user, markPhaseComplete]);

  const setActivePhase = useCallback((phaseId: string): void => {
    setActivePhaseId(phaseId);
    void markPhaseViewed(phaseId);
  }, [setActivePhaseId, markPhaseViewed]);

  return {
    phases,
    activePhaseId,
    progress,
    completionPercentage: TimelineEngine.calculateCompletion(phases, progress),
    nextPhase: TimelineEngine.getNextPhase(phases, progress),
    setActivePhase,
    markPhaseViewed
  };
};
