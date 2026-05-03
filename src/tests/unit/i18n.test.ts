import { describe, it, expect } from 'vitest';
import { TranslationEngine } from '../../../src/engines/TranslationEngine';
import { SUPPORTED_LANGUAGES } from '../../../src/constants';

describe('Global i18n Coverage', () => {
  SUPPORTED_LANGUAGES.forEach(lang => {
    describe(`Language: ${lang.name} (${lang.code})`, () => {
      it('should have a defined direction', () => {
        expect(['rtl', 'ltr']).toContain(TranslationEngine.getDirection(lang.code));
      });

      it('should return a non-empty string for common keys', () => {
        const keys = ['nav.dashboard', 'nav.timeline', 'nav.checklist', 'chat.placeholder'];
        keys.forEach(key => {
          const translation = TranslationEngine.t(key, lang.code);
          expect(translation).toBeDefined();
          expect(translation.length).toBeGreaterThan(0);
        });
      });
    });
  });
});
