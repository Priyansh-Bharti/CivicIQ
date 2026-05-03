/**
 * Language Switcher Component
 * Provides a dropdown interface for users to select their preferred language from a grouped list.
 */

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLanguageStore } from '../../store/languageStore';
import { Globe } from 'lucide-react';
import { SUPPORTED_LANGUAGES, LanguageCode } from '../../constants';

/**
 * Language region groups for better organization in the UI.
 */
const GROUPS = [
  { label: "South Asia", codes: ['hi', 'bn', 'ur', 'pa', 'te', 'ta', 'mr'] },
  { label: "Europe", codes: ['en', 'es', 'fr', 'de', 'pt', 'ru', 'tr', 'it'] },
  { label: "East Asia", codes: ['zh', 'ja', 'ko', 'vi', 'id'] },
  { label: "Middle East & Africa", codes: ['ar', 'sw'] },
];

/**
 * Renders a stylized language selection dropdown.
 * @returns {JSX.Element} The rendered switcher.
 */
export const LanguageSwitcher: React.FC = (): JSX.Element => {
  const { currentLanguage, setLanguage } = useLanguageStore();
  const [isOpen, setIsOpen] = useState(false);

  const current = SUPPORTED_LANGUAGES.find(l => l.code === currentLanguage) || SUPPORTED_LANGUAGES[0];

  useEffect(() => {
    /**
     * Applies language and text direction attributes to the document root.
     * @param {typeof SUPPORTED_LANGUAGES[number]} lang The language configuration.
     */
    const applyLanguage = (lang: typeof SUPPORTED_LANGUAGES[number]): void => {
      document.documentElement.setAttribute('lang', lang.code);
      document.documentElement.setAttribute('dir', lang.dir);
    };
    applyLanguage(current);
  }, [current]);

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Select language"
        className="flex items-center gap-2 text-white hover:bg-white/10 px-3 py-2 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-amber"
      >
        <Globe className="w-5 h-5" />
        <span className="hidden sm:inline font-medium">{current.flag}</span>
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className="absolute right-0 mt-2 w-64 bg-white rounded-xl shadow-2xl border border-gray-200 overflow-hidden z-50 max-h-[80vh] overflow-y-auto"
          >
            {GROUPS.map((group) => (
              <div key={group.label} className="border-b border-gray-100 last:border-0">
                <div className="px-4 py-2 bg-gray-50 text-[10px] font-bold uppercase tracking-wider text-gray-500">
                  {group.label}
                </div>
                {group.codes.map((code) => {
                  const lang = SUPPORTED_LANGUAGES.find(l => l.code === code);
                  if (!lang) return null;
                  
                  return (
                    <button
                      key={lang.code}
                      onClick={() => {
                        setLanguage(lang.code as LanguageCode);
                        setIsOpen(false);
                      }}
                      className={`w-full flex items-center gap-3 px-4 py-3 text-sm transition-colors ${
                        currentLanguage === lang.code 
                          ? 'bg-indigo/5 text-indigo font-bold' 
                          : 'text-on-surface hover:bg-gray-50'
                      }`}
                    >
                      <span className="text-xl">{lang.flag}</span>
                      <div className="flex flex-col items-start text-left">
                        <span className="font-medium leading-none">{lang.nativeName}</span>
                        <span className="text-[10px] text-gray-400 mt-1">{lang.name}</span>
                      </div>
                    </button>
                  );
                })}
              </div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
