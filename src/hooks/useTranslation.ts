import { useState, useEffect } from 'react';
import { useLanguageStore } from '../store/languageStore';
import { translateText } from '../lib/translate';

export const useTranslation = (text: string) => {
  const { currentLanguage } = useLanguageStore();
  const [translated, setTranslated] = useState(text);

  useEffect(() => {
    let isMounted = true;
    
    if (currentLanguage === 'en' || !text) {
      setTranslated(text);
      return;
    }

    const doTranslate = async () => {
      try {
        const result = await translateText(text, currentLanguage);
        if (isMounted) {
          setTranslated(result);
        }
      } catch (error) {
        console.error('Translation error in hook:', error);
        if (isMounted) setTranslated(text);
      }
    };

    doTranslate();

    return () => { isMounted = false; };
  }, [text, currentLanguage]);

  return translated;
};
