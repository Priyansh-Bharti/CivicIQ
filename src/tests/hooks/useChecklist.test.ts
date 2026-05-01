import { renderHook, act } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { useChecklist } from '../../../src/hooks/useChecklist';
import { useChecklistStore } from '../../../src/store/checklistStore';
import { CIVIC_CHECKLIST } from '../../../src/lib/constants';

// Mock dependencies
vi.mock('../../../src/hooks/useAuth', () => ({
  useAuth: vi.fn(() => ({ user: null }))
}));

vi.mock('../../../src/lib/analytics', () => ({
  trackEvent: vi.fn()
}));

describe('useChecklist', () => {
  beforeEach(() => {
    useChecklistStore.setState({ items: [] });
    localStorage.clear();
  });

  it('calculates completion percentage correctly', () => {
    const { result } = renderHook(() => useChecklist());
    
    // initially 0%
    expect(result.current.completionPercentage).toBe(0);

    // After loading, we can simulate toggling
    act(() => {
      // Simulate that the effect has loaded the initial checklist
      useChecklistStore.setState({ items: CIVIC_CHECKLIST });
    });

    // Toggle 3 items (3 out of 7 = 43%)
    act(() => {
      result.current.toggleItem(CIVIC_CHECKLIST[0].id);
      result.current.toggleItem(CIVIC_CHECKLIST[1].id);
      result.current.toggleItem(CIVIC_CHECKLIST[2].id);
    });

    expect(result.current.completionPercentage).toBe(43);
  });
});
