import { renderHook, act, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { useTimeline } from '../../hooks/useTimeline';
import { useTimelineStore } from '../../store/timelineStore';
import * as firebase from '../../lib/firebase';
import { onSnapshot, updateDoc } from 'firebase/firestore';

// Mock dependencies
vi.mock('../../lib/firebase', () => ({
  auth: { currentUser: null },
  db: {},
}));

vi.mock('firebase/firestore', () => ({
  doc: vi.fn(() => ({})),
  onSnapshot: vi.fn(),
  updateDoc: vi.fn(),
  getDoc: vi.fn(),
}));

describe('useTimeline Hook', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    useTimelineStore.setState({ 
      activePhaseId: '1', 
      progress: {},
    });
    (firebase.auth as any).currentUser = null;
  });

  it('initializes with default state', () => {
    const { result } = renderHook(() => useTimeline());
    expect(result.current.activePhaseId).toBe('1');
    expect(result.current.progress).toEqual({});
  });

  it('subscribes to firestore when user is authenticated', () => {
    (firebase.auth as any).currentUser = { uid: '123' };
    const mockUnsubscribe = vi.fn();
    (onSnapshot as any).mockReturnValue(mockUnsubscribe);

    renderHook(() => useTimeline());

    expect(onSnapshot).toHaveBeenCalled();
  });

  it('setActivePhase updates store and calls markPhaseViewed', async () => {
    const { result } = renderHook(() => useTimeline());
    
    act(() => {
      result.current.setActivePhase('2');
    });

    expect(result.current.activePhaseId).toBe('2');
    expect(result.current.progress['2']).toBe(true);
  });

  it('markPhaseViewed updates firestore for authenticated user', async () => {
    (firebase.auth as any).currentUser = { uid: '123' };
    const { result } = renderHook(() => useTimeline());
    
    await act(async () => {
      await result.current.markPhaseViewed('3');
    });

    expect(updateDoc).toHaveBeenCalled();
  });

  it('provides the phases list', () => {
    const { result } = renderHook(() => useTimeline());
    expect(result.current.phases.length).toBeGreaterThan(0);
  });

  it('markPhaseViewed performs optimistic update without user', async () => {
    const { result } = renderHook(() => useTimeline());
    
    await act(async () => {
      await result.current.markPhaseViewed('4');
    });

    expect(result.current.progress['4']).toBe(true);
    expect(updateDoc).not.toHaveBeenCalled();
  });
});
