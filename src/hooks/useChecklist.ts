/**
 * Checklist Management Hook
 * Synchronizes voter checklist progress between local state, localStorage, and Firestore.
 */

import { useEffect } from 'react';
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

/**
 * Custom hook for managing the voter checklist progress.
 * @returns {ChecklistHookResult} The checklist state and control methods.
 */
export const useChecklist = (): ChecklistHookResult => {
  const { items, setItems, toggleItem } = useChecklistStore();
  const { user } = useAuth();

  useEffect(() => {
    /**
     * Loads checklist progress from the most relevant data source.
     */
    const loadData = async (): Promise<void> => {
      let loadedItems = [...CIVIC_CHECKLIST];

      if (user) {
        try {
          const docRef = doc(db, 'users', user.uid);
          const docSnap = await getDoc(docRef);
          if (docSnap.exists() && docSnap.data().checklistProgress) {
            const completedIds = docSnap.data().checklistProgress as string[];
            loadedItems = loadedItems.map(item => ({
              ...item,
              completed: completedIds.includes(item.id)
            }));
          } else {
            await setDoc(docRef, { checklistProgress: [] }, { merge: true });
          }
        } catch (error) {
          logger.error('Error loading checklist from Firestore:', error);
        }
      } else {
        const localData = localStorage.getItem(LOCAL_STORAGE_KEY);
        if (localData) {
          try {
            const completedIds = JSON.parse(localData) as string[];
            loadedItems = loadedItems.map(item => ({
              ...item,
              completed: completedIds.includes(item.id)
            }));
          } catch (error) {
            logger.error('Error parsing local checklist data:', error);
          }
        }
      }
      setItems(loadedItems);
    };

    void loadData();
  }, [user, setItems]);

  /**
   * Toggles the completion status of a checklist item.
   * @param {string} id The unique identifier of the checklist item.
   */
  const handleToggleItem = async (id: string): Promise<void> => {
    toggleItem(id); 

    const item = items.find(i => i.id === id);
    const newCompletedState = !item?.completed;

    trackEvent('checklist_item_toggled', { 
      item_id: id, 
      completed: newCompletedState 
    });

    const updatedItems = items.map(i => i.id === id ? { ...i, completed: newCompletedState } : i);
    const completedIds = updatedItems.filter(i => i.completed).map(i => i.id);

    if (user) {
      try {
        const docRef = doc(db, 'users', user.uid);
        await updateDoc(docRef, { checklistProgress: completedIds });
      } catch (error) {
        logger.error('Error saving checklist to Firestore:', error);
      }
    } else {
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(completedIds));
    }
  };

  const completedCount = items.filter(i => i.completed).length;
  const completionPercentage = items.length === 0 ? 0 : Math.round((completedCount / items.length) * 100);

  return {
    items,
    toggleItem: handleToggleItem,
    completionPercentage,
    completedCount,
    totalCount: items.length
  };
};
