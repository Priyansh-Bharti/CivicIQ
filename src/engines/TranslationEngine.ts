import { SUPPORTED_LANGUAGES, LanguageCode } from '../constants';

/**
 * Translation Engine
 * A lightweight, high-performance internationalization engine.
 * Supports dynamic language switching and RTL/LTR layout orchestration.
 */
export class TranslationEngine {
  /**
   * Translates a given key into the target language.
   * Note: In a real production app, this would fetch from a CDN or JSON files.
   * For this sprint, we provide a structured implementation proof.
   * @param {string} key The localization key.
   * @param {LanguageCode} lang The target language code.
   * @returns {string} The translated string.
   */
  public static t(key: string, lang: LanguageCode): string {
    // Mapping of keys to translations (Sample set for architectural proof)
    const translations: Record<string, Record<string, string>> = {
      'nav.dashboard': { en: 'Dashboard', hi: 'डैशबोर्ड', es: 'Tablero', ar: 'لوحة القيادة' },
      'nav.timeline': { en: 'Journey', hi: 'यात्रा', es: 'Viaje', ar: 'الرحلة' },
      'nav.checklist': { en: 'Checklist', hi: 'चेकलिस्ट', es: 'Lista', ar: 'قائمة التحقق' },
      'chat.placeholder': { en: 'Ask about elections...', hi: 'चुनाव के बारे में पूछें...', es: 'Pregunte sobre...', ar: 'اسأل عن الانتخابات...' },
    };

    return translations[key]?.[lang] || translations[key]?.en || key;
  }

  /**
   * Returns the text direction (RTL/LTR) for a given language.
   * @param {LanguageCode} lang The language code.
   * @returns {'rtl' | 'ltr'}
   */
  public static getDirection(lang: LanguageCode): 'rtl' | 'ltr' {
    const language = SUPPORTED_LANGUAGES.find(l => l.code === lang);
    return (language?.dir!) || 'ltr';
  }
}
