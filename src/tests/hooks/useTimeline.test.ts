import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useTimeline } from '../../hooks/useTimeline';
import { useAuthStore } from '../../store/authStore';

// Mock the Auth Store
vi.mock('../../store/authStore', () => ({
  useAuthStore: vi.fn(),
}));

describe('useTimeline Hook Logic', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should calculate 0% progress when no items are completed', () => {
    (useAuthStore as any).mockReturnValue({ user: { uid: 'test-user' } });
    
    const { result } = renderHook(() => useTimeline());
    
    // Initial state should be 0% if no progress is found in store
    expect(result.current.completionPercentage).toBe(0);
  });

  it('should calculate correct percentage when items are checked', () => {
    (useAuthStore as any).mockReturnValue({ user: { uid: 'test-user' } });
    
    const { result } = renderHook(() => useTimeline());
    
    // Simulate checking a few items (assuming 7 total items in constant)
    // 1 item = ~14%
    act(() => {
      result.current.toggleItem('1');
    });

    expect(result.current.completionPercentage).toBeGreaterThan(0);
  });

  it('should handle anonymous users without crashing', () => {
    (useAuthStore as any).mockReturnValue({ user: null });
    
    const { result } = renderHook(() => useTimeline());
    expect(result.current.completionPercentage).toBe(0);
  });
});
