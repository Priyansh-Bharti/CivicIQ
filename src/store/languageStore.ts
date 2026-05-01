import { create } from 'zustand';

interface LanguageState {
  currentLanguage: string;
  setLanguage: (lang: string) => void;
}

export const useLanguageStore = create<LanguageState>((set) => ({
  currentLanguage: localStorage.getItem('civiciq_language') || 'en',
  setLanguage: (lang) => {
    localStorage.setItem('civiciq_language', lang);
    set({ currentLanguage: lang });
  },
}));
