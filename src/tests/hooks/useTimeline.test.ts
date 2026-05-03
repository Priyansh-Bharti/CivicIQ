import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useTimeline } from '../../hooks/useTimeline';
import { useAuthStore } from '../../store/authStore';
import { useTimelineStore } from '../../store/timelineStore';

// Mock the Stores
vi.mock('../../store/authStore', () => ({
  useAuthStore: vi.fn(),
}));

vi.mock('../../store/timelineStore', () => ({
  useTimelineStore: vi.fn(),
}));

describe('useTimeline Hook Logic', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should initialize with empty progress when no data is found', () => {
    (useAuthStore as any).mockReturnValue({ user: { uid: 'test-user' } });
    (useTimelineStore as any).mockReturnValue({
      phases: [],
      activePhaseId: '1',
      progress: {},
      setActivePhase: vi.fn(),
      markPhaseViewed: vi.fn(),
    });
    
    const { result } = renderHook(() => useTimeline());
    
    // progress should be an empty object initially
    expect(result.current.progress).toEqual({});
  });

  it('should handle phase updates correctly', async () => {
    (useAuthStore as any).mockReturnValue({ user: { uid: 'test-user' } });
    const markPhaseViewed = vi.fn();
    (useTimelineStore as any).mockReturnValue({
      phases: [],
      activePhaseId: '1',
      progress: {},
      setActivePhase: vi.fn(),
      markPhaseViewed,
    });
    
    const { result } = renderHook(() => useTimeline());
    
    // Trigger marking a phase as viewed
    await act(async () => {
      await result.current.markPhaseViewed('1');
    });

    expect(markPhaseViewed).toHaveBeenCalledWith('1');
  });

  it('should handle anonymous users without crashing', () => {
    (useAuthStore as any).mockReturnValue({ user: null });
    (useTimelineStore as any).mockReturnValue({
      phases: [],
      activePhaseId: '1',
      progress: {},
      setActivePhase: vi.fn(),
      markPhaseViewed: vi.fn(),
    });
    
    const { result } = renderHook(() => useTimeline());
    expect(result.current.progress).toEqual({});
  });
});
