import { describe, it, expect, beforeEach } from 'vitest';
import { useLanguageStore } from '../../../store/languageStore';

describe('languageStore', () => {
  beforeEach(() => {
    useLanguageStore.setState({ currentLanguage: 'en' });
  });

  it('should set language correctly', () => {
    useLanguageStore.getState().setLanguage('ar');
    expect(useLanguageStore.getState().currentLanguage).toBe('ar');

    useLanguageStore.getState().setLanguage('es');
    expect(useLanguageStore.getState().currentLanguage).toBe('es');
  });
});
