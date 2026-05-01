import { create } from 'zustand';
import { ChecklistItem } from '../types/election';

interface ChecklistState {
  items: ChecklistItem[];
  setItems: (items: ChecklistItem[]) => void;
  toggleItem: (id: string) => void;
}

export const useChecklistStore = create<ChecklistState>((set) => ({
  items: [],
  setItems: (items) => set({ items }),
  toggleItem: (id) => set((state) => ({
    items: state.items.map(item => 
      item.id === id ? { ...item, completed: !item.completed } : item
    )
  })),
}));
