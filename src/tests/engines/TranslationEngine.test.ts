import { describe, it, expect } from 'vitest';
import { TranslationEngine } from '../../engines/TranslationEngine';

describe('TranslationEngine', () => {
  it('should translate keys correctly for English', () => {
    expect(TranslationEngine.t('nav.dashboard', 'en')).toBe('Dashboard');
    expect(TranslationEngine.t('nav.timeline', 'en')).toBe('Journey');
  });

  it('should translate keys correctly for Hindi', () => {
    expect(TranslationEngine.t('nav.dashboard', 'hi')).toBe('डैशबोर्ड');
  });

  it('should fallback to English for unknown keys', () => {
    expect(TranslationEngine.t('unknown.key', 'hi')).toBe('unknown.key');
  });

  it('should return correct direction for Arabic', () => {
    expect(TranslationEngine.getDirection('ar')).toBe('rtl');
  });

  it('should return correct direction for English', () => {
    expect(TranslationEngine.getDirection('en')).toBe('ltr');
  });
});
