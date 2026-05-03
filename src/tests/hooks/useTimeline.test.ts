import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useTimeline } from '../../hooks/useTimeline';
import { useTimelineStore } from '../../store/timelineStore';

// Mock firebase lib so auth.currentUser is available
vi.mock('../../lib/firebase', () => ({
  auth: { currentUser: null },
  db: {},
}));

// Mock firestore operations
vi.mock('firebase/firestore', () => ({
  doc: vi.fn(),
  onSnapshot: vi.fn(() => () => {}),
  updateDoc: vi.fn().mockResolvedValue(undefined),
}));

vi.mock('../../store/timelineStore', () => ({
  useTimelineStore: vi.fn(),
}));

const mockMarkPhaseComplete = vi.fn();
const mockSetActivePhaseId = vi.fn();
const mockSetProgress = vi.fn();

const defaultStoreValue = {
  phases: [],
  activePhaseId: '1',
  progress: {},
  setActivePhaseId: mockSetActivePhaseId,
  setProgress: mockSetProgress,
  markPhaseComplete: mockMarkPhaseComplete,
};

describe('useTimeline Hook Logic', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    (useTimelineStore as unknown as ReturnType<typeof vi.fn>).mockReturnValue(defaultStoreValue);
  });

  it('should initialize with empty progress when no data is found', () => {
    const { result } = renderHook(() => useTimeline());
    expect(result.current.progress).toEqual({});
  });

  it('should handle phase updates correctly', async () => {
    const { result } = renderHook(() => useTimeline());

    await act(async () => {
      await result.current.markPhaseViewed('1');
    });

    expect(mockMarkPhaseComplete).toHaveBeenCalledWith('1');
  });

  it('should handle anonymous users without crashing', () => {
    const { result } = renderHook(() => useTimeline());
    expect(result.current.progress).toEqual({});
  });

  it('should calculate completion percentage correctly', () => {
    (useTimelineStore as unknown as ReturnType<typeof vi.fn>).mockReturnValue({
      ...defaultStoreValue,
      phases: [{ id: '1', name: 'P1' }, { id: '2', name: 'P2' }] as never,
      progress: { '1': true },
    });
    const { result } = renderHook(() => useTimeline());
    expect(result.current.completionPercentage).toBe(50);
  });
});

