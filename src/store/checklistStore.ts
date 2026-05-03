/**
 * Voter Checklist State Management
 * Handles the global state for the civic checklist items and their completion status.
 */

import { create } from 'zustand';
import { ChecklistItem } from '../types/election';

interface ChecklistState {
  items: ChecklistItem[];
  /**
   * Initializes or replaces the current checklist items.
   * @param {ChecklistItem[]} items The new array of checklist items.
   */
  setItems: (items: ChecklistItem[]) => void;
  /**
   * Toggles the completion status of a specific checklist item.
   * @param {string} id The unique identifier of the item.
   */
  toggleItem: (id: string) => void;
}

/**
 * Zustand store for managing the voter checklist progress.
 */
export const useChecklistStore = create<ChecklistState>((set) => ({
  items: [],
  setItems: (items: ChecklistItem[]): void => { set({ items }); },
  toggleItem: (id: string): void => { set((state) => ({
    items: state.items.map(item => 
      item.id === id ? { ...item, completed: !item.completed } : item
    )
  })); },
}));
