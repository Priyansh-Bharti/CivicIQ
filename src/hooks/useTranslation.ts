/**
 * Translation Hook
 * Dynamically translates a given text string based on the current application language.
 */

import { useState, useEffect } from 'react';
import { useLanguageStore } from '../store/languageStore';
import { translateText } from '../lib/translate';
import { logger } from '../utils/logger';

/**
 * Custom hook for translating text content.
 * @param {string} text The source text to translate.
 * @returns {string} The translated text (or original text as fallback).
 */
export const useTranslation = (text: string): string => {
  const { currentLanguage } = useLanguageStore();
  const [translated, setTranslated] = useState<string>(text);

  useEffect(() => {
    let isMounted = true;
    
    if (currentLanguage === 'en' || !text) {
      setTranslated(text);
      return;
    }

    /**
     * Performs the asynchronous translation request.
     */
    const doTranslate = async (): Promise<void> => {
      try {
        const result = await translateText(text, currentLanguage);
        if (isMounted) {
          setTranslated(result);
        }
      } catch (error) {
        logger.error('Translation error in hook:', error);
        if (isMounted) setTranslated(text);
      }
    };

    void doTranslate();

    return () => { isMounted = false; };
  }, [text, currentLanguage]);

  return translated;
};
