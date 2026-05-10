/**
 * Checklist Management Hook
 * Synchronizes voter checklist progress between local state, localStorage, and Firestore.
 */

import { useEffect, useCallback } from 'react';
import { useChecklistStore } from '../store/checklistStore';
import { CIVIC_CHECKLIST } from '../constants';
import { useAuth } from './useAuth';
import { db } from '../lib/firebase';
import { doc, getDoc, setDoc, updateDoc } from 'firebase/firestore';
import { trackEvent } from '../lib/analytics';
import { logger } from '../utils/logger';
import { ChecklistItem } from '../types/election';

const LOCAL_STORAGE_KEY = 'civiciq_checklist_progress';

interface ChecklistHookResult {
  items: ChecklistItem[];
  toggleItem: (id: string) => Promise<void>;
  completionPercentage: number;
  completedCount: number;
  totalCount: number;
}

const loadFromFirestore = async (uid: string): Promise<string[]> => {
  try {
    const docRef = doc(db, 'users', uid);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists() && docSnap.data().checklistProgress) {
      return docSnap.data().checklistProgress as string[];
    }
    await setDoc(docRef, { checklistProgress: [] }, { merge: true });
  } catch (error) { logger.error('Firestore load error:', error); }
  return [];
};

const loadFromLocal = (): string[] => {
  const localData = localStorage.getItem(LOCAL_STORAGE_KEY);
  if (!localData) return [];
  try { return JSON.parse(localData) as string[]; }
  catch (error) { logger.error('Local load error:', error); return []; }
};

export const useChecklist = (): ChecklistHookResult => {
  const { items, setItems, toggleItem } = useChecklistStore();
  const { user } = useAuth();

  useEffect(() => {
    const loadData = async (): Promise<void> => {
      const completedIds = user ? await loadFromFirestore(user.uid) : loadFromLocal();
      setItems(CIVIC_CHECKLIST.map(item => ({ ...item, completed: completedIds.includes(item.id) })));
    };
    void loadData();
  }, [user, setItems]);

  const handleToggleItem = useCallback(async (id: string): Promise<void> => {
    toggleItem(id);
    const item = items.find(i => i.id === id);
    const newState = !item?.completed;
    trackEvent('checklist_item_toggled', { item_id: id, completed: newState });

    const completedIds = items.map(i => i.id === id ? { ...i, completed: newState } : i)
      .filter(i => i.completed).map(i => i.id);

    if (user) {
      try { await updateDoc(doc(db, 'users', user.uid), { checklistProgress: completedIds }); }
      catch (error) { logger.error('Firestore save error:', error); }
    } else { localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(completedIds)); }
  }, [items, toggleItem, user]);

  const completedCount = items.filter(i => i.completed).length;
  return { items, toggleItem: handleToggleItem, completedCount, totalCount: items.length,
    completionPercentage: items.length === 0 ? 0 : Math.round((completedCount / items.length) * 100) };
};
