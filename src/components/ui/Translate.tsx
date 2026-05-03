/**
 * Translation Wrapper Component
 * Automatically translates the provided text based on the application's current language setting.
 */

import React from 'react';
import { useTranslation } from '../../hooks/useTranslation';

interface TranslateProps {
  /** The plain-text content to translate. */
  text: string;
}

/**
 * Renders a translated string, handling potential HTML entities from the translation service.
 * @param {TranslateProps} props Component properties.
 * @returns {JSX.Element} The rendered translation.
 */
export const Translate: React.FC<TranslateProps> = ({ text }): JSX.Element => {
  const translated = useTranslation(text);
  
  // Using dangerouslySetInnerHTML because Cloud Translate might return HTML entities (e.g. &#39;)
  return <span dangerouslySetInnerHTML={{ __html: translated }} />;
};
