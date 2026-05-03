import { describe, it, expect, beforeEach } from 'vitest';
import { useLanguageStore } from '../../store/languageStore';

describe('languageStore', () => {
  beforeEach(() => {
    useLanguageStore.setState({ currentLanguage: 'en', isRTL: false });
  });

  it('should set language and update RTL flag correctly', () => {
    useLanguageStore.getState().setLanguage('ar');
    expect(useLanguageStore.getState().currentLanguage).toBe('ar');
    expect(useLanguageStore.getState().isRTL).toBe(true);

    useLanguageStore.getState().setLanguage('es');
    expect(useLanguageStore.getState().currentLanguage).toBe('es');
    expect(useLanguageStore.getState().isRTL).toBe(false);
  });
});
