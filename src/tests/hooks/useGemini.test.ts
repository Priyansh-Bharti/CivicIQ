import { describe, it, expect, vi } from 'vitest';
import { renderHook } from '@testing-library/react';
import { useGemini } from '../../hooks/useGemini';

vi.mock('../../lib/gemini', () => ({
  generateAIResponse: vi.fn().mockResolvedValue('Mock response')
}));

describe('useGemini Hook', () => {
  it('should initialize with default state', () => {
    const { result } = renderHook(() => useGemini());
    expect(result.current.loading).toBe(false);
    expect(result.current.error).toBeNull();
  });
});
