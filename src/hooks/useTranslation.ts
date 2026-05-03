import { useState, useEffect } from 'react';
import { LanguageCode } from '../constants';
import { TranslationEngine } from '../engines/TranslationEngine';

/**
 * useTranslation Hook
 * Provides translation capabilities and layout direction management.
 */
export const useTranslation = () => {
  const [lang, setLang] = useState<LanguageCode>(
    (localStorage.getItem('civiciq_lang') as LanguageCode) || 'en'
  );

  useEffect(() => {
    localStorage.setItem('civiciq_lang', lang);
    // Apply direction to the HTML root for global RTL support
    const dir = TranslationEngine.getDirection(lang);
    document.documentElement.dir = dir;
    document.documentElement.lang = lang;
  }, [lang]);

  const t = (key: string) => TranslationEngine.t(key, lang);
  const changeLanguage = (newLang: LanguageCode) => { setLang(newLang); };

  return {
    t,
    lang,
    changeLanguage,
    dir: TranslationEngine.getDirection(lang)
  };
};
