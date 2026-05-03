import { describe, it, expect, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useRateLimit } from '../../hooks/useSecurity';
import { SECURITY_LIMITS } from '../../constants';

describe('useRateLimit Security Logic', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('should allow requests within the limit', () => {
    const { result } = renderHook(() => useRateLimit());
    
    let check: { allowed: boolean; remaining: number; resetTime: number };
    act(() => {
      check = result.current.checkLimit('AI');
    });
    
    expect(check.allowed).toBe(true);
    expect(check.remaining).toBe(SECURITY_LIMITS.AI.MAX - 1);
  });

  it('should block requests exceeding the limit', () => {
    const { result } = renderHook(() => useRateLimit());
    
    // Exhaust the limit using Auth which has small limit in some configs or just loop
    for (let i = 0; i < SECURITY_LIMITS.AUTH.MAX; i++) {
      act(() => {
        result.current.checkLimit('AUTH');
      });
    }

    let blockedCheck: { allowed: boolean; remaining: number; resetTime: number };
    act(() => {
      blockedCheck = result.current.checkLimit('AUTH');
    });
    
    expect(blockedCheck.allowed).toBe(false);
  });
});
