import { useEffect } from 'react';
import { useChecklistStore } from '../store/checklistStore';
import { CIVIC_CHECKLIST } from '../lib/constants';
import { useAuth } from './useAuth';
import { db } from '../lib/firebase';
import { doc, getDoc, setDoc, updateDoc } from 'firebase/firestore';
import { trackEvent } from '../lib/analytics';

const LOCAL_STORAGE_KEY = 'civiciq_checklist_progress';

export const useChecklist = () => {
  const { items, setItems, toggleItem } = useChecklistStore();
  const { user } = useAuth();

  // Initialize and load
  useEffect(() => {
    const loadData = async () => {
      let loadedItems = [...CIVIC_CHECKLIST];

      if (user) {
        // Load from Firestore
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
            // First time, initialize
            await setDoc(docRef, { checklistProgress: [] }, { merge: true });
          }
        } catch (error) {
          console.error('Error loading checklist from Firestore:', error);
        }
      } else {
        // Load from localStorage
        const localData = localStorage.getItem(LOCAL_STORAGE_KEY);
        if (localData) {
          try {
            const completedIds = JSON.parse(localData) as string[];
            loadedItems = loadedItems.map(item => ({
              ...item,
              completed: completedIds.includes(item.id)
            }));
          } catch (error) {
            console.error('Error parsing local checklist data:', error);
          }
        }
      }
      setItems(loadedItems);
    };

    loadData();
  }, [user, setItems]);

  const handleToggleItem = async (id: string) => {
    toggleItem(id); // optimistic update

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
        console.error('Error saving checklist to Firestore:', error);
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
