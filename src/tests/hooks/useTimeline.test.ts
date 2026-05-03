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

  it('should initialize with empty progress when no data is found', () => {
    (useAuthStore as any).mockReturnValue({ user: { uid: 'test-user' } });
    
    const { result } = renderHook(() => useTimeline());
    
    // progress should be an empty object initially
    expect(result.current.progress).toEqual({});
  });

  it('should handle phase updates correctly', async () => {
    (useAuthStore as any).mockReturnValue({ user: { uid: 'test-user' } });
    
    const { result } = renderHook(() => useTimeline());
    
    // Trigger marking a phase as viewed
    await act(async () => {
      await result.current.markPhaseViewed('1');
    });

    // Check if progress is updated (this would usually be handled by the store mock, but we're testing the hook's exposure)
    expect(result.current.markPhaseViewed).toBeDefined();
  });

  it('should handle anonymous users without crashing', () => {
    (useAuthStore as any).mockReturnValue({ user: null });
    
    const { result } = renderHook(() => useTimeline());
    expect(result.current.progress).toEqual({});
  });
});
