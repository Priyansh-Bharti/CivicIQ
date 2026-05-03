import { describe, it, expect, beforeEach } from 'vitest';
import { useChecklistStore } from '../../store/checklistStore';

describe('checklistStore', () => {
  beforeEach(() => {
    useChecklistStore.setState({ items: [] });
  });

  it('should toggle an item', () => {
    useChecklistStore.setState({ items: [{ id: '1', label: 'Item 1', checked: false, required: true }] });
    useChecklistStore.getState().toggleItem('1');
    expect(useChecklistStore.getState().items[0].checked).toBe(true);
  });
});
