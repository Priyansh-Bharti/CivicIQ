import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { ChecklistItem as ChecklistItemComponent } from '../../../src/components/checklist/ChecklistItem';
import { ProgressRing } from '../../../src/components/checklist/ProgressRing';
import { Checklist } from '../../../src/pages/Checklist';
import { CIVIC_CHECKLIST } from '../../../src/lib/constants';
import { ChecklistItem } from '../../../src/types/election';
import { MemoryRouter } from 'react-router-dom';

// ─── Mocks ───────────────────────────────────────────────────────────────────
vi.mock('../../../src/components/layout/Navbar', () => ({ Navbar: () => <div data-testid="navbar" /> }));
vi.mock('../../../src/components/chat/ChatPanel', () => ({ ChatPanel: () => <div data-testid="chatpanel" /> }));
vi.mock('../../../src/lib/analytics', () => ({ trackEvent: vi.fn() }));
vi.mock('../../../src/components/ui/Translate', () => ({
  Translate: ({ text }: { text: string }) => <span>{text}</span>,
}));

// Control data returned by useChecklist — bypasses firebase & localStorage
const mockToggleItem = vi.fn();
let mockItems: ChecklistItem[] = [];

vi.mock('../../../src/hooks/useChecklist', () => ({
  useChecklist: () => {
    const completed = mockItems.filter(i => i.completed).length;
    const pct = mockItems.length === 0 ? 0 : Math.round((completed / mockItems.length) * 100);
    return {
      items: mockItems,
      toggleItem: mockToggleItem,
      completionPercentage: pct,
      completedCount: completed,
      totalCount: mockItems.length,
    };
  },
}));

// ─── Helpers ─────────────────────────────────────────────────────────────────
const renderChecklist = () =>
  render(<MemoryRouter><Checklist /></MemoryRouter>);

const freshItems = (): ChecklistItem[] =>
  CIVIC_CHECKLIST.map(i => ({ ...i, completed: false }));

// ─── Tests ────────────────────────────────────────────────────────────────────
describe('Checklist Component Suite', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockItems = freshItems();
  });

  // ── CIVIC_CHECKLIST constant ────────────────────────────────────────────────
  it('CIVIC_CHECKLIST has exactly 7 items', () => {
    expect(CIVIC_CHECKLIST).toHaveLength(7);
  });

  it('Each item has id, title, description fields', () => {
    CIVIC_CHECKLIST.forEach(item => {
      expect(item).toHaveProperty('id');
      expect(item).toHaveProperty('title');
      expect(item).toHaveProperty('description');
    });
  });

  // ── Checklist page ──────────────────────────────────────────────────────────
  it('renders all 7 checklist checkboxes', () => {
    renderChecklist();
    expect(screen.getAllByRole('checkbox')).toHaveLength(7);
  });

  it('Checklist h1 heading is "Your Civic Readiness"', () => {
    renderChecklist();
    expect(screen.getByRole('heading', { level: 1, name: /Your Civic Readiness/i })).toBeInTheDocument();
  });

  it('Progress ring shows 0% when no items complete', () => {
    renderChecklist();
    expect(screen.getByText('0%')).toBeInTheDocument();
  });

  it('Progress ring shows 100% when all items complete', () => {
    mockItems = freshItems().map(i => ({ ...i, completed: true }));
    renderChecklist();
    expect(screen.getByText('100%')).toBeInTheDocument();
  });

  it('Progress ring shows ~14% when 1 of 7 items complete', () => {
    mockItems[0] = { ...mockItems[0], completed: true };
    renderChecklist();
    expect(screen.getByText('14%')).toBeInTheDocument();
  });

  it('Progress ring shows ~57% when 4 of 7 items complete', () => {
    mockItems[0] = { ...mockItems[0], completed: true };
    mockItems[1] = { ...mockItems[1], completed: true };
    mockItems[2] = { ...mockItems[2], completed: true };
    mockItems[3] = { ...mockItems[3], completed: true };
    renderChecklist();
    expect(screen.getByText('57%')).toBeInTheDocument();
  });

  it('Clicking checkbox calls toggleItem with correct id', () => {
    renderChecklist();
    fireEvent.click(screen.getAllByRole('checkbox')[0]);
    expect(mockToggleItem).toHaveBeenCalledWith(CIVIC_CHECKLIST[0].id);
  });

  it('Progress ring aria-valuenow is 0 at start', () => {
    renderChecklist();
    expect(screen.getByRole('progressbar')).toHaveAttribute('aria-valuenow', '0');
  });

  it('Counter shows "0 of 7" initially', () => {
    renderChecklist();
    expect(screen.getByText('0 of 7')).toBeInTheDocument();
  });

  it('Counter shows "7 of 7" when all complete', () => {
    mockItems = freshItems().map(i => ({ ...i, completed: true }));
    renderChecklist();
    expect(screen.getByText('7 of 7')).toBeInTheDocument();
  });

  it('main landmark exists', () => {
    renderChecklist();
    expect(screen.getByRole('main')).toBeInTheDocument();
  });

  // ── ProgressRing component ─────────────────────────────────────────────────
  it('ProgressRing 100% sets correct aria attrs', () => {
    render(<ProgressRing percentage={100} />);
    const ring = screen.getByRole('progressbar');
    expect(ring).toHaveAttribute('aria-valuenow', '100');
    expect(ring).toHaveAttribute('aria-valuemin', '0');
    expect(ring).toHaveAttribute('aria-valuemax', '100');
  });

  it('ProgressRing renders 0%', () => {
    render(<ProgressRing percentage={0} />);
    expect(screen.getByText('0%')).toBeInTheDocument();
  });

  // ── ChecklistItem component ─────────────────────────────────────────────────
  it('Completed item label has line-through class', () => {
    const item = { ...CIVIC_CHECKLIST[0], completed: true };
    render(<ChecklistItemComponent item={item} onToggle={() => {}} />);
    const label = screen.getByText(item.title).closest('label');
    expect(label).toHaveClass('line-through');
  });

  it('Incomplete item label does NOT have line-through', () => {
    const item = { ...CIVIC_CHECKLIST[0], completed: false };
    render(<ChecklistItemComponent item={item} onToggle={() => {}} />);
    const label = screen.getByText(item.title).closest('label');
    expect(label).not.toHaveClass('line-through');
  });

  it('External link has rel="noopener noreferrer" and target="_blank"', () => {
    const item = { ...CIVIC_CHECKLIST[0], link: 'https://vote.gov' };
    render(<ChecklistItemComponent item={item} onToggle={() => {}} />);
    const link = screen.getByRole('link', { name: /Resource/i });
    expect(link).toHaveAttribute('target', '_blank');
    expect(link).toHaveAttribute('rel', 'noopener noreferrer');
  });

  it('ChecklistItem onToggle fires with item id on checkbox click', () => {
    const onToggle = vi.fn();
    const item = { ...CIVIC_CHECKLIST[0], completed: false };
    render(<ChecklistItemComponent item={item} onToggle={onToggle} />);
    fireEvent.click(screen.getByRole('checkbox'));
    expect(onToggle).toHaveBeenCalledWith(item.id);
  });
});
