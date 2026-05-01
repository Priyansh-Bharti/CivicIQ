import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { ProgressRing } from '../../../src/components/checklist/ProgressRing';
import { ChecklistItem } from '../../../src/components/checklist/ChecklistItem';

vi.mock('../../../src/hooks/useTranslation', () => ({
  useTranslation: (text: string) => text
}));

describe('ProgressRing', () => {
  it('renders correct aria attributes', () => {
    render(<ProgressRing percentage={40} />);
    const progress = screen.getByRole('progressbar');
    expect(progress).toHaveAttribute('aria-valuenow', '40');
    expect(progress).toHaveAttribute('aria-label', 'Civic readiness: 40% complete');
  });

  it('changes color based on percentage', () => {
    const { rerender, container } = render(<ProgressRing percentage={20} />);
    let circle = container.querySelector('circle.text-indigo');
    expect(circle).toBeInTheDocument();

    rerender(<ProgressRing percentage={60} />);
    circle = container.querySelector('circle.text-amber');
    expect(circle).toBeInTheDocument();

    rerender(<ProgressRing percentage={100} />);
    circle = container.querySelector('circle.text-emerald');
    expect(circle).toBeInTheDocument();
  });
});

describe('ChecklistItem', () => {
  it('toggles completed state', () => {
    const mockToggle = vi.fn();
    const item = { id: '1', title: 'Test Item', description: 'Desc', completed: false };
    
    render(<ChecklistItem item={item} onToggle={mockToggle} />);
    
    const checkbox = screen.getByRole('checkbox');
    fireEvent.click(checkbox);
    
    expect(mockToggle).toHaveBeenCalledWith('1');
  });
});
