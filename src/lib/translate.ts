// In-memory cache: Map<targetLang, Map<originalText, translatedText>>
const translationCache = new Map<string, Map<string, string>>();

export const translateText = async (text: string, targetLang: string): Promise<string> => {
  if (!text || targetLang === 'en') return text;

  const API_KEY = import.meta.env.VITE_TRANSLATE_API_KEY || '';
  const TRANSLATE_URL = `https://translation.googleapis.com/language/translate/v2?key=${API_KEY}`;

  // Check cache
  if (!translationCache.has(targetLang)) {
    translationCache.set(targetLang, new Map());
  }
  const langCache = translationCache.get(targetLang)!;
  if (langCache.has(text)) {
    return langCache.get(text)!;
  }

  if (!API_KEY) {
    console.warn('Translate API key missing, falling back to original text.');
    return text;
  }

  try {
    const response = await fetch(TRANSLATE_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        q: text,
        target: targetLang,
        source: 'en',
        format: 'html' // preserve basic formatting if any
      }),
    });

    if (!response.ok) {
      throw new Error(`Translation API error: ${response.statusText}`);
    }

    const data = await response.json();
    const translatedText = data.data.translations[0].translatedText;
    
    // Save to cache
    langCache.set(text, translatedText);
    return translatedText;
  } catch (error) {
    console.error('Translation failed:', error);
    return text; // Graceful fallback
  }
};
