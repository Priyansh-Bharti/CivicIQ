/**
 * Translation Service
 * Integrates with Google Cloud Translate API to provide multi-language support with in-memory caching.
 */

import { logger } from '../utils/logger';

/**
 * In-memory cache to prevent redundant API calls.
 * Structure: Map<targetLang, Map<originalText, translatedText>>
 */
const translationCache = new Map<string, Map<string, string>>();

/**
 * Fetches translation from Google Cloud Translate API.
 */
const fetchTranslation = async (text: string, targetLang: string, apiKey: string): Promise<string> => {
  const TRANSLATE_URL = `https://translation.googleapis.com/language/translate/v2?key=${apiKey}`;
  const response = await fetch(TRANSLATE_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ q: text, target: targetLang, source: 'en', format: 'html' }),
  });

  if (!response.ok) {
    throw new Error(`Translation API error: ${response.statusText}`);
  }

  const data = await response.json();
  return data.data.translations[0].translatedText;
};

/**
 * Translates a string from English to a target language.
 * @param {string} text The source text in English.
 * @param {string} targetLang The ISO language code for the target language.
 * @returns {Promise<string>} The translated text or original text as fallback.
 */
export const translateText = async (text: string, targetLang: string): Promise<string> => {
  if (!text || targetLang === 'en') return text;

  const API_KEY = import.meta.env.VITE_TRANSLATE_API_KEY || '';
  if (!translationCache.has(targetLang)) translationCache.set(targetLang, new Map());
  
  const langCache = translationCache.get(targetLang)!;
  if (langCache.has(text)) return langCache.get(text)!;

  if (!API_KEY) {
    logger.warn('Translate API key missing, falling back to original text.');
    return text;
  }

  try {
    const translatedText = await fetchTranslation(text, targetLang, API_KEY);
    langCache.set(text, translatedText);
    return translatedText;
  } catch (error) {
    logger.error('Translation failed:', error);
    return text;
  }
};
