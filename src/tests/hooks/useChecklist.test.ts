import { renderHook, act } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { useChecklist } from '../../hooks/useChecklist';
import { useChecklistStore } from '../../store/checklistStore';
import { CIVIC_CHECKLIST } from '../../lib/constants';

// Mock dependencies
vi.mock('../../hooks/useAuth', () => ({
  useAuth: vi.fn(() => ({ user: null }))
}));

vi.mock('../../lib/analytics', () => ({
  trackEvent: vi.fn()
}));

describe('useChecklist', () => {
  beforeEach(() => {
    useChecklistStore.setState({ items: [] });
    localStorage.clear();
  });

  it('CIVIC_CHECKLIST has exactly 7 items', () => {
    expect(CIVIC_CHECKLIST.length).toBe(7);
  });

  it('Each item has required fields', () => {
    CIVIC_CHECKLIST.forEach(item => {
      expect(item).toHaveProperty('id');
      expect(item).toHaveProperty('title');
      expect(item).toHaveProperty('description');
      expect(item).toHaveProperty('completed');
    });
  });

  it('calculates completion percentage correctly (0%)', () => {
    const { result } = renderHook(() => useChecklist());
    expect(result.current.completionPercentage).toBe(0);
  });

  it('calculates completion percentage correctly (100%)', () => {
    const { result } = renderHook(() => useChecklist());
    
    act(() => {
      useChecklistStore.setState({ 
        items: CIVIC_CHECKLIST.map(i => ({ ...i, completed: true })) 
      });
    });

    expect(result.current.completionPercentage).toBe(100);
  });

  it('calculates completion percentage correctly (~43%)', () => {
    const { result } = renderHook(() => useChecklist());
    
    act(() => {
      useChecklistStore.setState({ items: CIVIC_CHECKLIST });
    });

    act(() => {
      result.current.toggleItem(CIVIC_CHECKLIST[0].id);
      result.current.toggleItem(CIVIC_CHECKLIST[1].id);
      result.current.toggleItem(CIVIC_CHECKLIST[2].id);
    });

    expect(result.current.completionPercentage).toBe(43);
  });

  it('toggleItem updates correct item only', () => {
    const { result } = renderHook(() => useChecklist());
    
    act(() => {
      useChecklistStore.setState({ items: CIVIC_CHECKLIST });
    });

    act(() => {
      result.current.toggleItem(CIVIC_CHECKLIST[0].id);
    });

    const items = useChecklistStore.getState().items;
    expect(items[0].completed).toBe(true);
    expect(items[1].completed).toBe(false);
  });

  it('Persistence: localStorage write called when not authenticated', () => {
    const setItemSpy = vi.spyOn(Storage.prototype, 'setItem');
    const { result } = renderHook(() => useChecklist());
    
    act(() => {
      useChecklistStore.setState({ items: CIVIC_CHECKLIST });
    });

    act(() => {
      result.current.toggleItem(CIVIC_CHECKLIST[0].id);
    });

    expect(setItemSpy).toHaveBeenCalledWith('civiciq_checklist_progress', expect.any(String));
    setItemSpy.mockRestore();
  });
});
