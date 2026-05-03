import { describe, it, expect } from 'vitest';
import { renderHook } from '@testing-library/react';
import { useTranslation } from '../../hooks/useTranslation';

describe('useTranslation Hook', () => {
  it('should return a translate function', () => {
    const { result } = renderHook(() => useTranslation());
    expect(typeof result.current.t).toBe('function');
  });

  it('should correctly fall back to key if translation is missing', () => {
    const { result } = renderHook(() => useTranslation());
    expect(result.current.t('MISSING_KEY')).toBe('MISSING_KEY');
  });
});
