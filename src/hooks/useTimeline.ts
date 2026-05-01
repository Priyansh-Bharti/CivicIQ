import { useEffect } from 'react';
import { db, auth } from '../lib/firebase';
import { doc, onSnapshot, updateDoc, setDoc, getDoc } from 'firebase/firestore';
import { useTimelineStore } from '../store/timelineStore';

export const useTimeline = () => {
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
    
    // Subscribe to progress updates
    const unsubscribe = onSnapshot(userRef, (doc) => {
      if (doc.exists()) {
        const data = doc.data();
        if (data.progress) {
          setProgress(data.progress);
        }
      }
    });

    return () => unsubscribe();
  }, [user, setProgress]);

  const markPhaseViewed = async (phaseId: string) => {
    // Optimistic update
    markPhaseComplete(phaseId);

    if (user) {
      const userRef = doc(db, 'users', user.uid);
      try {
        await updateDoc(userRef, {
          [`progress.${phaseId}`]: true
        });
      } catch (error) {
        // If doc doesn't exist or progress field missing, handle it
        console.error('Error updating progress:', error);
      }
    }
  };

  const setActivePhase = (phaseId: string) => {
    setActivePhaseId(phaseId);
    markPhaseViewed(phaseId);
  };

  return {
    phases,
    activePhaseId,
    progress,
    setActivePhase,
    markPhaseViewed
  };
};
