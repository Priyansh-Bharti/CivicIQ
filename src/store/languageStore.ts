/**
 * Localization State Management
 * Handles the global state for the application's current language and persistence.
 */

import { create } from 'zustand';
import { LanguageCode } from '../constants';

interface LanguageState {
  currentLanguage: LanguageCode;
  /**
   * Updates the application language and persists the choice to localStorage.
   * @param {LanguageCode} lang The new language code to set.
   */
  setLanguage: (lang: LanguageCode) => void;
}

/**
 * Zustand store for managing application localization.
 */
export const useLanguageStore = create<LanguageState>((set) => ({
  currentLanguage: (localStorage.getItem('civiciq_language') as LanguageCode) || 'en',
  setLanguage: (lang: LanguageCode): void => {
    localStorage.setItem('civiciq_language', lang);
    set({ currentLanguage: lang });
  },
}));
